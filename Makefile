# The default target must be at the top
.DEFAULT_GOAL := start

install:
	npm install

update-deps:
	ncu -u

get-bearer-token:
	node get-twitter-bearer.js

start:
	node --experimental-json-modules index.js > tmp.txt

lint:
	./node_modules/.bin/xo

test: lint

