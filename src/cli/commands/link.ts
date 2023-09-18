import { program } from 'commander';

program
  .command('link', '创建文件的软链')
  .argument('<link>', '需要软链的文件地址')
  .argument('<target>', '软链的目标地址');
