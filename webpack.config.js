/**
 * Created by Matthew Crocco on 4/12/2017.
 */

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const pkg = require('./package.json');

const isDebug = global.DEBUG === false ? false : process.env.NODE_ENV !== 'production';
const isVerbose = process.argv.includes('--verbose') || process.argv.includes('-v');
const useHMR = isDebug;
const babelConfig = Object.assign({}, pkg.babel, {
  cacheDirectory: useHMR,
});

if(!process.env.PRESERVE_OUTPUT) {
  const del = require('del');
  del.sync(['./public/dist/*']);
}

const config = {
  
  context: path.resolve(__dirname, './client'),
  
  entry: [
    './main.js',
  ],
  
  output: {
    path: path.resolve(__dirname, './public/dist'),
    publicPath: 'dist/',
    filename: isDebug ? '[name].js?[hash]' : '[name].[hash].js',
    chunkFilename: isDebug ? '[id].js?[chunkhash]' : '[id].[chunkhash].js',
    sourcePrefix: '  ',
  },
  
  devtool: isDebug ? 'cheap-module-inline-source-map' : 'cheap-module-source-map',
  
  stats: {
    colors: true,
    reasons: isDebug,
    hash: isVerbose,
    version: isVerbose,
    timings: true,
    chunks: true,
    chunkModules: isVerbose,
    cached: isVerbose,
    cachedAssets: isVerbose,
  },
  
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
      __DEV__: isDebug,
    }),
    new HtmlWebpackPlugin({
      alwaysWriteToDisk: true,
      template: 'index.ejs',
      filename: '../index.html',
    }),
    new HtmlWebpackHarddiskPlugin(),
    new ScriptExtHtmlWebpackPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: isDebug,
      options: {
        content: __dirname,
        postcss: [
                    // Transfer @import rule by inlining content, e.g. @import 'normalize.css'
                    // https://github.com/postcss/postcss-import
                    // require('postcss-import')({ addDependencyTo: bundler }),
                    // W3C variables, e.g. :root { --color: red; } div { background: var(--color); }
                    // https://github.com/postcss/postcss-custom-properties
          require('postcss-custom-properties'),
                    // W3C CSS Custom Media Queries, e.g. @custom-media --small-viewport (max-width: 30em);
                    // https://github.com/postcss/postcss-custom-media
          require('postcss-custom-media'),
                    // CSS4 Media Queries, e.g. @media screen and (width >= 500px) and (width <= 1200px) { }
                    // https://github.com/postcss/postcss-media-minmax
          require('postcss-media-minmax'),
                    // W3C CSS Custom Selectors, e.g. @custom-selector :--heading h1, h2, h3, h4, h5, h6;
                    // https://github.com/postcss/postcss-custom-selectors
          require('postcss-custom-selectors'),
                    // W3C calc() function, e.g. div { height: calc(100px - 2em); }
                    // https://github.com/postcss/postcss-calc
          require('postcss-calc'),
                    // Allows you to nest one style rule inside another
                    // https://github.com/jonathantneal/postcss-nesting
          require('postcss-nesting'),
                    // W3C color() function, e.g. div { background: color(red alpha(90%)); }
                    // https://github.com/postcss/postcss-color-function
          require('postcss-color-function'),
                    // Convert CSS shorthand filters to SVG equivalent, e.g. .blur { filter: blur(4px); }
                    // https://github.com/iamvdo/pleeease-filters
          require('pleeease-filters'),
                    // Generate pixel fallback for "rem" units, e.g. div { margin: 2.5rem 2px 3em 100%; }
                    // https://github.com/robwierzbowski/node-pixrem
          require('pixrem'),
                    // W3C CSS Level4 :matches() pseudo class, e.g. p:matches(:first-child, .special) { }
                    // https://github.com/postcss/postcss-selector-matches
          require('postcss-selector-matches'),
                    // Transforms :not() W3C CSS Level 4 pseudo class to :not() CSS Level 3 selectors
                    // https://github.com/postcss/postcss-selector-not
          require('postcss-selector-not'),
                    // Add vendor prefixes to CSS rules using values from caniuse.com
                    // https://github.com/postcss/autoprefixer
          require('autoprefixer'),
        ],
      },
    }),
  ],
  
  resolveLoader: {
    moduleExtensions: ['-loader'],
  },
    
    // Options affecting the normal modules
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, './client'),
        ],
        loader: `babel-loader?${JSON.stringify(babelConfig)}`,
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|woff|woff2)(\?.*)$/,
        loader: 'url-loader?limit=10000',
      },
      {
        test: /\.(eot|ttf|wav|mp3)(\?.*)$/,
        loader: 'file-loader',
      },
    ],
  },
  
};

babelConfig.presets[babelConfig.presets.indexOf('latest')] = ['latest', {
  es2015: {modules: false},
}];

if(!isDebug) {
  config.module.loaders.push({
    test: /\.css$/,
    use:
      ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          `css-loader?${JSON.stringify({
            soureMap: true,
            // CSS Modules https://github.com/css-modules/css-modules
            modules: true,
            localIdentName: '[name]_[local]_[hash:base64:3]',
            // CSS Nano http://cssnano.co/options/
            importLoaders: true,
          })}`,
          'postcss-loader',
        ],
      }),
  });
  
  config.plugins.push(new ExtractTextPlugin({
    filename: '[name].[hash].css',
    allChunks: true,
  }));
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({ compress: {warnings: isVerbose} }));
  config.plugins.push(new webpack.optimize.AggressiveMergingPlugin());
}

if(isDebug && useHMR) {
  babelConfig.plugins.unshift('react-hot-loader/babel');
  config.entry.unshift('react-hot-loader/patch', 'webpack-hot-middleware/client');
  
  config.module.loaders.push({
    test: /\.css/,
    loaders: [
      'style-loader',
      `css-loader?${JSON.stringify({
        sourceMap: isDebug,
        // CSS Modules https://github.com/css-modules/css-modules
        modules: true,
        localIdentName: isDebug ? '[name]_[local]_[hash:base64:3]' : '[hash:base64:4]',
        // CSS Nano http://cssnano.co/options/
        minimize: !isDebug,
      })}`,
      'postcss-loader',
    ],
  });
  
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new BrowserSyncPlugin({
    host: 'localhost',
    port: 8081,
    proxy: 'http://localhost:8080',
  },{
    reload: false,
  }));
  config.plugins.push(new webpack.NamedModulesPlugin());
  config.plugins.push(new webpack.NoEmitOnErrorsPlugin());
}

module.exports = config;
