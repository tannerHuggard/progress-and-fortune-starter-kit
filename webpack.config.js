const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const UglifyJS = require('uglify-es');

const DefaultUglifyJsOptions = UglifyJS.default_options();
const compress = DefaultUglifyJsOptions.compress;
for (let compressOption in compress) {
	compress[compressOption] = false;
}
compress.unused = true;

module.exports = {
	entry: {
		index: './assets/js/index.js',
		FirstComp: './assets/js/components/FirstComp.js',
		main: './assets/js/main.js'
	},
	output: {
		path: path.resolve(__dirname, 'public/dist'),
		filename: '[name].js' // '[name].[chunkhash].js' put this if you want to get hashed files to cache bust
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['babel-loader', 'prettier-loader']
			},
			{
				test: /\.scss$/,
				use: [
					'style-loader',
					MiniCssExtractPlugin.loader,
					'css-loader',
					'sass-loader',
					'postcss-loader'
				]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin('public/dist', {}),
		new MiniCssExtractPlugin({
			filename: 'styles.css' // 'style.[contenthash].css' put this if you want to get hashed files to cache bust
		}),
		// new HtmlWebpackPlugin({
		// 	inject: false,
		// 	hash: true,
		// 	template: './assets/index.html',
		// 	children: false,
		// 	filename: '../index.html'
		// }),
		new WebpackMd5Hash()
	],
	optimization: {
		splitChunks: {
			chunks: 'all',
			minSize: 0
		},
		minimize: true,
		minimizer: [
			new UglifyJsPlugin({
				uglifyOptions: {
					compress,
					mangle: false,
					output: {
						beautify: true
					}
				}
			})
		],
		usedExports: true,
		sideEffects: true
	}
};