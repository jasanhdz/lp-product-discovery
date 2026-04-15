const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development'

  return {
    entry: {
      // pages
      app: './src/index.jsx'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDev ? '[name].js' : '[name].[contenthash:8].js',
      chunkFilename: isDev ? '[name].chunk.js' : '[name].[contenthash:8].chunk.js',
      publicPath: '/',
      clean: true
    },

    target: 'web',
    devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    module: {
      rules: [
        // JS / JSX / TS / TSX → Babel
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: 'defaults' }],
                ['@babel/preset-react', { runtime: 'automatic' }],
                '@babel/preset-typescript'
              ],
              cacheDirectory: true
            }
          }
        },

        // CSS
        {
          test: /\.css$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  auto: true,
                  namedExport: false,
                  exportLocalsConvention: 'as-is'
                }
              }
            },
            'postcss-loader'
          ]
        },

        // SASS / SCSS
        {
          test: /\.s[ac]ss$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  auto: true,
                  namedExport: false,
                  exportLocalsConvention: 'as-is'
                }
              }
            },
            'postcss-loader',
            'sass-loader'
          ]
        },

        // Images
        {
          test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 8 * 1024 // inline < 8KB
            }
          },
          generator: {
            filename: 'assets/images/[name].[hash:8][ext]'
          }
        },

        // Fonts
        {
          test: /\.(woff2?|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/fonts/[name].[hash:8][ext]'
          }
        }
      ]
    },
    plugins: [
      new Dotenv({ systemvars: true }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        minify: !isDev && {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true
        }
      }),
      ...(!isDev
        ? [
            new MiniCssExtractPlugin({
              filename: 'css/[name].[contenthash:8].css',
              chunkFilename: 'css/[name].[contenthash:8].chunk.css'
            })
          ]
        : [])
    ],
    optimization: {
      minimize: !isDev,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: { drop_console: true },
            format: { comments: false }
          },
          extractComments: false
        }),
        new CssMinimizerPlugin()
      ],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          // React core (react, react-dom, react-router, scheduler)
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom|react-router|scheduler)[\\/]/,
            name: 'vendor-react',
            priority: 40,
            reuseExistingChunk: true
          },
          // Other vendor libs
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
            priority: 20,
            reuseExistingChunk: true
          },
          // Shared app code used by 2+ chunks
          common: {
            minChunks: 2,
            name: 'common',
            priority: 10,
            reuseExistingChunk: true
          }
        }
      },
      runtimeChunk: 'single'
    },

    devServer: {
      static: path.resolve(__dirname, 'public'),
      port: 3000,
      hot: true,
      compress: true,
      historyApiFallback: true,
      open: true
    },

    performance: {
      hints: isDev ? false : 'warning',
      maxAssetSize: 250 * 1024,
      maxEntrypointSize: 400 * 1024
    }
  }
}
