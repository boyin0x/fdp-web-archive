const webpack = require("webpack");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const srcDir = path.join(__dirname, "..", "src");

module.exports = {
    entry: {
        popup: path.join(srcDir, 'popup.tsx'),
        options: path.join(srcDir, 'options.tsx'),
        background: path.join(srcDir, 'background.ts'),
        content_script: path.join(srcDir, 'content_script.tsx'),
    },
    output: {
        path: path.join(__dirname, "../dist/js"),
        filename: "[name].js",
    },
    optimization: {
        splitChunks: {
            name: "vendor",
            chunks(chunk) {
                return chunk.name !== 'background' && chunk.name !== 'options';
            }
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        fallback: {
            fs: false,
            assert: require.resolve("assert"),
            buffer: require.resolve("buffer"),
            crypto: require.resolve("crypto-browserify"),
            http: require.resolve("stream-http"),
            https: require.resolve("https-browserify"),
            os: require.resolve("os-browserify/browser"),
            path: require.resolve("path-browserify"),
            process: require.resolve("process/browser"),
            stream: require.resolve("stream-browserify"),
            zlib: require.resolve("browserify-zlib"),
        },
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: ".", to: "../", context: "public" }],
            options: {},
        }),

        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
            process: ['process', 'process/browser'],
        }),

        new webpack.DefinePlugin({
            'process.env.NODE_DEBUG': 'false',
            'process.env.REACT_APP_BEE_BATCH_ID': '"c65f5e9a2eeaef012ed3b4b6c6c4867d58fde617725e7a2c7e74695496dd5b8a"',
            'process.env.REACT_APP_BEE_URL': '"https://1633-gitpodio-templatetypesc-kjg7d6msudh.ws-us67.gitpod.io/"',
            'process.env.REACT_APP_BEE_DEBUG_URL': '"https://1635-gitpodio-templatetypesc-kjg7d6msudh.ws-us67.gitpod.io/"',
            'process.env.REACT_APP_RPC_URL': '"https://9545-gitpodio-templatetypesc-kjg7d6msudh.ws-us67.gitpod.io/"',

            'process.env.REACT_APP_ENS_REGISTRY_ADDRESS': '"0x26b4AFb60d6C903165150C6F0AA14F8016bE4aec"',
            'process.env.REACT_APP_PUBLIC_RESOLVER_ADDRESS': '"0xA94B7f0465E98609391C623d0560C5720a3f2D33"',
            'process.env.REACT_APP_SUBDOMAIN_REGISTRAR_ADDRESS': '"0x630589690929E9cdEFDeF0734717a9eF3Ec7Fcfe"',
        })


    ],
    performance: {
        hints: false,
        // maxEntrypointSize: 512000,
        // maxAssetSize: 512000
    }
};
