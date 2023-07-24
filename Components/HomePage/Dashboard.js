import { Container, Grid } from "@mui/material";
import React, { useEffect, useState } from 'react';
import Channel from "./Channel";
import ChartJs from './ChartJs';
import HomePageCart from './HomePageCart/HomePageCart';
import WebsiteLink from './WebsiteLink';
// Cart Img
import axios from 'axios';
import SuperFetch from '../../hook/Axios';
import { headers } from '../../pages/api';
import cartImg1 from '../../public/images/homepage-icon/1.png';
import cartImg10 from '../../public/images/homepage-icon/10.png';
import cartImg11 from '../../public/images/homepage-icon/11.png';
import cartImg2 from '../../public/images/homepage-icon/2.png';
import cartImg3 from '../../public/images/homepage-icon/3.png';
import cartImg4 from '../../public/images/homepage-icon/4.png';
import cartImg5 from '../../public/images/homepage-icon/5.png';
import cartImg6 from '../../public/images/homepage-icon/6.png';
import cartImg7 from '../../public/images/homepage-icon/7.png';
import cartImg8 from '../../public/images/homepage-icon/8.png';
import cartImg9 from '../../public/images/homepage-icon/9.png';
import { filterOrder } from "./HomeUtlis";
import RecentOrder from './RecentOrder';
import TopSellingProducts from './TopSellingProducts';



