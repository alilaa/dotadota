var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  poll: 500,
  historyApiFallback: true,
  proxy: {
    '/api/*': {
      target: 'http://localhost:63189/',
      secure: false
    },
	    '/signalr/*': {
      target: 'http://localhost:63189/',
      secure: false
    }
  }
}).listen(3000, 'localhost', function (err, result) {
  if (err) {
    return console.log(err);
  }

  console.log('Listening at http://localhost:3000/');
});
