const { ChildProcess, spawn } = require('child_process');
const { env } = require('process');
const path = require('path');
const fs = require('fs');

import { IRpc, AuthServiceProxy } from './authproxy';
import { rpcPort, p2pPort, getRpcProxy, rpcUrl, sleep } from './util';


export class TestNode implements IRpc {

  dataDir: string;

  args: string[];

  process: ChildProcess;

  // HTTP request timeout, in ms
  rpcTimeout: number = 60000;

  rpc: AuthServiceProxy;

  rpcPort: number;

  p2pPort: number;

  rpcHost: string;

  running: boolean = false;

  constructor(
    private index: number, private dirname: string, private binary: string
  ) {
    this.dataDir = path.join(dirname, `node${index}`);
    this.rpcPort = rpcPort(index);
    this.p2pPort = p2pPort(index);

    this.args = [
    `-regtest`, `-datadir=${this.dataDir}`, '-server', '-keypool=1', '-discover=0', '-rest', '-logtimemicros',
    '-debug', '-debugexclude=libevent', '-debugexclude=leveldb', `-uacomment=testnode${this.index}`,
    `-rpcport=${this.rpcPort}`, `-bind=127.0.0.1:${this.p2pPort}`, `-rpcpassword=test`, `-rpcuser=test`,
    ];
  }

  async start(extraArgs?: any): Promise<void> {
    this.process = spawn(this.binary, this.args);

    return new Promise<void>((resolve, reject) => {
      const t = setTimeout(() => {
        this.running = true;
        resolve();
      }, 200);

      this.process.on('error', (msg) => {
        this.running = false;
        clearTimeout(t);
        reject(new Error(`The process could not be spawned: ${msg}`));
      });

      this.process.on('exit', (msg) => {
        if (this.running) {
          this.running = false;
          return;
        }

        clearTimeout(t);

        // Dump any errors from the debug log
        const lines = fs.readFileSync(`${this.dataDir}/regtest/debug.log`, 'utf8').split('\n');
        console.log(lines.slice(lines.length - 40).join('\n'));

        reject(new Error(`The process exited prematurely: ${msg}`));
      });
    });
  }

  async waitForRPCConnection(): Promise<void> {
    const pollPerS = 4;
    const waitEnd = Date.now() + this.rpcTimeout * 1000;

    return new Promise<void>((resolve, reject) => {
      const checkConnection = () => {
        if (Date.now() > waitEnd) {
          reject(new Error('RPC timeout exceeded'));
        }

        rpcUrl(this.dataDir, this.index, this.rpcHost)
        .then((url) => {
          this.rpc = getRpcProxy(url, this.index, this.rpcTimeout);
          this.rpc.call('getblockcount')
          .then(() => {
            this.running = true;
            resolve();
          })
          .catch(() => setTimeout(checkConnection, 1000 / pollPerS));
        })
      };

      checkConnection();
    });
  }

  async stopNode() {
    if (!this.running) {
      return;
    }
    await this.drainMainSignalCallbacksPending();
    await this.stop();
  }

  async stop() {
    try {
      await this.call('stop');
    } catch (e) {
      // The daemon is probably already stopped, which is what we want
    }
  }

  async drainMainSignalCallbacksPending() {
    let queueSize: number = await this.call('getmainsignalscallbackspending');

    while (queueSize > 10) {
      await sleep(1000);
      const timeout = Date.now() + 20000;
      let left = queueSize;

      while (Date.now() < timeout) {
        left = await this.call('getmainsignalscallbackspending');
        if (left !== queueSize) {
          break
        }
        await sleep(500)
      }
      if (left !== queueSize) {
        queueSize = left
      }
    }
  }

  async waitUntilStopped() {
    while (this.running) {
      await sleep(100);
    }
  }

  async call(method: string, ...args: any[]) {
    return this.rpc.call(method, ...args);
  }
}
