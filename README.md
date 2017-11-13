## How to install

1. Clone this repo: `git clone git@github.com:murilopolese/serious-amnesty`
2. Navigate to the repo directory: `cd serious-amnesty`
3. Install npm dependencies: `npm install`

## How to configure app?

Either change on the source code of `index.js` or create a file named `.env` on the root of this project's folder and write one or all the following key/values replacing the fake values with the actual values:

```bash
# ofApp websocket server url
WEBSOCKET_SERVER=ws://localhost:8001
# main app port to listen (i.e 8000 will result the app listening to http://localhost:8000)
PORT=8080
# Interval between the queue items being selected (in milliseconds)
QUEUE_TIME=2000
```

## How to run?

To run the main application (serves html form, writes to CSV and send websocket message):

`npm start`

To build front end source code:

`npm run build`

To watch for changes in the front end source code and rebuild automagically:

`npm run watch`

To run test websocket server:

`npm run websocket`

**Important**

Make sure to keep the test websocket server if you don't have the real websocket server app working.

This server won't work (for now) without a websocket server to connect.

## Testing queue

Run the following code on your browser terminal to create random requests to the queue and test the application:

```js
setInterval(() => {
    let names = ['John Doe', 'Jane Doe'],
        countries = ['Iceland', 'Venezuela', 'Brazil', 'Sweden', 'Germany'],
        emails = ['foo@bar.com', 'zooz@zaz.com', 'murilopolese@gmail.com'];
    data = {
        name: names[parseInt(Math.random() * names.length)],
        email: emails[parseInt(Math.random() * emails.length)],
        country: countries[parseInt(Math.random() * countries.length)]
    };
	fetch('/message', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify(data)
        }).then((r) => r.json())
}, Math.random()*5000);
```

## Collecting CSV data

The app will create a file named `entries.csv` to add all the messages that have been sent to the websocket server. All the sent messages that could not be sent to the websocket server will be stored at `entries_failed.csv`.
