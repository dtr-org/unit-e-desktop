const http = require('http');
const { URL } = require('url');

const HTTP_TIMEOUT = 5000
const USER_AGENT = 'AuthServiceProxy/0.1'


export interface IRpc {
  call(method: string, ...args: any[]): Promise<any>;
}

export class AuthServiceProxy implements IRpc {

  id: number = 0;

  url: URL;

  authHeader: string;

  timeout: number = HTTP_TIMEOUT;

  constructor(url: string, proxyKwargs: any) {
    this.url = new URL(url);
    const user = this.url.username;
    const passwd = this.url.password;
    const authpair = user + ':' + passwd;
    this.authHeader = 'Basic ' + Buffer.from(authpair).toString('base64');
    if (proxyKwargs && proxyKwargs['timeout']) {
      this.timeout = proxyKwargs['timeout'];
    }
  }

  async call(method: string, ...args: any[]) {
    const postdata = JSON.stringify(this.getRequest(method, ...args))
    const response = await this.request('POST', this.url, postdata)

    if (response['error']) {
      throw new Error(response['error']);
    } else if (!('result' in response)) {
      throw new Error('missing JSON-RPC result');
    }

    return response['result'];
  }

  getRequest(method: string, ...args: any[]) {
    return  {
      'version': '1.1',
      'method': method,
      'params': args,
      'id': ++this.id,
    };
  }

  async request(method: string, url: URL, postData: string) {
    const headers = {
      'Host': 'localhost',
      'User-Agent': USER_AGENT,
      'Authorization': this.authHeader,
      'Content-type': 'application/json'
    };

    return new Promise((resolve, reject) => {
      const req = http.request({
        port: url.port,
        path: url.pathname,
        method: method,
        headers: headers,
        timeout: this.timeout,
      });
      req.on('response', (msg) => {
        const chunks = [];

        msg.on('error', (e) => reject(new Error(`${method}: error (${e})`)));
        msg.on('data', d => chunks.push(d));
        msg.on('end', () => resolve(JSON.parse(chunks.join(''))));
      });
      req.on('timeout', () => {
        req.abort();
        reject(new Error(`Request timeout in ${this.timeout} ms`));
      })

      req.write(postData);
      req.end();
    });
  }
}
