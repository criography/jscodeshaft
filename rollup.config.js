import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: 'lib/index.js',
  output: {
    dir: 'dist',
    format: 'cjs'
  },
  plugins: [nodeResolve()]
};
