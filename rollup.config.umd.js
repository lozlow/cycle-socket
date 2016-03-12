import config from './rollup.config.js';

config.format = 'umd';
config.dest = 'dist/cycle-socket.umd.js';
config.moduleName = 'cycleSocket';

export default config;
