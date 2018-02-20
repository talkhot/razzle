'use strict';

const shell = require('shelljs');
const path = require('path');
const { rootDir } = require('../fixtures/util');
const craDir = `packages/create-razzle-app/`;
const buildDir = path.join(rootDir, `build`);
const bin = path.join(rootDir, craDir, `bin/create-razzle-app`);
const razzleBin = appName => path.join(buildDir, appName, 'razzle');
const { run } = require('../utils/common');

shell.config.silent = true;
const timeout = 150000;

describe('create-react-app', () => {
  it(
    'should create and run app',
    async () => {
      const name = 'myapp';

      expect(await build({ cmd: `${bin} ${name}` })).toBe(0);

      expect(shell.test('-d', `${buildDir}/${name}`)).toBe(true);

      expect(shell.test('-f', `${buildDir}/${name}/src/server.js`)).toBe(true);
      expect(shell.test('-f', `${buildDir}/${name}/src/index.js`)).toBe(true);

      expect(shell.test('-f', `${buildDir}/${name}/package-lock.json`)).toBe(
        true
      );

      run({
        main: `${razzleBin(name)} start`,
        print: 'curl -sb -o "" localhost:3001/static/js/bundle.js',
        matches: ['Compiled successfully', 'React'],
      })
        .then(test => expect(test).toBe(true))
        .catch(error => {
          throw error;
        });
    },
    timeout
  );

  it(
    'should create app from examples',
    async () => {
      const name = 'elm';

      expect(await build({ cmd: `${bin} --example with-elm ${name}` })).toBe(0);

      expect(shell.test('-d', `${buildDir}/${name}`)).toBe(true);

      expect(shell.test('-f', `${buildDir}/${name}/package-lock.json`)).toBe(
        true
      );
      expect(shell.test('-f', `${buildDir}/${name}/elm-package.json`)).toBe(
        true
      );
      expect(shell.test('-f', `${buildDir}/${name}/razzle.config.js`)).toBe(
        true
      );

      // Indirectly tests `yarn init:bin`
      run({
        main: `${razzleBin(name)} start`,
        print: 'curl -sb -o "" localhost:3001/static/js/bundle.js',
        matches: ['Compiled successfully', 'Main.elm'],
      })
        .then(test => expect(test).toBe(true))
        .catch(error => {
          throw error;
        });
    },
    timeout
  );

  afterEach(() => {
    shell.rm('-rf', buildDir);
  });
});

async function build({ cmd }) {
  return await new Promise(resolve => {
    shell.exec(cmd, code => {
      resolve(code);
    });
  });
}
