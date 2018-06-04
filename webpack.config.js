const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const config = {
    entry: [
         './src/main.js',
    ],
    resolve: {
        extensions: ['.html', '.js', '.json', '.scss', '.css'],
        alias: {
            leaflet_css: __dirname + "/node_modules/leaflet/dist/leaflet.css",
            leaflet_marker: __dirname + "/node_modules/leaflet/dist/images/marker-icon.png",
            leaflet_marker_2x: __dirname + "/node_modules/leaflet/dist/images/marker-icon-2x.png",
            leaflet_marker_shadow: __dirname + "/node_modules/leaflet/dist/images/marker-shadow.png"
        }
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            //{test: /style\.css/,use: ExtractTextPlugin.extract({fallback: "style-loader",use: "css-loader"})},
            {test: /\.css$/,use: ['style-loader','css-loader' ]},
            {test: /\.(csv|tsv)$/,use: ['csv-loader']}, 
            {test: /\.xml$/, use: ['xml-loader']},
            { test: /bootstrap\/js\//, loader: 'imports-loader?jQuery=jquery' },
            {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/font-woff'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file-loader'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml'},
            {test: /tabdrop/, loader: "imports-loader?define=>undefined,exports=>undefined" },
            {test: /\.(png|jpg|gif)$/, use: [{loader: 'url-loader',options: {limit: 8192}}]},
            {
              test: /fuelux\/js\/.*\.js$/,
              use: ['imports-loader?define=>false']
            }
        ],
        loaders: [
            {test: /\.css$/, loader: "style-loader!css-loader"},
            //{test: /\.png$/, loader: "url-loader?mimetype=image/png"}
            { test: /datatables\.net.*/, loader: 'imports?define=>false'},
            { test: /\.json$/, loader: 'json-loader' } //Handling json files
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            Backbone: "backbone",
            _: "underscore"
        }),
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Boda Telecom Suite - CE',
            //favicon: __dirname + '/images/favicon.ico',
            template: __dirname + '/src/index.html'
        }),
        //new ExtractTextPlugin("styles.css"),
        new FaviconsWebpackPlugin('./src/images/btsce-logo-selection.png'),
        new UglifyJsPlugin()
    ]
};

module.exports = config;