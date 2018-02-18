'use strict';

const env = (() => {
  const env = process.env.BABEL_ENV || process.env.NODE_ENV;
  if (env !== 'development' && env !== 'test' && env !== 'production') {
    throw new Error(
      'Using `babel-preset-razzle` requires that you specify `NODE_ENV` or ' +
        '`BABEL_ENV` environment variables. Valid values are "development", ' +
        '"test", and "production". Instead, received: ' +
        JSON.stringify(env) +
        '.'
    );
  }
  return env;
})();

const development = env === 'development';
const test = env === 'test';
const production = env == 'production';

module.exports = (
  api,
  opts = {
    env: { modules: false }, // https://git.io/vA8cw
    react: { development: development || test }, // https://git.io/vA8cr
  }
) => {
  return {
    presets: [
      [require('@babel/preset-env'), envOptions(opts)],
      [require('@babel/preset-react'), reactOptions(opts)],
    ],
    plugins: [
      require('@babel/plugin-proposal-class-properties'),
      [require('@babel/plugin-proposal-object-rest-spread'), builtIns()],
      require('@babel/plugin-syntax-dynamic-import'),
      transformsAsync(opts) && require('@babel/plugin-transform-runtime'),
      test && [require('@babel/plugin-transform-modules-commonjs'), loose()],
      test && require('babel-plugin-dynamic-import-node'),
      production && require('babel-plugin-transform-react-remove-prop-types'),
    ],
  };
};

function envOptions(opts) {
  return opts.hasOwnProperty('env') ? opts.env : { modules: false };
}

function reactOptions(opts) {
  return opts.hasOwnProperty('react')
    ? opts.react
    : { development: development || test }; // https://git.io/vA8ca
}

function builtIns() {
  return { useBuiltIns: true };
}

function loose() {
  return { loose: true };
}

function transformsAsync({ env: { exclude } }) {
  let excluded = exclude.join();
  return (
    !/transform-async-to-generator/.test(exclude) &&
    !/transform-regenerator/.test(exclude)
  );
}
