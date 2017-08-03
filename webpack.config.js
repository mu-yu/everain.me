const path = require('path')
const webpack = require('webpack')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  entry: [
    './src/main.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [path.join(__dirname, 'src')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.join(__dirname, 'src')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/img/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:7].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  }
}

if (process.env.NODE_ENV === 'development') {
  module.exports.module.rules = module.exports.module.rules.concat([
    {
      test: /\.css$/,
      include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules')],
      use: [
        {
          loader: 'style-loader'
        },
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
          }
        },
        {
          loader: 'postcss-loader'
        }
      ]
    },
  ])
  module.exports.devtool = '#cheap-module-eval-source-map'
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': '"development"'
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin()
  ]);
  ['index', 'friend', 'about'].forEach(pageName => {
    // https://github.com/ampedandwired/html-webpack-plugin
    let pagePlugin = new HtmlWebpackPlugin({
      filename: `${pageName}.html`,
      template: 'index.html',
      inject: true,
      contentName: pageName
    })
    module.exports.plugins.push(pagePlugin)
  })

  module.exports.devServer = {
    port: 9000,
    compress: true,
    hot: true, // Tell the dev-server we're using HMR
    contentBase: path.resolve(__dirname, 'dist'),
  }
}

if (process.env.NODE_ENV === 'production') {
  module.output = {
    path: path.resolve(__dirname, 'dist'),
    filename: path.resolve(__dirname, 'dist', 'js/[name].[chunkhash].js'),
    chunkFilename: path.resolve(__dirname, 'dist', 'js/[id].[chunkhash].js')
  }
  module.exports.module.rules = module.exports.module.rules.concat([
    {
      test: /\.css$/,
      include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, 'node_modules')],
      use: ExtractTextPlugin.extract({
        fallback: [{
          loader: 'style-loader',
        }],
        use: [
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      })
    },
  ])
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    }),
    // extract css into its own file
    new ExtractTextPlugin({
      filename: 'css/[name].[contenthash].css'
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './static'),
        to: path.resolve(__dirname, 'dist', 'static'),
        ignore: ['.*']
      }
    ])
  ]);

  ['index', 'friend', 'about'].forEach(pageName => {
    let pagePlugin = new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, 'dist', `${pageName}.html`),
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency',
      contentName: pageName
    })
    module.exports.plugins.push(pagePlugin)
  })
}
