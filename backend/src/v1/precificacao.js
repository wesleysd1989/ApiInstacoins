
const env = require('../../.env')
const express = require('express')
const binance = require('node-binance-api');

module.exports = function (server) {

    binance.options({
        APIKEY: env.Binance_APIKEY,
        APISECRET: env.Binance_APISECRET,
        useServerTime: true, // If you get timestamp errors, synchronize to server time at startup
        test: true // If you want to use sandbox mode where orders are simulated
    });

    // Definir URL base para todas as rotas 
    const router = express.Router()
    server.use('/api/v1/', router)

    router.get('/precificacao', (req, res, next) => {        
        res.json({
            precificacao: "precificação",
        })
    })

    
}

