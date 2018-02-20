const shell = require('shelljs');
const kill = require('../utils/psKill');

shell.config.silent = true;

exports.run = ({ main, print, matches }) => {
  return new Promise((resolve, reject) => {
    const child = shell.exec(main, { async: true });
    child.stderr.on('data', data => {
      kill(child.pid);
      reject(data);
    });
    child.stdout.on('data', data => {
      if (data.includes(matches[0])) {
        shell.exec('sleep 5');
        const result = shell.exec(print).stdout.includes(matches[1]);
        kill(child.pid);
        resolve(result);
      }
      // Do not reject on stdout as output may be continuous.
    });
  });
};
