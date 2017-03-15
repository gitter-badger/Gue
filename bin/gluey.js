#!/usr/bin/env node

'use strict';

const Liftoff = require('liftoff');
const argv = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');
var prettyMs = require('pretty-ms');

const glueyCli = new Liftoff({
  name: 'gluey',
  processTitle: 'gluey',
  moduleName: 'gluey',
  configName: 'glueyfile',
});

glueyCli.launch({
  cwd: argv.cwd,
  configPath: argv.myappfile,
  require: argv.require,
  completion: argv.completion
}, invoke);

function invoke(env) {
  if (!env.configPath) {
    console.log(chalk.red('No gulpfile found'));
    process.exit(1);
  }

  // add node_modules/.bin to the path.
  // this should be relative to the project root
  // if liftoff is working correctly.  :)
  process.env.PATH = env.configBase + '/node_modules/.bin:' +
    process.env.PATH;

  require(env.configPath);
  const glueInst = require(env.modulePath);
  const actions = argv._;
  const actionList = actions.length ? actions : ['default'];
  const availableTasks = glueInst.taskList();

  if (argv.l) {
    console.log(availableTasks.join('\n'));
    process.exit(0);
  }

  glueInst.on('task_start', (event) => {
    console.log(chalk.green('[' + event.task + ']') + chalk.blue('started'));
  });

  glueInst.on('task_stop', (event) => {
    console.log(chalk.green('[' + event.task + ']') +
      chalk.blue('finished in ') + chalk.magenta(prettyMs(event.duration)));
  });

  // Now lets make do stuff
  glueInst.start(actionList);
}
//
