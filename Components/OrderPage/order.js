import { Box, Button, Container, Grid, OutlinedInput, Pagination, TextField, Tooltip } from "@mui/material";

import { styled } from '@mui/material/styles';
import axios from "axios";
import { enGB } from 'date-fns/locale';
import moment from 'moment';
import getConfig from "next/config";
import Link from "next/link";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { DateRangePicker } from 'react-nice-dates';

import 'react-nice-dates/build/style.css';
import Swal from "sweetalert2";
import EditOrderModal from "../../Components/OrderPage/EditOrder";
import OrderModal from "../../Components/OrderPage/Modal";
import Note from "../../Components/OrderPage/Note";
import OrderUpdateModal from "../../Components/OrderPage/OrderUpdateModal";
import { baseUrl } from "../../constant/constant";
import SuperFetch from "../../hook/Axios";
import withAuth from '../../hook/PrivateRoute';

import CourierModal from "../../Components/CourierPage/CourierModal";
import Capitalized from "../../constant/capitalized";
import { useToast } from "../../hook/useToast";
import { headers } from "../api";

import HeaderDescription from "../../Components/Common/HeaderDescription/HeaderDescription";
import SmallLoader from "../../Components/SmallLoader/SmallLoader";
import useLoading from "../../hook/useLoading";


