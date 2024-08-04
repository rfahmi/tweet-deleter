const axios = require("axios");
const OAuth = require("oauth-1.0a");
const crypto = require("crypto");
const fs = require("fs").promises;

require('dotenv').config();

// Set your Twitter API credentials
const CONSUMER_KEY = process.env.CONSUMER_KEY;
const CONSUMER_SECRET = process.env.CONSUMER_SECRET;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const TWEET_IDS_FILE = "./files/tweets.json";

// Create an OAuth 1.0a instance
const oauth = OAuth({
  consumer: { key: CONSUMER_KEY, secret: CONSUMER_SECRET },
  signature_method: "HMAC-SHA1",
  hash_function(baseString, key) {
    return crypto.createHmac("sha1", key).update(baseString).digest("base64");
  },
});

async function deleteTweet(tweetId) {
  const url = `https://api.x.com/2/tweets/${tweetId}`;

  const requestData = {
    url: url,
    method: "DELETE",
  };

  const oauthHeaders = oauth.toHeader(
    oauth.authorize(requestData, {
      key: ACCESS_TOKEN,
      secret: ACCESS_TOKEN_SECRET,
    })
  );

  try {
    await axios.delete(url, {
      headers: {
        ...oauthHeaders,
        "Content-Type": "application/json",
      },
    });
    console.info(`\x1b[32m✅ Tweet ${tweetId} deleted successfully\x1b[0m`);
    return true;
  } catch (error) {
    console.error(
      `\x1b[31m❌ Error deleting tweet ${tweetId}:`,
      error.response ? error?.response?.data?.detail : error.message,
      "\x1b[0m"
    );
    return false;
  }
}

async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getTweetIdsFromFile(key) {
  try {
    const data = await fs.readFile(TWEET_IDS_FILE, "utf-8");
    const tweets = JSON.parse(data);
    return { tweets, tweetIds: tweets[key] };
  } catch (error) {
    if (error.code === "ENOENT") {
      throw new Error(`\x1b[31m${TWEET_IDS_FILE} does not exist, please run get-tweet-ids.js first\x1b[0m`);
    }
    throw error;
  }
}

async function writeTweetsToFile(tweets) {
  const data = JSON.stringify(tweets, null, 2); // Pretty print JSON with 2-space indentation
  await fs.writeFile(TWEET_IDS_FILE, data, "utf-8");
}

async function start(key) {
  try {
    const { tweets, tweetIds } = await getTweetIdsFromFile(key);

    for (const tweetId of tweetIds) {
      const success = await deleteTweet(tweetId); // Ensure the deleteTweet function returns a promise
      if (success) {
        tweets[key] = tweets[key].filter((id) => id !== tweetId);
        await writeTweetsToFile(tweets);
      }
      await delay(800); // Wait for x ms
    }
  } catch (error) {
    console.error("Error processing tweets:", error);
  }
}

// Parse command-line arguments
const args = process.argv.slice(2);
const batchArgIndex = args.findIndex((arg) => arg === "--batch" || arg === "-b");
let key = null;

if (batchArgIndex !== -1 && args[batchArgIndex + 1]) {
  key = args[batchArgIndex + 1];
}

if (key) {
  start(key);
} else {
  console.warn(
    '\x1b[33m⚠️ Batch key is required. Usage: node delete-tweets.js --batch <key>\x1b[0m'
  );
}
