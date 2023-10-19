import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  OutlinedInput,
  Pagination,
  Select,
  Skeleton,
  TextField,
  Tooltip,
} from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import dayjs from "dayjs";

import { styled } from "@mui/material/styles";
import axios from "axios";
import { enGB } from "date-fns/locale";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { DateRangePicker } from "react-nice-dates";
import "react-nice-dates/build/style.css";
import Swal from "sweetalert2";
import OrderModal from "../../Components/OrderPage/Modal";
import Note from "../../Components/OrderPage/Note";
import OrderUpdateModal from "../../Components/OrderPage/OrderUpdateModal";
import SuperFetch from "../../hook/Axios";
import withAuth from "../../hook/PrivateRoute";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import { BsThreeDotsVertical } from "react-icons/bs";
import ReactSelect from 'react-select';
import HeaderDescription from "../../Components/Common/HeaderDescription/HeaderDescription";
import CourierModal from "../../Components/CourierPage/CourierModal";
import SmallLoader from "../../Components/SmallLoader/SmallLoader";
import CopyIcon from "../../Components/UI/CopyIcon/CopyIcon";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import Capitalized, { courierStatusFormate } from "../../constant/capitalized";
import useLoading from "../../hook/useLoading";
import { useToast } from "../../hook/useToast";
import { headers } from "../api";
import ViewModal from "../../Components/OrderPage/ViewModal";

const followUpOrderFilterOption = [
  { value: 'today', label: 'Today' },
  { value: 'next_seven_days', label: 'Next Seven Days' },
  { value: 'custom', label: 'Custom' }
]

