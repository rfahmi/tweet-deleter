function extractTweetIds(data) {
  // Sort the data by created_at date
  data.sort(
    (a, b) => new Date(a.tweet.created_at) - new Date(b.tweet.created_at)
  );

  // Extract and return the id_str values
  return data.map((item) => item.tweet.id_str);
}

function chunkArray(array, chunkSize) {
  const chunks = {};

  for (let i = 0; i < array.length; i += chunkSize) {
    // Create a chunk from the current index to the next chunkSize
    const chunk = array.slice(i, i + chunkSize);
    // Assign the chunk to the corresponding key in the object
    chunks[Math.floor(i / chunkSize)] = chunk;
  }

  return chunks;
}

async function backupAndSaveTweets(data) {
  const filePath = path.join(__dirname, "./files/tweets.json");
  const backupPath = path.join(__dirname, "./files");

  // Check if the tweets.json file exists
  try {
    await fs.access(filePath);

    // File exists, create a backup
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:.]/g, "")
      .slice(0, 14);
    const backupFileName = `tweets-${timestamp}.json`;
    const backupFilePath = path.join(backupPath, backupFileName);

    await fs.rename(filePath, backupFilePath);
    console.log(`Backup created: ${backupFileName}`);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Error checking tweets.json file:", error);
      return;
    }
    // File does not exist, no need to create a backup
  }

  // Write the new data to tweets.json
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log("New tweets.json file created.");
  } catch (error) {
    console.error("Error writing tweets.json file:", error);
  }
}

async function start() {
  // Call the function and store the result
  const tweetData = [
    /* Your tweet data here */
  ];
  const tweetIds = extractTweetIds(tweetData);
  const final = chunkArray(tweetIds, 50);

  // Save the final object to tweets.json with backup
  await backupAndSaveTweets(final);
}
