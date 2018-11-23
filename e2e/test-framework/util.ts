const path = require('path');
const os = require('os');
const fs = require('fs');
const assert = require('assert');

const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);
const mkdir = promisify(fs.mkdir);
const rmdir = promisify(fs.rmdir);
const unlink = promisify(fs.unlink);

import { IRpc, AuthServiceProxy } from './authproxy';


// RPC connection constants and functions
// The maximum number of nodes a single test can spawn
const MAX_NODES = 8;

// Don't assign rpc or p2p ports lower than this
const PORT_MIN = 18400;

// The number of ports to "reserve" for p2p and rpc, each
const PORT_RANGE = 40;

export async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitUntil(lambda: () => Promise<boolean>) {
  for (let attempts = 0; attempts < 1000; attempts++) {
    if (await lambda()) {
      return;
    }
    await sleep(50);
  }

  throw new Error('Node is unreachable!');
}

export async function initializeDatadir(dirname: string, n: number) {
  const nodeIds = Array.from(Array(n).keys());
  await Promise.all(nodeIds.map(async (i) => {
    const datadir = path.join(dirname, `node${i}`);

    await mkdirRecursive(datadir);
    await writeFile(path.join(datadir, 'unite.conf'),
`regtest=1
rpcport=${rpcPort(i)}
listenononion=0
rpcpassword=test
rpcuser=test
`);
  }));
}

export async function deleteDirectory(dirPath: string) {
  if (!dirPath.startsWith(os.tmpdir())) {
    throw new Error(`Refusing to delete ${dirPath} recursively`);
  }

  const names: any[] = await readdir(dirPath);
  const dirents: any[] = await Promise.all(names.map(async (name) => {
    const fullPath = path.join(dirPath, name);
    const s = await stat(fullPath);
    s.path = fullPath;
    return s;
  }));

  await Promise.all(
    dirents.filter(x => x.isFile()).map(x => unlink(x.path)));
  await Promise.all(
    dirents.filter(x => x.isDirectory()).map(x => deleteDirectory(x.path)));
  await rmdir(dirPath)
}

export async function connectNodes(fromConnection: IRpc, nodeIdx: number) {
  const ipPort = `127.0.0.1:${p2pPort(nodeIdx)}`;
  await fromConnection.call('addnode', ipPort, 'onetry');

  waitUntil(async () => {
    const peers = await fromConnection.call('getpeerinfo');
    return peers.every((x) => x.version);
  })
}

export async function connectNodesBi(nodes: any[], a: number, b: number) {
  await Promise.all([
    connectNodes(nodes[a], b),
    connectNodes(nodes[b], a)
  ]);
}

async function getAuthCookie(datadir: string) {
  let user: string = null;
  let password: string = null;

  try {
    const fileContents = await readFile(path.join(datadir, 'unite.conf'), 'utf8');
    const f: string[] = fileContents.split('\n');
    for (const line of f) {
      if (line.startsWith('rpcuser=')) {
        user = line.split('=')[1].trim()
      }
      if (line.startsWith('rpcpassword=')) {
        password = line.split('=')[1].trim();
      }
    }
  } catch (e) {}

  try {
    const userpass: string = await readFile(path.join(datadir, 'regtest', '.cookie'), 'utf8');
    [user, password] = userpass.split(':');
  } catch (e) {}

  if (!user || !password) {
    throw new Error(`No RPC credentials provided in ${datadir}`);
  }

  return [user, password];
}

export function p2pPort(n: number) {
  return PORT_MIN + n;
}

export function rpcPort(n: number) {
  return PORT_MIN + PORT_RANGE + n;
}

export async function rpcUrl(datadir: string, i: number, rpcHost?: string) {
  const [rpcUser, rpcPass] = await getAuthCookie(datadir);
  let host = '127.0.0.1';
  let port = `${rpcPort(i)}`;

  if (rpcHost) {
    const parts = rpcHost.split(':');
    if (parts.length === 2) {
      [host, port] = parts;
    } else {
      host = rpcHost;
    }
  }

  return `http://${rpcUser}:${rpcPass}@${host}:${port}`;
}

export function getRpcProxy(url: string, nodeNumber: number, timeout?: number): AuthServiceProxy {
  const proxyKwargs = {};
  if (timeout) {
    proxyKwargs['timeout'] = timeout;
  }

  return new AuthServiceProxy(url, proxyKwargs);
}

export async function syncBlocks(rpcConnections: IRpc[]) {
  const wait = 1000;
  const timeout = 60000;
  const blockCounts: any[] = await Promise.all(rpcConnections.map(x => x.call('getblockcount')));
  const maxheight = Math.max(...blockCounts);
  const startTime = Date.now();
  let tips = [];

  for (let curTime = startTime; curTime <= startTime + timeout;) {
    tips = await Promise.all(rpcConnections.map(x => x.call('waitforblockheight', maxheight, wait)));

    if (tips.every(x => x['height'] === maxheight)) {
      if (tips.every(x => x['hash'] === tips[0]['hash'])) {
        return;
      }

      throw new Error(`Block sync failed, mismatched block hashes: ${tips}`);
    }

    curTime = Date.now();
  }

  throw new Error(`Block sync to height ${maxheight} timed out: ${tips}`);
}

export async function syncMempools(rpcConnections: IRpc[]) {
  const wait = 1000;
  const flushScheduler = true;
  let timeout = 60000;

  while (timeout > 0) {
    const pool = new Set(await rpcConnections[0].call('getrawmempool'));
    let numMatch = 1

    for (let i = 1; i < rpcConnections.length; i++) {
      const otherPool: any[] = await rpcConnections[i].call('getrawmempool');

      if (pool.size === otherPool.length && otherPool.every(x => pool.has(x))) {
        numMatch++;
      }
    }

    if (numMatch === rpcConnections.length) {
      if (flushScheduler) {
        await Promise.all(rpcConnections.map(x => x.call('syncwithvalidationinterfacequeue')));
      }
      return;
    }

    await sleep(wait);
    timeout -= wait;
  }

  throw new Error('Mempool sync failed');
}

// An implementation of utils.promisify for older Node versions
function promisify(fn: Function): Function {
  return function(...args: any[]) {
    return new Promise(function (resolve: Function, reject: Function) {
      fn(...args, function (err: any, result: any) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };
}

async function mkdirRecursive(absPath: string) {
  const tokens: string[] = absPath.split('/');
  let dir = '/';

  for (const tok of tokens) {
    dir = path.join(dir, tok);
    try {
      await mkdir(dir);
    } catch (e) {
      if (e.code !== 'EEXIST') {
        throw e;
      }
    }
  }
}
