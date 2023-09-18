import http from 'http';
import querystring from 'querystring';
import * as fs from 'fs';
import { checkDir } from '@/server/utils/check-dir';
import { walk } from '@/server/utils/walk';
import * as path from 'path';

const throwError = (res: http.ServerResponse, message: string) => {
  res.writeHead(500, { 'content-type': 'application/json' }).end(
    JSON.stringify({
      success: false,
      message,
    })
  );
};

export const linkPath = async (req: http.IncomingMessage, res: http.ServerResponse) => {
  const query = querystring.decode((req.url || '').split('?')[1]) as Record<string, string>;
  const { home, from, to } = query;
  try {
    checkDir(from, 'from');
    checkDir(to, 'to');
    checkDir(home, 'home');
  } catch (error: any) {
    throwError(res, error.message);
    return;
  }
  let allDirectory: any;
  try {
    const dirName = from.replace(path.dirname(from), '');
    fs.symlinkSync(from as string, path.join(to, dirName) as string, 'dir');
    allDirectory = await walk(home as string);
  } catch (error: any) {
    throwError(res, error.message);
    return;
  }
  res.writeHead(200, { 'content-type': 'application/json' }).end(
    JSON.stringify({
      success: true,
      allDirectory,
    })
  );
};
