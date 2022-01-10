import { Configuration } from 'webpack';
import path from 'path';
import HtmlPlugin from 'html-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

const DEV_PORT = 2021;

export default function (env: any, args: any): Configuration {
  const isProduction: boolean = args.mode === 'production';
  return {
    entry: [path.join(__dirname, 'src', 'index.tsx')],
    mode: isProduction ? 'production' : 'development',
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
      extensions: ['.tsx', '.jsx', '.ts', '.js', '...'],
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
      new CopyPlugin({
        patterns: [{ from: path.join(__dirname, 'public', 'robots.txt') }],
      }),
      isProduction ? new CompressionPlugin() : () => {},
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
    optimization: isProduction
      ? {
          minimize: true,
          minimizer: [new TerserPlugin()],
          removeEmptyChunks: true,
          splitChunks: {
            chunks: 'all',
            usedExports: true,
          },
        }
      : undefined,
    devtool: isProduction ? false : 'inline-source-map',
  };
}
