const jsonResponse = (value: any, init: ResponseInit = {}) =>
  new Response(JSON.stringify(value), {
    headers: { "Content-Type": "application/json", ...init.headers },
    ...init,
  });

export class Game implements DurableObject {
  private value = 0;

  constructor(private state: DurableObjectState) {
    // `blockConcurrencyWhile()` ensures no requests are delivered until initialization completes.
    this.state.blockConcurrencyWhile(async () => {
      const stored = await this.state.storage.get<number>("value");
      this.value = stored || 0;
    });
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    let currentValue = this.value;

    if (url.pathname === "/increment") {
      currentValue = ++this.value;
      await this.state.storage.put("value", currentValue);
    }

    return jsonResponse(currentValue);
  }
}

export default {
  async fetch() {
    return new Response("This worker only creates a Durable Object");
  },
};
