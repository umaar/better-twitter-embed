
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
`;
}

export default renderTweet;
