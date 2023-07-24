import { Box, Container, Grid, Link } from "@mui/material";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useRouter } from "next/router";
import React, { useState } from "react";
import SuperFetch from "../../hook/Axios";
import { useToast } from "../../hook/useToast";
import { created, headers } from "../../pages/api";

import style from './style.module.css';

import Cookies from "js-cookie";
import moment from "moment";
import dynamic from 'next/dynamic';
import HeaderDescription from "../../Components/Common/HeaderDescription/HeaderDescription";
import useLoading from "../../hook/useLoading";
import Spinner from "../commonSection/Spinner/Spinner";
import Billing from "./Billing";
// import Skeletor from "../commonSection/Skeleton/Skeletor";

const HtmlToPdf = dynamic(() => import('html2pdf.js'), { ssr: false });

const Subscription = ({ subscriptions, merchant, handelFetchBusInfo, isApiResponse, ...props }) => {
    const [isLoading, startLoading, stopLoading] = useLoading();
    const [loadingInvoice, setLoadingInvoice] = useState(null);
    const showToast = useToast()
    const router = useRouter()
    const [selectedPayment, setSelectedPayment] = useState("");
    const [openModal, setModalOpen] = useState(false);

    const [updateModal, setUpdateModal] = useState(false);
    const handleUpdateModal = () => setUpdateModal(true);
    const handleUpdateModalClose = () => setUpdateModal(false);

    const params = {
        amount: 1,
        order_type: 'package'
    }
    const makePaymentSsl = () => {
        SuperFetch.get('/client/sslcommerze/pay', { params: params, headers: headers }).then((res) => {
            if (res.data?.success === false) {
                showToast(res.data.message, "error")
            }
            router.push(res.data).then(r => {

                handelFetchBusInfo(),
                    Cookies.set('user', JSON.stringify(merchant));

            })
        })
    }

    const makePaymentBkash = () => {
        SuperFetch.get('/client/bkash/pay', { params: params, headers: headers }).then((res) => {
            if (res.status === 200) {
                router.push(res.data).then(r => {
                    //  r ,
                    handelFetchBusInfo(),
                        Cookies.set('user', JSON.stringify(merchant));
                })
            }
        })
    }

    const makePaymentNagad = () => {
        SuperFetch.get('/client/nagad/pay', { params: params, headers: headers }).then((res) => {
            if (res.status === 200) {
                router.push(res.data).then(r => r)
            }
        })
    }


    const handlePaymentMethod = async (e) => {
        setModalOpen(false)
        switch (e) {
            case 'ssl':
                makePaymentSsl();
                break;
            case 'bkash':
                makePaymentBkash();
                break;
            case 'nagad':
                makePaymentNagad()
                break;
            default:
                setModalOpen(false)
                makePaymentSsl();
        }
    }

    const handlePaymentMethodChange = (event) => {
        setSelectedPayment(event.target.value);
    };


    const lastPayment = subscriptions[0]?.api_response
    const data1 = lastPayment !== undefined ? JSON?.parse(lastPayment) : "";

 
    const [downLoading_invoce_index, setDownLoading_invoce_index] = useState(null)
    const downloadInvoice = async (id, invoice, index) => {
        try {
            setDownLoading_invoce_index(index)
            setLoadingInvoice(invoice); // Set the loading state for the current invoice
            startLoading(); // Start the global loading state
            const response = await SuperFetch.get(`/client/subscription/pdf/download/${id}`, { headers: headers, responseType: 'blob' });
            const blob = response.data;
            const objectURL = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = objectURL;
            downloadLink.download = `invoice-${invoice}.pdf`;
            downloadLink.click();
            URL.revokeObjectURL(objectURL);
        } catch (error) {
            // Handle error
        } finally {
            setLoadingInvoice(null); // Reset the loading state for the current invoice
            setDownLoading_invoce_index(null)
            stopLoading(); // Stop the global loading state
        }
    };


   

    return (
        <>
            <section className='TopSellingProducts DashboardSetting Courier Subscription'>

                {/* header */}
                <HeaderDescription headerIcon={'flaticon-wallet'} title={'Subscription'} subTitle={'Subscription for software'} search={false}></HeaderDescription>

                <Container maxWidth='sm'>

                    <Grid container spacing={3}>
                        {
                            isApiResponse && subscriptions.length === 0 &&
                            <Grid item xs={12} sm={6} md={4}>

                                <div className="commonCart boxShadow cart-2">

                                    <div className={style.packagePrice}>

                                        <h3>Entrepreneur Plan</h3>

                                        <h4> <i className="flaticon-taka"></i> 3000 </h4>

                                        <ul>
                                            <li> <img src="/images/first-setup/check-mark.png" alt="" /> 1 Online Store</li>
                                            <li> <img src="/images/first-setup/check-mark.png" alt="" /> Drag & Drop, No Code Editor</li>
                                            <li> <img src="/images/first-setup/check-mark.png" alt="" /> Unlimited Products</li>
                                            <li> <img src="/images/first-setup/check-mark.png" alt="" /> Unlimited Order Management</li>
                                            <li> <img src="/images/first-setup/check-mark.png" alt="" /> Multi Page Themes</li>
                                            <li> <img src="/images/first-setup/check-mark.png" alt="" /> Landing Page Templates</li>
                                            <li> <img src="/images/first-setup/check-mark.png" alt="" /> Business Reports</li>
                                            <li> <img src="/images/first-setup/check-mark.png" alt="" /> Custom Domain</li>
                                            <li> <img src="/images/first-setup/check-mark.png" alt="" /> Auto Invoice Making</li>
                                            <li> <img src="/images/first-setup/check-mark.png" alt="" /> Auto Courier Entry</li>
                                            <li> <img src="/images/first-setup/check-mark.png" alt="" /> Inventory Management </li>
                                            <li> <img src="/images/first-setup/check-mark.png" alt="" /> Bulk SMS Marketing Features</li>
                                            <li> <img src="/images/first-setup/check-mark.png" alt="" /> Marketing Tools</li>
                                        </ul>
                                        <Button onClick={handleUpdateModal}>Subscribe Now</Button>
                                    </div>
                                </div>
                            </Grid>}
                        {/* } */}

                        {/* Total Order */}

                        {
                            data1?.amount === '3000.00' || data1?.transactionStatus === "Completed"
                            &&
                            <Grid item xs={12} sm={6} md={4}>

                                <div className="commonCart boxShadow cart-2">

                                    <div className={style.SubsHeight}>

                                        <div className="header">
                                            <h4><i className="flaticon-stock-market-1"></i> Monthly Subscription Fee</h4>
                                        </div>

                                        <div className="middle">
                                            <h3>
                                                <i className="flaticon-taka"></i>
                                                3000
                                            </h3>
                                        </div>
                                        <div className="list">
                                            <ul>
                                                <li>Your Registration Date: <span>{created}</span> </li>
                                                <li>Your Last Payment Date: <span>{subscriptions[0]?.created_at}</span> </li>
                                                <li className="nextPayment">Next Due Date: <span>{moment(subscriptions[0]?.next_due_date).format('Do MMMM YYYY')}</span> </li>
                                            </ul>
                                        </div>


                                    </div>

                                </div>

                            </Grid>

                        }
                        <Grid item xs={12}>

                            <div className="SubscriptionInvoice boxShadow">
                                <div className="Pending">
                                    <div className="Table">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>S/L</th>
                                                    <th>Invoice</th>
                                                    <th>Invoice Date</th>
                                                    <th>Due Date</th>
                                                    <th>Subscription</th>
                                                    <th>Amount</th>
                                                    <th>Transaction</th>
                                                    <th>Status</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {subscriptions && subscriptions?.map((item, index) => {

                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>#{item?.invoice_num}</td>
                                                            <td>{item?.created_at}</td>

                                                            <td style={{ color: 'red', fontWeight: 'bold' }}> {moment(item?.next_due_date).format('Do MMMM YYYY')}</td>
                                                            <td style={{ fontWeight: 'bold' }}>Entrepreneur Plan</td>
                                                            <td>     <i className="flaticon-taka"></i> {item?.amount}</td>
                                                            <td> {item?.gateway_trxid}</td>
                                                            <td style={{ color: JSON?.parse(item?.api_response).transactionStatus === 'Completed' ? 'green' : 'red', fontWeight: 'bold' }}>
                                                                {JSON?.parse(item?.api_response).transactionStatus === 'Completed' ? 'paid' : 'fail'}
                                                            </td>
                                                            <td>

                                                                <div className="DuelButton" style={{ marginTop: '-15px' }} >
                                                                    <Button
                                                                        key={item?.invoice_num}
                                                                        onClick={() => downloadInvoice(item?.id, item?.invoice_num)}
                                                                        disabled={loadingInvoice === item?.invoice_num}
                                                                    >
                                                                        {loadingInvoice === item?.invoice_num ? (
                                                                            <>
                                                                                <Spinner />
                                                                                Downloading...
                                                                            </>
                                                                        ) : (
                                                                            'Invoice'
                                                                        )}
                                                                    </Button>
                                                                    <Button onClick={e => handleUpdateModal(true)} style={{ marginLeft: '10px' }}>Pay Now</Button>
                                                                </div>
                                                            </td>

                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>


                            </div>

                        </Grid>

                    </Grid>


                </Container>
            </section>

            <Billing></Billing>

            <Modal
                keepMounted
                open={updateModal}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
                className='updateModal'
            >
                <Box className='modalBox'>

                    <div className='modalContent'>

                        <div className='header'>
                            <div className='left'>
                                <i className="flaticon-wallet" />
                                <h4>Select Payment Method</h4>
                            </div>

                            <div className='right' onClick={handleUpdateModalClose}>
                                <i className="flaticon-cancel" />
                            </div>

                        </div>

                        <form action="">

                            <div className='updateModalForm'>

                                <div className="SubscriptionModal">

                                    <div className="PaymentType">

                                        <label className="card">
                                            <input name="plan" className="radio" type="radio" checked={selectedPayment === "bkash"} value="bkash" onChange={handlePaymentMethodChange} />
                                            <img src="/images/payment-img/bkash.png" alt="" />
                                        </label>

                                        <label className="card">
                                            <input name="plan" className="radio" type="radio" checked={selectedPayment === "nagad"} value="nagad" onChange={handlePaymentMethodChange} />
                                            <img src="/images/payment-img/nagod.png" alt="" />
                                        </label>

                                        <label className="card">
                                            <input name="plan" className="radio" type="radio" checked={selectedPayment === "ssl"} value="ssl" onChange={handlePaymentMethodChange} />
                                            <img src="/images/payment-img/visa.png" alt="" />
                                        </label>

                                    </div>

                                    <div className="Review">

                                        <h6>Review</h6>
                                        <div className="SubscribeAmount">
                                            <h4>Subscribe Amount</h4>
                                            <h3><i className="flaticon-taka" /> 3000.00 </h3>
                                        </div>

                                    </div>

                                    <div className="terms-condition">
                                        <input type="checkbox" id="checkbox" checked />
                                        <label for="checkbox">By pressing “Continue” you agree to the <Link href="https://funnelliner.com/terms" target="/blank">Terms and Conditions</Link> </label>
                                    </div>

                                    <div className="duelButton">
                                        <Button onClick={() => handlePaymentMethod(selectedPayment)}>Pay Now</Button>
                                    </div>

                                </div>

                            </div>

                        </form>

                    </div>

                </Box>

            </Modal>
        </>
    );
};

export default Subscription;
