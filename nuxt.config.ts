// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },

  runtimeConfig: {
    mongodbUri: process.env.MONGO_URI,
  },

  mongoose: {
    uri: process.env.MONGO_URI,
    options: {},
    modelsDir: "server/models",
    devtools: false,
  },

  css: ["~/assets/css/main.css"],

  app: {
    pageTransition: {
      name: "page",
      mode: "out-in",
    },
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  nitro: {
    preset: "vercel",
  },

  modules: ["nuxt-mongoose"],
});
