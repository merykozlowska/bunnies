# snowball vs fluffy

snowball vs fluffy is a game created for [Cloudflare Spring developer challenge 2022](https://blog.cloudflare.com/announcing-our-spring-developer-challenge/).

## The game

### General principles

In this game, two bunnies (snowball and fluffy) are competing head to head for the title of The Bunniest of Them All.

Any player can join in the game by accessing [https://snowball-vs-fluffy.pages.dev/](https://snowball-vs-fluffy.pages.dev/).

When you arrive on that page, you can see in real time how many players are playing currently as either snowball or fluffy.
You can also see the total score accumulated by each bunny.

If you select to help a bunny, you'll start playing as that bunny and your score will accumulate to its total.

### Gameplay

When playing, there are two sides (left and right), each divided in two lanes.
You control both lanes at the same time by either using arrow keys (on desktop) or tapping on mobile.

Bombs and carrots will go down the lanes, and your goal is to catch ALL carrots, and avoid ALL bombs.

## How it's built

This project is built using mainly three Cloudflare products:

- [Cloudflare Pages](https://pages.cloudflare.com/)
- [Cloudflare Durable Objects](https://developers.cloudflare.com/workers/learning/using-durable-objects/)
- [Cloudflare Workers](https://workers.cloudflare.com/)

The frontend app is built in [React](https://reactjs.org/) using [Remix](https://remix.run/) and deployed using [Cloudflare Pages](https://pages.cloudflare.com/).

Once loaded in a browser, it communicates with a deployed [Durable Object](https://developers.cloudflare.com/workers/learning/using-durable-objects/) using a websocket.

There is only one single Durable Object for the whole game, and it keeps track of the global score of both snowball and fluffy.

### Project structure

This project is a monorepo.

The base repo is a standard Remix Cloudflare Pages app.

The code for the durable object is in the `durable_objects` folder.

### How to run locally

You can run the project locally using the following:

```shell
npm i
npm run dev
```
