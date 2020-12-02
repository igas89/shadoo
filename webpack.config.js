const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const pathResolve = (pathSegments) => path.resolve(__dirname, pathSegments);

module.exports = (env, { mode = 'development' }) => {
    const isDev = mode === 'development';

    const config = {
        mode,
        entry: {
            application: './src/frontend/client.tsx',
        },
        // output: {
        //     publicPath: '/',
        // },
        devtool: isDev ? 'source-map' : '',
        devServer: {
            historyApiFallback: true,
            contentBase: './',
            hot: true,
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.css', '.scss'],
            alias: {
                img: path.resolve(__dirname, 'src/frontend/assets/images/'),
                icons: path.resolve(__dirname, 'src/frontend/assets/icons/'),
                styles: path.resolve(__dirname, 'src/frontend/styles/'),
                files: path.resolve(__dirname, 'src/frontend/files/'),
                api: path.resolve(__dirname, 'src/frontend/api/'),
                store: path.resolve(__dirname, 'src/frontend/store/'),
                actions: path.resolve(__dirname, 'src/frontend/store/actions/'),
                reducers: path.resolve(__dirname, 'src/frontend/store/reducers/'),
                Helpers: path.resolve(__dirname, 'src/frontend/Helpers/'),
                hooks: path.resolve(__dirname, 'src/frontend/hooks/'),
                components: path.resolve(__dirname, 'src/frontend/components/'),
                pages: path.resolve(__dirname, 'src/frontend/pages/'),
            }
        },
        module: {
            rules: [
                {
                    test: /\.(js|ts)x?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    },
                },
                {
                    test: /\.(scss|css)$/,
                    use: [
                        // Creates `style` nodes from JS strings
                        'style-loader',
                        MiniCssExtractPlugin.loader,
                        // Translates CSS into CommonJS
                        {
                            loader: 'css-loader',
                            options: {
                                // modules: true,
                                // importLoaders: 1,
                            }
                        },
                        // Compiles Sass to CSS
                        {
                            loader: 'sass-loader',
                            options: {
                                // Prefer `dart-sass`
                                implementation: require('sass'),
                                sourceMap: isDev,
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|svg|jpg|gif)$/,
                    use: [
                        'file-loader',
                    ],
                },
            ],
        },
        output: {
            path: pathResolve('dist'),
            filename: '[name].[chunkhash:22].js',
            chunkFilename: '[name].[chunkhash:22].js'
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: './src/frontend/public/index.html',
                filename: 'index.html',
                inject: true,
                hash: true,
            }),
            new ForkTsCheckerWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: "[name].css",
                // allChunks: true,
            }),
            // new CopyPlugin({
            //     patterns: [{
            //         context: path.join(__dirname, '/src/frontend/assets/images'),
            //         from: '**/*',
            //         to: path.join(__dirname, '/dist/img/'),
            //     }],
            // }),
            new CopyPlugin({
                patterns: [{
                    context: path.join(__dirname, '/src/frontend/assets/icons'),
                    from: '**/*',
                    to: path.join(__dirname, '/dist/icons/'),
                }],
            }),
        ],
    };

    return config;
};