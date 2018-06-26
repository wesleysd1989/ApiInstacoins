
const env = require('../../.env')
const express = require('express')
const BlinkTradeRest = require("blinktrade").BlinkTradeRest;

module.exports = function (server) {

    var Blinktrade = new BlinkTradeRest({
        prod: true,
        key: env.BlinkTrade_API_Key,
        secret: env.BlinkTrade_API_Secret,
        currency: "BRL",
        brokerId: 4,
    });

    // Definir URL base para todas as rotas 
    const router = express.Router()
    server.use('/api/v1/blinktrade', router)

    router.get('/historico/saque', (req, res, next) => {
        Blinktrade.requestWithdrawList().then(function (withdraws) {
            res.json({
                retorno: withdraws
            })
        }).catch(function (err) {
            res.json({
                err: err
            })
        });
    })

    router.post('/saque', (req, res, next) => {
        var quantity = req.body.quantity;
        var carteira = req.body.carteira;
        var descricao = req.body.descricao;
        Blinktrade.requestWithdraw({
            amount: parseInt(quantity * 1e8),
            currency: 'BTC',
            memo: descricao,
            method: 'bitcoin',
            data: {
                Wallet: carteira
            }
        }).then(function (withdraw) {
            res.json({
                withdraw: withdraw
            })
        }).catch(function (err) {
            res.json({
                err: err
            })
        });
    });


    router.get('/compra', (req, res, next) => {
            res.json({
                retorno: "/compra"
            })
        })

    router.get('/balance', (req, res, next) => {
            Blinktrade.balance().then(function (balance) {
                res.json({
                    BRL: parseFloat(balance['4'].BRL / 1e8),
                    BRL_Locked: parseFloat(balance['4'].BRL_locked / 1e8),
                    BTC: parseFloat(balance['4'].BTC / 1e8),
                    BTC_Locked: parseFloat(balance['4'].BTC_locked / 1e8),
                })
            }).catch(function (err) {
                res.json({
                    err: err
                })
            });
        })

    router.get('/historico/trade', (req, res, next) => {
            Blinktrade.myOrders().then(function (myOrders) {
                res.json({
                    myOrders: myOrders
                })
            }).catch(function (err) {
                res.json({
                    err: err
                })
            });
        })
}
