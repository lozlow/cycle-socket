import babel from 'rollup-plugin-babel';

export default {
  entry: 'lib/cycle-socket.js',
  sourceMap: false,
  plugins: [babel()]
};
