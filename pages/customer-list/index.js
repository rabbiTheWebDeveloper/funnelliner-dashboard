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


const CustomerListPage = () => {

    const [active, setDefault] = useState('pending')

    const [orders, setOrders] = useState([])

    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [callCount, setCount] = useState(0)
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedValue, setSelectedValue] = useState(null)
    const [selectCourier, setSelectCourier] = useState(null)


    const [fetchApi, setFetch] = useState(false)
    const [order, setOrder] = useState({})
    const [search, setSearch] = useState(null)


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
    const handleFetch = () => {
        setFetch(true);
    }


    useEffect(() => {
        SuperFetch.get(`/customer/${active}/order/list`, { headers: headers },)
            .then(res => {
                if (res.data.success === true) {
                    setOrders(res.data?.data)
                    // setTotalPage(res.data?.last_page)
                }
            }).catch((e) => {

            })

        setFetch(false)

    }, [active])


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
        body: uniqueCustomer?.map((product, index) => [index + 1, product?.name, product?.phone, product?.address, moment(product?.created_at).format(
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

    const newCustomer = Array.isArray(orders) ? orders?.filter(obj => obj.order !== 0) : [];

    return (
        <div>
            <section className={style.CustomerList}>

                {/* header */}
                <HeaderDescription headerIcon={'flaticon-people'} title={'Customer List'} subTitle={'List  Of  Customers'} search={false}></HeaderDescription>

                <Container maxWidth="sm">

                    <div className="">

                        <div className={style.CustomerListContent}>

                            <div className="CommonTab">
                                <Box sx={{ width: "100%", typography: "body1" }}>
                                    <BootstrapButton className={active === 'pending' ? 'filterActive' : ''}
                                        onClick={e => setDefault('pending')}>Pending Order </BootstrapButton>
                                    <BootstrapButton className={active === 'followup' ? 'filterActive' : ''}
                                        onClick={e => setDefault('followup')}>Follow Up Order </BootstrapButton>
                                    <BootstrapButton className={active === 'confirm' ? 'filterActive' : ''}
                                        onClick={e => setDefault('confirm')}>Confirm Order </BootstrapButton>
                                    <BootstrapButton className={active === 'cancel' ? 'filterActive' : ''}
                                        onClick={e => setDefault('cancel')}>Cancel Order </BootstrapButton>

                                    <BootstrapButton className={active === 'return' ? 'filterActive' : ''}
                                        onClick={e => setDefault('return')}>Order Return </BootstrapButton>
                                </Box>
                            </div>

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
                        </div>

                    </div>

                    <div className="Table" id="downlode_customer_list">
                        <div className="DataTable">

                            {/* DataTableRow */}
                            <div className="DataTableRow">

                                <div className="DataTableColum">
                                    <h3>SL</h3>
                                </div>

                                <div className="DataTableColum">
                                    <h3>Customer Name</h3>
                                </div>

                                <div className="DataTableColum Address">
                                    <h3>Contact No.</h3>
                                </div>

                                <div className="DataTableColum">
                                    <h3>Address</h3>
                                </div>

                                <div className="DataTableColum">
                                    <h3>Total Order</h3>
                                </div>


                            </div>

                            {/* DataTableRow */}
                            {/* item */}

                            {newCustomer.length > 0 ? newCustomer.map((order, index) => {
                                return (
                                    <div className="DataTableRow" key={index}>
                                        <div className="DataTableColum">
                                            <div className="number">{index + 1}</div>
                                        </div>

                                        <div className="DataTableColum">

                                            <div className="Name">
                                                <Tooltip
                                                    title={order?.name}
                                                    placement="top-start"
                                                >
                                                    <>
                                                        {order?.name.length < 15 ? (
                                                            <span>{order?.name}</span>
                                                        ) : (
                                                            <>
                                                                {order?.name.slice(0, 13)}
                                                                ...
                                                            </>
                                                        )}
                                                    </>
                                                </Tooltip>
                                            </div>
                                        </div>






                                        <div className="DataTableColum">
                                            <div className="TotalPrice">
                                                {order?.phone}

                                            </div>

                                        </div>
                                        <div className="DataTableColum">
                                            <div className="TotalPrice">
                                                {order?.address}


                                            </div>

                                        </div>


                                        <div className="DataTableColum">
                                            <div className="TotalPrice">

                                                {order?.order}
                                            </div>
                                        </div>
                                    </div>
                                )

                            }) :
                                (
                                    <table>
                                        <tr>
                                            <td colSpan={14}>
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
                                    </table>
                                )}


                        </div>

                    </div>
                    <Paginator count={totalPage} page={currentPage} onChange={handleChange} showFirstButton
                        showLastButton variant="outlined" />

                </Container>

            </section>

        </div>

    )

}

export default withAuth(CustomerListPage, {
    isProtectedRoute: true
});