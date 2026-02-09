// webpack.common.js
const path               = require('path');

module.exports = {
    entry: './src/index.js',

    output: {
        path:          path.resolve(__dirname, 'bin'),
        publicPath:    '/',               // dynamic imports will fetch `/<chunk>.bundle.js`
        filename:      'bundle.js',
        chunkFilename: '[name].bundle.js',// e.g. `node_modules_pixi_js_lib_environment-browser_browserAll_mjs.bundle.js`
    },

    resolve: {
        extensions: ['.js', '.mjs', '.json'],
        fallback:    { fs: false },
    },

    module: {
        rules: [
            {
                test: /\.mjs$/,
                include: /[\\/]node_modules[\\/]pixi\.js[\\/]/,
                type: 'javascript/auto',
                use: {
                    loader: 'babel-loader',
                    options: {
                        babelrc: false,
                        configFile: path.resolve(__dirname, 'babel.config.js'),
                    },
                },
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: 'babel-loader',
            },
            {
                test: /\.(glsl|vs|fs|frag|vert)$/,
                loader: 'shader-loader',
                options: { glsl: { chunkPath: path.resolve('/glsl/chunks') } },
            },
        ],
    },
};
