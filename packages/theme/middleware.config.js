module.exports = {
  integrations: {
    shopify: {
      location: '@vue-storefront/shopify-api/server',
      configuration: {
        api: {
          domain: process.env.SHOPIFY_STORE_URL,
          storefrontAccessToken: process.env.SHOPIFY_STORE_TOKEN
        },
        currency: 'USD',
        country: 'US'
      }
    }
  }
};