const Order = ({ orderUpdate }) => {
    const showToast = useToast();
    const [isLoading, startLoading, stopLoading] = useLoading()
    const [active, setDefault] = useState('pending')
    const [products, setProducts] = useState([])
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [orders, setOrders] = useState([])
    const [orderId, setOrderId] = useState("")
    const [orderStatus, setOrderStatus] = useState("")
    const [modalOpen, setModalOpen] = useState(false)
    const [modalOpenUpdate, setModalOpenUpdate] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPage, setTotalPage] = useState(1)
    const [callCount, setCount] = useState(0)
    const [openDialog, setOpenDialog] = useState(false)
    const [selectedValue, setSelectedValue] = useState(null)
    const [selectCourier, setSelectCourier] = useState(null)
    const [selectCourierStatus, setSelectCourierStatus] = useState(null)
    const [advancedPaymentConfig, setAdvancedPaymentConfig] = useState(false)
    const [holdOnConfig, setHoldOnConfig] = useState(false)
    const [showPicker, setShowPicker] = useState(false);
    const [fetchApi, setFetch] = useState(false)
    const [order, setOrder] = useState({})
    const [viewOrderModal, setViewOrderModalOpen] = useState(false)
    const [update, setUpdate] = useState(false)
    const [search, setSearch] = useState(null)
    const [followUpChange, setFollowUpInputChange] = useState("")
    const [courierModal, setCourierModal] = useState(false)
    const router = useRouter()

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

    const pendingStatus = [
        { item: 'Pending', value: 'pending' },
        { item: 'Follow Up', value: 'follow_up' },
        { item: 'Confirmed', value: 'confirmed' },
        { item: 'Cancelled', value: 'cancelled' },

    ]
    if (holdOnConfig) {
        pendingStatus.push({ item: 'Hold On', value: 'hold_on' });
    }


    const followUpStatus = [
        { item: 'Follow Up', value: 'follow_up' },
        { item: 'Confirmed', value: 'confirmed' },
        { item: 'Cancelled', value: 'cancelled' },
    ]
    
    const holdOnStatus = [
        { item: 'Follow Up', value: 'follow_up' },
        { item: 'Confirmed', value: 'confirmed' },
        { item: 'Cancelled', value: 'cancelled' },
    ]
    if (holdOnConfig) {
        followUpStatus.push({ item: 'Hold On', value: 'hold_on' });
    }

    const couriers = [
        { item: 'Office Delivery', value: 'office_delivery' },
        { item: 'SteadFast', value: 'steadfast' },
        { item: 'Pathao', value: 'pathao' },
    ]

    const steadfast = [
        { item: 'in_review', value: 'In Review' },
        { item: 'pending', value: 'Pending' },
        { item: 'hold', value: 'Hold' },
        { item: 'cancelled', value: 'Cancelled' },
        { item: 'delivered', value: 'Delivered' },
        { item: 'cancelled_approval_pending', value: 'Cancel' },
        { item: 'unknown_approval_pending', value: 'Need Approval' },
        // { item: 'partial_delivered_approval_pending', value: 'Partial Delivered' },
        { item: 'delivered_approval_pending', value: 'Delivered' },
        { item: 'partial_delivered', value: 'Partial Delivered' },
        { item: 'unknown', value: 'Unknown' }
    ]
    const pathao = [
        { item: 'Pickup_Requested', value: 'Pickup Requested' },
        { item: 'Assigned_for_Pickup', value: 'Assigned For Pickup' },
        { item: 'Picked', value: 'Picked' },
        { item: 'Pickup_Failed', value: 'Pickup Failed' },
        { item: 'Pickup_Cancelled', value: 'Pickup Cancelled' },
        { item: 'At_the_Sorting_HUB', value: 'At The Sorting HUB' },
        { item: 'In_Transit', value: 'In Transit' },
        { item: 'Received_at_Last_Mile_HUB', value: 'Received At Last Mile HUB' },
        { item: 'Assigned_for_Delivery', value: 'Assigned For Delivery' },
        { item: 'Delivered', value: 'Delivered' },
        { item: 'Partial_Delivery', value: 'Partial Delivery' },
        { item: 'Return', value: 'Return' },
        { item: 'Delivery_Failed', value: 'Delivery Failed' },
        { item: 'On_Hold', value: 'On Hold' },
        { item: 'Payment_Invoice', value: 'Payment Invoice' },
    ]

    const handleOpenModal = () => {
        setModalOpen(true)
    }
    const handleCloseModal = () => {
        setModalOpen(false)
    }
    const handleCloseOrderUpdateModal = () => {
        setModalOpenUpdate(false)
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

    const dateValue = startDate && endDate ? `${formatDate(startDate)} - ${formatDate(endDate)}` : "";

    const handleSelected = (value) => {
        setFollowUpInputChange(value)
        setOpenDialog(false)
        if (value === 'custom') {
            setShowPicker(true);
        } else {
            setShowPicker(false);
        }
        setSelectedValue(value)
    }

    const handleCloseViewModal = () => {
        setViewOrderModalOpen(false)
    }

    const handleCourierTypeChange = (e) => {
        setSelectCourier(e.target.value)
    }
    const handleCourierStatus = (e) => {
        setSelectCourierStatus(e.target.value)
    }
    const handleFilterStatusChange = (value) => {
        setSelectCourier(null)
        setSelectCourierStatus(null)
        setDefault(value)
    }

    const handleCourierModalOpen = () => {
        setCourierModal(true)
    }
    const handleCourierModalClose = () => {
        setCourierModal(false)
    }


    const params = {
        type: active,
        page: currentPage,
        date: selectedValue,
        provider: selectCourier,
        courier_status: selectCourierStatus,
        search: search,
        start_date: startDate,
        end_date: endDate,
        filter_date: selectedValue,
    }
    const [statusChangeLoading, setStatusChangeLoading] = useState(false)
    const handleStatusChange = (event, id) => {
        startLoading()
        const params = {
            order_id: id,
            status: event.target.value,
        }
        SuperFetch.post('/client/orders/status/update', params, { headers: headers })
            .then(res => {
                toast.success(res.data?.message, { position: 'top-right' })
                orderUpdate()
            }).catch(error => {
                if (error.response?.data?.msg?.status[0]) {
                    toast.error(error.response?.data?.msg?.status[0], { position: 'top-right' })
                }
                toast.error('Internal Server Error', { position: 'top-right' })
            })
        setTimeout(() => {
            setFetch(true)
            orderUpdate()
            stopLoading()
        }, 1000)
    }

    const handleAdvancedPayment = (event, id) => {


        if (event.key === "Enter" && event.target.value > 0) {
            // debugger
            SuperFetch.post(`/client/order/advance-payment/${id}/update`, { advanced: event.target.value }, { headers: headers })
                .then(res => {
                    toast.success(res.data?.message, { position: 'top-right' })
                    setFetch(true);
                }).catch(error => {
                    toast.error('Something went wrong please wait for some time', { position: 'top-right' })
                })
        } else if (event.key === "Enter" && event.target.value === '') {
            SuperFetch.post(`/client/order/advance-payment/${id}/update`, { advanced: "0" }, { headers: headers })
                .then(res => {
                    toast.success(res.data?.message, { position: 'top-right' })
                    setFetch(true);
                    handleFetch()
                }).catch(error => {
                    toast.error('Something went wrong please wait for some time', { position: 'top-right' })
                })
        }
    }

    const handleDiscount = (event, id, type) => {
        if (event.key === "Enter" && event.target.value > 0) {
            SuperFetch.post(`/client/order/discount/${id}/update`, {
                discount: event.target.value,
                type: type
            }, { headers: headers })
                .then(res => {
                    toast.success(res.data?.message, { position: 'top-right' })

                    setFetch(true)
                }).catch(error => {
                    toast.error('Something went wrong please wait for some time', { position: 'top-right' })
                })
        } else if (event.key === "Enter" && event.target.value === '') {
            SuperFetch.post(`/client/order/discount/${id}/update`, {
                discount: "0",
                type: type
            }, { headers: headers })
                .then(res => {
                    toast.success(res.data?.message, { position: 'top-right' })

                    setFetch(true)
                }).catch(error => {
                    toast.error('Something went wrong please wait for some time', { position: 'top-right' })
                })
        }
    }
    const handleFetch = () => {
        setFetch(true);
    }

    const handleNote = (event, id, type) => {
        if (event.key === "Enter") {
            SuperFetch.post(`/client/order/note/${id}/update`, {
                note: event.target.value,
                type: type
            }, { headers: headers })
                .then(res => {
                    toast.success(res.data?.message, { position: 'top-right' })
                }).catch(error => {
                    toast.error('Something went wrong please wait for some time', { position: 'top-right' })
                }
                )
        }
    }

    const handleOrderDetails = (event, id) => {
        event.preventDefault();
        SuperFetch.get(`/client/orders/${id}`, { headers: headers })
            .then(res => {
                setViewOrderModalOpen(true)
                setOrder(res.data.data)
                handleFetch()
            }).catch(error => {
                toast.error('Something went wrong please wait for some time', { position: 'top-right' })
            })
    }

    const handleOrderUpdate = (event, id) => {
        event.preventDefault();
        SuperFetch.get(`/client/orders/${id}`, { headers: headers })
            .then(res => {
                setModalOpenUpdate(true)
                setOrder(res.data.data)
                handleFetch()
            }).catch(error => {
                toast.error('Something went wrong please wait for some time', { position: 'top-right' })
            })
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
            SuperFetch.get('/client/settings/hold-on/status', { headers: headers })
                .then(res => {
                    if (res.data.success === true) {
                        setHoldOnConfig(res.data?.data?.hold_on)
                    }
                })
        }

        setFetch(false)

    }, [followUpChange, active, currentPage, fetchApi, selectCourier, selectCourierStatus, update, search, startDate, endDate])
  

    const today = new Date().toISOString().slice(0, 10);

    // follow date 

    const [openStock, setOpenStock] = useState(false);
    const handleOpenStock = () => setOpenStock(true);

    const onChangeDate = (orderId, e) => {
        // setFollowupDate(e.target)
        const postBody = {
            date: e.target.value,
            type: "follow_up",
        };
        axios
            .post(baseUrl + `/client/order/date/${orderId}/update`, postBody, {
                headers: headers,
            })
            .then(function (response) {
                if (response.status === 200) {
                    toast.success(response.data.message, {
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: false,
                    });
                }
            });
    };


    // delete order 
    const { publicRuntimeConfig } = getConfig();
    const apiUrl = publicRuntimeConfig.API_URL;

    const deleteProduct = (id) => {
        Swal.fire({
            iconHtml: '<img src="/images/delete.png">',
            customClass: {
                icon: 'no-border',
                border: '0'
            },
            text: 'Are you sure you want to delete this order?',
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: '#894BCA',
            cancelButtonColor: '#d33',
            confirmButtonText: 'yes, delete'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.post(apiUrl + `/client/order/${id}/delete`, {}, {
                    headers: headers,
                })
                    .then(function (result) {


                        if (result) {
                            setOrders((pd) => {
                                const filter = orders.filter((prod) => {
                                    return prod.id !== id;
                                });
                                return [...filter];
                            });
                            Swal.fire("Deleted!", "Your order has been deleted.", "success");
                            orderUpdate()
                        } else {
                        }
                    }).catch((errr) => {
                        alert("something went wrong")
                    })

            }
        });
    };


    //   courier
    const [courierList, setCourierList] = useState({});
    const [tabValue, setTabValue] = useState('1');
    const [cities, setCities] = useState();


    const courierSubmit = (id, provider) => {
        startLoading()
        if (provider === 'pathao') {
            SuperFetch.get('/client/courier/pathao/city-list', {
                headers: headers,
                order_id: id,
                provider: provider
            }).then((res) => {
                if (res?.data?.success) {
                    setCities(res.data?.data)
                    setOrderId(id)
                    handleCourierModalOpen()
                } else {
                    showToast(res?.data?.message, "error")
                }
                stopLoading()
            })
        }
        if (provider === 'steadfast') {
            SuperFetch.post('/client/courier/send-order', {
                order_id: id,
                provider: provider
            }, { headers: headers }).then((res) => {
                showToast(res.data?.message, 'success');
                handleFetch()
                stopLoading()
            })
        }
        if (provider === 'office') {
            SuperFetch.post('/client/orders/status/update', {
                order_id: id,
                status: 'delivered'
            }, { headers: headers }).then((res) => {
                showToast('Office Delivery successfully', 'success');
                handleFetch()
                stopLoading()
            })
        }
    };


    const handleTabChange = (event, newTabValue) => {
        setTabValue(newTabValue);
    };

    useEffect(() => {
        SuperFetch.get('/client/courier/list', { headers: headers })
            .then(function (response) {
                setCourierList(response?.data.data);
            });
    }, []);

    return (

        <div>
            <section className="DashboardSetting Order">
                {
                    isLoading && <div className="orderSection_preloader"> <SmallLoader /> </div>
                }
                {/* header */}
                <HeaderDescription setSearch={setSearch} headerIcon={'flaticon-order-delivery'} title={'Orders'} subTitle={'Order List'} search={true}></HeaderDescription>

                <Container maxWidth="sm">
                    <Grid>

                        {/* <Grid item xs={12}>

                            <div className="Header d_flex d_justify">

                                <div className="Left d_flex">
                                    <div className="svg">
                                        <MdOutlineReceiptLong/>
                                    </div>

                                    <div className="text">
                                        <h4>Orders </h4>
                                        <p>Order List</p>
                                    </div>
                                </div>

                                <div className="Right d_flex">
                                    <div className="FilterItem">
                                        <div className="CustomeInput">
                                            <TextField
                                                id="outlined-basic"
                                                label="Search Here..."
                                                variant="outlined"
                                                onKeyUp={e => setSearch(e.target.value)}
                                            />
                                            <Button id="orderSearchButton">
                                                <BsSearch/>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Grid> */}

                    </Grid>


                    <div className="OrderTabs">

                        <div className="CommonTab">

                            <Box sx={{ width: "100%", typography: "body1" }}>
                                <BootstrapButton className={active === 'pending' ? 'filterActive' : ''}
                                    onClick={e => handleFilterStatusChange('pending')}>Pending <h6>45</h6></BootstrapButton>
                                <BootstrapButton className={active === 'confirmed' ? 'filterActive' : ''}
                                    onClick={e => handleFilterStatusChange('confirmed')}>Confirmed</BootstrapButton>
                                <BootstrapButton className={active === 'shipped' ? 'filterActive' : ''}
                                    onClick={e => handleFilterStatusChange('shipped')}>Shipped <h6>45</h6></BootstrapButton>
                                <BootstrapButton className={active === 'delivered' ? 'filterActive' : ''}
                                    onClick={e => handleFilterStatusChange('delivered')}>Delivered</BootstrapButton>
                                <BootstrapButton className={active === 'cancelled' ? 'filterActive' : ''}
                                    onClick={e => handleFilterStatusChange('cancelled')}>Cancelled <h6>45</h6></BootstrapButton>

                                <BootstrapButton className={active === 'returned' ? 'filterActive' : ''}
                                    onClick={e => handleFilterStatusChange('returned')}>Returned</BootstrapButton>
                                <BootstrapButton className={active === 'follow_up' ? 'filterActive' : ''}
                                    onClick={e => handleFilterStatusChange('follow_up')}>Follow
                                    Up</BootstrapButton>
                                {
                                    holdOnConfig ?
                                        <>
                                            <BootstrapButton className={active === 'hold_on' ? 'filterActive' : ''}
                                                onClick={e => handleFilterStatusChange('hold_on')}>Hold On
                                            </BootstrapButton>
                                        </>
                                        : undefined
                                }

                            </Box>

                        </div>

                        {active === 'pending' &&
                            <div className="duelSelect">
                                <Button className="CreateNewBtn" onClick={handleOpenModal}>Create New
                                    Order <i className="flaticon-plus"></i></Button>
                            </div>
                        }

                        {active === 'shipped' &&
                            <div className="duelSelect d_flex">

                                {/* new Design */}
                                <select name="" defaultValue="" displayEmpty onChange={handleCourierTypeChange}>
                                    <option value="" disabled>Select Courier Provider</option>
                                    <option value="steadfast">Steadfast Courier</option>
                                    <option value="pathao">Pathao Courier</option>
                                </select>

                                {/* old Design */}
                                {/* <Select labelId="my-select-label" defaultValue="" displayEmpty
                                    style={{ marginRight: '10px' }} onChange={handleCourierTypeChange}>
                                    <MenuItem value="" disabled>Select Courier Provider</MenuItem>
                                    <MenuItem value="steadfast" sx={menuItemHoverStyle}>Steadfast Courier</MenuItem>
                                    <MenuItem value="pathao" sx={menuItemHoverStyle}>Pathao Courier</MenuItem>
                                </Select> */}

                                {/* new Design */}
                                <select name="" defaultValue="" displayEmpty onChange={handleCourierStatus}>
                                    <option value="" disabled>Select Courier Status</option>
                                    {selectCourier === 'steadfast' &&
                                        steadfast.map((item, index) => (
                                            <option
                                                key={index}
                                                value={item.item}
                                                sx={menuItemHoverStyle}
                                            >
                                                {item.value}
                                            </option>
                                        ))
                                    }

                                    {selectCourier === 'pathao' &&
                                        pathao.map((item, index) => (
                                            <option
                                                key={index}
                                                value={item.item}
                                                sx={menuItemHoverStyle}
                                            >
                                                {item.value}
                                            </option>
                                        ))
                                    }

                                </select>

                                {/* <Select labelId="my-select-label" defaultValue="" displayEmpty onChange={handleCourierStatus}>
                                    <MenuItem value="" disabled>Select Courier Status</MenuItem>
                                    {selectCourier === 'steadfast' &&
                                        steadfast.map((item, index) => (
                                            <MenuItem
                                                key={index}
                                                value={item.item}
                                                sx={menuItemHoverStyle}
                                            >
                                                {item.value}
                                            </MenuItem>
                                        ))
                                    }
                                    {selectCourier === 'pathao' &&
                                        pathao.map((item, index) => (
                                            <MenuItem
                                                key={index}
                                                value={item.item}
                                                sx={menuItemHoverStyle}
                                            >
                                                {item.value}
                                            </MenuItem>
                                        ))
                                    }

                                </Select> */}

                            </div>
                        }
                        {active === 'follow_up' &&
                            <div className="d_flex">
                                <div>
                                    {showPicker && (
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
                                                <div className="date-range">

                                                    <FilterDateInput
                                                        className="input"
                                                        {...endDateInputProps}
                                                        {...startDateInputProps}
                                                        value={dateValue}
                                                        placeholder="Select date range"
                                                    />
                                                </div>
                                            )}
                                        </DateRangePicker>)
                                    }
                                </div>

                                <select onChange={() => handleSelected(event.target.value)}>
                                    <option disabled selected value="">Find Your Follow Up Order</option>
                                    <option value="today">Today</option>
                                    <option value="tomorrow">Tomorrow</option>
                                    <option value="next_seven_days">Next Seven Days</option>
                                    <option value="custom">Custom</option>
                                </select>

                                {/* <Select defaultValue="" displayEmpty>
                                    <MenuItem disabled value="">
                                        <em>Find Your Follow Up Order</em>
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleSelected('today')}
                                        value='today'
                                        sx={menuItemHoverStyle}
                                    >
                                        Today
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleSelected('tomorrow')}
                                        value='tomorrow'
                                        sx={menuItemHoverStyle}
                                    >
                                        Tomorrow
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleSelected('next_seven_days')}
                                        value='next_seven_days'
                                        sx={menuItemHoverStyle}
                                    >
                                        Next Seven Days
                                    </MenuItem>
                                    <MenuItem
                                        onClick={() => handleSelected('custom')}
                                        value='custom'
                                        sx={menuItemHoverStyle}
                                    >
                                        Custom
                                    </MenuItem>
                                </Select> */}

                            </div>
                        }

                    </div>


                    <div className="Table">

                        <table>

                            <thead>
                                <tr>
                                    <th>SL</th>
                                    <th>Order No</th>
                                    <th>Order Date</th>
                                    <th>Customer</th>
                                    <th>Contact No.</th>
                                    <th>Address</th>
                                    <th>Product Name</th>
                                    <th>Product Price</th>
                                    <th>Quantity</th>
                                    <th>Discount</th>
                                    <th>Total Price</th>
                                    {advancedPaymentConfig &&
                                        <>
                                            <th>Advanced</th>
                                        </>
                                    }
                                    <th>Due</th>
                                    {active === 'confirmed' &&
                                        <>
                                            <th>Invoice</th>
                                            <th width={20}>Select Courier</th>
                                        </>
                                    }
                                    {active === 'follow_up' &&
                                        <th>Follow Up Date</th>
                                    }
                                    {active === 'shipped' &&
                                        <>
                                            <th>Courier Provider</th>
                                            <th>Courier Status</th>
                                        </>
                                    }
                                    {(active === 'pending' || active === 'follow_up' || active === 'hold_on' ) &&
                                        <th>Status</th>
                                    }
                                    {active === 'delivered' && <th>Delivery Providers</th>
                                    }
                                    <th>Note</th>
                                    {(active === 'pending' || active === 'follow_up' || active === 'shipped' || active === 'confirmed' || active === 'hold_on' || active === 'delivered') &&
                                        <th>Action</th>
                                    }

                                </tr>
                            </thead>

                            <tbody>
                                {orders.length > 0 ? orders.map((order, index) => {
                                    return (

                                        <tr key={index}>

                                            <td>{index + 1 + currentPage * 25 - 25}</td>
                                            <td>#{order.order_no}</td>
                                            <td>
                                                {order?.created_at?.slice(0, 10) >=
                                                    today
                                                    ? moment(
                                                        order?.created_at
                                                    ).fromNow()
                                                    : moment(order?.created_at).format(
                                                        "DD-MM-YYYY"
                                                    )}
                                            </td>

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
                                                                    13
                                                                )}
                                                                ...
                                                            </span>
                                                        )}
                                                    </span>
                                                </Tooltip>
                                            </td>

                                            <td>{order.phone}</td>
                                            <td>
                                                <Tooltip
                                                    title={order?.address}
                                                    placement="top-start"
                                                >
                                                    <span>
                                                        {order?.address?.length < 15 ? (
                                                            <span>{order?.address}</span>
                                                        ) : (
                                                            <span>
                                                                {order?.address?.slice(0, 13)}
                                                                ...
                                                            </span>
                                                        )}
                                                    </span>
                                                </Tooltip>
                                            </td>
                                            <td>
                                                <Tooltip
                                                    title={order?.order_details[0]?.product}
                                                    placement="top-start"
                                                >
                                                    <span>
                                                        {order?.order_details[0]?.product?.length < 15 ? (
                                                            <span>{order?.order_details[0]?.product}</span>
                                                        ) : (
                                                            <span>
                                                                {order?.order_details[0]?.product?.slice(0, 13)}
                                                                ...
                                                            </span>
                                                        )}
                                                    </span>
                                                </Tooltip>
                                            </td>

                                            <td>
                                                {order?.order_details[0]?.price}
                                            </td>

                                            <td>
                                                {
                                                    order?.order_details?.reduce((prevVal, currentVal) => {
                                                        return prevVal + (currentVal?.quantity)
                                                    }, 0)
                                                }

                                            </td>
                                            <td>
                                                {active === 'pending' ?
                                                    <input key={order.id} type="text" defaultValue={order?.discount}
                                                        onKeyDown={(event => handleDiscount(event, order?.id, order?.order_status))} />
                                                    :
                                                    <span>{order?.discount}</span>
                                                }
                                            </td>
                                            <td>{order?.grand_total}</td>
                                            {advancedPaymentConfig &&
                                                <>
                                                    {active === 'pending' ?
                                                        (<td>
                                                            <input key={order.id} type="text" defaultValue={order?.advanced}
                                                                onKeyDown={(event) => handleAdvancedPayment(event, order?.id)} />
                                                        </td>)
                                                        :
                                                        <td>{order?.advanced}</td>
                                                    }

                                                </>
                                            }
                                            <td>{order?.due}</td>
                                            {active === 'confirmed' &&
                                                <>
                                                    <td>
                                                        <Button className='invoice'>
                                                            <Link target="_blank"
                                                                href={"/invoice-one/" + order?.id}
                                                                rel="noopener noreferrer">
                                                                Print <i className="flaticon-printer-2" />
                                                            </Link>
                                                        </Button>
                                                    </td>


                                                    {/* } */}
                                                    {/* <td>
                                                        <FormControl sx={{ m: 1, width: 300 }}>

                                                            <Select
                                                                displayEmpty
                                                                defaultValue=""
                                                                onChange={(event) => handleCourier(event, order?.id)}
                                                                input={<OutlinedInput />}
                                                                inputProps={{ 'aria-label': 'Without label' }}
                                                            >
                                                                <MenuItem disabled value="">
                                                                    <em>Select Courier</em>
                                                                </MenuItem>
                                                                {couriers.map((item, index) => (
                                                                    <MenuItem
                                                                        key={index}
                                                                        value={item.value}
                                                                    >
                                                                        {item.item}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                        </td> */}

                                                    <td>
                                                        <td>
                                                            <select key={order?.id} name=""
                                                                onChange={(e) => {
                                                                    courierSubmit(order?.id, e.target.value);
                                                                }}
                                                            >
                                                                <option>Select Courier</option>
                                                                <option key="office" value="office">
                                                                    Office Delivery
                                                                </option>
                                                                {courierList.length > 0 ? (
                                                                    courierList.map((item) => {
                                                                        return (
                                                                            <option key={item.provider} value={item.provider}>
                                                                                {Capitalized(item.provider)}
                                                                            </option>
                                                                        )
                                                                    })
                                                                ) : (
                                                                    <option key="add_courier" value="add_courier">
                                                                        Add Courier
                                                                    </option>
                                                                )}

                                                            </select>
                                                        </td>
                                                    </td>
                                                </>
                                            }

                                            {active === 'follow_up' &&
                                                <td>
                                                    <Button
                                                        className="followUpDate"
                                                        onClick={handleOpenStock}
                                                    >
                                                        <input
                                                            defaultValue={order?.follow_up_date}
                                                            type="date"
                                                            name=""
                                                            key={order?.id}
                                                            onChange={(e) => onChangeDate(order?.id, e)}
                                                            id=""
                                                        />
                                                    </Button>
                                                </td>
                                            }
                                            {active === 'shipped' &&
                                                <>
                                                    <td>
                                                        {order?.courier_provider}
                                                    </td>
                                                    <td>
                                                        {order?.courier_status}
                                                    </td>
                                                </>
                                            }
                                            {(active === 'pending' || active === 'follow_up' || active === 'hold_on') &&
                                                <td>

                                                    <select displayEmpty
                                                        value={order?.order_status}
                                                        onChange={(event) => handleStatusChange(event, order?.id)}
                                                        input={<OutlinedInput />}
                                                        inputProps={{ 'aria-label': 'Without label' }}
                                                    >
                                                        <option value="">Select Status</option>

                                                        {active === 'pending' &&
                                                            pendingStatus.map((item, index) => (
                                                                <option
                                                                    key={index}
                                                                    value={item.value}
                                                                    selected={item.value === order?.order_status}
                                                                >
                                                                    {item.item}
                                                                </option>
                                                            ))
                                                        }

                                                        {active === 'follow_up' &&
                                                            followUpStatus.map((status, index) => (
                                                                <option
                                                                    key={index}
                                                                    value={status.value}
                                                                    selected={status.value === order?.order_status}
                                                                >
                                                                    {status.item}
                                                                </option>
                                                            ))
                                                        }
                                                        {
                                                            active === 'hold_on' &&
                                                            holdOnStatus.map((status, index) => (
                                                                <option
                                                                    key={index}
                                                                    value={status.value}
                                                                    selected={status.value === order?.order_status}
                                                                >
                                                                    {status.item}
                                                                </option>
                                                            ))
                                                        }

                                                    </select>

                                                </td>
                                            }

                                            {active === 'delivered' &&
                                                <>
                                                    <td>
                                                        {order?.courier_entry ? order.courier_provider : "Office Delivery"}
                                                    </td>
                                                </>
                                            }

                                            <td className="NoteField">
                                                <Note note={order?.note} id={order?.id} status={order?.order_status}
                                                    handleFetch={handleFetch} key={order?.id} />
                                            </td>
                                            {(active === 'pending' || active === 'follow_up' || active === 'shipped' || active === 'confirmed' || active ==='hold_on') &&
                                                <td>

                                                    <div className="action">

                                                        <Button className='viewActionBtn'
                                                            onClick={(e) => handleOrderDetails(e, order?.id)}>
                                                            <i className="flaticon-view" />
                                                        </Button>

                                                        <Button className='updateActionBtn' onClick={(e) => {
                                                            { handleOrderUpdate(e, order?.id), setOrderId(order?.id); setOrderStatus(order?.status) }
                                                        }}>
                                                            {/* <OrderUpdate products={products} id={order.id} handleFetch={handleFetch}  /> */}
                                                            <i className="flaticon-edit" />
                                                        </Button>

                                                        <Button className='deleteActionBtn'
                                                            onClick={() => deleteProduct(order.id)}>
                                                            <i className="flaticon-trash" />
                                                        </Button>

                                                    </div>

                                                    {/* <div>
                                                        <Link href='' onClick={(e) => handleOrderDetails(e, order?.id)}>
                                                            <MdOutlineRemoveRedEye color={'#6f6f6f'} size={'1.4em'}
                                                                style={{ marginRight: '5px' }} />
                                                        </Link>
                                                       
                                                        <button>
                                                            <OrderUpdate products={products} id={order.id} handleFetch={handleFetch} />
                                                        </button>
                                                        <Link href='' onClick={() => deleteProduct(order.id)}>
                                                            <RiDeleteBin6Line color={'#6f6f6f'} size={'1.4em'} />
                                                        </Link>

                                                    </div> */}

                                                </td>
                                            }
                                        </tr>
                                    )
                                })
                                    :
                                    (
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
                                    )

                                }

                            </tbody>

                        </table>

                    </div>


                    <Paginator count={totalPage} page={currentPage} onChange={handleChange} showFirstButton
                        showLastButton variant="outlined" />

                </Container>

            </section>
            <OrderModal modalOpen={modalOpen} handleCloseModal={handleCloseModal} products={products}
                handleFetch={handleFetch} orderUpdate={orderUpdate} />
            <EditOrderModal key={order.id} order={order} handleCloseViewModal={handleCloseViewModal} status={orderStatus} viewModalOpen={viewOrderModal} handleFetch={handleFetch} />
            <OrderUpdateModal key={order.id} order={order} orderId={orderId} modalOpenUpdate={modalOpenUpdate}
                handleCloseOrderUpdateModal={handleCloseOrderUpdateModal} handleFetch={handleFetch} />
            {
                cities && <CourierModal handleCourierModalOpen={courierModal}
                    handleCourierModalClose={handleCourierModalClose} city={cities} order_id={orderId} />
            }

        </div>

    )

}
// export default index;
export default withAuth(Order, {
    isProtectedRoute: true
});
