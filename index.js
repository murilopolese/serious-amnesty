require('dotenv').config()

let path = require('path')
    fs = require('fs'),
    express = require('express')
    bodyParser = require('body-parser'),
    app = express();

let writeToCSV = (name, country) => {
    let time = new Date();
    fs.appendFileSync('entries.csv', `${name};${country};${time}\n`);
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
        country = req.body.country;
    writeToCSV(name, country);
    res.json(req.body);
});

let s = app.listen(process.env.PORT || 8080, (a) => {
    console.log(`listening on http://localhost:${s.address().port}`);
});