const confirmedOrderFilterOption = [
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'previous', label: 'Previous' },
  { value: 'next_seven_days', label: 'Next Seven Days' },
  { value: 'custom', label: 'Custom' }
]
function formatDateToBST(date) {
  return date?.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
}
const OrderPage = ({ orderUpdate, pendingOrderCount, myAddonsList }) => {
  const showToast = useToast();
  const router = useRouter();
  const [isLoading, startLoading, stopLoading] = useLoading();
  const [enableGlobalSearch, setEnableGlobalSearch] = useState(false);
  const [active, setDefault] = useState("pending");
  const [products, setProducts] = useState([]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [orders, setOrders] = useState([]);
  const [apiResponse, setApiResponse] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenUpdate, setModalOpenUpdate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [callCount, setCount] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [selectCourier, setSelectCourier] = useState(null);
  const [selectCourierStatus, setSelectCourierStatus] = useState(null);
  const [advancedPaymentConfig, setAdvancedPaymentConfig] = useState(false);
  const [holdOnConfig, setHoldOnConfig] = useState(false);
  const [shippingDateConfig, setShippingDateConfig] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [fetchApi, setFetch] = useState(false);
  const [order, setOrder] = useState({});
  const [viewOrderModal, setViewOrderModalOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const [search, setSearch] = useState(null);
  const [followUpChange, setFollowUpInputChange] = useState("");
  const [courierModal, setCourierModal] = useState(false);
  const [courierStatus, setCourierStatus] = useState("");
  //   courier
  const [courierList, setCourierList] = useState({});
  const [tabValue, setTabValue] = useState("1");
  const [cities, setCities] = useState();
  const [followUpDate, setFollowUpDate] = useState();
  const [shippingDate, setShippingDate] = useState();
  const [selectedSingleCourier, setSelectedSingleCourier] = useState("");
  const [selectedOrder, setSelectedOrder] = useState();



  const BootstrapButton = styled(Button)({
    backgroundColor: "#fff",
    border: "1px solid #894bca",
    color: "#894bca",
    marginRight: "10px",
    "&:hover": {
      backgroundColor: "#894bca",
      borderColor: "#894bca",
      boxShadow: "none",
      color: "#fff",
    },
  });

  const FilterDateInput = styled(TextField)({
    "& .MuiInputBase-root": {
      height: "42px",
      marginRight: "10px",
      width: "250px",
    },
  });

  const Paginator = styled(Pagination)({
    "& .MuiPagination-ul": {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      marginTop: "10px",
    },
  });

  const menuItemHoverStyle = {
    "&:hover": {
      backgroundColor: "#894bca",
      color: "#fff",
    },
    "&.Mui-selected": {
      backgroundColor: "#894bca",
      color: "#fff",
    },
  };

  const pendingStatus = [
    { item: "Pending", value: "pending" },
    { item: "Follow Up", value: "follow_up" },
    { item: "Confirmed", value: "confirmed" },
    { item: "Cancelled", value: "cancelled" },
  ];
  if (holdOnConfig) {
    pendingStatus.push({ item: "Hold On", value: "hold_on" });
  }

  const followUpStatus = [
    { item: "Follow Up", value: "follow_up" },
    { item: "Confirmed", value: "confirmed" },
    { item: "Cancelled", value: "cancelled" },
  ];

  const holdOnStatus = [
    { item: "Hold On", value: "hold_on", color: "yellow" },
    { item: "Follow Up", value: "follow_up", color: "blue" },
    { item: "Confirmed", value: "confirmed", color: "green" },
    { item: "Cancelled", value: "cancelled", color: "red" },
    { item: "Pending", value: "pending", color: "red" },
  ];
  const cancelledOnStatus = [
    { item: "Cancelled", value: "cancelled", color: "red" },
    { item: "Follow Up", value: "follow_up", color: "blue" },
    { item: "Confirmed", value: "confirmed", color: "green" },
  ];
  if (holdOnConfig) {
    followUpStatus.push({ item: "Hold On", value: "hold_on" });
    cancelledOnStatus.push({ item: "Hold On", value: "hold_on" });
  }

  const couriers = [
    { item: "Office Delivery", value: "office_delivery" },
    { item: "SteadFast", value: "steadfast" },
    { item: "Pathao", value: "pathao" },
  ];

  const steadfast = [
    { item: "in_review", value: "In Review" },
    { item: "pending", value: "Pending" },
    { item: "hold", value: "Hold" },
    { item: "cancelled", value: "Cancelled" },
    { item: "delivered", value: "Delivered" },
    { item: "cancelled_approval_pending", value: "Cancel" },
    { item: "unknown_approval_pending", value: "Need Approval" },
    // { item: 'partial_delivered_approval_pending', value: 'Partial Delivered' },
    { item: "delivered_approval_pending", value: "Delivered" },
    { item: "partial_delivered", value: "Partial Delivered" },
    { item: "unknown", value: "Unknown" },
  ];
  const pathao = [
    { item: "Pickup_Requested", value: "Pickup Requested" },
    { item: "Assigned_for_Pickup", value: "Assigned For Pickup" },
    { item: "Picked", value: "Picked" },
    { item: "Pickup_Failed", value: "Pickup Failed" },
    { item: "Pickup_Cancelled", value: "Pickup Cancelled" },
    { item: "At_the_Sorting_HUB", value: "At The Sorting HUB" },
    { item: "In_Transit", value: "In Transit" },
    { item: "Received_at_Last_Mile_HUB", value: "Received At Last Mile HUB" },
    { item: "Assigned_for_Delivery", value: "Assigned For Delivery" },
    { item: "Delivered", value: "Delivered" },
    { item: "Partial_Delivery", value: "Partial Delivery" },
    { item: "Return", value: "Return" },
    { item: "Delivery_Failed", value: "Delivery Failed" },
    { item: "On_Hold", value: "On Hold" },
    { item: "Payment_Invoice", value: "Payment Invoice" },
  ];

  const handleOpenModal = () => {
    setModalOpen(true);
  };
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const handleCloseOrderUpdateModal = () => {
    setModalOpenUpdate(false);
  };

  const handleChange = (event, value) => {
    setCurrentPage(value);
    setCount(1);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const formatDate = date => {
    if (!date) return "";
    return date.toLocaleDateString();
  };

  const dateValue =
    startDate && endDate
      ? `${formatDate(startDate)} - ${formatDate(endDate)}`
      : "";

  const handleSelected = value => {
    setFollowUpInputChange(value);
    setOpenDialog(false);
    if (value === "custom") {
      setShowPicker(true);
    } else {
      setShowPicker(false);
    }
    setSelectedValue(value);
  };

  const handleCloseViewModal = () => {
    setViewOrderModalOpen(false);
  };

  const handleCourierTypeChange = e => {
    setSelectCourier(e.target.value);
  };
  const handleCourierStatus = e => {
    setSelectCourierStatus(e.target.value);
  };
  const handleFilterStatusChange = value => {
    setSelectCourier(null);
    setSelectCourierStatus(null);
    setFollowUpInputChange(null);
    setSelectedValue(null)
    setDefault(value);
    setShowPicker(false)
    setStartDate()
    setEndDate()
    setEnableGlobalSearch(false)
    setTotalPage(0)
  };

  const handleFilterStatusCOurier = value => {
    setCourierStatus(value);
  };

  const handleCourierModalOpen = () => {
    setCourierModal(true);
  };
  const handleCourierModalClose = () => {
    setCourierModal(false);
  };

  const params = {
    type: active,
    page: currentPage,
    date: selectedValue,
    provider: selectCourier,
    courier_status: selectCourierStatus,
    // search: search,
    start_date: formatDateToBST(startDate),
    end_date: formatDateToBST(endDate),
    filter_date: selectedValue,
  };
  const [statusChangeLoading, setStatusChangeLoading] = useState(false);
  const handleStatusChange = (event, id) => {
    const params = {
      order_id: id,
      status: event.target.value,
    };

    if (event.target.value === "cancelled") {
      Swal.fire({
        iconHtml: '<img src="/images/delete.png">',
        customClass: {
          icon: "no-border",
          border: "0",
        },
        text: "Are you sure you want to cancel this order?",
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#894BCA",
        cancelButtonColor: "#d33",
        confirmButtonText: "yes, cancel it!",
      }).then(result => {
        if (result.isConfirmed) {
          startLoading();

          SuperFetch.post("/client/orders/status/update", params, {
            headers: headers,
          })
            .then(res => {
              orderUpdate();
              handleFetch();
              toast.success(res.data?.message, { position: "top-right" });
            })
            .catch(error => {
              if (error.response?.data?.msg?.status[0]) {
                orderUpdate();
                handleFetch();
                toast.error(error.response?.data?.msg?.status[0], {
                  position: "top-right",
                });
              }
              toast.error("Internal Server Error", { position: "top-right" });
            });
          setTimeout(() => {
            setFetch(true);
            orderUpdate();
            stopLoading();
          }, 1000);
        }
      });
    } else {
      SuperFetch.post("/client/orders/status/update", params, {
        headers: headers,
      })
        .then(res => {
          orderUpdate();
          handleFetch();
          toast.success(res.data?.message, { position: "top-right" });
        })
        .catch(error => {
          if (error.response?.data?.msg?.status[0]) {
            orderUpdate();
            handleFetch();
            toast.error(error.response?.data?.msg?.status[0], {
              position: "top-right",
            });
          }
          toast.error("Internal Server Error", { position: "top-right" });
        });
      setTimeout(() => {
        setFetch(true);
        orderUpdate();
        stopLoading();
      }, 1000);
    }
  };

  const handleAdvancedPayment = (event, id) => {
    if (event.key === "Enter" && event.target.value > 0) {
      // debugger
      SuperFetch.post(
        `/client/order/advance-payment/${id}/update`,
        { advanced: event.target.value },
        { headers: headers }
      )
        .then(res => {
          toast.success(res.data?.message, { position: "top-right" });
          setFetch(true);
        })
        .catch(error => {
          toast.error("Something went wrong please wait for some time", {
            position: "top-right",
          });
        });
    } else if (event.key === "Enter" && event.target.value === "") {
      SuperFetch.post(
        `/client/order/advance-payment/${id}/update`,
        { advanced: "0" },
        { headers: headers }
      )
        .then(res => {
          toast.success(res.data?.message, { position: "top-right" });
          setFetch(true);
          handleFetch();
        })
        .catch(error => {
          toast.error("Something went wrong please wait for some time", {
            position: "top-right",
          });
        });
    }
  };

  const handleDiscount = (event, id, type) => {
    if (event.key === "Enter" && event.target.value > 0) {
      SuperFetch.post(
        `/client/order/discount/${id}/update`,
        {
          discount: event.target.value,
          type: type,
        },
        { headers: headers }
      )
        .then(res => {
          toast.success(res.data?.message, { position: "top-right" });

          setFetch(true);
        })
        .catch(error => {
          toast.error("Something went wrong please wait for some time", {
            position: "top-right",
          });
        });
    } else if (
      event.key === "Enter" &&
      event.target.value.endsWith("%") === true
    ) {
      SuperFetch.post(
        `/client/order/discount/${id}/update`,
        {
          discount: event.target.value,
          type: type,
        },
        { headers: headers }
      )
        .then(res => {
          toast.success(res.data?.message, { position: "top-right" });

          setFetch(true);
        })
        .catch(error => {
          toast.error("Something went wrong please wait for some time", {
            position: "top-right",
          });
        });
    } else if (event.key === "Enter" && event.target.value === "") {
      SuperFetch.post(
        `/client/order/discount/${id}/update`,
        {
          discount: "0",
          type: type,
        },
        { headers: headers }
      )
        .then(res => {
          toast.success(res.data?.message, { position: "top-right" });

          setFetch(true);
        })
        .catch(error => {
          toast.error("Something went wrong please wait for some time", {
            position: "top-right",
          });
        });
    } else if (event.key === "Enter") {
      // If the entered value is not a valid number or percentage, show an error toast message
      toast.error(
        "Invalid discount value. Please enter a valid number or percentage (e.g., 10 or 10%).",
        { position: "top-right" }
      );
    }
  };

  const handleFetch = () => {
    setFetch(true);
  };

  const handleOrderDetails = id => {
    SuperFetch.get(`/client/orders/${id}`, { headers: headers })
      .then(res => {
        setViewOrderModalOpen(true);
        setOrder(res.data.data);
        handleFetch();
      })
      .catch(error => {
        toast.error("Something went wrong please wait for some time", {
          position: "top-right",
        });
      });
  };

  const handleOrderUpdate = id => {
    SuperFetch.get(`/client/orders/${id}`, { headers: headers })
      .then(res => {
        setModalOpenUpdate(true);
        setOrder(res.data.data);
        handleFetch();
      })
      .catch(error => {
        toast.error("Something went wrong please wait for some time", {
          position: "top-right",
        });
      });
  };

  const searchParams = {
    search: search,
  }

  const handleFetchOrderGlobalSearch = useCallback(async () => {
    setApiResponse(false);
    try {
      const OrderGlobalSearchResponse = await axios.get(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ORDERS.ORDER_GLOBAL_SEARCH}`, {
        headers: headers,
        params: searchParams
      });
      setOrders(OrderGlobalSearchResponse?.data?.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setApiResponse(true);
    }
  }, [search]);

  useEffect(() => {
    if (search?.length > 0) {
      handleFetchOrderGlobalSearch();
    } else {
      setFetch(true);
    }
  }, [search, handleFetchOrderGlobalSearch]);
  useEffect(() => {
    if (enableGlobalSearch === false && active !== "trashed") {
      SuperFetch.get("/client/orders", { params: params, headers: headers })
        .then(res => {
          if (res.data.success) {
            setOrders(res.data?.data);
            setTotalPage(res.data?.last_page);
            setFetch(false);
            setApiResponse(true)
          }
        })
        .catch(e => { });

      if (callCount === 0) {
        SuperFetch.get(API_ENDPOINTS.PRODUCTS.GET_PRODUCTS, { headers: headers }).then(res => {
          if (res.data.success) {
            setProducts(res.data?.data);
          }
        });
        if (active === 'pending') {
          SuperFetch.get(API_ENDPOINTS.ORDERS.ORDER_ADVANCE_PAYMENT_CONFIG, {
            headers: headers,
          }).then(res => {
            if (res?.data?.success) {
              setAdvancedPaymentConfig(res.data?.data?.advanced_payment);
            }
          });

        }

        SuperFetch.get(API_ENDPOINTS.ORDERS.ORDER_HOLD_ON_CONFIG, {
          headers: headers,
        }).then(res => {
          if (res?.data?.success) {
            setHoldOnConfig(res.data?.data?.hold_on);
          }
        });
        if (active === "confirmed") {
          SuperFetch.get(`${API_ENDPOINTS.ORDERS.ORDER_SHIPPING_DATE_CONFIG}`, {
            headers: headers,
          }).then(res => {
            if (res.data.success) {
              setShippingDateConfig(res?.data?.data?.shipped_date_status);
            }
          });
        }

      }

      setFetch(false);
    }
  }, [
    followUpChange,
    active,
    currentPage,
    fetchApi,
    selectCourier,
    selectCourierStatus,
    update,
    startDate,
    endDate,
  ]);

  const today = new Date().toISOString().slice(0, 10);

  // follow date

  const [openStock, setOpenStock] = useState(false);
  const handleOpenStock = () => setOpenStock(true);

  const onChangeDate = (orderId, type) => {
    if (followUpDate === undefined) {
      showToast("Please select valid Date", "error");
      return;
    }
    const postBody = {
      date: `${followUpDate.$y}-${followUpDate.$M + 1}-${followUpDate.$D}`,
      type: type,
    };
    axios
      .post(API_ENDPOINTS.BASE_URL + `/client/order/date/${orderId}/update`, postBody, {
        headers: headers,
      })
      .then(function (response) {
        if (response.status === 200) {
          handleFetch()
          toast.success(response.data.message, {
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
          });
        }
      });
  };

  const onChangeShippingDate = orderId => {
    if (shippingDate === undefined) {
      showToast("Please select valid Date", "error");
      return;
    }
    const postBody = {
      date: `${shippingDate.$y}-${shippingDate.$M + 1}-${shippingDate.$D}`,
      type: "confirmed",
    };
    axios
      .post(API_ENDPOINTS.BASE_URL + `${API_ENDPOINTS.ORDERS.ORDER_SHIPPING_DATE}${orderId}/update`, postBody, {
        headers: headers,
      })
      .then(function (response) {
        if (response.status === 200) {
          handleFetch()
          showToast(response?.data?.message, "success");
        }
      }).catch(function (error) {
        showToast("An error occurred while updating the shipping date", "error");
      })
  };

  // delete order
  const deleteProduct = id => {
    Swal.fire({
      iconHtml: '<img src="/images/delete.png">',
      customClass: {
        icon: "no-border",
        border: "0",
      },
      text: "Are you sure you want to delete this order?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#894BCA",
      cancelButtonColor: "#d33",
      confirmButtonText: "yes, delete",
    }).then(result => {
      if (result.isConfirmed) {
        axios
          .post(
            `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ORDERS}/${id}/delete`,
            // `${process.env.NEXT_PUBLIC_API_URL}/client/order/${id}/delete`,
            {},
            {
              headers: headers,
            }
          )
          .then(function (result) {
            if (result) {
              setOrders(pd => {
                const filter = orders.filter(prod => {
                  return prod.id !== id;
                });
                return [...filter];
              });
              Swal.fire("Deleted!", "Your order has been deleted.", "success");
              orderUpdate();
            } else {
            }
          })
          .catch(errr => {
            alert("something went wrong");
          });
      }
    });
  };

  const [courierViewValue, setCourierViewValue] = useState("");

  const courierSubmit = (event, id) => {
    setCourierViewValue(event.target.value);
    startLoading();
    if (event.target.value === "pathao") {
      SuperFetch.get("/client/courier/pathao/city-list", {
        headers: headers,
        order_id: id,
        provider: event.target.value,
      }).then(res => {
        if (res?.data?.success) {
          setCities(res.data?.data);
          setOrderId(id);
          handleCourierModalOpen();
          orderUpdate();
          setCourierViewValue("");
        } else {
          showToast(res?.data?.message, "error");
        }
        stopLoading();
      });
    } else if (event.target.value === "steadfast") {
      SuperFetch.post(
        "/client/courier/send-order",
        {
          order_id: [id],
          provider: event.target.value,
        },
        { headers: headers }
      ).then(res => {
        showToast("Order Send Courier Provider Successfully", "success");
        handleFetch();
        stopLoading();
        orderUpdate();
        setCourierViewValue("");
      });
    } else if (event.target.value === "office") {
      SuperFetch.post(
        "/client/orders/status/update",
        {
          order_id: id,
          status: "delivered",
        },
        { headers: headers }
      ).then(res => {
        showToast("Office Delivery successfully", "success");
        handleFetch();
        stopLoading();
        orderUpdate();
        setCourierViewValue("");
      });
    } else if (event.target.value === "redriect-courier") {
      router.push("/courier");
    }
  };

  const handleTabChange = (event, newTabValue) => {
    setTabValue(newTabValue);
  };

  useEffect(() => {
    SuperFetch.get("/client/courier/list", { headers: headers }).then(function (
      response
    ) {
      setCourierList(response?.data.data);
    });
  }, []);

  // Dropdown
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [anchorEls, setAnchorEls] = useState(Array(3).fill(null));

  const handleClick1 = (event, index) => {
    const newAnchorEls = [...anchorEls];
    newAnchorEls[index] = event.currentTarget;
    setAnchorEls(newAnchorEls);
  };

  const handleClose1 = index => {
    const newAnchorEls = [...anchorEls];
    newAnchorEls[index] = null;
    setAnchorEls(newAnchorEls);
  };

  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders([]);
    } else {
      const orderIds = orders.map(order => order.id);
      setSelectedOrders(orderIds);
    }
    setSelectAll(!selectAll);
  };

  const handleOrderSelection = orderId => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const multiSelectOrdersDelete = () => {
    Swal.fire({
      iconHtml: '<img src="/images/delete.png">',
      customClass: {
        icon: "no-border",
        border: "0",
      },
      text: "Are you sure you want to delete this order?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#894BCA",
      cancelButtonColor: "#d33",
      confirmButtonText: "yes, delete",
    }).then(result => {
      if (result.isConfirmed) {
        axios
          .post(`${process.env.NEXT_PUBLIC_API_URL}/client/bulkdelete`,
            {
              orders: [...selectedOrders],
            },
            {
              headers: headers,
            }
          )
          .then(function (result) {
            orderUpdate();
            handleFetch();
            setSelectedOrders([]);

            Swal.fire("Deleted!", "Your order has been deleted.", "success");

            // if (result) {
            //     setOrders((pd) => {
            //         const filter = orders.filter((prod) => {
            //             return prod.id !== id;
            //         });
            //         return [...filter];
            //     });
            //
            //     orderUpdate()
            // } else {
            // }
          })
          .catch(errr => {
            alert("something went wrong");
          });
      }
    });
  };

  const multiSelectOrdersCouriers = () => {
    SuperFetch.post(
      "/client/courier/send-order",
      {
        order_id: [...selectedOrders],
        provider: "steadfast",
      },
      { headers: headers }
    ).then(res => {
      showToast("Order Send Courier Provider Successfully", "success");
      setSelectedOrders([]);
      handleFetch();
      stopLoading();
      orderUpdate();
    });
  };

  //order note functionality
  const [isOpenOrderNoteModal, setIsOpenOrderNoteModal] = useState(false);
  const [orderIdOfModal, setOrderIdOfModal] = useState(null);
  const [onChangeOrderNoteData, setOnChangeOrderNoteData] = useState({
    orderId: null,
    note: "",
  });

  const handleOpenOrderNoteModal = orderId => {
    setIsOpenOrderNoteModal(true);
    setOrderIdOfModal(orderId);
  };
  const handleCloseOrderNoteModal = () => {
    setIsOpenOrderNoteModal(false);
  };
  const getNoteDefaultValue = note => {
    if (note !== null && note?.length <= 43) {
      return note;
    } else if (note !== null && note?.length >= 44) {
      return `${note.slice(0, 44)}..`;
    } else {
      return "Add Note";
    }
  };
  // onChange={() => handleOnChangeNote(order?.order_no, order?.note)}
  const handleOnChangeNote = (orderId, note_data, event, type) => {
    setOnChangeOrderNoteData({ orderId: orderId, note: note_data });
    // if (event.key === "Enter") {
    //     SuperFetch.post(`/client/order/note/${id}/update`, {
    //         note: event.target.value,
    //         type: type
    //     }, { headers: headers })
    //         .then(res => {
    //             toast.success(res.data?.message, { position: 'top-right' })
    //         }).catch(error => {
    //             toast.error('Something went wrong please wait for some time', { position: 'top-right' })
    //         }
    //         )
    // }
  };

  const removeTextFromNumber = (phoneNumber, textToRemove) => {
    if (phoneNumber.includes(textToRemove)) {
      return phoneNumber.replace(textToRemove, "");
    } else {
      return phoneNumber;
    }
  };

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  // const steadfast = [
  //     { item: 'in_review', value: 'In Review' },
  //     { item: 'pending', value: 'Pending' },
  //     { item: 'hold', value: 'Hold' },
  //     { item: 'cancelled', value: 'Cancelled' },
  //     { item: 'delivered', value: 'Delivered' },
  //     { item: 'cancelled_approval_pending', value: 'Cancel' },
  //     { item: 'unknown_approval_pending', value: 'Need Approval' },
  //     // { item: 'partial_delivered_approval_pending', value: 'Partial Delivered' },
  //     { item: 'delivered_approval_pending', value: 'Delivered' },
  //     { item: 'partial_delivered', value: 'Partial Delivered' },
  //     { item: 'unknown', value: 'Unknown' }
  // ]

  const courierText = value => {
    if (value === "In Review") {
      return "in_review";
    } else if (value === "Unknown") {
      return "unknown";
    } else if (value === "Pending") {
      return "pending";
    } else if (value === "Unknown") {
      return "unknown";
    } else if (value === "Hold") {
      return "hold";
    } else if (value === "Cancelled") {
      return "cancelled";
    } else if (value === "Delivered") {
      return "delivered";
    } else if (value === "Cancel") {
      return "cancelled_approval_pending";
    }

    return;
  };

  function createUniqueCityArray(inputArray) {
    const uniqueCourier = [];
    const jsonObject = [];

    for (const item of inputArray) {
      const courier = item?.courier_status;
      if (!uniqueCourier.includes(courier)) {
        uniqueCourier.push(courier);
        jsonObject.push({ item: courier, value: courier });
      }
    }
    return jsonObject;
  }

  const countNonNullFields = (invoiceNote, courierNote) => {
    if (
      invoiceNote !== null &&
      courierNote !== null &&
      courierNote !== "0" &&
      invoiceNote !== "0"
    ) {
      return 2;
    } else if (
      (invoiceNote !== null && invoiceNote !== "0") ||
      (courierNote !== null && courierNote !== "0")
    ) {
      return 1;
    } else {
      return 0;
    }
  };

  const courierStatusOrderCount = value => {
    const order = orders.filter(order => {
      return order.courier_status === value;
    });
    return order?.length;
  };
  useEffect(() => {
    setSelectedOrders([]);
    setSelectAll(false);
  }, [active]);

  const courierReDriect = () => {
    router.push("/courier");
  };

  const href =
    selectedOrders.length > 0 ? `/invoice-one/${selectedOrders.join("/")}` : "";

  const [selectedStatus, setSelectedStatus] = useState("Select Status");

  const handleTableAction = (type, id) => {
    if (type === "view") {
      handleOrderDetails(id);
    }
  };

  const orderType = value => {
    if (value === "landing") {
      return "#894bca";
    }
    if (value === "website") {
      return "#f5b849";
    }
    if (value === "social") {
      return "#23b7e5";
    }
    if (value === "phone") {
      return "#26bf94";
    }
  };

  const moveToTrash = (id) => {
    Swal.fire({
      iconHtml: '<img src="/images/delete.png">',
      customClass: {
        icon: "no-border",
        border: "0",
      },
      text: "Are you sure you want to move this order to trash?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#894BCA",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete",
    }).then(result => {
      if (result.isConfirmed) {
        axios
          .get(
            `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ORDERS.MOVE_ORDER_TRASHED}/${id}`,
            {
              headers: headers,
            }
          )
          .then(function (result) {
            if (result) {
              setOrders(pd => {
                const filter = orders.filter(prod => {
                  return prod.id !== id;
                });
                return [...filter];
              });
              showToast("Your order has been Moved to trash", "success");
              orderUpdate();
            } else {
            }
          })
          .catch(errr => {
            showToast("something went wrong", "error");
          });
      }
    });

  }
  const handleFetchOrderTrash = useCallback(async () => {
    if (active === "trashed") {
      try {
        let data = await axios({
          method: "get",
          url: `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ORDERS.GET_ORDER_TRASHED_LIST}`,
          headers: headers,
        });
        if (data.status) {
          setOrders(data?.data?.data);
        }
      } catch (err) { }

    }
  }, [active]);

  useEffect(() => {
    handleFetchOrderTrash();
  }, [handleFetchOrderTrash])
  return (
    <div>
      <section className="DashboardSetting Order">
        {isLoading && (
          <div className="orderSection_preloader">
            <SmallLoader />
          </div>
        )}
        {/* header */}
        <HeaderDescription
          videoLink={
            {
              video: "https://www.youtube.com/embed/Z5bjNcweC8s?si=AYJvJWfJehFenQRO",
              title: "Effective Order Management tutorial"
            }}
          setSearch={setSearch}
          setOrders={setOrders}
          handleFilterStatusChange={handleFilterStatusChange}
          setEnableGlobalSearch={setEnableGlobalSearch}
          headerIcon={"flaticon-sent"}
          title={"Orders"}
          subTitle={"Order List"}
          search={false}
          order={true}
        />


        <Container maxWidth="sm">
          <div className="OrderTabs">
            <div className="CommonTab">
              <Box sx={{ width: "100%", typography: "body1" }}>
                <BootstrapButton
                  className={active === "pending" ? "filterActive" : ""}
                  onClick={e => handleFilterStatusChange("pending")}
                >
                  Pending
                  <h6>
                    {pendingOrderCount?.pending > 0
                      ? pendingOrderCount?.pending
                      : "0"}
                  </h6>
                </BootstrapButton>
                {myAddonsList[1]?.addons_id === 13 &&
                  myAddonsList[1]?.status === 1 && (
                    <BootstrapButton
                      className={active === "unverified" ? "filterActive" : ""}
                      onClick={e => handleFilterStatusChange("unverified")}
                    >
                      Unverified
                      <h6>
                        {pendingOrderCount?.unverified > 0
                          ? pendingOrderCount?.unverified
                          : "0"}
                      </h6>
                    </BootstrapButton>
                  )}

                <BootstrapButton
                  className={active === "confirmed" ? "filterActive" : ""}
                  onClick={e => handleFilterStatusChange("confirmed")}
                >
                  Confirmed
                  <h6>
                    {pendingOrderCount?.confirmed > 0
                      ? pendingOrderCount?.confirmed
                      : "0"}
                  </h6>
                </BootstrapButton>
                <BootstrapButton
                  className={active === "shipped" ? "filterActive" : ""}
                  onClick={e => handleFilterStatusChange("shipped")}
                >
                  Shipped
                  <h6>
                    {pendingOrderCount?.shipped > 0
                      ? pendingOrderCount?.shipped
                      : "0"}
                  </h6>
                </BootstrapButton>

                <BootstrapButton
                  className={active === "delivered" ? "filterActive" : ""}
                  onClick={e => handleFilterStatusChange("delivered")}
                >
                  Delivered
                  <h6>
                    {pendingOrderCount?.delivered > 0
                      ? pendingOrderCount?.delivered
                      : "0"}
                  </h6>
                </BootstrapButton>
                <BootstrapButton
                  className={active === "cancelled" ? "filterActive" : ""}
                  onClick={e => handleFilterStatusChange("cancelled")}
                >
                  Cancelled
                  <h6>
                    {pendingOrderCount?.cancelled > 0
                      ? pendingOrderCount?.cancelled
                      : "0"}
                  </h6>
                </BootstrapButton>
                <BootstrapButton
                  className={active === "returned" ? "filterActive" : ""}
                  onClick={e => handleFilterStatusChange("returned")}
                >
                  Returned
                  <h6>
                    {pendingOrderCount?.returned > 0
                      ? pendingOrderCount?.returned
                      : "0"}
                  </h6>
                </BootstrapButton>
                <BootstrapButton
                  className={active === "follow_up" ? "filterActive" : ""}
                  onClick={e => handleFilterStatusChange("follow_up")}
                >
                  Follow Up
                  <h6>
                    {pendingOrderCount?.follow_up > 0
                      ? pendingOrderCount?.follow_up
                      : "0"}
                  </h6>
                </BootstrapButton>
                {holdOnConfig ? (
                  <BootstrapButton
                    className={active === "hold_on" ? "filterActive" : ""}
                    onClick={e => handleFilterStatusChange("hold_on")}
                  >
                    Hold On
                    <h6>
                      {pendingOrderCount?.hold_on > 0
                        ? pendingOrderCount?.hold_on
                        : "0"}
                    </h6>
                  </BootstrapButton>
                ) : undefined}
                <BootstrapButton
                  className={active === "trashed" ? "filterActive" : ""}
                  onClick={e => handleFilterStatusChange("trashed")}
                >
                  Order Trash
                  {/* <h6>
                    {pendingOrderCount?.follow_up > 0
                      ? pendingOrderCount?.follow_up
                      : "0"}
                  </h6> */}
                </BootstrapButton>
              </Box>
            </div>

            {active === "pending" && (
              <div className="duelSelect">
                <Button className="CreateNewBtn" onClick={handleOpenModal}>
                  Create New Order <i className="flaticon-plus"></i>
                </Button>
              </div>
            )}
            {active === "shipped" && (
              <div className="duelSelect d_flex">
                {/* new Design */}
                <select
                  name=""
                  defaultValue=""
                  displayEmpty
                  onChange={handleCourierTypeChange}
                >
                  <option value="" disabled>
                    Select Courier Provider
                  </option>
                  <option value="steadfast"> Steadfast Courier</option>
                  <option value="pathao">Pathao Courier</option>
                </select>
              </div>
            )}

            {/* active === "confirmed" || */}
            {active === "confirmed" || active === "follow_up" ? (
              <div className="duelSelect d_flex">
                <div className="react_Select_custom_date_select">
                  {shippingDateConfig ?
                    active === "confirmed" ? <ReactSelect
                      options={confirmedOrderFilterOption}
                      onChange={(event) => handleSelected(event.value)}
                      placeholder="Find Your Shipping Order"
                    /> : null : null
                  }

                  {
                    active === "follow_up" ? <ReactSelect
                      options={followUpOrderFilterOption}
                      onChange={(event) => handleSelected(event.value)}
                      placeholder="Find Your Follow Up Order"
                    /> : null
                  }
                </div>
                <div>
                  {showPicker ? (
                    <DateRangePicker
                      startDate={startDate}
                      endDate={endDate}
                      focus={focus}
                      onStartDateChange={setStartDate}
                      onEndDateChange={setEndDate}
                      locale={enGB}
                      modifiersClassNames={{ open: "-open" }}
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
                    </DateRangePicker>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>

          <div className="d-flex ">
            {/* {
                                    selectedOrders.length > 0 &&
                                    <div className="AllDelete">
                                        <Button onClick={multiSelectOrdersDelete} className="bg">{selectedOrders.length} Delete All</Button>
                                    </div>
                                } */}
            {active === "confirmed" && selectedOrders.length > 0 && (
              <div className="AllDelete d_flex">
                <Button className="bg">
                  {selectedOrders.length} Selected Item
                </Button>
                <div className="Status">
                  <div className="commonDropdown">
                    <Button
                      id="fade-button-0"
                      aria-controls={anchorEls[0] ? "fade-menu-0" : undefined}
                      aria-haspopup="true"
                      aria-expanded={anchorEls[0] ? "true" : undefined}
                      onClick={event => handleClick1(event, 0)}
                    >
                      Select Courier
                      <i className="flaticon-arrow-down-sign-to-navigate"></i>
                    </Button>
                    <Menu
                      id="fade-menu-0"
                      className="commonDropdownUl"
                      MenuListProps={{
                        "aria-labelledby": "fade-button-0",
                      }}
                      anchorEl={anchorEls[0]}
                      open={Boolean(anchorEls[0])}
                      onClose={() => handleClose1(0)}
                    >
                      {courierList.length > 0 ? (
                        <MenuItem
                          onClick={e => {
                            multiSelectOrdersCouriers();
                            handleClose();
                          }}
                        >
                          <img
                            src="https://funnelliner.s3.ap-southeast-1.amazonaws.com/media/steadfast.svg"
                            alt=""
                            style={{
                              width: "20px",
                              height: "auto",
                              margin: "5px",
                            }}
                          />
                          SteadFast
                        </MenuItem>
                      ) : (
                        <MenuItem
                          onClick={e => {
                            courierReDriect();
                            handleClose();
                          }}
                        >
                          Add Courier
                        </MenuItem>
                      )}
                    </Menu>
                  </div>
                </div>
                <Link href={href}>
                  <Button className="bg">
                    Invoice Print <i class="flaticon-printer"></i>
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className=" OrderTabs CommonTab">
            <Box sx={{ width: "100%", typography: "body1" }}>
              {selectCourier === "steadfast" && (
                <BootstrapButton className={"filterActive"}>
                  <img
                    src="https://funnelliner.s3.ap-southeast-1.amazonaws.com/media/steadfast.svg"
                    alt=""
                    style={{
                      width: "20px",
                      height: "auto",
                      margin: "5px",
                    }}
                  />
                  Steadfast
                  <h6>
                    {pendingOrderCount?.steadfast > 0
                      ? pendingOrderCount?.steadfast
                      : "0"}
                  </h6>
                </BootstrapButton>
              )}
              {selectCourier === "pathao" && (
                <BootstrapButton className={"filterActive"}>
                  <img
                    src="https://funnelliner.s3.ap-southeast-1.amazonaws.com/media/pathao.svg"
                    alt=""
                    style={{
                      width: "20px", // Adjust the width as desired
                      height: "auto", // Set height to 'auto' to maintain aspect ratio
                      margin: "5px", // Adjust the margin value as desired
                    }}
                  />
                  Pathao
                  <h6>
                    {pendingOrderCount?.pathao > 0
                      ? pendingOrderCount?.pathao
                      : "0"}
                  </h6>
                </BootstrapButton>
              )}
            </Box>
          </div>

          <div className=" OrderTabs CommonTab">
            <Box sx={{ width: "100%", typography: "body1" }}>
              {selectCourier === "steadfast" &&
                Object?.entries(pendingOrderCount?.steadfast_status || {}).map(
                  ([field, value]) => {
                    return (
                      <BootstrapButton
                        key={field}
                        onClick={() => {
                          setSelectCourierStatus(field);
                          // handleFilterStatusCOurier(field);
                        }}
                        className={"filterActive"}
                      >
                        {courierStatusFormate(field)}
                        <h6>{value}</h6>
                      </BootstrapButton>
                    );
                  }
                )}
              {selectCourier === "pathao" &&
                Object?.entries(pendingOrderCount?.pathao_status || {}).map(
                  ([field, value]) => {
                    return (
                      <BootstrapButton
                        key={field}
                        onClick={() => {
                          setSelectCourierStatus(field);
                          // handleFilterStatusCOurier(field);
                        }}
                        className={"filterActive"}
                      >
                        {courierStatusFormate(field)}
                        <h6>{value}</h6>
                      </BootstrapButton>
                    );
                  }
                )}
            </Box>
          </div>

          <div className="DataTableContent">
            <div className="DataTable">
              {/* DataTableRow */}
              <div className="DataTableRow">
                <div className="DataTableColum">
                  {/* <input
                type="checkbox"
                checked={selectAll}
                onChange={toggleSelectAll}
            /> */}
                  {active === "confirmed" && (
                    <Checkbox
                      {...label}
                      checked={selectAll}
                      onChange={toggleSelectAll}
                    />
                  )}
                </div>

                <div className="DataTableColum">
                  <h3>SL</h3>
                </div>

                <div className="DataTableColum">
                  <h3>Order No & Date</h3>
                </div>

                <div className="DataTableColum Address">
                  <h3>Customer Info</h3>
                </div>

                <div className="DataTableColum">
                  <h3>Product Info</h3>
                </div>
                {/* <div className="DataTableColum">
                  <h3>Order Source</h3>
                </div> */}
                {active !== "shipped" && (
                  <div className="DataTableColum">
                    <h3>Discount</h3>
                  </div>
                )}
                {active !== "shipped" && (
                  <div className="DataTableColum">
                    <h3>Total Price</h3>
                  </div>
                )}

                {active !== "shipped" && advancedPaymentConfig && (
                  <div className="DataTableColum">
                    <h3>Advanced</h3>
                  </div>
                )}
                {active === "shipped" && (
                  <div className="DataTableColum Address">
                    <h3>Payment Info</h3>
                  </div>
                )}
                {
                  active !== "shipped" &&
                  <div className="DataTableColum">
                    <h3>Due</h3>
                  </div>
                }
                {active === "confirmed" && (
                  <>

                    <div className="DataTableColum">
                      <h3>Invoice</h3>
                    </div>
                    <div className="DataTableColum Address">
                      <h3>Select Courier</h3>
                    </div>

                    {/* <th width={20}>Select Courier</th> */}
                  </>
                )}
                {/* || active === "confirmed" */}
                {shippingDateConfig ? active === "confirmed" || active === "follow_up" ? (
                  <div className="DataTableColum">
                    <h3>
                      {
                        active === "confirmed" ? "Shipping Date" : "Follow Up Date"
                      }
                    </h3>
                  </div>
                ) : null : null}
                {active === "shipped" && (
                  <>
                    <div className="DataTableColum">
                      <h3>Courier Provider</h3>
                    </div>
                    <div className="DataTableColum">
                      <h3>Courier Status</h3>
                    </div>
                    <div className="DataTableColum">
                      <h3>Courier ID</h3>
                    </div>
                    <div className="DataTableColum">
                      <h3>Tracking Link</h3>
                    </div>
                  </>
                )}
                {(active === "delivered" || active === "returned") ? (
                  <React.Fragment>
                    <div className="DataTableColum">
                      <h3>Courier ID</h3>
                    </div>
                    <div className="DataTableColum">
                      <h3>Tracking Link</h3>
                    </div>
                  </React.Fragment>
                ) : null}
                {(active === "pending" ||
                  active === "follow_up" ||
                  active === "hold_on" ||
                  active === "cancelled") && (
                    <div className="DataTableColum Address">
                      <h3>Status</h3>
                    </div>
                  )}
                {active === "delivered" && (
                  <div className="DataTableColum">
                    <h3>Delivery Providers</h3>
                  </div>
                )}
                <div className="DataTableColum">
                  <h3>Notes</h3>
                </div>

                {(active === "pending" ||
                  active === "unverified" ||
                  active === "follow_up" ||
                  active === "shipped" ||
                  active === "confirmed" ||
                  active === "hold_on" ||
                  active === "delivered" ||
                  active === "cancelled" ||
                  active === "returned") && (
                    <div className="DataTableColum">
                      <h3>Action</h3>
                    </div>
                  )}
              </div>

              {/* DataTableRow */}
              {/* item */}

              {apiResponse ? orders?.length > 0 ? (
                orders.map((order, index) => {
                  return (
                    <div className="DataTableRow" key={index}>
                      <div className="DataTableColum">
                        {/* <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={() => handleOrderSelection(order.id)}
                    /> */}
                        {active === "confirmed" && (
                          <Checkbox
                            {...label}
                            checked={selectedOrders.includes(order.id)}
                            onChange={() => handleOrderSelection(order.id)}
                          />
                        )}
                      </div>

                      <div className="DataTableColum">
                        <div className="number">
                          {index + 1 + currentPage * 25 - 25}
                        </div>
                      </div>
                     
                      <div className="DataTableColum">
                        <Link href={`/order-details?id=${order?.id}`}>
                        <div className="orderColor">#{order?.order_no}</div>
                        </Link>
                       
                        {/* <p>   {moment(
                        order?.created_at
                    ).fromNow()
                    }</p> */}
                        <p>{moment(order?.created_at).format("h:mm a")}</p>
                        <p>
                          {moment(order?.created_at).format('DD.MM.YY')}
                        </p>
                        <p className="TotalPrice" style={{ color: orderType(order?.order_type) }}>
                          {Capitalized(order?.order_type)}
                        </p>
                      </div>



                      <div className="DataTableColum Address">
                        <div className="Name">
                          <div className="icon">
                            <i className="flaticon-user"></i>

                          </div>
                          <Tooltip
                            title={order?.customer_name}
                            placement="top-start"
                          >
                            <span>
                              {order?.customer_name?.length < 12 ? (
                                <span>{order?.customer_name}</span>
                              ) : (
                                <span>
                                  {order?.customer_name?.slice(0, 13)}
                                  ...
                                </span>
                              )}
                            </span>
                          </Tooltip>
                        </div>

                        <div className="Name PhoneNumber">
                          <div className="icon">
                            <i className="flaticon-phone-call"></i>
                          </div>
                          <Link href={`tel:${order?.phone}`}>
                            {removeTextFromNumber(order?.phone, "+88")}
                          </Link>
                        </div>

                        <div className="Name">
                          <div className="icon">
                            <i className="flaticon-location"></i>
                          </div>
                          <p>
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
                          </p>
                        </div>
                      </div>

                      <div className="DataTableColum">
                        <div className="Name" >
                          <Tooltip
                            title={order?.order_details[0]?.product ? order?.order_details?.map((item, index) => {
                              return (
                                <ul>
                                  <li>
                                    {" "}
                                    {index + 1} .{item?.product}{" "}-{item?.variant !== null && `(${item?.variant !== null ? item?.variations?.variant : ""})`}
                                  </li>
                                </ul>
                              );
                            }) : "N/A"}
                            placement="top-start"

                          >
                            <span style={{
                              display: "flex",
                              alignItem: "center",
                              justifyContent: "center",
                            }}>
                              {order?.order_details[0]?.product?.length < 15 ? (
                                  <span>
                                    {order?.order_details[0]?.product}
                                  </span>
                              ) : (
                            
                                  <span>
                                    {order?.order_details[0]?.product?.slice(
                                      0,
                                      13
                                    )}
                                    ...
                                  </span>
                                
                              )}
                            </span>
                          </Tooltip>
                        </div>
                        <div className="Quantity">
                          {/* variant: */}
                          <span>
                          {order?.order_details[0]?.variant !== null ? order?.order_details[0]?.variations?.variant : null}
                          </span>
                        </div>

                        <div className="Price">
                          <i className="flaticon-taka"></i>
                          {order?.order_details[0]?.variant !== null ? order?.order_details[0]?.variations?.price : order?.order_details[0]?.price}.00
                        </div>

                        <div className="Quantity">
                          Quantity:
                          <span>
                            {order?.order_details?.reduce(
                              (prevVal, currentVal) => {
                                return prevVal + currentVal?.quantity;
                              },
                              0
                            )}
                          </span>
                        </div>
                      </div>
                      {/* <div className="DataTableColum">
                        <div
                          className="TotalPrice"
                          style={{ color: orderType(order?.order_type) }}
                        >
                          {Capitalized(order?.order_type)}
                        </div>
                      </div> */}

                      {/* {active === 'pending' ?
                            <input key={order.id} type="text" defaultValue={order?.discount}
                                onKeyDown={(event => handleDiscount(event, order?.id, order?.order_status))} />
                            :
                            <span>{order?.discount}</span>
                        } */}

                      {active !== "shipped" && (
                        <div className="DataTableColum">
                          <div className="Discount">
                            {active === "pending" ? (
                              <>
                                <div className="inputTaka">
                                  <i className="flaticon-taka"></i>
                                </div>
                                <input
                                  key={order.id}
                                  type="text"
                                  defaultValue={
                                    order.discount_type === "percent"
                                      ? order?.discount + "%"
                                      : order?.discount
                                  }
                                  onKeyDown={event =>
                                    handleDiscount(
                                      event,
                                      order?.id,
                                      order?.order_status
                                    )
                                  }
                                />
                              </>
                            ) : (
                              <>
                                <i className="flaticon-taka"></i>
                                {order?.discount_type === "percent"
                                  ? order?.discount + "%"
                                  : order?.discount}
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {active !== "shipped" && (
                        <div className="DataTableColum">
                          <div className="TotalPrice">
                            <i className="flaticon-taka"></i>
                            {order?.grand_total}
                          </div>
                        </div>
                      )}

                      {active !== "shipped" && advancedPaymentConfig && (
                        <>
                          {active === "pending" ? (
                            <div className="DataTableColum">
                              <div className="Discount">
                                <div className="inputTaka">
                                  <i className="flaticon-taka"></i>
                                </div>
                                <input
                                  key={order.id}
                                  type="text"
                                  defaultValue={order?.advanced}
                                  onKeyDown={event =>
                                    handleAdvancedPayment(event, order?.id)
                                  }
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="DataTableColum">
                              <div className="TotalPrice">
                                <i className="flaticon-taka"></i>
                                {order?.advanced}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {active === "shipped" && (
                        <div className="DataTableColum Address PaymentInfo">
                          <div className="TotalPrice">
                            <span>Price</span> :<i className="flaticon-taka" style={{ marginRight: '-4px' }}></i>{order?.grand_total}
                          </div>

                          <div className="TotalPrice">
                            <span> Dis.</span> : <i className="flaticon-taka" style={{ marginRight: '-4px' }}></i>{order?.discount}
                          </div>

                          <div className="TotalPrice">

                            <span>Adv.</span> :<i className="flaticon-taka" style={{ marginRight: '-4px' }}></i> {order?.advanced}
                          </div>
                          <div className="TotalPrice">

                            <span>Due.</span> :<i className="flaticon-taka" style={{ marginRight: '-4px' }}></i> {order?.due}
                          </div>
                        </div>
                      )}
                      {
                        active !== "shipped" ?

                          <div className="DataTableColum">
                            <div className="TotalPrice">
                              <i className="flaticon-taka"></i>
                              {order?.due}
                            </div>
                          </div>
                          : null
                      }

                      {active === "confirmed" && (
                        <>
                          {/* <div className="DataTableColum">
                            <div className="TotalPrice">
                              <MobileDatePicker
                                defaultValue={dayjs(order?.confirmed_date)}
                                sx={{
                                  "& .MuiInputBase-input": {
                                    fontSize: "11px",
                                    padding: "0",
                                  },
                                }}
                                key={order?.id}
                                onChange={e => setShippingDate(dayjs(e))}
                                onAccept={() => onChangeShippingDate(order?.id)}
                              />
                            </div>
                          </div> */}
                          <div className="DataTableColum">
                            <div className="TotalPrice">
                              <Button className="invoice">
                                <Link
                                  target="_blank"
                                  href={"/invoice-one/" + order?.id}
                                  rel="noopener noreferrer"
                                >
                                  <i className="flaticon-printer" /> Print
                                </Link>
                              </Button>
                            </div>
                          </div>
                          <div
                            className="DataTableColum Address"
                            key={order.id}
                          >
                            <div className="Status">
                              <div className="commonDropdown">
                                <FormControl
                                  sx={{ m: 1, width: 150 }}
                                  key={order.id}
                                >
                                  <Select
                                    value={courierViewValue}
                                    displayEmpty
                                    defaultValue={selectedStatus}
                                    onChange={event =>
                                      courierSubmit(event, order?.id)
                                    }
                                    input={<OutlinedInput />}
                                    inputProps={{
                                      "aria-label": "Without label",
                                    }}
                                  >
                                    <MenuItem value="">
                                      <em>Select Status</em>
                                    </MenuItem>
                                    <MenuItem key={"office"} value={"office"}>
                                      <i
                                        style={{
                                          width: "20px",
                                          height: "auto",
                                          margin: "5px",
                                        }}
                                        className="flaticon-people"
                                      ></i>
                                      Office Delivery
                                    </MenuItem>
                                    {courierList.length > 0 ? (
                                      courierList.map(item => {
                                        return (
                                          <MenuItem
                                            key={item?.provider}
                                            value={item?.provider}
                                          >
                                            {item?.provider === "steadfast" ? (
                                              <>
                                                <img
                                                  src="https://funnelliner.s3.ap-southeast-1.amazonaws.com/media/steadfast.svg"
                                                  alt=""
                                                  style={{
                                                    width: "20px",
                                                    height: "auto",
                                                    margin: "5px",
                                                  }}
                                                />
                                                SteadFast
                                              </>
                                            ) : (
                                              <>
                                                <img
                                                  src="https://funnelliner.s3.ap-southeast-1.amazonaws.com/media/pathao.svg"
                                                  alt=""
                                                  style={{
                                                    width: "20px",
                                                    height: "auto",
                                                    margin: "5px",
                                                  }}
                                                />
                                                Pathao
                                              </>
                                            )}
                                          </MenuItem>
                                        );
                                      })
                                    ) : (
                                      <MenuItem
                                        key={"redriect-courier"}
                                        value={"redriect-courier"}
                                      >
                                        <i
                                          style={{
                                            width: "20px",
                                            height: "auto",
                                            margin: "5px",
                                          }}
                                          className="flaticon-courier"
                                        ></i>
                                        Add Courier
                                      </MenuItem>
                                    )}
                                  </Select>
                                </FormControl>

                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      {shippingDateConfig && active === "follow_up" && (
                        <div className="DataTableColum">
                          <div className="TotalPrice">
                            <MobileDatePicker
                              defaultValue={dayjs(order?.follow_up_date)}
                              sx={{
                                "& .MuiInputBase-input": {
                                  fontSize: "11px",
                                  padding: "0",
                                },
                              }}
                              key={order?.id}
                              onChange={e => setFollowUpDate(dayjs(e))}
                              onAccept={() => onChangeDate(order?.id, "follow_up")}
                            />
                          </div>
                        </div>
                      )}

                      {shippingDateConfig ? active === "confirmed" ? (
                        <div className="DataTableColum">
                          <div className="TotalPrice">
                            <MobileDatePicker
                              defaultValue={order?.confirmed_date !== null ? dayjs(order?.confirmed_date) : dayjs(moment(order?.updated_at).format("YYYY-MM-DD"))}
                              sx={{
                                "& .MuiInputBase-input": {
                                  fontSize: "11px",
                                  padding: "0",
                                },
                              }}
                              key={order?.id}
                              onChange={e => setFollowUpDate(dayjs(e))}
                              onAccept={() => onChangeDate(order?.id, "confirmed")}
                            />
                          </div>
                        </div>
                      ) : null : null}
                      {active === "shipped" && (
                        <>
                          <div className="DataTableColum">
                            <div className="TotalPrice">
                              {/* <i className='flaticon-taka'></i> */}
                              {order?.courier_provider === "steadfast" ? (
                                <>
                                  <img
                                    src="https://funnelliner.s3.ap-southeast-1.amazonaws.com/media/steadfast.svg"
                                    alt=""
                                    style={{
                                      width: "20px", // Adjust the width as desired
                                      height: "auto", // Set height to 'auto' to maintain aspect ratio
                                      margin: "5px", // Adjust the margin value as desired
                                    }}
                                  />
                                  SteadFast
                                </>
                              ) : (
                                <>
                                  <img
                                    src="https://funnelliner.s3.ap-southeast-1.amazonaws.com/media/pathao.svg"
                                    alt=""
                                    style={{
                                      width: "20px", // Adjust the width as desired
                                      height: "auto", // Set height to 'auto' to maintain aspect ratio
                                      margin: "5px", // Adjust the margin value as desired
                                    }}
                                  />
                                  Pathao
                                </>
                              )}
                            </div>
                          </div>
                          <div className="DataTableColum">
                            <div className="TotalPrice">
                              {courierStatusFormate(order?.courier_status)}
                            </div>

                          </div>
                          <div className="DataTableColum">
                            <div className="TotalPrice ">
                              {
                                order?.consignment_id ?
                                  <div className="TrackingId">
                                    <Tooltip
                                      title={order?.consignment_id}
                                      placement="top-start"
                                    >
                                      <span>
                                        {order?.consignment_id?.length < 30 ? (
                                          <span>{order?.consignment_id}</span>
                                        ) : (
                                          <span>
                                            {order?.consignment_id?.slice(
                                              0,
                                              30
                                            )}
                                            ..
                                          </span>
                                        )}
                                      </span>
                                    </Tooltip>

                                    {/* {order?.consignment_id} */}
                                    {
                                      order?.consignment_id ?
                                        <CopyIcon
                                          url={
                                            order?.consignment_id
                                          } /> : null
                                    }


                                  </div> : <div className="TrackingId" style={{ textAlign: 'center' }}>N/A</div>
                              }





                            </div>
                          </div>
                          <div className="DataTableColum">
                            <div className="TotalPrice">
                              {/* <i className='flaticon-taka'></i> */}

                              {order?.courier_provider === "steadfast" ? (
                                <Link
                                  href={`https://steadfast.com.bd/t/${order?.tracking_code}`}
                                  className="TrackingId"
                                  target="_blank"
                                >
                                  {order?.tracking_code}
                                </Link>
                              ) : (
                                <Link
                                  href={`https://merchant.pathao.com/tracking?consignment_id=${order?.tracking_code}&phone=${order?.phone}`}
                                  className="TrackingId"
                                  target="_blank"
                                >
                                  {order?.tracking_code}
                                </Link>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                      {(active === "delivered" || active === "returned") ? (
                        <React.Fragment>
                          <div className="DataTableColum">
                            <div className="TotalPrice ">
                              {
                                order?.consignment_id ?
                                  <div className="TrackingId">
                                    <Tooltip
                                      title={order?.consignment_id}
                                      placement="top-start"
                                    >
                                      <span>
                                        {order?.consignment_id?.length < 30 ? (
                                          <span>{order?.consignment_id}</span>
                                        ) : (
                                          <span>
                                            {order?.consignment_id?.slice(
                                              0,
                                              30
                                            )}
                                            ..
                                          </span>
                                        )}
                                      </span>
                                    </Tooltip>
                                    {
                                      order?.consignment_id ?
                                        <CopyIcon
                                          url={
                                            order?.consignment_id
                                          } /> : null
                                    }
                                  </div> : <div className="TrackingId" style={{ textAlign: 'center' }}>N/A</div>
                              }
                            </div>
                          </div>
                          <div className="DataTableColum">
                            <div className="TotalPrice">
                              {
                                order?.tracking_code ?
                                  order?.courier_provider === "steadfast" ? (
                                    <Link
                                      href={`https://steadfast.com.bd/t/${order?.tracking_code}`}
                                      className="TrackingId"
                                      target="_blank"
                                    >
                                      {order?.tracking_code}
                                    </Link>
                                  ) : (
                                    <Link
                                      href={`https://merchant.pathao.com/tracking?consignment_id=${order?.tracking_code}&phone=${order?.phone}`}
                                      className="TrackingId"
                                      target="_blank"
                                    >
                                      {order?.tracking_code}
                                    </Link>
                                  ) : <div className="TrackingId" style={{ textAlign: 'center' }}>N/A</div>
                              }

                            </div>
                          </div>
                        </React.Fragment>
                      ) : null}

                      {(active === "pending" ||
                        active === "follow_up" ||
                        active === "hold_on" ||
                        active === "cancelled") && (
                          <div className="DataTableColum Address">
                            <div className="Status ">


                              <FormControl sx={{ m: 1, width: 150 }}>
                                <Select
                                  displayEmpty
                                  value={order?.order_status}
                                  onChange={event =>
                                    handleStatusChange(event, order?.id)
                                  }
                                  input={<OutlinedInput />}
                                  inputProps={{ "aria-label": "Without label" }}
                                >
                                  <MenuItem disabled value="">
                                    <em>Select Status</em>
                                  </MenuItem>
                                  {active === "pending" &&
                                    pendingStatus.map((item, index) => (
                                      <MenuItem
                                        key={index}
                                        value={item.value}
                                        selected={
                                          item.value === order?.order_status
                                        }
                                      >
                                        {item.item}
                                      </MenuItem>
                                    ))}

                                  {active === "follow_up" &&
                                    followUpStatus.map((status, index) => (
                                      <MenuItem
                                        key={index}
                                        value={status.value}
                                        selected={
                                          status.value === order?.order_status
                                        }
                                      >
                                        {status.item}
                                      </MenuItem>
                                    ))}

                                  {active === "hold_on" &&
                                    holdOnStatus.map((status, index) => (
                                      <MenuItem
                                        key={index}
                                        value={status.value}
                                        selected={
                                          status.value === order?.order_status
                                        }
                                      >
                                        {status.item}
                                      </MenuItem>
                                    ))}
                                  {active === "cancelled" &&
                                    cancelledOnStatus.map((status, index) => (
                                      <MenuItem
                                        key={index}
                                        value={status.value}
                                        selected={
                                          status.value === order?.order_status
                                        }
                                      >
                                        {status.item}
                                      </MenuItem>
                                    ))}
                                </Select>
                              </FormControl>
                            </div>
                          </div>
                        )}
                      {active === "delivered" && (
                        <div className="DataTableColum">
                          <div className="TotalPrice">
                            {/* <i className='flaticon-taka'></i> */}
                            {order.courier_provider !== null
                              ? order.courier_provider === "steadfast" ? (
                                <>
                                  <img
                                    src="https://funnelliner.s3.ap-southeast-1.amazonaws.com/media/steadfast.svg"
                                    alt=""
                                    style={{
                                      width: "20px",
                                      height: "auto",
                                      margin: "5px",
                                    }}
                                  />
                                  SteadFast
                                </>
                              ) : (
                                <>
                                  <img
                                    src="https://funnelliner.s3.ap-southeast-1.amazonaws.com/media/pathao.svg"
                                    alt=""
                                    style={{
                                      width: "20px",
                                      height: "auto",
                                      margin: "5px",
                                    }}
                                  />
                                  Pathao
                                </>
                              )
                              : "Office Delivery"}
                          </div>
                        </div>
                      )}

                      <div key={order?.id} className="DataTableColum">
                        <div
                          className="Note"
                          style={{
                            display: "flex",
                            alignItem: "center",
                            justifyContent: "center",
                          }}
                        >

                          <Button
                            key={order?.id}
                            onClick={() =>
                              handleOpenOrderNoteModal(
                                order?.id,
                                order?.order_note
                              )
                            }
                          >
                            {getNoteDefaultValue(order?.order_note)}

                            {countNonNullFields(
                              order?.invoice_note,
                              order?.courier_note
                            ) > 0 && (
                                <h6>
                                  {countNonNullFields(
                                    order?.invoice_note,
                                    order?.courier_note
                                  )}
                                  <i class="flaticon-plus"></i>
                                </h6>
                              )}
                          </Button>
                          <Note
                            orderNote={order}
                            isOpenOrderNoteModal={isOpenOrderNoteModal}
                            handleCloseOrderNoteModal={
                              handleCloseOrderNoteModal
                            }
                            onChangeOrderNoteData={onChangeOrderNoteData}
                            orderIdOfModal={orderIdOfModal}
                            orderNo={order?.id}
                            status={order?.order_status}
                            handleFetch={handleFetch}
                            startLoading={startLoading}
                            stopLoading={stopLoading}
                          />
                        </div>
                      </div>
                      {
                        active !== "trashed" ?
                          <div className="DataTableColum">
                            <div className="Action">
                              <div className="commonDropdown">
                                <PopupState variant="popover" popupId="demo-popup-menu">
                                  {(popupState) => (
                                    <>
                                      <Button {...bindTrigger(popupState)}>
                                        <BsThreeDotsVertical />
                                      </Button>
                                      <Menu
                                        id="fade-menu"
                                        className="commonDropdownUl"
                                        MenuListProps={{
                                          "aria-labelledby": "fade-button",
                                        }}
                                        anchorEl={anchorEl}
                                        open={open}
                                        onClose={handleClose}
                                        {...bindMenu(popupState)}
                                      >
                                        <MenuItem
                                          className="viewActionBtn"
                                          onClick={() => {
                                            router.push(`/order-details?id=${order?.id}`)
                                            popupState.close();
                                          }}
                                        >
                                          <i
                                            className="flaticon-view"
                                            style={{
                                              width: "20px",
                                              height: "auto",
                                              margin: "5px",
                                            }}
                                          />
                                          View
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            handleOrderUpdate(order?.id),
                                              setOrderId(order?.id);
                                            setOrderStatus(order?.status);
                                          }}
                                        >
                                          <i
                                            className="flaticon-edit"
                                            style={{
                                              width: "20px",
                                              height: "auto",
                                              margin: "5px",
                                            }}
                                          />
                                          Edit
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => { moveToTrash(order?.id); popupState.close() }
                                          }
                                        >
                                          <i
                                            className="flaticon-delete"
                                            style={{
                                              width: "20px",
                                              height: "auto",
                                              margin: "5px",
                                            }}
                                          />
                                          Move to Trash
                                        </MenuItem>

                                      </Menu>
                                    </>
                                  )}
                                </PopupState>
                              </div>
                            </div>
                          </div> : null
                      }


                    </div>
                  );
                })
              ) : (
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
              ) :
                <Box sx={{ width: "100%" }} spacing={2}>
                  {[...Array(15)].map((_, index) => (
                    <Skeleton key={index} />
                  ))}
                  <Skeleton />
                </Box>
              }

            </div>
          </div>

          <Paginator
            count={totalPage}
            page={currentPage}
            onChange={handleChange}
            showFirstButton
            showLastButton
            variant="outlined"
          />
        </Container>
      </section>
      <OrderModal
        modalOpen={modalOpen}
        handleCloseModal={handleCloseModal}
        products={products}
        handleFetch={handleFetch}
        orderUpdate={orderUpdate}
      />
      <ViewModal
        key={order.id}
        order={order}
        handleCloseViewModal={handleCloseViewModal}
        status={orderStatus}
        viewModalOpen={viewOrderModal}
        handleFetch={handleFetch}
      />
      <OrderUpdateModal
        key={order.id}
        order={order}
        products={products}
        orderId={orderId}
        orderUpdate={orderUpdate}
        modalOpenUpdate={modalOpenUpdate}
        handleCloseOrderUpdateModal={handleCloseOrderUpdateModal}
        handleFetch={handleFetch}
      />
      {cities && (
        <CourierModal
          handleCourierModalOpen={courierModal}
          handleCourierModalClose={handleCourierModalClose}
          city={cities}
          order_id={orderId}
        />
      )}
    </div>
  );
};
// export default index;
export default withAuth(OrderPage, {
  isProtectedRoute: true,
});

