
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


    router.post('/compra', (req, res, next) => {
        var quantity = req.body.quantity; // Quantidade a ser comprada, informação fornecida pelo usuário
        var cotacao = req.body.cotacao; // Cotação a ser paga, fornecida pelo usuário
        var margin = req.body.margin/100; // Porcentagem máxima acima do preço normal, fornecida pelo usuário
        var price = 0;
        Blinktrade.ticker(price).then(function(ticker) {
            if (margin > 1-(cotacao/ticker.sell)) {
                Blinktrade.sendOrder({
                    msgType: 'D', // Full doc here: http://www.onixs.biz/fix-dictionary/4.4/msgType_D_68.html
                    symbol: 'BTCBRL', // Can be BTCBRL, BTCPKR, BTCVND, BTCVEF, BTCCLP.
                    ordType: '2', //1=Market, 2=Limited, 3=Stop, 4=Stop Limit, G=Swap, P=Pegged
                    side: '1', //# 1-Buy , 2-Sell
                    price: parseInt(((ticker.sell*(1+margin)) * 1e8).toFixed(0)),
                    amount: parseInt(quantity * 1e8, 10)
                })
            } else {
                res.json({
                    err: "Cotação de compra abaixo da margem de segurança. A ORDEM NÃO FOI CRIADA."
                })
            }
        }).then(function (ticker, order) {
            res.json({
                order: order,
                ticker: ticker
            })
        }).catch(function (err) {
            res.json({
                err: err
            })
        });
    })

    router.post('/venda', (req, res, next) => {
        var quantity = req.body.quantity; // Quantidade a ser comprada, informação fornecida pelo usuário
        var cotacao = req.body.cotacao; // Cotação a ser paga, fornecida pelo usuário
        var margin = req.body.margin/100; // Porcentagem máxima acima do preço normal, fornecida pelo usuário
        var price = 0;
        Blinktrade.ticker(price).then(function(ticker) {
            if (1-cotacao/ticker.buy > margin*-1) {
                Blinktrade.sendOrder({
                    msgType: 'D', // Full doc here: http://www.onixs.biz/fix-dictionary/4.4/msgType_D_68.html
                    symbol: 'BTCBRL', // Can be BTCBRL, BTCPKR, BTCVND, BTCVEF, BTCCLP.
                    ordType: '2', //1=Market, 2=Limited, 3=Stop, 4=Stop Limit, G=Swap, P=Pegged
                    side: '2', //# 1-Buy , 2-Sell
                    price: parseInt(((ticker.buy-(ticker.buy*margin)) * 1e8).toFixed(0)),
                    amount: parseInt(quantity * 1e8, 10)
                })
            } else {
                res.json({
                    err: "Cotação de venda abaixo da margem de segurança. A ORDEM NÃO FOI CRIADA."
                })
            }
        }).then(function (ticker, order) {
            res.json({
                order: order,
                ticker: ticker
            })
        }).catch(function (err) {
            res.json({
                err: err
            })
        });
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
