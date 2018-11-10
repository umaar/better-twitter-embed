### Better twitter embed

How I get tweets onto https://umaar.com/dev-tips/feedback

#### Create a `.env` file like this:

```
TWITTER_CONSUMER_KEY=
TWITTER_CONSUMER_SECRET=
TWITTER_BEARER_TOKEN=
```

#### Add your IDs to ids.json

```sh
mkdir images
npm start
```

#### Sprite Generation

Generate sprites of all images in `./images`. Save the output image to `/assets/images/twitter-profile-pics.jpg`. Make sure to chose jpeg and lower the quality a bit. Use this for the class prefix: `dt-fb-pic-`. The URL to accomplish this is here:

```
http://css.spritegen.com/
```

#### Copy markup

Copy the markup from tmp.txt and paste it into `umaar/app/dev-tips/main/tweets`

#### Copy CSS

Take the CSS from spritegen and paste it into dev-tips.scss. Find `'jpeg.jpg'` and replace it with `/assets/images/twitter-profile-pics.jpg`.

##### Get all twitter IDs from page

```js
[...document.querySelectorAll('blockquote')].map(b => {
  return [...b.querySelectorAll('a')].reverse()[0].href.split('status/')[1];
})
```

### Twitter API

https://api.twitter.com/1.1/statuses/lookup.json?id=20,432656548536401920