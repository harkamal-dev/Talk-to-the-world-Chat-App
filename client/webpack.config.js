const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = (env) => {
	const isProduction = env.NODE_ENV === "production";
	const dotenvFilename = isProduction ? ".env.prod" : ".env.dev";

	return {
		entry: "./src/index.js",
		output: {
			filename: isProduction ? "bundle.[contenthash].js" : "bundle.js",
			path: path.resolve(__dirname, "dist"),
			publicPath: "/",
		},
		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					use: {
						loader: "babel-loader",
						options: {
							presets: ["@babel/preset-env", "@babel/preset-react"],
						},
					},
				},
				{
					test: /\.css$/,
					use: ["style-loader", "css-loader", "postcss-loader"],
				},
			],
		},
		resolve: {
			extensions: [".js", ".jsx"],
			alias: {
				components: path.resolve(__dirname, "src/components/"),
				pages: path.resolve(__dirname, "src/pages/"),
				apis: path.resolve(__dirname, "src/apis/"),
				hooks: path.resolve(__dirname, "src/hooks/"),
				contexts: path.resolve(__dirname, "src/context/"),
			},
		},
		devtool: isProduction ? "source-map" : "cheap-module-source-map",
		devServer: {
			static: {
				directory: path.join(__dirname, "public"),
			},
			compress: true,
			port: 9000,
			historyApiFallback: true,
		},
		optimization: {
			minimize: isProduction,
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						format: {
							comments: false,
						},
					},
					extractComments: false,
				}),
			],
			splitChunks: {
				cacheGroups: {
					default: false,
					vendors: false,
					async: {
						chunks: "async",
					},
				},
			},
		},

		plugins: [
			new HtmlWebpackPlugin({
				template: path.join(__dirname, "public/index.html"),
				minify: isProduction
					? {
							removeComments: true,
							collapseWhitespace: true,
							removeRedundantAttributes: true,
							useShortDoctype: true,
							removeEmptyAttributes: true,
							removeStyleLinkTypeAttributes: true,
							keepClosingSlash: true,
							minifyJS: true,
							minifyCSS: true,
							minifyURLs: true,
					  }
					: false,
			}),
			new Dotenv({
				path: dotenvFilename,
			}),
			new webpack.DefinePlugin({
				"process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
			}),
		],
	};
};
