
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Button, Menu, MenuItem } from '@mui/material';
import Fade from '@mui/material/Fade';
import axios from 'axios';
import { enGB } from 'date-fns/locale';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { BsCloudArrowDown } from 'react-icons/bs';
import { TbCurrencyTaka } from 'react-icons/tb';
import { DateRangePicker, END_DATE } from 'react-nice-dates';
import 'react-nice-dates/build/style.css';
import * as XLSX from 'xlsx';
import { headers } from '../../pages/api';
import FilterCategoryItem from './FilterCategoryItem';
import FilterPaymentItem from './FilterPaymentItem';
import FilterReceverItem from './FilterReceverItem';



const AccountExcelReport = () => {
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [fetchApi, setFetch] = useState(false)
    const [payment, setPayment] = useState([]);
    const [balance, setBalance] = useState({});
    const [update, setUpdate] = useState(false)
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    let top100Films = payment?.length === 0 ? [] : payment?.map(function (item) {
        return { title: item.payment_recevier };
    })
    // const top100Films = [
    //     { title: 'The Shawshank', year: 1994 },
    //     { title: 'The Godfather', year: 1972 },
    //     { title: 'The Godfather: Part II', year: 1974 },
    //     { title: 'The Dark Knight', year: 2008 },
    //     { title: '12 Angry Men', year: 1957 },
    //     { title: "Schindler", year: 1993 },
    //     { title: 'P' }
    // ];

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    // Custom Date
    const formatDate = (date) => {
        if (!date) return "";
        return date.toLocaleDateString();
    }
    const dateValue = startDate && endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : "";
    const handleFetch = () => {
        setFetch(true);
    }
    const handleFetchEditInfo = async () => {
        try {
            let data = await axios({
                method: "get",
                url: `${process.env.API_URL}/client/accounts/payment-list`,
                headers: headers,
            });
            setPayment(data?.data?.data);
        } catch (err) {

        }
    };

    useEffect(() => {
        handleFetchEditInfo();
        setFetch(false)
    }, [fetchApi]);



    const balanceFetch = () => {
        setUpdate(true);
    }



    const handleBalanceInfo = async () => {
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
        handleBalanceInfo();
        setUpdate(false)

    }, [update]);

    const doc = new jsPDF();
    doc.autoTable({
        theme: 'grid',
        head: [['SL.', 'Bill No', 'Date & Time', 'Description', 'Payable/Receivable', 'Category/Ledger', "Status", 'Payment Method', 'Transaction', 'Balance']],
        body: payment?.map((item, index) => [index + 1, item?.bill_no, moment(item?.created_at).format("DD-MM-YYYY"), item?.description, item?.payorName, item?.ledgerName, item?.payment_type, item?.status, item?.status === 'CashIn' ? '+' + item?.amount?.toFixed(0)?.replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '-' + item?.amount?.toFixed(0)?.replace(/\B(?=(\d{3})+(?!\d))/g, ","), balance?.balance]),
        beforePageContent: function (data) {
            const title = '';
            const pageWidth = doc.internal.pageSize.width;
            const titleWidth = doc.getStringUnitWidth(title) * 14 / doc.internal.scaleFactor;
            const titlePosition = (pageWidth - titleWidth) / 2;

            doc.text(title, titlePosition, 8, { align: 'center' });
        }
    });

    const handelPdf = () => {
        doc.save('data.pdf');

    }

    // excel 
    const generateExcelFile = (data) => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        return file;
    };
    const downloadExcelFile = async () => {
        const file = generateExcelFile(payment);
        saveAs(file, 'data.xlsx');
    };



    const [selectedItems, setSelectedItems] = useState([]);

    const handleItemSelected = (event, value) => {
        setSelectedItems(value);
    };

    const filterData = (inputValue) => {
        return top100Films.filter((item) => item.title.toLowerCase().includes(inputValue.toLowerCase()));
    };

    useEffect(() => {
        const filteredItems = payment?.filter(item => selectedItems?.title?.includes(item?.payment_recevier));
    

    }, [selectedItems])

    const newStartDate = moment(startDate).format("DD-MM-YYYY")
    const newEndDate = moment(endDate).format("DD-MM-YYYY")


    const handleFetchCustomDateSearch = async () => {
        try {
            let data = await axios({
                method: "get",
                url: `${process.env.API_URL}/client/accounts/payment-search-custom-datewise?start_date=${newStartDate}&end_date=${newEndDate}`,
                headers: headers,
            });
            setPayment(data?.data?.data)
      

        } catch (err) {

        }
    };
    useEffect(() => {
        if (startDate != undefined && endDate != undefined) handleFetchCustomDateSearch()
    }, [startDate, endDate])

    //    reciver list 

    const [reciverList, setReciverList] = useState([])

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
    };
    useEffect(() => {
        handleFetchReciverList()
    }, [])

    // cetogory list 
    const [categoryList, setCategoryList] = useState([])
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
    };
    useEffect(() => {
        handleFetchCategoryList()
    }, [])


    // payment list 

    const [paymentList, setPaymentList] = useState([])

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
    }, [])

    let selectReciver = reciverList?.length === 0 ? [] : reciverList?.map(function (item) {
        return item;
    })

    let selectCatgory = categoryList?.length === 0 ? [] : categoryList?.map(function (item) {
        return item
    })
    let selectPayment = paymentList?.length === 0 ? [] : paymentList?.map(function (item) {
        return item.payment_method;
    })



    return (

        <>

            <section className='AccountDashboard AccountPdfReport'>

                <div className="Selector">

                    <h4>Transactions Report </h4>

                </div>

                <div className="Header d_flex">

                    {/* Item */}
                    <div className="HeaderItemContent">

                        <div className="HeaderItem d_flex">

                            <div className="img">
                                <img src="/images/account-plus.png" alt="" />
                            </div>

                            <div className="text">
                                <h5>Cash In</h5>
                                <h3><TbCurrencyTaka />
                                    {balance?.cashIn ? balance?.cashIn.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "00"}

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
                                    {balance?.cashOut ? balance?.cashOut.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "00"}
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
                                <h5>Today’s Balance</h5>
                                <h3><TbCurrencyTaka />
                                    {balance?.balance ? balance?.balance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "00"} </h3>
                            </div>

                            <div className="overlay">
                                <img src="/images/account-equal-overlay.png" alt="" />
                            </div>

                        </div>

                    </div>

                </div>

                {/* AccountTable */}

                <div className="AccountTable">

                    <div className="Filter d_flex">

                        <h3>Accounting Modules</h3>

                        <div className="FilterButton FilterItem">

                            <Button className='active'>All Item</Button>

                        </div>

                        <div className="FilterItem">
                            <FilterReceverItem balanceFetch={balanceFetch} setBalance={setBalance} selectReciver={selectReciver} setPayment={setPayment} handleFetch={handleFetch}></FilterReceverItem>

                        </div>

                        <div className="FilterItem">
                            <FilterCategoryItem balanceFetch={balanceFetch} setBalance={setBalance} selectCatgory={selectCatgory} setPayment={setPayment} handleFetch={handleFetch}></FilterCategoryItem>

                        </div>

                        <div className="FilterItem">
                            <FilterPaymentItem balanceFetch={balanceFetch} setBalance={setBalance} selectPayment={selectPayment} setPayment={setPayment} handleFetch={handleFetch}></FilterPaymentItem>
                        </div>

                        <div className="FilterItem">
                            <DateRangePicker






                                startDate={startDate}
                                endDate={endDate}
                                onStartDateChange={setStartDate}
                                onEndDateChange={setEndDate}

                                // format='dd MMM yyyy'
                                locale={enGB}
                            >
                                {({ startDateInputProps, endDateInputProps, focus }) => (
                                    <div className='date-range'>
                                        <span className='date-range_arrow' />
                                        <input
                                            className={'input' + (focus === END_DATE ? ' -focused' : '')}
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

                    <div className="Table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Bill No </th>
                                    <th>Date & Time </th>
                                    <th>Description</th>
                                    <th>Payable/Receivable</th>
                                    <th>Category/Ledger</th>
                                    <th>Payment  Method</th>
                                    <th>Transaction</th>
                                    <th>Balance</th>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    payment.length > 0 ? payment.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>#{item?.bill_no}</td>
                                                <td>{moment(item?.created_at).calendar()}</td>
                                                <td>{item?.description}</td>
                                                <td>{item?.payorName}</td>
                                                <td>{item?.ledgerName}</td>

                                                <td>{item?.payment_type}</td>
                                                <td>

                                                    {item.status === 'CashIn' ? '+' + item?.amount?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '-' + item?.amount?.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</td>
                                                <td>
                                                    {item?.balance ? item?.balance.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "00"}
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
                                                                <img src="/error.svg" alt="" />
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

                        <div className="DownloadPdf">
                            <div className="Dropdown">

                                <Button
                                    id="fade-button"
                                    aria-controls={open ? 'fade-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                >
                                    Download <BsCloudArrowDown />
                                </Button>
                                <Menu
                                    id="fade-menu"
                                    MenuListProps={{
                                        'aria-labelledby': 'fade-button',
                                    }}
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    TransitionComponent={Fade}
                                >
                                    <MenuItem onClick={() => {
                                        handelPdf();
                                        handleClose()
                                    }}> Download PDF   <img src="/images/pdf.png" alt="" /> </MenuItem>
                                    <MenuItem onClick={() => {
                                        downloadExcelFile();
                                        handleClose()
                                    }}> Download Excel  <img src="/images/xls.png" alt="" /> </MenuItem>
                                </Menu>

                            </div>
                        </div>

                    </div>

                </div>

            </section>

        </>

    )

}

export default AccountExcelReport
