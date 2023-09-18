import * as fs from 'fs';
import * as path from 'path';
import { separator } from '@/shared/constant';

export const walk = async (dir: string, index = 0) => {
  if (index > 5) {
    return;
  }
  const results: any[] = [];
  if (dir.includes('node_modules')) {
    return results;
  }
  const list = fs.readdirSync(dir);
  for (let file of list) {
    const filePath = path.resolve(dir, file);
    const stat = fs.lstatSync(filePath);
    let isDirectory = stat.isDirectory();
    const isSymbolicLink = stat.isSymbolicLink();
    const symbolicLinkPath = isSymbolicLink ? fs.readlinkSync(filePath) : '';

    if (isSymbolicLink && symbolicLinkPath) {
      isDirectory = fs.statSync(symbolicLinkPath).isDirectory();
    }

    if (isDirectory) {
      const res = await walk(filePath, index++);
      results.push({
        key: filePath,
        title: filePath.replace(`${dir}${separator}`, ''),
        children: res,
        isSymbolicLink,
        symbolicLinkPath,
      });
    }
  }
  return results;
};
