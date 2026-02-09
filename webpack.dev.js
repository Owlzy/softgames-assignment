// webpack.dev.js
const path      = require('path');
const { merge } = require('webpack-merge');
const common    = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'eval-source-map',
    optimization: {
        minimize: false,         // no minification in dev
        splitChunks: false,      // disable all code‑splitting
        runtimeChunk: false,     // keep runtime in the bundle
    },
    output: {
        publicPath: '/',         // same as before
        // filename & chunkFilename come from common (both ‘bundle.js’ → no extra files)
    },
    devServer: {
        hot: true,
        open: true,
        static: [
            { directory: path.resolve(__dirname),        publicPath: '/' },
            { directory: path.resolve(__dirname, 'bin'), publicPath: '/' },
        ],
    },
});
