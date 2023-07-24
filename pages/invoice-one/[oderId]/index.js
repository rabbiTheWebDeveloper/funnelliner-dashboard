
import axios from 'axios';
import Cookies from 'js-cookie';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { headers, shopId, userId } from '../../api';

import moment from 'moment';
import Head from 'next/head';



const index = () => {
    const { publicRuntimeConfig } = getConfig();
    const apiUrl = publicRuntimeConfig.API_URL;
    const [invoice, setInvoice] = useState({})
    const [busInfo, setBusInfo] = useState({});
    const [ownInfo, setOwnInfo] = useState({});
    const router = useRouter()
    const { oderId } = router.query
    const token = Cookies.get("token");


    useEffect(() => {
        axios.get(apiUrl + "/client/settings/business-info", { headers: headers })
            .then(function (response) {
                setBusInfo(response?.data?.data);

            });
    }, [oderId]);


    useEffect(() => {
        const timeoutId = setTimeout(() => {
            axios.get(apiUrl + "/client/order-invoice", {
                headers: {
                    'shop-id': shopId,
                    'X-Requested-With': 'XMLHttpRequest',
                    Authorization: `Bearer ${token}`,
                    "order-id": oderId,
                    "id": userId,
                    // shop_id :shopId
                },
            })
                .then(function (response) {
                    // handle success
                    setInvoice(response?.data?.data);

                });
        }, 1000)

        return () => clearTimeout(timeoutId);


    }, [oderId])







    const calculatePrice = invoice?.order_details?.reduce((prevVal, currentVal) => {
        return prevVal + currentVal?.price * currentVal?.quantity
    }, 0)

    const totalPrice = calculatePrice
    useEffect(() => {

        setTimeout(() => {
            window.print();

        }, 5000)
    }, [])
    const { order_details } = invoice


    function numberToWord(num) {
        const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

        if (num === 0) {
            return 'zero';
        }

        if (num < 0) {
            return 'minus ' + numberToWord(Math.abs(num));
        }

        let words = '';

        if (Math.floor(num / 1000) > 0) {
            words += numberToWord(Math.floor(num / 1000)) + ' thousand ';
            num %= 1000;
        }

        if (Math.floor(num / 100) > 0) {
            words += numberToWord(Math.floor(num / 100)) + ' hundred ';
            num %= 100;
        }

        if (num >= 10 && num <= 19) {
            words += teens[num - 10];
            return words;
        }

        if (Math.floor(num / 10) > 0) {
            words += tens[Math.floor(num / 10)];
            num %= 10;
        }

        if (num > 0) {
            words += ones[num];
        }

        return words.trim();
    }






    const capitalizeWords = (str) => {
        return (str || '').toLowerCase()
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };




    if (invoice !== undefined) {


        return (

            <>
                <Head>
                    <title>Invoice-3</title>
                    <style dangerouslySetInnerHTML={{ __html: "\n        :where(h1, h2, h3, h4, h5, h6, p, ) {\n            margin: 0;\n            padding: 0;\n        }\n\n        .invoice-4 {\n            font-family: 'Montserrat', sans-serif;\n            width: 700px;\n            height: 900px;\n            margin: 0 auto;\n            padding: 10px 20px;\n            padding-bottom: 0;\n            border: 1px solid #ddd;\n            background: #FFF;\n            -webkit-print-color-adjust: exact;\n            display: flex;\n            flex-direction: column;\n            justify-content: space-between;\n            flex-wrap: wrap;\n        }\n\n        .invoice-4 .item{\n            height: 48%;\n        }\n\n        .invoice-4 .bdr{\n            border: 2px dashed #DDD;\n            margin: 0 -20px;\n        }\n\n        .header {\n            display: flex;\n            align-items: self-start;\n            justify-content: space-between;\n            border-bottom: 1px solid #ddd;\n            margin: 0 -20px;\n            padding: 0 20px;\n            padding-bottom: 10px;\n            border-collapse: collapse;\n        }\n\n        .header h2 {\n            font-size: 25px;\n            line-height: 35px;\n            font-weight: 700;\n            color: #000;\n        }\n\n        .header h4 {\n            font-size: 13px;\n            line-height: 15px;\n            color: #737373;\n            font-weight: 400;\n            margin-top: 5px;\n        }\n\n        .header h4 span {\n            font-weight: 700;\n            color: #000;\n        }\n\n        .logo {\n            text-align: right;\n        }\n\n        .logo img {\n            height: 50px;\n        }\n\n        .table {\n            width: 100%;\n            margin-top: 10px;\n        }\n\n        .table table {\n            width: 100%;\n            border-collapse: collapse;\n        }\n\n        .table table thead tr {\n            border-bottom: 1px solid #ddd;\n        }\n\n        .table table th {\n            font-size: 13px;\n            text-align: center;\n            padding: 5px 20px;\n            color: #000;\n            font-weight: 700;\n        }\n\n        .table table td {\n            text-align: center;\n            padding: 5px 20px;\n            color: #000;\n            font-weight: 400;\n            font-size: 14px;\n            line-height: 16px;\n        }\n\n        .table table tbody tr:nth-child(odd) {\n            background: #CFE2FF;\n        }\n\n        .table table tbody tr:nth-child(even) {\n            background: #f3f3f3;\n        }\n\n\n        .billing {\n            margin-top: 20px;\n            display: flex;\n            align-items: flex-start;\n            justify-content: space-between;\n        }\n\n        .billing .left {\n            width: 43%;\n        }\n\n        .billing .right {\n            width: 47%;\n            text-align: right;\n        }\n\n        .billing h4 {\n            font-size: 14px;\n            line-height: 20px;\n            color: #737373;\n            margin-bottom: 5px;\n        }\n\n        .billing p {\n            font-size: 13px;\n            line-height: 20px;\n            color: #000;\n            font-weight: 400;\n            margin-top: 5px;\n            color: #737373;\n        }\n\n        .billing p span {\n            font-weight: 700;\n        }\n\n        .billing h5 {\n            font-size: 13px;\n            line-height: 20px;\n            color: #737373;\n            font-weight: 400;\n            margin-top: 5px;\n        }\n\n        .billing h5 span {\n            font-weight: 700;\n            color: #000;\n        }\n\n        .billing ul {\n            list-style-type: none;\n            margin: 0;\n            padding: 0;\n        }\n\n        .billing ul li {\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n            margin-bottom: 0px;\n            padding: 2px 7px;\n        }\n\n        .billing ul li h3 {\n            font-size: 14px;\n            line-height: 20px;\n            color: #000;\n            font-weight: 700;\n            width: 45%;\n        }\n\n        .billing ul li p {\n            width: 40%;\n            font-size: 14px;\n            font-weight: 400;\n            color: #737373;\n            margin-top: 0;\n        }\n\n        .billing ul li:last-child {\n            background: #894bca;\n            margin-bottom: 0;\n            margin-top: 5px;\n        }\n\n        .billing ul li:last-child h3 {\n            color: #fff;\n            font-size: 16px;\n            line-height: 24px;\n        }\n\n        .billing ul li:last-child p {\n            color: #fff;\n            font-size: 16px;\n            line-height: 24px;\n        }\n\n        .footer {\n            background: rgba(255, 0, 0, 0.04);\n            border-top: 2px solid rgba(255, 0, 0, 0.16);\n            margin: 0 -20px;\n            padding: 10px 20px;\n            margin-top: 10px;\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n        }\n\n        .footer h3{\n            font-size: 15px;\n            line-height: 24px;\n            color: #000;\n            font-weight: 700;\n        }\n\n        .footer h5 {\n        \n            font-size: 14px;\n            line-height: 20px;\n            color: #000;\n            font-weight: 400;\n            margin-top: 3px;\n        }\n\n\n    " }} />

                </Head>

                <div className="invoice-4">
                    {/* item */}
                    <div className="item">
                        {/* header */}
                        <div className="header">
                            <div className="left">
                                <h2>Invoice</h2>
                                <h4> <span>Date:</span>{moment().format('MMMM Do, YYYY')}</h4>
                                <h4> <span>Invoice:</span> #{invoice?.order_no} </h4>
                            </div>
                            <div className="logo">
                                <img src={busInfo?.shop_logo?.name} alt="" />
                            </div>
                        </div>
                        <div className="table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>SL</th>
                                        <th>Product Description</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order_details?.map((data, index) => {
                                        return <tr key={data.order_id} >
                                            <td>
                                                {index + 1}

                                            </td>
                                            <td>
                                                {data?.product}

                                            </td>
                                            <td>{data?.price}</td>
                                            <td>{data?.quantity}</td>
                                            <td>{data?.price * data?.quantity}</td>
                                        </tr>
                                    })}
                                    {/* <tr>
                                        <td>1</td>
                                        <td>i-phone</td>
                                        <td>Tk. 250.00</td>
                                        <td>1</td>
                                        <td>Tk. 250.00</td>
                                    </tr>
                                    <tr>
                                        <td>1</td>
                                        <td>i-phone</td>
                                        <td>Tk. 250.00</td>
                                        <td>1</td>
                                        <td>Tk. 250.00</td>
                                    </tr> */}
                                </tbody>
                            </table>
                        </div>
                        {/* billing */}
                        <div className="billing">
                            <div className="left">
                                <h4>Customer Details</h4>
                                <h5><span>Name: </span> {invoice?.customer_name}</h5>
                                <h5><span>Mobile:</span>{invoice?.phone}</h5>
                                <h5><span>Address:</span> {invoice?.address}</h5>
                            </div>





                            <div className="right">
                                <ul>
                                    <li>
                                        <h3>Subtotal :</h3>
                                        <p> Tk. {invoice?.grand_total}.00</p>
                                    </li>
                                    <li>
                                        <h3>Discount :</h3>
                                        <p>Tk. {invoice?.discount}.00</p>
                                    </li>
                                    <li>
                                        <h3>Advance :</h3>
                                        <p>Tk. {invoice?.advanced}.00</p>
                                    </li>
                                    <li>
                                        <h3>Shipping Cost :</h3>
                                        <p>Tk. {invoice?.shipping_cost}.00</p>
                                    </li>
                                    <li>
                                        <h3>Total Due :</h3>
                                        <p>Tk. {invoice?.due}</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        {/* footer */}
                        <div className="footer">
                            <div className="left">
                                <h3>{capitalizeWords(invoice?.shop_info?.name)}</h3>
                                <h5>Mobile: {busInfo?.phone}</h5>
                                <h5>Email: {busInfo?.email}</h5>
                            </div>
                            <div className="right">
                                <h5>{busInfo?.address}</h5>
                            </div>
                        </div>
                    </div>
                    {/* bdr */}
                    <div className="bdr" />
                    {/* item */}

                </div>





                {/* <div className="InvoiceOne">


                    <div className="InvoiceOneContent">

                        <div className="Thankyou">
                            <p>Thank you for your being with us !</p>

                            <div className="FooterAddress">

                                <div className="Header">

                               
                                    <div className="Text">
                                        <ul>
                                            <li> <BiPhoneCall /> {busInfo?.phone}</li>
                                            <li> <FaRegEnvelope />{busInfo?.email}</li>
                                            <li> <MdLocationPin />{busInfo?.address}</li>
                                        </ul>
                                    </div>

                                </div>

                            </div>

                        </div>

                      
                        <div className="Header d_flex d_justify">

                            <div className="Logo d_flex">
                                <img src={busInfo?.shop_logo?.name} alt="" />
                                <h4>{invoice?.shop_info?.name}</h4>
                            </div>

                            <div className="Title">
                                <h3>INVOICE</h3>
                                <h4>Invoice No: <span>{" "} {invoice?.order_no}</span></h4>
                                <h4>Invoice date: <strong>{moment().format("DD-MM-YYYY")}</strong> </h4>
                            </div>


                        </div>

                     
                        <div className="Table">

                            <table>

                                <thead>
                                    <tr>
                                        <th>SL</th>
                                        <th>PRODUCT DESCRIPTION</th>
                                        <th>PRICE</th>
                                        <th>QTY</th>
                                        <th>AMOUNT</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {order_details?.map((data, index) => {
                                        return <tr key={data.order_id} >
                                            <td>
                                                <h4>{index + 1}</h4>
                                            
                                            </td>
                                            <td>
                                                <h4>{data?.product}</h4>
                                              
                                            </td>
                                            <td>{data?.price}</td>
                                            <td>{data?.quantity}</td>
                                            <td>{data?.price * data?.quantity}</td>
                                        </tr>
                                    })}


                                </tbody>

                            </table>

                        </div>

                      
                        <div className="Total d_flex d_justify">

                            <div className="Left">
                                <h4>Invoice to: </h4>
                                <p>{invoice?.customer_name}</p>
                                <p> {invoice?.address}</p>
                                <p>{invoice?.phone}</p>
                            </div>

                            <div className="Right">

                                <ul>
                                    <li><span>SubTotal  <strong>:</strong></span>  <h6>{invoice?.grand_total} <TbCurrencyTaka/> </h6></li>
                                    <li><span>Discount  <strong>:</strong></span>  <h6>{invoice?.discount} <TbCurrencyTaka/> </h6></li>
                                    <li><span>Advance  <strong>:</strong></span>  <h6>{invoice?.advanced} <TbCurrencyTaka/> </h6></li>
                                    <li><span>Shipping Cost  <strong>:</strong></span> <h6>{invoice?.shipping_cost} <TbCurrencyTaka/> </h6></li>
                                </ul>

                                <h3>Total Due: BDT {invoice?.due}</h3>
                                

                            </div>

                        </div>

                        <div className="InWord">
                            <h5>In word: {numberToWord(invoice?.due)}</h5>
                        </div>


                    </div>


                </div> */}




            </>

        )
    }





}

export default index