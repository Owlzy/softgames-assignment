module.exports = {
    presets: [
        ['@babel/preset-env', {
            targets: '>0.25%, not dead',
            useBuiltIns: 'usage',
            corejs: 3,
            bugfixes: true
        }]
    ],
    plugins: [
        'dynamic-import-node',
        '@babel/plugin-proposal-nullish-coalescing-operator',
        '@babel/plugin-proposal-optional-chaining'
    ]
};