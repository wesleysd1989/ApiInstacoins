const server = require('./config/server')
require('./v1/routesBinance')(server)
require('./v1/routesBlinkTrade')(server)
require('./v1/precificacao')(server)