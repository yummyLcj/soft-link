import * as fs from 'fs';

export const checkDir = (filePath: string | string[] | undefined, key: string) => {
  if (typeof filePath !== 'string') {
    throw new Error(`未传入${key}`);
  }
  if (!fs.existsSync(filePath)) {
    throw new Error(`不存在对应的文件夹${key}`);
  }
  if (!fs.statSync(filePath).isDirectory()) {
    throw new Error(`${key}不为文件夹`);
  }
};
