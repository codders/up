require('dotenv').config(); // make sure you have '.env' file in pwd
const fs = require('fs');

fs.writeFileSync('./static/swenv.js',
`
const process = {
  env: {
    FIREBASE_API_KEY: "${process.env.FIREBASE_API_KEY}",
    FIREBASE_APP_ID: "${process.env.FIREBASE_APP_ID}"
  }
}
`);
