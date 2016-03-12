import config from './rollup.config.js';
import uglify from 'rollup-plugin-uglify';

config.format = 'umd';
config.dest = 'dist/cycle-socket.umd.js';
config.plugins.push(uglify());
config.moduleName = 'cycleSocket';

export default config;
