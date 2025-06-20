const path = require("path");
const FileManagerPlugin = require("filemanager-webpack-plugin");

module.exports = {
    entry: "./index.ts",
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
        extensions: [".tsx", ".ts", ".js"],
        preferRelative: true,
    },
    output: {
        filename: "index.js",
        path: path.resolve(
            __dirname,
            "build/com.tfdidesign.announcements/background",
        ),
        library: {
            type: "commonjs2",
        },
    },
    plugins: [
        new FileManagerPlugin({
            events: {
                onEnd: {
                    copy: [
                        {
                            source: "plugin.json",
                            destination: "build/com.tfdidesign.announcements/",
                        },
                        {
                            source: "soundpacks",
                            destination:
                                "build/com.tfdidesign.announcements/background/soundpacks",
                        },
                        {
                            source: "package.json",
                            destination:
                                "build/com.tfdidesign.announcements/background/package.json",
                        },
                        {
                            source: "package-lock.json",
                            destination:
                                "build/com.tfdidesign.announcements/background/package-lock.json",
                        },
                    ],
                },
            },
        }),
    ],
    mode: "production",
    target: "node",
};
