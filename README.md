# Delete Tweets

This project is a Node.js script that deletes tweets from the Twitter API.

## Getting Started

1. Clone the repository.
2. Install the dependencies by running `npm install`.
3. Set the required environment variables in a `.env` file.
4. Run the script with the appropriate command-line arguments.

## Usage

1. Run the script with the following command: `node delete-tweets.js --batch <key>`. Replace `<key>` with the batch key you want to delete.
2. The script will read the tweet IDs from the `TWEET_IDS_FILE` environment variable.
3. The script will delete the tweets one by one using the Twitter API.

## Requirements

- Node.js
- npm

## Environment Variables

The following environment variables are required:

- `CONSUMER_KEY`: The Twitter API consumer key.
- `CONSUMER_SECRET`: The Twitter API consumer secret.
- `ACCESS_TOKEN`: The Twitter API access token.
- `ACCESS_TOKEN_SECRET`: The Twitter API access token secret.
- `TWEET_IDS_FILE`: The file containing the tweet IDs to delete.

## Contributing

Contributions are welcome. Please follow the guidelines in the [CONTRIBUTING.md](CONTRIBUTING.md) file.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments

- [axios](https://github.com/axios/axios)
- [dotenv](https://github.com/motdotla/dotenv)
- [oauth-1.0a](https://github.com/ddo/oauth-1.0a)