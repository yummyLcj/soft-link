import * as fs from 'fs';
import * as path from 'path';
import { debug } from 'debug';

let cachePkgInfo: Record<string, any>;

export const getPkg = () => {
  if (cachePkgInfo) {
    return cachePkgInfo;
  }
  const pkg = fs.readFileSync(path.join(__dirname, '../../package.json'), {
    encoding: 'utf8',
  });
  try {
    cachePkgInfo = JSON.parse(pkg);
    return cachePkgInfo;
  } catch (e) {
    debug('soft-link/read-pkg')(e);
    return {};
  }
};
