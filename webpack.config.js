var path = require('path');
var webpack = require('webpack');
module.exports = {
    entry: [
        './js/index.js',
    ],
    output: {
        path: path.resolve(__dirname, 'js/'),
        filename: 'bundle.js'
    },
    module: {
        rules : [
            {
              test : /\.js?/,
              exclude: /node_modules/,
              loader : 'babel-loader',
              options: {
                "presets": ["@babel/preset-env"]
              }
            }
        ]
    }
};