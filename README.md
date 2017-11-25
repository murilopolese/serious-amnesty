## How to install

1. Clone this repo: `git clone git@github.com:murilopolese/serious-amnesty`
2. Navigate to the repo directory: `cd serious-amnesty`
3. Install npm dependencies: `npm install`

## How to configure app?

Either change on the source code of `index.js` or create a file named `.env` on the root of this project's folder and write one or all the following key/values replacing the fake values with the actual values:

```bash
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


## Collecting CSV data

The app will create a file named `entries.csv` with all the form submission.
