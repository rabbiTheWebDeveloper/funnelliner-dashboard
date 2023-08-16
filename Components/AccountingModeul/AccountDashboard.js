import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Button, TextField, Tooltip } from '@mui/material';
import axios from 'axios';
import { enGB } from 'date-fns/locale';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import { TbCurrencyTaka } from 'react-icons/tb';
import { DateRangePicker } from 'react-nice-dates';
import 'react-nice-dates/build/style.css';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { baseTest } from '../../constant/constant';
import { headers } from '../../pages/api';
import AccountEdit from './AccountEdit';
import CashIn from './CashIn';
import CashOut from './CashOut';
import FilterCategoryItem from './FilterCategoryItem';
import FilterPaymentItem from './FilterPaymentItem';
import FilterReceverItem from './FilterReceverItem';

const AccountDashboard = ({ payment, setPayment, handleFetch, fetchApi }) => {

    const [search, setSearch] = useState(null)


    // Custom Date
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const formatDate = (date) => {
        if (!date) return "";
        return date.toLocaleDateString();
    }
    const dateValue = startDate && endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : "";
    const [update, setUpdate] = useState(false)
    // balance 
    const [balance, setBalance] = useState({});


    const balanceFetch = () => {
        setUpdate(true);
    }




    //   delete 
    const deletePayment = (id) => {
        Swal.fire({
            title: "Are you sure?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes",
        }).then((result) => {
            if (result.isConfirmed) {
                axios.get(baseTest + `/client/accounts/payment-delete/${id}`, {
                    headers: headers,
                })
                    .then(function (result) {
                        if (result) {
                            setPayment((pd) => {
                                const filter = payment.filter((prod) => {
                                    return prod.id !== id;
                                });
                                return [...filter];
                            });
                            setUpdate(true)
                            Swal.fire("Deleted!", "Your file has been deleted.", "success");
                        }
                    }).catch((errr) => {
                        alert("Some thing went wrong")
                    })

            }
        });
    };

    const handleFetchEditInfo = async () => {
        try {
            let data = await axios({
                method: "get",
                url: `${process.env.API_URL}/client/accounts/payment-calculation`,
                headers: headers,
            });
            setBalance(data?.data?.data);
        } catch (err) {

        }
    };

    useEffect(() => {
        handleFetchEditInfo();
        setUpdate(false)
    }, [update]);

    //filter data by date
    const [filterOption, setOptionFilter] = useState("today")
    const handleFetchFilterdDataByDate = async () => {
        try {
            let data = await axios({
                method: "get",
                url: `${process.env.API_URL}/client/accounts/payment-search-datewise/${filterOption}`,
                headers: headers,
            });
            setPayment(data?.data?.data.search)
            setTodayData(data?.data?.data)
            setBalance(data?.data?.data);



        } catch (err) {

        }
    };
    useEffect(() => {
        if (filterOption !== "") {
            handleFetchFilterdDataByDate()
        }
    }, [filterOption, fetchApi])
    const handleFetchSearch = async () => {
        try {
            let data = await axios({
                method: "get",
                url: `${process.env.API_URL}/client/accounts/payment-search/${search}`,
                headers: headers,
            });
            setPayment(data?.data?.data)



        } catch (err) {

        }
    };
    useEffect(() => {
        if (search?.length > 0) {
            handleFetchSearch()

        }
    }, [search])


    const newStartDate = moment(startDate).format("DD-MM-YYYY")
    const newEndDate = moment(endDate).format("DD-MM-YYYY")


    const handleFetchCustomDateSearch = async () => {
        try {
            let data = await axios({
                method: "get",
                url: `${process.env.API_URL}/client/accounts/payment-search-custom-datewise?start_date=${newStartDate}&end_date=${newEndDate}`,
                headers: headers,
            });
            setPayment(data?.data?.data.search)
            setBalance(data?.data?.data);


        } catch (err) {

        }
    };
    useEffect(() => {
        if (startDate != undefined && endDate != undefined) handleFetchCustomDateSearch()
    }, [startDate, endDate])


    //    reciver list 

    const [reciverList, setReciverList] = useState([])
    const [fetchReciverList, setFetchReciverList] = useState(false)

    const handleFetchReciverList = async () => {
        try {
            let data = await axios({
                method: "get",
                url: `${process.env.API_URL}/client/accounts/payor/list`,
                headers: headers,
            });
            setReciverList(data?.data?.data)


        } catch (err) {

        }
        setFetchReciverList(false)
    };
    useEffect(() => {
        handleFetchReciverList()
    }, [fetchReciverList])

    const handelFetchReciver = () => {
        setFetchReciverList(true)
    }

    // cetogory list 
    const [categoryList, setCategoryList] = useState([])
    const [fetchCategoryList, setFetchCategoryList] = useState(false)
    const handleFetchCategoryList = async () => {
        try {
            let data = await axios({
                method: "get",
                url: `${process.env.API_URL}/client/accounts/ledger/list`,
                headers: headers,
            });
            setCategoryList(data?.data?.data)


        } catch (err) {

        }

        setFetchCategoryList(false)
    };
    useEffect(() => {
        handleFetchCategoryList()
    }, [fetchCategoryList])

    const handelFetchCategory = () => {
        setFetchCategoryList(true)

    }




    // payment list 
    const [todayData, setTodayData] = useState([])
    const [paymentList, setPaymentList] = useState(todayData)
    const [fetchPaymentList, setFetchPaymentList] = useState(false)

    const handleFetchPaymentList = async () => {
        try {
            let data = await axios({
                method: "get",
                url: `${process.env.API_URL}/client/accounts/payment-method-show`,
                headers: headers,
            });
            setPaymentList(data?.data?.data)


        } catch (err) {

        }
    };
    useEffect(() => {
        handleFetchPaymentList()
    }, [fetchPaymentList])

    const handelFetchPaymentlist = () => {
        setFetchPaymentList(true)

    }

    let selectReciver = reciverList?.length === 0 ? [] : reciverList?.map(function (item) {
        return item;
    })

    let selectCatgory = categoryList?.length === 0 ? [] : categoryList?.map(function (item) {
        return item;
    })
    let selectPayment = paymentList?.length === 0 ? [] : paymentList?.map(function (item) {
        return item.name;
    })



    return (

        <>

            <section className='AccountDashboard boxShadow'>

                <div className="Selector d_flex">

                    <Button className={filterOption === 'today' && 'active'} onClick={() => setOptionFilter("today")}>Today</Button>
                    <Button className={filterOption === 'yesterday' && 'active'} onClick={() => setOptionFilter("yesterday")}>Yesterday</Button>
                    <Button className={filterOption === 'week' && 'active'} onClick={() => setOptionFilter("week")}>This Week</Button>
                    <Button className={filterOption === 'month' && 'active'} onClick={() => setOptionFilter("month")}>This Month</Button>



                    <div className='AccountDashboard accounting_modules_custom_date_range' >

                        <div className="FilterItem CustomDate dateRangePicker" >
                            <DateRangePicker
                                startDate={startDate}
                                endDate={endDate}
                                focus={focus}
                                onStartDateChange={setStartDate}
                                onEndDateChange={setEndDate}
                                locale={enGB}
                                modifiersClassNames={{ open: '-open' }}
                            >
                                {({ startDateInputProps, endDateInputProps }) => (
                                    <div className='date-range' style={{ left: '495px' }}>
                                        <span className='date-range_arrow' />
                                        <input
                                            className={'input'}
                                            {...endDateInputProps}
                                            {...startDateInputProps}
                                            placeholder='Custom Date Range'
                                            value={dateValue}
                                        />
                                    </div>
                                )}
                            </DateRangePicker>


                        </div>

                    </div>
                    {/* <Button style={{ margin: "0 18px" }} onClick={() => router.push('/account-report')}> Reports </Button> */}

                </div>

                <div className="Header">

                    {/* Item */}
                    <div className="HeaderItemContent">

                        <div className="HeaderItem d_flex">

                            <div className="img">
                                <img src="/images/account-plus.png" alt="" />
                            </div>

                            <div className="text">
                                <h5>Cash In</h5>
                                <h3><TbCurrencyTaka />
                                    {balance?.cashIn ? balance?.cashIn?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "00"}
                                </h3>
                            </div>

                            <div className="overlay">
                                <img src="/images/account-plus-overlay.png" alt="" />
                            </div>

                        </div>

                    </div>

                    {/* Item */}
                    <div className="HeaderItemContent">

                        <div className="HeaderItem Minus d_flex">

                            <div className="img">
                                <img src="/images/account-minus.png" alt="" />
                            </div>

                            <div className="text">
                                <h5>Cash Out</h5>
                                <h3><TbCurrencyTaka />
                                    {balance?.cashOut ? balance?.cashOut?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "00"}
                                </h3>
                            </div>

                            <div className="overlay">
                                <img src="/images/account-minus-overlay.png" alt="" />
                            </div>

                        </div>

                    </div>

                    {/* Item */}
                    <div className="HeaderItemContent">

                        <div className="HeaderItem Equal d_flex">

                            <div className="img">
                                <img src="/images/account-equal.png" alt="" />
                            </div>

                            <div className="text">
                                <h5>Balance</h5>
                                <h3><TbCurrencyTaka />

                                    {balance?.balance ? balance?.balance?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "00"}
                                </h3>
                            </div>

                            <div className="overlay">
                                <img src="/images/account-equal-overlay.png" alt="" />
                            </div>

                        </div>

                    </div>

                    {/* Item */}
                    <div className="HeaderItemContent">
                        <CashIn handelFetchPaymentlist={handelFetchPaymentlist} handleFetch={handleFetch} balanceFetch={balanceFetch} payment={payment} paymentList={paymentList} categoryList={categoryList} reciverList={reciverList} handelFetchCategory={handelFetchCategory} handelFetchReciver={handelFetchReciver} />
                    </div>

                    {/* Item */}
                    <div className="HeaderItemContent">
                        <CashOut handelFetchPaymentlist={handelFetchPaymentlist} handleFetch={handleFetch} balanceFetch={balanceFetch} payment={payment} paymentList={paymentList} categoryList={categoryList} reciverList={reciverList} handelFetchCategory={handelFetchCategory} handelFetchReciver={handelFetchReciver} />
                    </div>

                </div>

                {/* AccountTable */}
                <div className="AccountTable Table">

                    <div className="Filter d_flex d_justify">

                        <div className="FilterItem">
                            <select onChange={(e) => setOptionFilter(e.target.value)} name="">
                                <option value="">Select</option>
                                <option value="today">Today</option>
                                <option value="yesterday">Yesterday</option>
                                <option value="week">This Week</option>
                                <option value="month">This Month</option>
                            </select>
                        </div>

                        <div className="FilterItem">
                            <FilterReceverItem balanceFetch={balanceFetch} setBalance={setBalance} selectReciver={selectReciver} setPayment={setPayment} handleFetch={handleFetch} ></FilterReceverItem>
                        </div>

                        <div className="FilterItem">
                            <FilterCategoryItem balanceFetch={balanceFetch} setBalance={setBalance} selectCatgory={selectCatgory} setPayment={setPayment} handleFetch={handleFetch}></FilterCategoryItem>
                        </div>

                        <div className="FilterItem">
                            <FilterPaymentItem balanceFetch={balanceFetch} setBalance={setBalance} selectPayment={selectPayment} setPayment={setPayment} handleFetch={handleFetch}></FilterPaymentItem>
                        </div>

                        <div className="FilterItem">

                            <div className="Search">
                                <input type="text" placeholder='Search Here...' onKeyUp={e => setSearch(e.target.value)} />
                                <AiOutlineSearch />
                            </div>

                        </div>


                        {/* <div className="FilterItem">

                            <div className="Dropdown">
                                <Button> <Link href='/account-report'>Reports</Link> </Button>
                            </div>

                        </div> */}


                    </div>

                    <div className="Table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Bill No</th>
                                    <th>Date & Time</th>
                                    <th>Description</th>
                                    <th>Payable/Payor</th>
                                    <th>Category/Ledger</th>
                                    <th>Payment  Method</th>
                                    <th>Amount</th>
                                    <th>Balance</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {
                                    payment.length > 0 ? payment.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>#{item?.bill_no}</td>
                                                <td>
                                                     {/* {moment(item?.date).format("h:mm a")} */}
                                                   
                                                        {moment(item?.created_at).format("MMMM DD, YYYY")}
                                                   


                                                    {/* {moment(item?.created_at).calendar()} */}
                                                    </td>

                                                <Tooltip
                                                    title={item?.description}
                                                    placement="top-start"
                                                >
                                                    <td>
                                                        {item?.description?.length < 15 ? (
                                                            <>{item?.description}</>
                                                        ) : (
                                                            <>
                                                                {item?.description?.slice(
                                                                    0,
                                                                    13
                                                                )}
                                                                ...
                                                            </>
                                                        )}
                                                    </td>
                                                </Tooltip>
                                                {/* <td>{item?.description}</td> */}
                                                <td>{item?.payorName}</td>
                                                <td>{item?.ledgerName}</td>
                                                <td>{item?.payment_type}</td>
                                                <td style={item.status !== 'CashIn' ? { color: 'red' } : { color: 'green', fontWeight: 600 }}>
                                                    {item.status === 'CashIn' ? '+' : '-'}
                                                    {item?.amount.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                                </td>

                                                <td>{item?.balance?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td>

                                                    <div className="action">

                                                        <Button className='updateActionBtn'>
                                                            <AccountEdit id={item.id} payment={payment} handleFetch={handleFetch} balanceFetch={balanceFetch} paymentList={paymentList} categoryList={categoryList} reciverList={reciverList} />
                                                        </Button>

                                                        <Button onClick={() => deletePayment(item.id)} className='deleteActionBtn'>
                                                            <i className="flaticon-trash"></i>
                                                        </Button>

                                                    </div>

                                                </td>


                                            </tr>
                                        )
                                    })
                                        :

                                        (
                                            <tr>
                                                <td colSpan={20}>
                                                    <section className="MiddleSection">
                                                        <div className="MiddleSectionContent">
                                                            <div className="img">
                                                                <img src="/images/empty.png" alt="" />
                                                            </div>

                                                            <div className="text">
                                                                <p>Not Found</p>
                                                            </div>
                                                        </div>
                                                    </section>
                                                </td>
                                            </tr>
                                        )
                                }

                            </tbody>

                        </table>

                    </div>

                </div>

            </section>

        </>

    )

}

export default AccountDashboard
