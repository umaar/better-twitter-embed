require('dotenv').config();

const request = require('request');

const consumer_key = process.env.TWITTER_CONSUMER_KEY;
const consumer_secret = process.env.TWITTER_CONSUMER_SECRET;
const enc_secret = Buffer.from(consumer_key + ':' + consumer_secret).toString('base64');

const oauthOptions = {
	url: 'https://api.twitter.com/oauth2/token',
	headers: {Authorization: 'Basic ' + enc_secret, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
	body: 'grant_type=client_credentials'
};

request.post(oauthOptions, (e, r, body) => {
	console.log('\n\n');
	console.log('e', e);
	console.log('\n\n');
	console.log(body);
	console.log('\n\n');
});
