require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const request = require('request');
const app = express()
const port = process.env.PORT || 3000

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

function sendBotReply(userId, message) {
    var data = (message.toLowerCase() === 'wassa wassa wassa') ? 'Hey hey hey' : 'Sorry, I don\'t undestand.';
    var options = {
        uri: 'https://api.telegram.org/bot' + process.env.TELEGRAM_TOKEN + '/sendMessage',
        body: JSON.stringify({ chat_id: userId, text: data}),
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
