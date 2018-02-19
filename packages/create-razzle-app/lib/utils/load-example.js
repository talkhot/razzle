'use strict';

const exec = require('execa');
const Promise = require('promise');
const output = require('./output');
const isEnvLocal = require('./env');

module.exports = function loadExample(opts) {
  const projectName = opts.projectName;
  const example = opts.example;

  const cmds = isEnvLocal
    ? [
        `mkdir -p build/${projectName}`,
        `cp -a ../../examples/${example}/. build/${projectName}/.`,
      ]
    : [
        `mkdir -p ${projectName}`,
        `curl https://codeload.github.com/jaredpalmer/razzle/tar.gz/master | tar -xz -C ${projectName} --strip=3 razzle-master/examples/${example}`,
      ];

  const stopSpinner = output.wait(
    `Downloading files for ${output.cmd(example)} example`
  );

  const cmdPromises = cmds.map(cmd => exec.shell(cmd));

  return Promise.all(cmdPromises).then(() => {
    stopSpinner();
    output.success(
      `Downloaded ${output.cmd(example)} files for ${output.cmd(projectName)}`
    );
  });
};
