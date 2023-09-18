import 'tsconfig-paths/register';
import { program } from 'commander';
import { debug } from 'debug';
import { getPkg } from '@/shared/read-pkg';

/** 初始化版本信息 */
const pkg = getPkg();
program.version(pkg.version).option('--debug', '打印调试日志');

/** 开启调试信息 */
program.hook('preAction', (thisCommand) => {
  if (thisCommand.opts().debug) {
    debug.enable('soft-link:*');
    console.log('start debug soft-link');
  }
});

require('./commands/start');
require('./commands/link');

program.parse();
