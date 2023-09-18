import chalk from 'chalk';
import http from 'http';
import { getDirectoriesByPath, linkPath, view } from '@/server/router';

const debug = require('debug')('soft-link:app');

export const createServer = (port: number) => {
  const server = http.createServer(async (req, res) => {
    const { method, url = '' } = req;
    const pathName = url.split('?')[0];
    switch (pathName) {
      case '/api/get-directories-by-path':
        await getDirectoriesByPath(req, res);
        break;
      case '/api/link-path':
        await linkPath(req, res);
        break;
      default:
        view(req, res);
        break;
    }
    debug('[%s] %s response %s', method, pathName, res.statusCode);
  });

  server.listen(port, () => {
    console.log(chalk.green('👩🏼‍❤️‍💋‍👨🏻 server listening on port %s'), port);
  });
};
