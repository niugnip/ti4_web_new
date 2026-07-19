const devConfig = {
  api: {
    mapsUrl: "https://asyncti4.com/maps.json",
    proxyMapsUrl: "/proxy/maps.json",
    frogMapUrl:
      "https://qw2j1lld43.execute-api.us-east-1.amazonaws.com/Production/frog",
    websiteBase: "http://localhost:5173/",
    discordLoginUrl: "http://localhost:8000/login",
    discordRedirectUri: "http://localhost:5173/login",
    gameDataUrl: "/bot/api/public/game",
    botApiUrl: "/bot/api",
    // Set VITE_WEBSOCKET_URL in .env.local to point at a local async bot
    // (e.g. ws://localhost:8081/ws) for local testing.
    websocketUrl:
      import.meta.env.VITE_WEBSOCKET_URL || "wss://bot.asyncti4.com/ws",
  },
};

const prodConfig = {
  api: {
    mapsUrl: "https://asyncti4.com/maps.json",
    proxyMapsUrl: "/proxy/maps.json",
    frogMapUrl:
      "https://qw2j1lld43.execute-api.us-east-1.amazonaws.com/Production/frog",
    websiteBase: "https://asyncti4.com/",
    discordLoginUrl: "https://api.asyncti4.com/login",
    discordRedirectUri: "https://asyncti4.com/login",
    gameDataUrl: "https://bot.asyncti4.com/api/public/game",
    botApiUrl: "https://bot.asyncti4.com/api",
    websocketUrl: "wss://bot.asyncti4.com/ws",
  },
};

export const config = import.meta.env.DEV ? devConfig : prodConfig;
