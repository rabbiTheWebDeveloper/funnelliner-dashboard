// export const baseUrl='https://funnelliner.com/api/v1';
export const baseUrl = "https://web.funnelliner.com/api/v1";
export const mainBaseUrl = "https://web.funnelliner.com";
const localBaseUrl = "https://web.funnelliner.com";

import axios from "axios";
import Cookies from "js-cookie";

const token = Cookies.get("token");

const data = Cookies.get();
const mainData = data?.user;
let parseData;
if (mainData != null) {
    parseData = JSON?.parse(mainData);
}

export let shopId = parseData?.shop_id || parseData?.shop?.shop_id
export let domain = parseData?.domain  || parseData?.shop?.domain
export let registrationDate = parseData?.created_at  
export let userId = parseData?.id
export let created = parseData?.created_at
export let paymentStatus = parseData?.payment_status
// let userId = parseData?.user_id

export const headers = {
    Authorization: `Bearer ${token}`,
    "shop-id": shopId,
    "id": userId,
    'Content-Type': 'application/multipart/form-data',
    'X-Requested-With': 'XMLHttpRequest',
};



export const getWebsiteSettings = async () => {
    let EndPoint = `${process.env.API_URL}/client/settings/business-info`;
    return axios
        .get(EndPoint, {headers: headers})
        .then((res) => {
            if (res.status === 200) {
                return res;
            } else {
                return false;
            }
        })
        .catch((err) => {
            return false;
        });
};



export const getMerchantList = () => {
    let EndPoint = `${process.env.API_URL}/client/customers/3`;
    return axios
        .get(EndPoint, {headers: headers})
        .then((res) => {
            if (res.status === 200) {
                return res;
            } else {
                return false;
            }
        })
        .catch((err) => {
            return false;
        });
};

export const topSellingProducts = () => {
    let EndPoint = `${process.env.API_URL}/client/top-selling-product`;
    return axios
        .get(EndPoint, {headers: headers})
        .then((res) => {
            return res;
        })
        .catch((err) => {
           
        });
};

export const handleGetSupportTicketList = (merchant_id) => {
    let EndPoint = `${process.env.API_URL}/client/support-ticket/list`;
    return axios
        .post(EndPoint, {merchant_id: merchant_id}, {headers: headers})
        .then((res) => {
            return res;
        })
        .catch((err) => {
           
        });
};

export const activateCourier = (merchant_id, provider, status, config) => {
    let EndPoint = `${process.env.API_URL}/client/courier/provider`;
    const postBody = {
        provider: provider,
        status: status,
        config: config,
    };
  
    return axios
        .post(EndPoint, postBody, {headers: headers})
        .then((res) => {
            return res;
        })
        .catch((err) => {
           
        });
};

export const multiPageTemplateList = () => {
    let EndPoint = `${mainBaseUrl}/api/themes/multiple/list`;
    return axios
        .get(EndPoint)
        .then((res) => {
            return res;
        })
        .catch((err) => {
            
        });
};

export const activeMultipleTemplate = (id) => {
    const postBody = {
        multiple_theme_id: id,
    };
    let EndPoint = `${process.env.API_URL}/client/themes/multiple/active`;
    return axios
        .post(EndPoint, postBody, {headers: headers})
        .then((res) => {
            return res;
        })
        .catch((err) => {
           
        });
};

export const landingPageTemplateList = () => {
    let EndPoint = `${mainBaseUrl}/api/themes/landing/list`;
    return axios
        .get(EndPoint)
        .then((res) => {
            return res;
        })
        .catch((err) => {
          
        });
};

export const activeLandingPageTemplate = (id) => {
    const postBody = {
        landing_theme_id: id,
    };
    let EndPoint = `${process.env.API_URL}/client/themes/landing/active`;
    return axios
        .post(EndPoint, postBody, {headers: headers})
        .then((res) => {
            return res;
        })
        .catch((err) => {
           
            return err;
        });
};


//theme list
export const allThemeList = (type) => {
    const postBody = {
        shop_id: 970795,
        type: type,
    };
    let EndPoint = `${process.env.API_URL}/client/themes/list`;
    return axios
        .post(EndPoint, postBody, {headers: headers})
        .then((res) => {
            return res;
        })
        .catch((err) => {
           
            return err;
        });
};

export const importLandingPage = (title, theme, status, product_id, videoLink) => {
    const postBody = {
        userId:shopId,
        shopId: shopId,
        title: title,       
        theme: theme,
        status: status,
        product_id: product_id,
        video_link: videoLink,
       
    };
    
    let EndPoint = `${process.env.API_URL}/client/pages`;
    return axios.post(EndPoint, postBody, {headers: headers})
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err
        });
};

export const importTheme = (type, theme_id) => {
    const postBody = {
        type: type,
        theme_id: theme_id
    };
   
    let EndPoint = `${process.env.API_URL}/client/themes/import-theme`;
    return axios
        .post(EndPoint, postBody, {headers: headers})
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err
        });
};

//  merchant theme

export const merchantThemeList = (type) => {
    const postBody = {
        shop_id: shopId,
        type: type,
    };
    let EndPoint = `${process.env.API_URL}/client/themes/merchant/themes`;
    return axios
        .post(EndPoint, postBody, {headers: headers})
        .then((res) => {
            return res;
        })
        .catch((err) => {
           
            return err;
        });
};

export const merchantLandingThemeList = (type) => {
    const postBody = {
        type: type,
    };
    let EndPoint = `${process.env.API_URL}/client/themes/merchant/themes`;
    return axios
        .post(EndPoint, postBody, {headers: headers})
        .then((res) => {
            return res;
        })
        .catch((err) => {
            return err
        });
};

