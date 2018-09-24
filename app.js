require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request');
const app = express()
const port = process.env.PORT || 3000
const { wallet } = require('@cityofzion/neon-js')
const address = wallet.getScriptHashFromAddress(process.env.NEO_ADDRESS) // only for testing purposes

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

app.get('/', (req, res) => {
    logRequest(req)
    res.send('Hello Node.js!')
})

app.post('/', (req, res) => {
    logRequest(req)    
    sendBotReply(req.body.message.from.id, req.body.message.text);
    res.send('Hello Node.js!')
})

function logRequest(req) {
    var body = ((req.method === "POST") ? (" " + JSON.stringify(req.body)) : "")
    console.log("Received " + req.method + " " + req.url + body + " from " + req.headers.host)
}

function sendBotReply(userId, userMessage) {
    if (userMessage.toLowerCase() === '/open') {
        var options = {
            uri: process.env.SWITCHEO_API + '/v2/orders',
            body: JSON.stringify({ address: address }),
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        request(options, function (error, response) {
            console.log(error, response.body);
            sendMessage(userId, 'You have ' + response.body.length + ' open order(s).');
        });
    } else {
        sendMessage(userId, 'Sorry, I don\'t undestand.');
    }
}

function sendMessage(userId, text) {
    var options = {
        uri: process.env.BOT_API + '/sendMessage',
        body: JSON.stringify({ chat_id: userId, text: text}),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    console.log(options.uri);
    console.log(options.body);
    request(options, function (error, response) {
        console.log(error, response.body);
        return;
    });
}