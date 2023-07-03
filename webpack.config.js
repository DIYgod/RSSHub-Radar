const webpack = require('webpack');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {

    mode: 'production',

    devtool: false,

    performance: {
        maxEntrypointSize: 1000000,
    },

    entry: {
        'popup': './src/js/popup/index.js',
        'content': './src/js/content/index.js',
        'background': './src/js/background/index.js',
        'options': './src/js/options/index.js',
        'sandbox': './src/js/sandbox/index.js',
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/',
    },

    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.less'],
        fallback: {
            'stream': require.resolve('stream-browserify'),
            'buffer': require.resolve('buffer/'),
            'http': require.resolve('stream-http'),
            "url": require.resolve("url/"),
            "https": require.resolve("https-browserify"),
            "timers": require.resolve("timers-browserify"),
            "process": require.resolve("process/browser"),
        }
    },

    module: {
        strictExportPresence: true,
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',
                loader: 'eslint-loader',
                include: path.resolve(__dirname, '../src/js'),
            },
            {
                test: /\.js$/,
                use: [
                    'template-string-optimize-loader',
                    {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            presets: ['@babel/preset-env'],
                            plugins: [
                                [
                                    "component",
                                    {
                                        "libraryName": "element-ui",
                                        "styleLibraryName": "theme-chalk"
                                    }
                                ],
                            ],
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('autoprefixer'),
                                    require('cssnano')({
                                        preset: 'default',
                                    }),
                                ],
                            },
                        }
                    },
                ],
            },
            {
                test: /\.less$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('autoprefixer'),
                                    require('cssnano')({
                                        preset: 'default',
                                    }),
                                ],
                            },
                        }
                    },
                    'less-loader'
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: false,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    require('autoprefixer'),
                                    require('cssnano')({
                                        preset: 'default',
                                    }),
                                ],
                            },
                        }
                    },
                    'sass-loader'
                ],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.(png|jpg)$/,
                loader: 'url-loader',
                options: {
                    'limit': 40000
                }
            },
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'
            },
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css'
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: 'src/assets',
                    to: '',
                },
            ],
        }),
        new VueLoaderPlugin(),
        new webpack.DefinePlugin({
            VERSION: JSON.stringify(require('./src/assets/manifest.json').version)
        }),
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        }),
    ],
};
