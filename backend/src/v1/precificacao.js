
const env = require('../../.env')
const express = require('express')
const binance = require('node-binance-api');
const BlinkTradeRest = require("blinktrade").BlinkTradeRest;

module.exports = function (server) {

    binance.options({
        APIKEY: env.Binance_APIKEY,
        APISECRET: env.Binance_APISECRET,
        useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
        test: false // If you want to use sandbox mode where orders are simulated
    });

    var BlinkTrade = new BlinkTradeRest({
        prod: true,
        currency: "BRL",
        brokerId: 4,
    });

    //variaveis
    var cotacao_BTC = ''
    var cotacao_NANOBTC = ''
    var cotacao_LTCBTC = ''
    var custoCorretSaqBTC = ''

    BlinkTrade.ticker().then(async function (ticker) {
        cotacao = await ticker
    });
    binance.prices('NANOBTC', (error, ticker) => {
        cotacao_NANOBTC = ticker.NANOBTC
    });
    binance.prices('LTCBTC', (error, ticker) => {
        cotacao_LTCBTC = ticker.LTCBTC
    });

    // Definir URL base para todas as rotas 
    const router = express.Router()
    server.use('/api/v1/', router)
    //if (V01 != "BITCOIN") then ((V10/(100-(V09*100))*100)-V10) else ((V06/(100-(V05*100))*100)-V06)
    router.get('/precificacao', (req, res, next) => {
        res.json({
            BTC: {
                COTACAO_BRL_BTC: cotacao.sell,
                PCT_CORRET_BTC: 0.5,
                TX_SAQ_BTC: 0.00001200,
                PCT_LUCRO_BTC: 2,
                COTACAO_BTC_ALT: 1.0,
                PCT_CORRET_ALT: 0.1,
                TX_SAQ_ALT: 0.00001200,
                PCT_LUCRO_ALT: 5,
                CUSTO_CORRET_SAQ_ALT: custoCorretSaqBTC = ((0.00001200 / (100 - (0.5 * 100)) * 100) - 0.00001200)
            },
            NANO: {
                COTACAO_BRL_BTC: cotacao.sell,
                PCT_CORRET_BTC: 0.5,
                TX_SAQ_BTC: 0.00001200,
                PCT_LUCRO_BTC: 2,
                COTACAO_BTC_ALT: cotacao_NANOBTC,
                PCT_CORRET_ALT: 0.1,
                TX_SAQ_ALT: 0.05,
                PCT_LUCRO_ALT: 5,
                CUSTO_CORRET_SAQ_ALT: 1
            },
            LITECOIN: {
                COTACAO_BRL_BTC: cotacao.sell,
                PCT_CORRET_BTC: 0.5,
                TX_SAQ_BTC: 0.00001200,
                PCT_LUCRO_BTC: 2,
                COTACAO_BTC_ALT: cotacao_LTCBTC,
                PCT_CORRET_ALT: 0.1,
                TX_SAQ_ALT: 0.01,
                PCT_LUCRO_ALT: 5,
                CUSTO_CORRET_SAQ_ALT: 1
            }
        })
    })


}

