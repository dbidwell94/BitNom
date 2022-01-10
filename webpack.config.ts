import { Configuration } from 'webpack';
import path from 'path';
import HtmlPlugin from 'html-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';

const DEV_PORT = 2021;

export default function (env: any, args: any): Configuration {
  const isProduction: boolean = args.mode === 'production';
  return {
    entry: [path.join(__dirname, 'src', 'index.tsx')],
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'babel-loader',
        },
        {
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre',
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.jsx', '.ts', '.js'],
    },
    plugins: [
      new HtmlPlugin({
        template: path.join(__dirname, 'public', 'index.html'),
        inject: 'head',
        scriptLoading: 'defer',
        favicon: path.join(__dirname, 'public', 'favicon.ico'),
        title: 'BitNom',
        hash: true,
      }),
      new CompressionPlugin(),
      new CopyPlugin({
        patterns: [{ from: path.join(__dirname, 'public', 'robots.txt') }],
      }),
    ],
    devServer: {
      historyApiFallback: true,
      port: DEV_PORT,
      hot: true,
      open: true,
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: isProduction ? '[chunkhash].bundle.js' : '[name].js',
      publicPath: '/',
    },
    devtool: 'inline-source-map',
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  };
}
