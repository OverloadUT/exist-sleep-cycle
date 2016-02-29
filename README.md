# Sleep Cycle -> Exist

### Setup

You need Node installed. All of this you only need to do once:

1. Clone the git repo locally
2. `npm install`
3. [Create a new Exist app](https://exist.io/account/apps/) with Allowed Attributes of: Time asleep, Time in bed, Bedtime, Wake time
4. Follow the instructions in the Exist API docs to [generate an OAuth2 Bearer token](http://developer.exist.io/?python#oauth2-authentication) for your app
5. Create a `.env` file with the contents `EXIST_BEARER_TOKEN=your_token_here`
6. `node claim_attributes.js`

You should get this output from the final command:
```js
Sending request to acquire sleep attributes...
{ failed: [],
  success:
   [ { active: true, name: 'sleep' },
     { active: true, name: 'sleep_start' },
     { active: true, name: 'sleep_end' },
     { active: true, name: 'time_in_bed' } ] }
```

If you do, you're ready to go!

### Usage

1. Export a fresh CSV of your sleep data from Sleep Cycle by going to Settings -> Advanced -> Database -> Export database
2. Place the `sleepdata.csv` file in your project directory
3. `node index.js`

After several seconds you should see output from the Exist API saying that the attribute update was a success!

Each time you run this, it will send your entire database to Exist, as it has no state to remember what it has already sent. This is probably terrible and I imagine might not work if you have too much data. In that case you could simply split up your csv in to multiple files and run them one at a time. 
