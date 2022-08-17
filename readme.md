### Better twitter embed

[![Actions Status](https://github.com/umaar/better-twitter-embed/workflows/Node%20CI/badge.svg)](https://github.com/umaar/better-twitter-embed/actions)

How I get tweets onto https://umaar.com/dev-tips/feedback

#### Create a `.env` file like this:

_Note: To fill in `TWITTER_BEARER_TOKEN`_, run the next step

```
TWITTER_CONSUMER_KEY=
TWITTER_CONSUMER_SECRET=
TWITTER_BEARER_TOKEN=
```

#### Install deps:

```sh
npm i
```

#### Get your bearer token:

```sh
make get-bearer-token
```

#### Add your IDs to ids.json and run

```sh
mkdir images
make start
```

#### Sprite Generation

Generate sprites of all images in `./images`. Save the output image to `/assets/images/twitter-profile-pics.jpg`.

For the class prefixes, use: `dt-fb-sprite` (in the "sprite class name" input) & `dt-fb-pic-` (in the "class prefix" input)

The sprite generator is here: https://instantsprite.com/ / Forked at https://github.com/umaar/InstantSprite

- Can use horizontal direction
- 0px offet
- instantsprite exports as a png, so open with preview and export to .jpg with a lower quality
-

#### Copy markup

Copy the markup from tmp.txt and paste it into `umaar/app/dev-tips/main/tweets`

#### Copy CSS

Take the CSS from instantsprite and paste it into dev-tips-feedback.scss. Find `'*.jpg'` and replace it with `/assets/images/twitter-profile-pics.jpg`.

##### Get all twitter IDs from page

```js
[...document.querySelectorAll("blockquote")].map((b) => {
  return [...b.querySelectorAll("a")].reverse()[0].href.split("status/")[1];
});
```

### Twitter API

https://api.twitter.com/1.1/statuses/lookup.json?id=20,432656548536401920

#### Run tests:

```sh
make test
```
