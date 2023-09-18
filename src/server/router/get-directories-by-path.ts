import querystring from 'querystring';
import * as http from 'http';
import * as fs from 'fs';
import { walk } from '@/server/utils/walk';
import { throwError } from '@/server/utils/throw-error';
import { checkDir } from '@/server/utils/check-dir';

export const getDirectoriesByPath = async (req: http.IncomingMessage, res: http.ServerResponse) => {
  const query = querystring.decode((req.url || '').split('?')[1]);
  const { path } = query;
  try {
    checkDir(path, 'path');
  } catch (error: any) {
    throwError(res, error.message);
    return;
  }
  const allDirectory = await walk(path as string);
  res.writeHead(200, { 'content-type': 'application/json' }).end(
    JSON.stringify({
      success: true,
      allDirectory: {
        path,
        allDirectory: [
          {
            key: path,
            title: path,
            children: allDirectory,
            isSymbolicLink: false,
          },
        ],
      },
    })
  );
};
