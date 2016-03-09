const path = require('path');

module.exports = {
	entry: {
		app: ['./lib/cycle-socket.js']
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'cycle-socket.js',
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				loader: 'babel',
				query: {
					presets: ['es2015']
				}
			}
		]
	}
};
