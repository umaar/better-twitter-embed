require('dotenv').config();

const fs = require('fs');
const got = require('got');
const moment = require('moment');
const Twitter = require('twitter');
const tweetToHTML = require('tweet-to-html');

const renderTweet = require('./render-tweet');

const client = new Twitter({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	bearer_token: process.env.TWITTER_BEARER_TOKEN
});

async function doTwitterAPICall(ids) {
	return await client.post('statuses/lookup', {
		id: ids.join(',')
	});
}

function createMarkupForTweets(tweets) {
	const markups = tweets.map(rawTweet => {
		const tweet = tweetToHTML.parse(rawTweet);
		const date = new Date(tweet.created_at);
		const time = moment(date).format('h:mm a - D MMM YYYY'); // 4:14 PM - 23 Apr 2015
		const profileUrl = `https://twitter.com/${tweet.user.screen_name}`;
		const tweetUrl = `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`;

		return renderTweet({
			profileUrl,
			tweetUrl,
			time,
			retweet_count: tweet.retweet_count,
			favorite_count: tweet.favorite_count,
			html: tweet.html,
			userId: tweet.user.id,
			userName: tweet.user.name,
			screenName: tweet.user.screen_name
		});
	});

	return markups;
}

async function downloadAllTweetImages(tweets) {
	for (tweet of tweets) {
		const imageUrl = tweet.user.profile_image_url_https;
		const filePath = './images/' + tweet.user.id + '.jpg';

		const downloadResponse = await got(imageUrl, {
			encoding: null
		});

		fs.writeFileSync(filePath, downloadResponse.body, 'binary');
	}
}

function sleep(ms = 1000) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function orderTweets(tweets) {
	return tweets.sort((a, b) => b.retweet_count - a.retweet_count);
}

// const allIds = require('./ids.json').ids;
const allIds = require('./ids.json').ids.slice(0, 3);

function unique(arr) {
	return [...new Set(arr)];
}

async function init() {
	const max = 2;
	let start = 0;
	let end = max;
	let tweets = [];

	const ids = unique(allIds);

	while (start <= ids.length) {
		const rawTweets = await doTwitterAPICall(ids.slice(start, end));
		tweets = tweets.concat(rawTweets);
		start = end;
		end = start + max;
		await sleep(50);
	}

	const orderedTweets = orderTweets(tweets);
	await downloadAllTweetImages(orderedTweets);
	const markup = createMarkupForTweets(orderedTweets);

	console.log(markup.join(' '));
}

init();
