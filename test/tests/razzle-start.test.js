'use strict';

const shell = require('shelljs');
const util = require('../fixtures/util');
const { run } = require('../utils/common');
const path = require('path');

shell.config.silent = true;

describe('razzle start', () => {
  describe('razzle basic example', () => {
    beforeAll(() => {
      shell.cd(path.join(util.rootDir, 'examples/basic'));
    });

    it(
      'should start a dev server',
      () => {
        return run({
          main: './node_modules/.bin/razzle start',
          print: 'curl -sb -o "" localhost:3001/static/js/bundle.js',
          matches: ['Compiled successfully', 'React'],
        })
          .then(test => expect(test).toBe(true))
          .catch(error => {
            throw error;
          });
      },
      1000000
    );

    it(
      'should build and run',
      () => {
        shell.exec('./node_modules/.bin/razzle build');
        return run({
          main: 'node build/server.js',
          print: 'curl -I localhost:3000',
          matches: ['> Started on port 3000', '200'],
        })
          .then(test => expect(test).toBe(true))
          .catch(error => {
            throw error;
          });
      },
      400000
    );

    afterAll(() => {
      shell.rm('-rf', 'build');
      shell.cd(util.rootDir);
    });
  });
});
