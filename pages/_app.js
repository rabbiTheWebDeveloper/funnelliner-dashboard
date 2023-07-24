import axios from 'axios';
import Cookies from 'js-cookie';
import Head from 'next/head';
import Router from 'next/router';
import { useEffect, useState } from 'react';
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../Components/Common/layout';
import Loader from '../Components/Loader/Loader';
import '../public/fonts/flaticon_mycollection.css';
import { store } from "../redux/app/store";

import '../styles/globals.css';
import '../styles/Register.css';
import '../styles/admin_dashboard.css';
import '../styles/admin_dashboard_media.css';
import '../styles/common.css';
import '../styles/style.css';


import { headers } from './api';
import SuperFetch from '../hook/Axios';
import moment from 'moment';



function MyApp({ Component, pageProps, router }) {
    const [isLoading, setIsLoading] = useState(false);
    const [isStatus, setIsStatus] = useState(1)
    const [verifyPayment, setVerifyPayment] = useState('');
    const [busInfo, setBusInfo] = useState({});
    const [fetchBusInfo, setFetchBusInfo] = useState(false);
    const [fetchOrderApi, setFetchOrder] = useState(false)
    const [pendingOrderCount, setPendingOrderCount] = useState([])
    const [fetchApi, setFetch] = useState(false)
    // addons show and hode 
    const [myAddonsList, setMyAddonsList] = useState([]);

    const style = {
        style: {
            border: '1px solid #894bca',
            padding: '16px',
            color: '#894bca',
        },
        iconTheme: {
            primary: '#894bca',
            secondary: '#FFFAEE',
        },
        duration: 2000
    }

    useEffect(() => {
        Router.events.on("routeChangeStart", (url) => {
            setIsLoading(true)
            setIsStatus(isStatus + 1)
        });

        Router.events.on("routeChangeComplete", (url) => {
            setIsLoading(false)
        });

        Router.events.on("routeChangeError", (url) => {
            setIsLoading(false)
        });

    }, [Router])


 



    


    // console.log("today", today)
    const handleFetchBusInfo = async () => {
        try {
            let data = await axios({
                method: "get",
                url: `${process.env.API_URL}/client/settings/business-info`,
                headers: headers,
            });
            setBusInfo(data?.data?.data);

            if (data?.data?.data?.domain_status === "connected") {
                Cookies.set('domain_request', data?.data?.data.domain_request)
            } else {
                Cookies.set('domain_request', null)
            }

        } catch (err) {
            if (err?.response?.status === 401 || err?.message === 'Network Error') {
                Cookies.remove("token");
                Cookies.remove("user");
            }


        }
    };

    useEffect(() => {
        handleFetchBusInfo();
        setFetchBusInfo(false)
    }, []);


    const handelFetchBusInfo = () => {
        setFetchBusInfo(true);
    }

    const handleFetchOrderCount = async () => {
        try {
            let data = await axios({
                method: "get",
                url: `${process.env.API_URL}/client/pending-order/count`,
                headers: headers,
            });
            setPendingOrderCount(data.data.data)
        } catch (err) {

        }
        setFetchOrder(false)
    };

    useEffect(() => {
        handleFetchOrderCount();
    }, [fetchOrderApi]);

    
    const orderUpdate = () => {
        setFetchOrder(true);
    }
    const [isApiResponse, setIsApiResponse]=useState(false)


    const handleFetchMyAddonsList = async () => {
        try {
            let data = await axios({
                method: "get",
                url: `${process.env.API_URL}/client/addons/myaddons`,
                headers: headers,
            });
            setMyAddonsList(data?.data?.data);
            setFetch(false)
            setIsApiResponse(true)
        } catch (err) {

        }
    };

    useEffect(() => {
        handleFetchMyAddonsList();
    }, [fetchApi]);





    if (router.pathname.startsWith("/login")) {

        return (
            <>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title>Funnel Liner - Automated Sales Funnel</title>
                    <meta name="description" content="Generated by create next app" />
                    <link rel="icon" href="../images/favicon.png" />
                </Head>
                {isLoading && <Loader />}
                <Provider store={store}>
                    <Toaster toastOptions={style} />
                    <Component {...pageProps} />
                </Provider>

            </>
        )

    }

    if (router.pathname.startsWith("/invoice-one/")) {

        return (
            <>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title>Funnel Liner - Automated Sales Funnel</title>
                    <meta name="description" content="Generated by create next app" />
                    <link rel="icon" href="../images/favicon.png" />
                </Head>
                {isLoading && <Loader />}
                <Provider store={store}>
                    <Component {...pageProps} />
                </Provider>

            </>
        )

    }
    if (router.pathname.startsWith("/forgot-password")) {

        return (
            <>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <title>Funnel Liner - Automated Sales Funnel</title>
                    <meta name="description" content="Generated by create next app" />
                    <link rel="icon" href="../images/favicon.png" />
                </Head>
                {isLoading && <Loader />}
                <Provider store={store}>
                    <Component {...pageProps} />
                </Provider>

            </>
        )

    }
    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>Funnel Liner - Automated Sales Funnel</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="../images/favicon.png" />
            </Head>

            {isLoading && <Loader />}
            <Provider store={store}>

                <Toaster toastOptions={style} />
                <Layout handelFetchBusInfo={handelFetchBusInfo} busInfo={busInfo} myAddonsList={myAddonsList} setFetch={setFetch} pendingOrderCount={pendingOrderCount} >
                    <Component {...pageProps} busInfo={busInfo} setFetch={setFetch} orderUpdate={orderUpdate} myAddonsList={myAddonsList} pendingOrderCount={pendingOrderCount} isApiResponse={isApiResponse}  />
                </Layout>

            </Provider>

        </>
    );


}

export default MyApp
