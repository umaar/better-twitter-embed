require('dotenv').config();

const request = require('request');
const moment = require('moment');
const Twitter = require('twitter');
const fs = require('fs');
const forEach = require('async-foreach').forEach;
const tweetToHTML = require('tweet-to-html');

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

function renderTweet({
	profileUrl,
	userId,
	userName,
	screenName,
	html,
	tweetUrl,
	time,
	retweet_count,
	favorite_count
}) {
	return `
<li class="dt-fb-tweet">
	<header>
		<a target="_blank" href="${profileUrl}">
			<div class="dt-fb-pic-${userId}"></div>
		</a>

		<a class="dt-fb-name" target="_blank" href="${profileUrl}">
			<h2>${userName}</h2>
			<h3>@${screenName}</h3>
		</a>

		<svg><use xlink:href="#twitter-logo" /></svg>
	</header>

	<p>${html}</p>

	<a class="dt-fb-tweet-time" target="_blank" href="${tweetUrl}">
		<time>${time}</time>
	</a>

	<a target="_blank" href="${tweetUrl}" class="dt-fb-actions">
		<span class="dt-fb-actions-retweets">
			<svg><use xlink:href="#twitter-retweet" /></svg>
			${retweet_count}
		</span>

		<span class="dt-fb-actions-likes">
			<svg><use xlink:href="#twitter-like" /></svg>
			${favorite_count}
		</span>
	</a>
</li>
`
}

function createMarkupForTweets(tweets) {
	const markups = tweets.map(rawTweet => {
		const tweet = tweetToHTML.parse(rawTweet);
		const date = new Date(tweet.created_at);
		// 4:14 PM - 23 Apr 2015
		const time = moment(date).format('h:mm a - D MMM YYYY');
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
	return new Promise(function(resolve, reject) {
		forEach(tweets, function(tweet, index, arr) {
			var asyncForEachDone = this.async();
			const imageUrl = tweet.user.profile_image_url_https;
			const filePath = './images/' + tweet.user.id + '.jpg';

			request(imageUrl, {encoding: 'binary'}, function(error, response, body) {
				if (error) {
					console.log('\n\nThere was an error downloading an image: \n', error);
					return asyncForEachDone();
				}

				fs.writeFile(filePath, body, 'binary', function (err) {
					if (err) {
						console.log('There was an error writing the file\n\n', err);
					}
					asyncForEachDone();
				});
			});

		}, resolve)
	});
}

function sleep(ms = 1000) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function orderTweets(tweets) {
	return tweets.sort((a, b) => b.retweet_count - a.retweet_count);
}

const allIds = require('./ids.json').ids;
// const allIds = require('./ids.json').ids.slice(0, 5);

function unique(arr) {
	return Array.from(new Set(arr));
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