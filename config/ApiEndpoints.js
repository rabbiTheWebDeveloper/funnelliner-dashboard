const MAIN_URL = process.env.API_URL;

const API_ENDPOINTS = {
  BASE_URL: MAIN_URL,
  CATEGORY: {
    GET_CATEGORIES: `/client/categories`,
    GET_CATEGORY: `/client/categories`,
    UPDATE_CATEGORY: `/client/categories`,
    DELETE_CATEGORY: `/client/categories`,
    CREATE_CATEGORY: `/client/categories`
  },
  STOCK_IN: {
    GET_STOCK_IN_PRODUCTS: `/client/stocks/stock-in/list`,
    GET_STOCK_IN_PRODUCT: `/client/stocks/stock-in/show`,
    UPDATE_STOCK_IN_PRODUCT: `/client/stocks/stock-in/update`
  }
}

export {API_ENDPOINTS}