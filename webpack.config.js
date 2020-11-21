const path = require('path');
const webpack = require('webpack');
const HtmlPlugin = require('html-webpack-plugin');
const WasmPackPlugin = require('@wasm-tool/wasm-pack-plugin');

module.exports = {
    entry: './www/src/index.ts',
    output: {
        path: path.resolve(__dirname, 'www/dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        alias: {
            pkg: path.resolve(__dirname, 'pkg'),
        },
        extensions: ['.ts', '.js'],
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'www/dist'),
        compress: true,
        port: 1234,
    },
    mode: 'development',
    plugins: [
        new HtmlPlugin({
            title: 'WASM Demo',
            template: 'www/src/index.html',
        }),
        new WasmPackPlugin({
            crateDirectory: path.resolve(__dirname),
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
