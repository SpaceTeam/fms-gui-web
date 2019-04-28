export const environment = {
  production: true,
  server: {
    secure: true,
    host: 'localhost',
    port: 10000,
    paths: {
      subscribe: {
        fms: "/subscribe/fms",
        cards: "/subscribe/cards",
        controls: "/subscribe/controls"
      },
      data: {
        fms: '/assets/json/fms-name-value-pairs.json',
        cards: '/assets/json/cards-name-value-pairs.json'
      }
    },
    serverOptions: {
      key: "",
      cert: ""
    },
    options: {
      period: 1000,
    }
  }
};
