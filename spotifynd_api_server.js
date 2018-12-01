var fileStreamRotator = require('file-stream-rotator'),
    express = require('express'),
    application = express(),
    dotEnvInit = require('dotenv').config(),
    bodyParser=require('body-parser'),
    authRouteV1 = require('./v1/routes/auth'),
    apiRouteV1 = require('./v1/routes/api'),
    port = process.env.PORT,
    DBConn = require('./v1/utils/db.js').DBConn,
    dbConn = new DBConn();

var timeout = require('connect-timeout');

application.use(timeout(10*60*1000)); // number minutes * 60 seconds * 1000 ms
application.use(bodyParser.json({limit: '100mb'}));
application.use(bodyParser.urlencoded({extended: true}));

// CORS support for development from localhost
application.all("/*", function(request, response, next) {
   response.header("Access-Control-Allow-Origin", "*");
   response.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, Content-Disposition, Content-Length, X-Requested-With");
   response.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");

   response.header("Cache-Control", "no-cache, no-store, must-revalidate");
   response.header("Pragma", "no-cache");
   response.header("Expires",0);

   return next();
});

application.all("/*", function(request, response, next) {
   if(request.method.toLowerCase() !== "options") {
      return next();
   }
   return response.sendStatus(204);
});

application.disable('x-powered-by');
application.enable('trust proxy');

// ROUTES
application.use('/'+ process.env.API_CONTEXT +'/v1/auth', authRouteV1);
application.use('/'+ process.env.API_CONTEXT +'/v1/api', apiRouteV1);

// heartbeat
application.get('/'+ process.env.API_CONTEXT +'/staying', function(request, response) {
    response.json('alive');
});

// development error handler. will print stacktrace
if (application.get('env') === 'production') {
    application.use(function(error, request, response, next) {
        response.status(error.status || 500).json(error);
    });
}

// production error handler. no stacktraces leaked to user
application.use(function(error, request, response, next) {
    response.status(error.status || 500).json();
});

application.listen(port);
console.log( 'Spotifynd is now listening on port ' + port );

// register app relevant event handlers below
process.on('SIGTERM', function(err) {
    dbConn.cleanup();
    process.exit(0);
});
