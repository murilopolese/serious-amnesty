require('dotenv').config()

let path = require('path')
    fs = require('fs'),
    express = require('express')
    bodyParser = require('body-parser'),
    app = express(),
    websocket = require('nodejs-websocket'),
    ws = websocket.connect(
        process.env.WEBSOCKET_SERVER || 'ws://localhost:8001',
        () => {
            console.log('connected to websocket server');
        }
    );

let queue = [];

setInterval(() => {
    if (!queue.length) {
        console.log('queue is empty');
        return;
    }
    let message = queue.shift();
    sendMessage(message);
}, process.env.QUEUE_TIME || 2000);

let writeToCSV = (name, email, country) => {
    let time = Date.now();
    fs.appendFileSync('entries.csv', `${name};${email};${country};${time}\n`);
}

let writeFailed = (name, email, country) => {
    let time = Date.now();
    fs.appendFileSync('entries_failed.csv', `${name};${email};${country};${time}\n`);
}

let sendMessage = (message) => {
    console.log('sending message', message);
    if (!ws) {
        writeFailed(message.name, message.email, message.country);
        return;
    }
    ws.send(JSON.stringify(message));
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'))
});

app.post('/message', (req, res) => {
    let name = req.body.name,
        email = req.body.email,
        country = req.body.country;
    writeToCSV(name, email, country);
    queue.push({name, email, country});
    res.json(req.body);
});

app.listen(process.env.port || 8080);
