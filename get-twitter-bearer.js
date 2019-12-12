import dotenv from 'dotenv';
import request from 'request';

dotenv.config();

const consumerKey = process.env.TWITTER_CONSUMER_KEY;
const consumerSecret = process.env.TWITTER_CONSUMER_SECRET;

const encodedSecret = Buffer.from(consumerKey + ':' + consumerSecret).toString('base64');

const oauthOptions = {
	url: 'https://api.twitter.com/oauth2/token',
	headers: {
		Authorization: 'Basic ' + encodedSecret,
		'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
	},
	body: 'grant_type=client_credentials'
};

request.post(oauthOptions, (error, response, body) => {
	if (error) {
		console.log('Error in fetching bearer token');
		throw new Error(error);
	}

	if (body) {
		const parsedBody = JSON.parse(body);

		console.log({
			raw: parsedBody
		});

		console.log('\nAccess Token:\n', parsedBody.access_token);
	} else {
		throw new Error('No body!');
	}
});
