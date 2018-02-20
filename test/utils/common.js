const shell = require('shelljs');
const kill = require('../utils/psKill');

exports.run = ({ main, print, matches }) =>
  new Promise((resolve, reject) => {
    shell.exec(main).stdout.on('data', data => {
      if (data.includes(matches[0])) {
        shell.exec('sleep 5');
        const output = shell.exec(print).stdout.includes(matches[1]);
        kill(child.pid);
        resolve(output);
      } else {
        reject();
      }
    });
  });
