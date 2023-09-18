import { createServer } from '@/server/app';
import { program } from 'commander';
import { DEFAULT_PORT } from '@/cli/constant';

const debug = require('debug')('soft-link:start');

const start = (options: { port?: number }) => {
  createServer(options.port ?? DEFAULT_PORT);
};

program
  .command('start')
  .option('-P, --port <number>', '页面启动的端口', String(DEFAULT_PORT))
  .action(start);
