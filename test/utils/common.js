const shell = require('shelljs');
const kill = require('../utils/psKill');

shell.config.silent = true;

exports.run = ({ main, print, matches }) =>
  new Promise((resolve, reject) => {
    const child = shell.exec(main, { async: true });
    child.stdout.on('data', data => {
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
