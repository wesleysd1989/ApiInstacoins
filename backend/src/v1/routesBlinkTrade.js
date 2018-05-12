
const env = require('../../.env')
const express = require('express')
const BlinkTradeRest = require("blinktrade").BlinkTradeRest;
const BlinkTradeWS = require("blinktrade").BlinkTradeWS;



module.exports = function (server) {

    var Blinktrade = new BlinkTradeRest({
        prod: true,
        key: env.BlinkTradeF_API_Key,
        secret: env.BlinkTradeF_API_Secret,
        currency: "BRL",
        brokerId: 4,
    });

    var blinktrade = new BlinkTradeWS({
        prod: true
    });

    // Definir URL base para todas as rotas 
    const router = express.Router()
    server.use('/api/v1/blinktrade', router)

    router.get('/historico/saque', (req, res, next) => {
        Blinktrade.requestWithdrawList().then(function (withdraws) {
            res.json({
                retorno: withdraws
            })
        });
    })

    router.get('/saque', (req, res, next) => {
        res.json({
            retorno: "/saque"
        })
    })

    router.get('/compra', (req, res, next) => {
        res.json({
            retorno: "/compra"
        })
    })
    router.get('/balance', (req, res, next) => {
        Blinktrade.balance().then(function (balance) {
            console.log(balance)
            res.json({
                BRL: parseFloat(balance['4'].BRL / 1e8),
                BRL_Locked: parseFloat(balance['4'].BRL_locked / 1e8),
                BTC: parseFloat(balance['4'].BTC / 1e8),
                BTC_Locked: parseFloat(balance['4'].BTC_locked / 1e8),
            })
        });
    })
    router.get('/historico/trade', (req, res, next) => {
        blinktrade.connect().then(function () {
            return blinktrade.tradeHistory();
        }).then(function (tradeHistory) {
            res.json({
                tradeHistory: tradeHistory
            })
        });
    })
}

