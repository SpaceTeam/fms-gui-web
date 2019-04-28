export const environment = {
  production: true,
  server : {
    secure: false,
    host: 'localhost',
    port: 9000,
    subscribe: {
      fms: "subscribe/fms",
      cards: "subscribe/cards",
      controls: "subscribe/controls"
    }
  }
};
