// webpack.prod.js
const path         = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { merge }    = require('webpack-merge');
const common       = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',      // full source maps in /bin/bundle.js.map
    optimization: {
        minimize: true,           // minify
        minimizer: [ new TerserPlugin() ],
        splitChunks: false,       // disable splitting
        runtimeChunk: false,      // inline runtime
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'bin'),
    },
});
