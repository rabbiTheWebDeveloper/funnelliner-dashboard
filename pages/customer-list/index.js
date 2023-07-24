import { Box, Button, Container, Pagination, TextField, Tooltip } from "@mui/material";
import { styled } from '@mui/material/styles';
import download from 'downloadjs';
import { saveAs } from 'file-saver';
import * as htmlToImage from 'html-to-image';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import _ from 'lodash';
import moment from "moment";
import { useEffect, useState } from "react";
import 'react-nice-dates/build/style.css';
import * as XLSX from 'xlsx';
import SuperFetch from "../../hook/Axios";
import withAuth from '../../hook/PrivateRoute';
import { headers } from "../api";

import HeaderDescription from "../../Components/Common/HeaderDescription/HeaderDescription";

import style from './customerList.module.css';


const index = () => {

    const [active, setDefault] = useState('pending')
    const [products, setProducts] = useState([])
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [orders, setOrders] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [callCount, setCount] = useState(0)
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedValue, setSelectedValue] = useState(null)
    const [selectCourier, setSelectCourier] = useState(null)
    const [selectCourierStatus, setSelectCourierStatus] = useState(null)
    const [advancedPaymentConfig, setAdvancedPaymentConfig] = useState(false)
    const [showPicker, setShowPicker] = useState(false);
    const [fetchApi, setFetch] = useState(false)
    const [order, setOrder] = useState({})
    const [search, setSearch] = useState(null)
    const [viewOrderModal, setViewOrderModalOpen] = useState(false)

    const BootstrapButton = styled(Button)({
        backgroundColor: '#fff',
        border: '1px solid #894bca',
        color: '#894bca',
        marginRight: '10px',
        '&:hover': {
            backgroundColor: '#894bca',
            borderColor: '#894bca',
            boxShadow: 'none',
            color: '#fff'
        }
    })

    const FilterDateInput = styled(TextField)({
        '& .MuiInputBase-root': {
            height: '42px',
            marginRight: '10px',
            width: '250px'
        },
    })

    const Paginator = styled(Pagination)({
        '& .MuiPagination-ul': {
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            marginTop: '10px'
        }
    })

    const menuItemHoverStyle = {
        '&:hover': {
            backgroundColor: '#894bca',
            color: '#fff'
        },
        '&.Mui-selected': {
            backgroundColor: '#894bca',
            color: '#fff'
        }
    };


    const handleOpenModal = () => {
        setModalOpen(true)
    }
    const handleCloseModal = () => {
        setModalOpen(false)
    }

    const handleChange = (event, value) => {
        setCurrentPage(value);
        setCount(1)
    };

    const handleOpenDialog = () => {
        setOpenDialog(true)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
    }

    const formatDate = (date) => {
        if (!date) return "";
        return date.toLocaleDateString();
    }


    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };




    const handleCloseViewModal = () => {
        setViewOrderModalOpen(false)
    }




    const params = {
        type: active,
        page: currentPage,
        date: selectedValue,
        search: search,
        provider: selectCourier,
        courier_status: selectCourierStatus,
    }

    const handleFetch = () => {
        setFetch(true);
    }


    useEffect(() => {
        SuperFetch.get('/client/orders', { params: params, headers: headers },)
            .then(res => {
                if (res.data.success === true) {
                    setOrders(res.data?.data)
                    setTotalPage(res.data?.last_page)
                }
            }).catch((e) => {

            })

        if (callCount === 0) {
            SuperFetch.get('/client/products', { headers: headers }).then(res => {
                if (res.data.success === true) {
                    setProducts(res.data?.data)
                }
            })
            SuperFetch.get('/client/settings/advance-payment/status', { headers: headers })
                .then(res => {
                    if (res.data.success === true) {
                        setAdvancedPaymentConfig(res.data?.data?.advanced_payment)
                    }
                })
        }

        setFetch(false)

    }, [active, currentPage, fetchApi, selectCourier, selectCourierStatus, search])



    const uniqueCustomer = orders.reduce((acc, current) => {
        const existingContact = acc.find(contact => contact.phone === current.phone);
        if (!existingContact) {
            return [...acc, current];
        } else {
            return acc;
        }
    }, []);


    const orderCheck = (number) => {

        return orders.filter(product => product.phone === number).length



    }




    const selectedData = uniqueCustomer?.map(obj => _.pick(obj, ['customer_name', 'phone', 'address', 'created_at']))

    // excel file genaretor 
    // const generateExcelFile = (data) => {
    //     const worksheet = XLSX.utils.json_to_sheet(data);

    //     // Example: Applying bold font to the header row
    //     const headerCellStyle = { font: { bold: true } };
    //     const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
    //     for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
    //         const headerCell = XLSX.utils.encode_cell({ r: headerRange.s.r, c: col });
    //         worksheet[headerCell].s = headerCellStyle;
    //     }

    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    //     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //     const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    //     return file;
    // };

    // const downloadExcelFile = async () => {
    //     const file = generateExcelFile(selectedData);
    //     saveAs(file, 'data.xlsx');
    // };

    const generateExcelFile = (data) => {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Applying a stylish design to the cells
        const headerStyle = { font: { bold: true }, fill: { fgColor: { rgb: "CCCCCC" } } };
        const dataStyle = { fill: { fgColor: { rgb: "FFFFFF" } } };

        // Applying the style to the header row
        const headerRange = XLSX.utils.decode_range(worksheet['!ref']);
        for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
            const headerCell = XLSX.utils.encode_cell({ r: headerRange.s.r, c: col });
            worksheet[headerCell].s = headerStyle;
        }

        // Applying the style to data cells
        const dataRange = XLSX.utils.decode_range(worksheet['!ref']);
        for (let row = dataRange.s.r + 1; row <= dataRange.e.r; row++) {
            for (let col = dataRange.s.c; col <= dataRange.e.c; col++) {
                const cell = XLSX.utils.encode_cell({ r: row, c: col });
                worksheet[cell].s = dataStyle;
            }
        }

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        return file;
    };

    const downloadExcelFile = async () => {
        const file = generateExcelFile(selectedData);
        saveAs(file, 'data.xlsx');
    };










    // const generateExcelFile = (data) => {
    //     const worksheet = XLSX.utils.json_to_sheet(data);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    //     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //     const file = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    //     return file;
    // };

    // const downloadExcelFile = async () => {
    //     const file = generateExcelFile(selectedData);
    //     saveAs(file, 'data.xlsx');
    // };



    const downlodeImage = () => {
        htmlToImage.toPng(document.getElementById('downlode_customer_list'))
            .then(function (dataUrl) {
                download(dataUrl, 'customer_list.jpg');
            });
    }


    const doc = new jsPDF();;

    doc.autoTable({
        theme: 'grid',
        head: [['SL.', 'Customer Name', 'Contact No.', 'Address.', 'Purchase Date']],
        body: uniqueCustomer?.map((product, index) => [index + 1, product?.customer_name, product?.phone, product?.address, moment(product?.created_at).format(
            "DD-MM-YYYY"
        )]),
        beforePageContent: function (data) {
            const title = '';
            const pageWidth = doc.internal.pageSize.width;
            const titleWidth = doc.getStringUnitWidth(title) * 14 / doc.internal.scaleFactor;
            const titlePosition = (pageWidth - titleWidth) / 2;

            doc.text(title, titlePosition, 8, { align: 'center' });
        }
    });


    const handelPdf = () => {
        doc.save('confirmOrderCustomer.pdf');

    }


    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        // Perform corresponding action based on the selected option
        switch (event.target.value) {
            case 'pdf':
                handelPdf();
                break;
            case 'image':
                downlodeImage();
                break;
            case 'excel':
                downloadExcelFile();
                break;
            default:
                break;
        }
    };

    return (
        <div>
            <section className={style.CustomerList}>

                {/* header */}
                <HeaderDescription headerIcon={'flaticon-people'} title={'Customer List'} subTitle={'List  Of  Customers'} search={false}></HeaderDescription>

                <Container maxWidth="sm">

                    <div className="boxShadow">

                        <div className={style.CustomerListContent}>

                            <div className="CommonTab">
                                <Box sx={{ width: "100%", typography: "body1" }}>
                                    <BootstrapButton className={active === 'pending' ? 'filterActive' : ''}
                                        onClick={e => setDefault('pending')}>Pending Order Customers</BootstrapButton>
                                    <BootstrapButton className={active === 'follow_up' ? 'filterActive' : ''}
                                        onClick={e => setDefault('follow_up')}>Follow Up Order Customers</BootstrapButton>
                                    <BootstrapButton className={active === 'confirmed' ? 'filterActive' : ''}
                                        onClick={e => setDefault('confirmed')}>Confirm Order Customers</BootstrapButton>
                                    <BootstrapButton className={active === 'cancelled' ? 'filterActive' : ''}
                                        onClick={e => setDefault('cancelled')}>Cancel Order Customers</BootstrapButton>

                                    <BootstrapButton className={active === 'returned' ? 'filterActive' : ''}
                                        onClick={e => setDefault('returned')}>Order Return Customers</BootstrapButton>
                                </Box>
                            </div>

                            <div className={style.select}>

                                <select name="downloadReport" value={selectedOption} onChange={handleOptionChange}>
                                    <option value="" disabled>
                                        Download Report
                                    </option>
                                    <option value="pdf">As PDF</option>
                                    <option value="image">As Image</option>
                                    <option value="excel">As Excel</option>
                                </select>

                                {/* <Button
                                id='basic-button'
                                aria-controls={open ? "basic-menu" : undefined}
                                aria-haspopup='true'
                                aria-expanded={open ? "true" : undefined}
                                onClick={handleClick}
                            >
                                <h6 className='d_flex'>
                                    Download Report
                                    <div className='svg'>
                                        <AiFillCaretDown />
                                    </div>
                                </h6>
                            </Button>
                            <Menu
                                id='basic-menu'
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    "aria-labelledby": "basic-button",
                                }}
                            >
                                <MenuItem onClick={() => {
                                    handelPdf();
                                    handleClose()
                                }}>As Pdf</MenuItem>
                                <MenuItem onClick={() => {
                                    downlodeImage();
                                    handleClose()
                                }}>As Image</MenuItem>
                                <MenuItem onClick={() => {
                                    downloadExcelFile();
                                    handleClose()
                                }}>As Excel</MenuItem>
                            </Menu> */}
                            </div>

                        </div>

                    </div>

                    <div className="Table" id="downlode_customer_list">
                        <table>
                            <thead>
                                <tr>
                                    <th>SL</th>
                                    <th>Customer Name</th>
                                    <th>Contact No.</th>
                                    <th>Address.</th>
                                    <th>Total Order </th>
                                    <th>Last Purchase Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {uniqueCustomer.length > 0 ? uniqueCustomer.map((order, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>

                                                <Tooltip
                                                    title={order?.customer_name}
                                                    placement="top-start"
                                                >
                                                    <span>
                                                        {order?.customer_name?.length <
                                                            12 ? (
                                                            <span>
                                                                {order?.customer_name}
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                {order?.customer_name?.slice(
                                                                    0,
                                                                    12
                                                                )}
                                                                ...
                                                            </span>
                                                        )}
                                                    </span>
                                                </Tooltip>
                                            </td>
                                            <td>{order?.phone}</td>
                                            <td>

                                                <Tooltip
                                                    title={order.address}
                                                    placement="top-start"
                                                >
                                                    <span>
                                                        {order.address?.length <
                                                            20 ? (
                                                            <span>
                                                                {order.address}
                                                            </span>
                                                        ) : (
                                                            <span>
                                                                {order.address?.slice(
                                                                    0,
                                                                    20
                                                                )}
                                                                ...
                                                            </span>
                                                        )}
                                                    </span>
                                                </Tooltip>
                                            </td>
                                            <td>{orderCheck(order?.phone)}</td>
                                            <td>

                                                {moment(
                                                    order?.created_at
                                                ).format("DD-MM-YYYY")}</td>

                                        </tr>
                                    )
                                })
                                    : (<tr>
                                        <td colSpan={advancedPaymentConfig ? 15 : 13}>
                                            <sction className="MiddleSection" style={{ padding: '20px' }}>
                                                <div className="MiddleSectionContent">
                                                    <div className="img">
                                                        <img src="/images/empty.png" alt="error" />
                                                    </div>
                                                    <div className="text"><p>No Data Available</p></div>
                                                </div>
                                            </sction>
                                        </td>
                                    </tr>)
                                }

                            </tbody>
                        </table>

                    </div>
                    <Paginator count={totalPage} page={currentPage} onChange={handleChange} showFirstButton
                        showLastButton variant="outlined" />

                </Container>

            </section>

        </div>

    )

}

export default withAuth(index, {
    isProtectedRoute: true
});