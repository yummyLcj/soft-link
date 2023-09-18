import type http from 'http';
import * as fs from 'fs';
import * as path from 'path';

const debug = require('debug')('soft-link:app');

const getContentType = (filePath: string) => {
  const ext = path.extname(filePath);
  switch (ext) {
    case '.html':
      return 'text/html';
    case '.js':
      return 'application/javascript';
    case '.css':
      return 'text/css';
    default:
      return 'text/plain';
  }
};

const getCyclePath = (url: string, needCycle: string[]): string | null => {
  for (let cyclePath of needCycle) {
    const checkPath = cyclePath.startsWith('.') ? `${url}${cyclePath}` : path.join(url, cyclePath);
    const legalPath = getLegalPath(checkPath);
    if (legalPath) {
      return legalPath;
    }
  }
  return null;
};

/** 获取访问文件的合法路径 */
const getLegalPath = (url: string, needCycle?: string[]): string | null => {
  const clientPath = path.join(__dirname, '../../client');
  const filePath = path.join(clientPath, url);
  if (!fs.existsSync(filePath)) {
    if (needCycle) {
      return getCyclePath(url, needCycle);
    }
    return null;
  }
  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) {
    return needCycle ? getCyclePath(url, needCycle) : null;
  }
  return filePath;
};

export const view = (req: http.IncomingMessage, res: http.ServerResponse) => {
  let { url = '/index.html' } = req;
  const filePath = getLegalPath(url, ['.html', '.js', '.css', '/index.html', '/index.js']);
  if (!filePath) {
    res.writeHead(404).end('404 not found');
    return;
  }
  const file = fs.readFileSync(filePath, { encoding: 'utf8' });
  const contentType = getContentType(filePath);
  res.writeHead(200, { 'content-type': contentType }).end(file);
};
