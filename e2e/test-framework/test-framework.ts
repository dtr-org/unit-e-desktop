const os = require('os');
const process = require('process');
const MersenneTwister = require('mersenne-twister');

import { IRpc } from './authproxy';
import { TestNode } from './test-node';
import {
  connectNodesBi,
  deleteDirectory,
  initializeDatadir,
  sleep,
  syncBlocks,
  syncMempools,
} from './util';


const ROOT_DIR = `${os.tmpdir()}/test`;
const MERSENNE_SEED = 42;


/**
 * Utility class to start and configure the Unit-e backend for end-to-end tests.
 * Shamelessly stolen from unit-e/test/functional/test_framework; main difference
 * is that this class needs to be instantiated in the Protractor beforeEach()
 * function, rather that subclasses.
 */
export class TestFramework implements IRpc {

  private numNodes: number = 4;

  private preserveDataDir: boolean = false;

  private datadir: string = ROOT_DIR;

  private binary: string = 'united';

  private createChain: boolean = false;

  private rnd: MersenneTwister = new MersenneTwister(MERSENNE_SEED);

  nodes: TestNode[] = [];

  static async cleanRootDir() {
    try {
      await deleteDirectory(ROOT_DIR);
    } catch (e) {
      if (e.code !== 'ENOENT') {
        throw e;
      }
    }
  }

  constructor(options?: any) {
    if ('UNITED_BINARY' in process.env) {
      this.binary = process.env['UNITED_BINARY'];
    }

    if (!options) {
      return;
    }

    if ('preserveDataDir' in options) {
      this.preserveDataDir = options.preserveDataDir;
    }
    if ('numNodes' in options) {
      this.numNodes = options.numNodes;
      if (this.numNodes < 4) {
        this.numNodes = 4;
      }
    }
    if ('createChain' in options) {
      this.createChain = options.createChain;
    }
    if ('randomSeed' in options) {
      this.rnd = new MersenneTwister(options.randomSeed);
    }
  }

  async setup() {
    await this.setupChain();
    await this.setupNetwork();
    if (this.createChain) {
      await this.initializeChain();
    }
  }

  async setupChain() {
    await initializeDatadir(this.datadir, this.numNodes);
  }

  async setupNetwork() {
    this.addNodes(this.numNodes);
    await this.startNodes();

    for (let i = 0; i < this.numNodes - 1; i++) {
      await connectNodesBi(this.nodes, i, i + 1);
    }

    await this.syncAll();
  }

  async initializeChain() {
    // Generate 200 blocks on the first 4 nodes
    for (let i = 0; i < 2; i++) {
      for (let peer = 0; peer < 4; peer++) {
        await this.nodes[peer].call('generate', 25);
        await syncBlocks(this.nodes);
      }
    }
  }

  async generate(n: number) {
    await syncMempools(this.nodes);

    for (let i = 0; i < n; i++) {
      const nodeId = this.rnd.random_int() % this.numNodes;
      await this.nodes[nodeId].call('generate', 1);
      await syncBlocks(this.nodes);
    }
  }

  async syncAll() {
    await syncBlocks(this.nodes);
    await syncMempools(this.nodes);
  }

  addNodes(numNodes: number) {
    for (let i = 0; i < numNodes; i++) {
      this.nodes.push(new TestNode(i, this.datadir, this.binary));
    }
  }

  async startNodes() {
    await Promise.all(this.nodes.map(x => x.start()));
    await Promise.all(this.nodes.map(x => x.waitForRPCConnection()));
  }

  async stopNode(i: number) {
    await this.nodes[i].stopNode();
    await this.nodes[i].waitUntilStopped();
  }

  async stopNodes() {
    await Promise.all(this.nodes.map(x => x.stopNode()));
    await Promise.all(this.nodes.map(x => x.waitUntilStopped()));
  }

  async tearDown() {
    await this.stopNodes();
    if (!this.preserveDataDir) {
      await deleteDirectory(this.datadir);
    }
  }

  async call(method: string, ...args: any[]): Promise<any> {
    return this.nodes[0].call(method, ...args);
  }
}
