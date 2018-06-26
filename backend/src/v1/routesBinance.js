
const env = require('../../.env')
const express = require('express')
const binance = require('node-binance-api');
const Binance = new binance().options({
    APIKEY: env.APIKEY,
    APISECRET: env.APISECRET,
    useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
    test: false // If you want to use sandbox mode where orders are simulated
});

module.exports = function (server) {

    // Definir URL base para todas as rotas 
    const router = express.Router()
    server.use('/api/v1/binance', router)

    router.get('/historico/saque', (req, res, next) => {
        Binance.withdrawHistory((error, response) => {
            res.json({
                error: error,
                Retorno: response
            })
          });
    })

    router.get('/saque', (req, res, next) => {
        var quantity = req.param('quantity');
        var coin = req.param('coin');
        var carteira = req.param('carteira');
        Binance.withdraw(coin, carteira, quantity, false, (error, response) => {
            res.json({
                error: error,
                Retorno: response
            })
        });
    })

    router.get('/compra', (req, res, next) => {
        var quantity = req.param('quantity');
        var coin = req.param('coin');
        Binance.marketBuy(coin, quantity, (error, response) => {
            res.json({
                error: error,
                Retorno: response,
                OrdenId: response.orderId
            })
        });
    })
    router.get('/balance', (req, res, next) => {
        Binance.balance((error, balances) => {
            res.json({
                BTCbalances: balances.BTC.available,
                NANObalances: balances.NANO.available,
                BNBbalances: balances.BNB.available
            })
        });
    })
    router.get('/historico/trade', (req, res, next) => {
        Binance.trades("NANOBNB", (error, trades, symbol) => {
            res.json({
                trades: trades
            })
        });
    })
    
}