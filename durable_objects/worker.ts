export default {
  async fetch() {
    return new Response("This worker only creates a Durable Object");
  },
};

export { Game } from "./src/game";
