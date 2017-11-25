require('dotenv').config()

let path = require('path')
    fs = require('fs'),
    express = require('express')
    bodyParser = require('body-parser'),
    app = express();

let writeToCSV = (name, lastname, country) => {
    let time = Date.now();
    fs.appendFileSync('entries.csv', `${name};${lastname};${country};${time}\n`);
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
        lastname = req.body.lastname,
        country = req.body.country;
    writeToCSV(name, lastname, country);
    res.json(req.body);
});

app.listen(process.env.PORT || 8080);
