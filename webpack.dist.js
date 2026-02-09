// webpack.dist.js
const path         = require('path');
const webpack      = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { merge }    = require('webpack-merge');
const common       = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    devtool: false,             // no source maps
    performance: { hints: false },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
    ],
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