const Dashboard = ({ busInfo }) => {
    const [date, setTotalOrderDate] = useState('today');
    const [confirmed_date, setTotalConfirmedDate] = useState('today');
    const [sales_date, setTotalSalesDate] = useState('today');
    const [pending_date, setPending_date] = useState('today');
    const [cancel_date, setCancel_date] = useState('today');
    const [discount_date, setDiscount_date] = useState('today');
    const [advance_date, setAdvance_date] = useState('today');
    const [reportData, setReportData] = useState({})
    const [ratioData, setRatioData] = useState({})
    const [salesTarget, setSalesTarget] = useState({});
    const [fatch, setfatch] = useState(false);
    const [advancedPaymentConfig, setAdvancedPaymentConfig] = useState(false)
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);


    // , month, year
    const params = {
        date: date,
        start_date: startDate,
        end_date: endDate,
        confirmed_date: confirmed_date,
        sales_date: sales_date,
        pending_date: pending_date,
        cancel_date: cancel_date,
        discount_payment: discount_date,
        advance_payment: advance_date,



    }
    const ratioParams = {
        total: date,
        confirm: confirmed_date,
        sales_amount: sales_date,
        cancel: cancel_date,
        discount_amount: discount_date,
        advance_amount: advance_date
    }


    useEffect(() => {
        SuperFetch.get('/client/order-statistics', { params: params, headers: headers }).then(res => {
            setReportData(res.data.data)
        }).catch(error => {
        })

        SuperFetch.get('/client/ratio-statistics', { params: ratioParams, headers: headers }).then(res => {
            setRatioData(res.data.data)
        }).catch(error => {
        })
    }, [date, confirmed_date, sales_date, advance_date, discount_date, pending_date, cancel_date, startDate, endDate])
  
    // delivery report 
    const [dateReport, setDateReport] = useState('today')
    const [report, setReport] = useState({})
    const delivereyParams = {
        date: dateReport
    }
    useEffect(() => {
        SuperFetch.get('/client/order-delivery-report', { params: delivereyParams, headers: headers }).then((res) => {
            setReport(res.data?.data)
        })
    }, [dateReport])





    const handleFetchSellsTarget = async () => {
        try {
            let data = await axios({
                method: "get",
                url: `${process.env.API_URL}/client/sales-target`,
                headers: headers,
            });


            setSalesTarget(data?.data?.data);
        } catch (err) {

        }

    };

    useEffect(() => {
        handleFetchSellsTarget();
        setfatch(false)
    }, [fatch]);

    const salesTargetRfatch = () => {
        setfatch(true)
    }


    const handleFetchAdvancePaymentStatus = async () => {
        try {
            let data = await axios({
                method: "get",
                url: `${process.env.API_URL}/client/settings/advance-payment/status`,
                headers: headers,
            });
            if (data.data.success === true) {
                setAdvancedPaymentConfig(data.data?.data?.advanced_payment)
            }
        } catch (err) {
        }
    };

    useEffect(() => {
        handleFetchAdvancePaymentStatus();
    }, [])
    const percentage = 34.21;
    const formattedPercentage = `+${new Intl.NumberFormat(undefined, { style: 'percent' }).format(percentage / 100)}`;



    return (
        <section className="WebsiteLink">

            <Container maxWidth="sm">



                <Grid container spacing={3}>

                    <Grid item xs={12}>
                        <WebsiteLink busInfo={busInfo} />
                    </Grid>

                    <Grid item xs={6}>
                        <ChartJs />
                    </Grid>

                    <Grid item xs={6}>
                        <Channel />
                    </Grid>

                    {/* Total Visitor */}
                    <Grid item xs={6} xl={4}>
                        <HomePageCart title="Total Visitor" increase="increase" filter={true} number="00" cartIcon="flaticon-trend" increaseTitle="+65% (30 days)" cartImg={cartImg1} />
                    </Grid>

                    {/* Total Order */}
                    <Grid item xs={6} xl={4}>
                        <HomePageCart setEndDate={setEndDate} endDate={endDate} setStartDate={setStartDate} startDate={startDate} data={date} setFetchData={setTotalOrderDate} title="Total Order" increase={ratioData?.total_order_ratio?.startsWith("-") === false ? "increase" : "decrease"} number={reportData?.total} cartIcon={ratioData?.total_order_ratio?.startsWith("-") === false ? "flaticon-trend" : "flaticon-down-arrow-2"} increaseTitle={`${ratioData?.total_order_ratio?.startsWith("-") === false ? "+" + ratioData?.total_order_ratio : ratioData?.total_order_ratio}  (${filterOrder(date)})`} cartImg={cartImg2} />
                    </Grid>

                    {/* Confirmed Order */}
                    <Grid item xs={6} xl={4}>
                        <HomePageCart setEndDate={setEndDate} endDate={endDate} setStartDate={setStartDate} startDate={startDate} data={confirmed_date} setFetchData={setTotalConfirmedDate} title="Confirmed Order" number={reportData?.confirmed?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} cartImg={cartImg3} increase={ratioData?.confirmed_order_ratio
                            ?.startsWith("-") === false ? "increase" : "decrease"} cartIcon={ratioData?.confirmed_order_ratio
                                ?.startsWith("-") === false ? "flaticon-trend" : "flaticon-down-arrow-2"} increaseTitle={`${ratioData?.confirmed_order_ratio?.startsWith("-") === false ? "+" + ratioData?.confirmed_order_ratio : ratioData?.confirmed_order_ratio}  (${filterOrder(confirmed_date)})`} />
                    </Grid>

                    {/* Order Pending */}
                    <Grid item xs={6} xl={4}>
                        <HomePageCart data={pending_date} setFetchData={setPending_date} filter={true} title="Order Pending" number={reportData?.pending} cartImg={cartImg4}
                        />
                    </Grid>

                    {/* Cancel Order */}
                    <Grid item xs={6} xl={4}>
                        <HomePageCart setEndDate={setEndDate} endDate={endDate} setStartDate={setStartDate} startDate={startDate} data={cancel_date} setFetchData={setCancel_date} title="Cancel Order" number={reportData?.cancel} cartImg={cartImg5}
                            increase={ratioData?.cancel_order_ratio
                                ?.startsWith("-") === false ? "increase" : "decrease"} cartIcon={ratioData?.cancel_order_ratio
                                    ?.startsWith("-") === false ? "flaticon-trend" : "flaticon-down-arrow-2"} increaseTitle={`${ratioData?.cancel_order_ratio?.startsWith("-") === false ? "+" + ratioData?.cancel_order_ratio : ratioData?.cancel_order_ratio}  (${filterOrder(cancel_date)})`} />
                    </Grid>

                    {/* Sales Amount */}
                    <Grid item xs={6} xl={4}>
                        <HomePageCart setEndDate={setEndDate} endDate={endDate} setStartDate={setStartDate} startDate={startDate} data={sales_date} setFetchData={setTotalSalesDate} title="Sales Amount" number={reportData?.sales?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} cartImg={cartImg6}
                            increase={ratioData?.sales_amount_ratio
                                ?.startsWith("-") === false ? "increase" : "decrease"} cartIcon={ratioData?.sales_amount_ratio
                                    ?.startsWith("-") === false ? "flaticon-trend" : "flaticon-down-arrow-2"} increaseTitle={`${ratioData?.sales_amount_ratio
                                        ?.startsWith("-") === false ? "+" + ratioData?.sales_amount_ratio : ratioData?.sales_amount_ratio
                                        }  (${filterOrder(sales_date)})`} />
                    </Grid>

                    {/* Discount Amount */}
                    <Grid item xs={6} xl={4}>
                        <HomePageCart setEndDate={setEndDate} endDate={endDate} setStartDate={setStartDate} startDate={startDate} data={discount_date} setFetchData={setDiscount_date} title="Discount Amount" number={reportData?.discount_payment?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} cartImg={cartImg7}
                            increase={ratioData?.discount_amount_ratio
                                ?.startsWith("-") === false ? "increase" : "decrease"} cartIcon={ratioData?.discount_amount_ratio
                                    ?.startsWith("-") === false ? "flaticon-trend" : "flaticon-down-arrow-2"} increaseTitle={`${ratioData?.discount_amount_ratio
                                        ?.startsWith("-") === false ? "+" + ratioData?.discount_amount_ratio
                                        : ratioData?.discount_amount_ratio
                                        }  (${filterOrder(discount_date)})`} />
                    </Grid>

                    {/* Available Courier Balance */}
                    <Grid item xs={6} xl={4}>
                        <HomePageCart title="Available Courier Balance" filter={true} increase="increase" number={busInfo?.courier_balance} cartIcon="" increaseTitle="" cartImg={cartImg8} />
                    </Grid>

                    {/* Delivery Report */}
                    <Grid item xs={6} xl={4}>
                        <HomePageCart setEndDate={setEndDate} endDate={endDate} setStartDate={setStartDate} startDate={startDate} data={dateReport} setFetchData={setDateReport} title="Delivery Report" listItem={true} deliveryCount={report.delivered} deliveryReturnCount={report.returned_ratio} returnRatioCount={report.returned} cartImg={cartImg9} />
                    </Grid>

                    {/* Sales Target */}
                    <Grid item xs={6} xl={4}>
                        <HomePageCart salesTargetRfatch={salesTargetRfatch} filter={true} salesTarget={salesTarget} title="Sales Target" openSale={true} listItem={false} listItem2={true} deliveryCount="0" deliveryReturnCount="0" returnRatioCount="0.0" cartImg={cartImg10} />
                    </Grid>

                    {/* Advance Collection */}

                    {
                        advancedPaymentConfig &&
                        <Grid item xs={4}>
                            <HomePageCart setEndDate={setEndDate} endDate={endDate} setStartDate={setStartDate} startDate={startDate} data={advance_date} setFetchData={setAdvance_date} title="Advance Collection" number={reportData?.advance_payment?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} cartImg={cartImg11}
                                increase={ratioData?.advance_amount_ratio
                                    ?.startsWith("-") === false ? "increase" : "decrease"} cartIcon={ratioData?.advance_amount_ratio
                                        ?.startsWith("-") === false ? "flaticon-trend" : "flaticon-down-arrow-2"} increaseTitle={`${ratioData?.advance_amount_ratio?.startsWith("-") === false ? "+" + ratioData?.advance_amount_ratio : ratioData?.advance_amount_ratio}  (${filterOrder(advance_date)})`} />
                        </Grid>
                    }

                    {/* <Grid item xs={12}>
                            <DataTable />
                        </Grid> */}


                </Grid>
                <Grid container spacing={3} style={{ marginTop: '20px' }} >
                    {/* recentOrder */}
                    <Grid item xs={6}>
                        <RecentOrder />
                    </Grid>

                    {/* TopSellingProduct */}
                    <Grid item xs={6}>
                        <TopSellingProducts />
                    </Grid>
                    {/* <Grid item xs={12}>
                          <DataTable />
                      </Grid> */}

                </Grid>


            </Container>

        </section>

    );
};

export default Dashboard;