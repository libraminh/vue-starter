const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const autoprefixer = require("autoprefixer")
const { VueLoaderPlugin } = require('vue-loader')

var config = {
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].bundle.js'
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
        loaders: ["file-loader"]
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
            loader: 'file-loader',
            options: {
                name: '[name].[ext]',
                outputPath: 'fonts/'
            }
        }]
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.vue', '.json'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html')
    }),
    new VueLoaderPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jquery: 'jquery',
      'window.jQuery': 'jquery',
      jQuery: 'jquery'
    })
  ]
}

module.exports = function(env, options) {
  const isDev = options.mode === 'development'
  const isProd = options.mode === 'production'

  if (isProd) {
    var plugins = [
      new CleanWebpackPlugin('build'),
      new MiniCssExtractPlugin({
        filename: "style.css",
        chunkFilename: "[name].css"
      }),
      new OptimizeCSSAssetsPlugin({}),
      new webpack.LoaderOptionsPlugin({
        options: {
            postcss: [
                autoprefixer()
            ]
        }
      })
    ]

    plugins.forEach(function(plugin) {
      config.plugins.push(plugin)
    })

    var rules = [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { sourceMap: true, importLoaders: 1 } },
          { loader: 'sass-loader', options: { sourceMap: true } },
          "postcss-loader"
        ],
      }
    ]

    rules.forEach(function(rule) {
      config.module.rules.push(rule)
    })

    config.optimization = {
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            filename: 'common.bundle.js'
          }
        }
      }
    }
  } else if (isDev) {
    var plugins = [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    ]

    plugins.forEach(function(plugin) {
      config.plugins.push(plugin)
    })

    config.devServer = {
      contentBase: path.join(__dirname, 'src'),
      compress: true,
      hot: true,
      open: true
    }

    var rules = [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          "vue-style-loader",
          "css-loader?sourceMap",
          "sass-loader?sourceMap"
        ]
      }
    ]

    rules.forEach(function(rule) {
      config.module.rules.push(rule)
    })

    config.devtool = 'source-map'
  }
  
  return config
}
