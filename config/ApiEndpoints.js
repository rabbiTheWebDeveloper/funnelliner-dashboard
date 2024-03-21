const MAIN_URL = process.env.NEXT_PUBLIC_API_URL;
const LEAD_URL = process.env.NEXT_PUBLIC_LEAD_API_URL;
const BKASH = process.env.NEXT_BKASH_URL;

const API_ENDPOINTS = {
  BASE_URL: MAIN_URL,
  LEAD_BASE_URL: LEAD_URL,
  BKASH_URL: BKASH,
  DASHBOARD: {
    ORDERS_STATIC: `/client/order-statistics`,
    RATIO_STATISTICS: `/client/ratio-statistics`,
    PIH_CHART: `/client/channel-statistics`,
    CHANNEL_RATIO_STATISTICS: `/client/channel/ratio-statistics`,
    ORDER_DELIVERY_REPORT: `/client/order-delivery-report`,
    SALES_TARGET: `/client/sales-target`,
  },
  CATEGORY: {
    GET_CATEGORIES: `/client/categories`,
    GET_CATEGORY: `/client/categories`,
    UPDATE_CATEGORY: `/client/categories`,
    DELETE_CATEGORY: `/client/categories`,
    CREATE_CATEGORY: `/client/categories`,
  },
  STOCK_IN: {
    GET_STOCK_IN_PRODUCTS: `/client/stocks/stock-in/list`,
    GET_STOCK_IN_PRODUCT: `/client/stocks/stock-in/show`,
    UPDATE_STOCK_IN_PRODUCT: `/client/stocks/stock-in/update`,
  },
  PIXEL: {
    UPDATE_PIXEL: `/client/settings/pixel/update`,
  },
  SETTINGS: {
    BUSINESS_INFO: `/client/settings/business-info`,
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
    SEARCH_ACCOUNT: `/client/accounts/payment-search/`,
    DELETE_PAYOR_CATEGORY: `/client/accounts/payor/delete/`,
    DELETE_LEDGER_CATEGORY: `/client/accounts/ledger/delete/`,
    DELETE_PAYMENT_TYPE_CATEGORY: `/client/accounts/payment-method-delete/`,
  },
  PRODUCTS: {
    GET_PRODUCTS: `/client/products`,
    GET_PRODUCT_DETAILS: `/client/products/`,
    GET_VARIANT_ATTRIBUTES: `/client/variation/attributes`,
    GET_VARIANT_VALUES: `/client/variation/attribute-values`,
    CREATE_VARIANT: `/client/variation/sku_combinations`,
    CREATE_PRODUCTS: `/client/products`,
    CREATE_VARIANT_ATTRIBUTE: `/client/variation/attributes-store`,
    CREATE_VARIANT_ATTRIBUTE_VALUE: `/client/variation/attributes-value-store`,
  },
  ORDERS: {
    ORDER_GLOBAL_SEARCH: `/client/order/search`,
    ORDER_DETAILS_BY_ID: `/client/orders`,
    CREATE_ORDER: `/client/orders`,
    DELETE_ORDER: `client/order`,
    ORDER_EDIT: `/client/orders/`,
    ORDER_SHIPPING_DATE: `/client/order/date/`,
    ORDER_SHIPPING_DATE_CONFIG: `/client/settings/shipped-date/status `,
    ORDER_HOLD_ON_CONFIG: `/client/settings/hold-on/status `,
    ORDER_ADVANCE_PAYMENT_CONFIG: `/client/settings/advance-payment/status`,
    GET_ORDER_TRASHED_LIST: `/client/order/trashed/list`,
    MOVE_ORDER_TRASHED: `/client/order/delete`,
  },
  CUSTOMERS: {
    GET_CUSTOMERS: `/client/customer-list`,
    CUSTOMERS_SEARCH: `/client/customer-search`,
  },
  WEBSITE_SETTINGS: {
    UPDATE_SHIPPING_DATE_STATUS: `/client/settings/shipped-date/status/update`,
    DOMAIN_VERIFICATION: `/client/settings/domain-meta/update`,
    GET_GOOGLE_TAG_MANAGER: `/client/other-script/list`,
    POST_GOOGLE_TAG_MANAGER: `/client/connection`,
    UPDATE_COMMON_SHIPPING_COST_STATUS: `/client/shipping-setting/status-update`,
    GET_COMMON_SHIPPING_COST: `/client/shipping-setting/show`,
    POST_COMMON_SHIPPING_COST: `/client/shipping-setting/store-update`,
    ORDERS_OTP_PERMISSION: `/client/order-otp-permission/status-update`,

  },
  OTP: {
    VERIFY_OTP: `/auth/verify`,
    RESEND_OTP: `/auth/resend`,
  },
  BILLING: {
    GET_BILLING_LIST: `/client/transaction/list`,
  },
  PAGE : {
    FOOTER_COLOR : `/client/multi-page/update`,
    GET_BILLING_LIST: `/client/multi-page/footer-id`,
  }
};
export { API_ENDPOINTS };
