const MAIN_URL = process.env.API_URL;
const BKASH = process.env.NEXT_BKASH_URL;

const API_ENDPOINTS = {
  BASE_URL: MAIN_URL,
  BKASH_URL: BKASH,
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
  },
  PIXEL: {
    UPDATE_PIXEL: `/client/settings/pixel/update`
  },
  SETTINGS: {
    BUSINESS_INFO: `/client/settings/business-info`
  },
  ACCOUNTS: {
    GET_PAYOR_LIST: `/client/accounts/payor/list`,
    GET_LEDGER_LIST: `/client/accounts/ledger/list`,
    GET_PAYMENT_METHOD_LIST: `/client/accounts/payment-method-show`,
    CREATE_CASE_IN: `/client/accounts/cash-in`,
    CREATE_CASE_OUT: `/client/accounts/cash-out`,
    CREATE_PAYMENT_METHOD: `/client/accounts/payment-method-add`,
    CREATE_PAYOR_METHOD: `/client/accounts/payor/add`,
    CREATE_LEDGER: `/client/accounts/ledger/add`,
    UPDATE_PAYMENT: `/client/accounts/payment-update/`,
    GET_MULTI_SEARCH: `/client/accounts/multi-search`,
    DELETE_ACCOUNT: `/client/accounts/payment-delete/`,
    SEARCH_ACCOUNT: `/client/accounts/payment-search/`
  },
  ORDERS: {
    ORDER_GLOBAL_SEARCH: `/client/order/search`
  }
}

export { API_ENDPOINTS }