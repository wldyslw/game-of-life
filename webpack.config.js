const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');

module.exports = {
    entry: './js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 1234,
    },
    mode: 'development',
    plugins: [
        new HtmlPlugin({
            title: 'WASM Demo',
            template: 'js/index.html',
        }),
        new WasmPackPlugin({
            crateDirectory: path.resolve(__dirname, '.'),
            outName: 'game_of_life',
            forceMode: 'production',
        }),
        new webpack.ProvidePlugin({
            TextDecoder: ['text-encoding', 'TextDecoder'],
            TextEncoder: ['text-encoding', 'TextEncoder'],
        }),
    ],
    experiments: {
        syncWebAssembly: true,
        topLevelAwait: true,
    },
};
