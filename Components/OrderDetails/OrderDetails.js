import { Button, Container, Grid } from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import { headers } from "../../pages/api";
import moment from "moment";
import { useToast } from "../../hook/useToast";
import CopyIcon from "../UI/CopyIcon/CopyIcon";
import { courierStatusFormate } from "../../constant/capitalized";
import { toast } from "react-hot-toast";
import SuperFetch from "../../hook/Axios";


const OrderDetails = () => {
  const router = useRouter();
  const showToast = useToast();
  const [OrderDetails, setOrderDetails] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [fetchApi, setFetch] = useState(false);
  const handleFetchOrderDetails = useCallback(async () => {
    try {
      let data = await axios({
        method: "get",
        url: `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ORDERS.ORDER_DETAILS_BY_ID}/${router?.query?.id}`,
        headers: headers,
      });
      setOrderDetails(data?.data?.data);
    } catch (err) {
    }
  }, [router?.query?.id, fetchApi]);


  const handleKeyDownNote = (event, id, status) => {
    if (event.key === "Enter") {
      let data = {
        note: event.target.value,
        type: status,
      };
      axios.post(API_ENDPOINTS.BASE_URL + `/client/order/note/${id}/update`, data, {
        headers: headers,
      })
        .then(function (res) {

          showToast(res.data?.message);

        })
        .catch((error) => {
          showToast("Something went wrong. Please wait for some time", "error");
        });
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

  useEffect(() => {
    handleFetchOrderDetails();
  }, [handleFetchOrderDetails]);

  console.log("OrderDetails", OrderDetails)
  return (
    <>
      <section className="OrderDetailsPage">
        <Container maxWidth="sm">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div className="OrderDetailsContent boxShadow">
                {/* header */}
                <div className="Header d_flex d_justify">
                  {/* left */}
                  <h3>
                    <Link href="">
                      <i className="flaticon-left-arrow"></i>
                    </Link>
                    Order Details
                  </h3>
                  <div className="right d_flex">
                    <select name="" defaultValue={OrderDetails?.order_status}>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="follow_up">Follow up</option>
                      <option value="shipped">shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>

                    {/* <select name="">
                      <option value="pending">Paid</option>
                      <option value="pending">Unpaid</option>
                    </select> */}

                    {
                      OrderDetails.courier_provider ?
                        <select name="" defaultValue={OrderDetails?.courier_provider}>
                          <option value="">Select Courier</option>
                          <option value="pathao">Pathao</option>
                          <option value="steadfast">State Fast</option>
                        </select> : null
                    }



                    <Button className="bg" onClick={"/invoice-one/" + OrderDetails?.id}>
                      <i className="flaticon-printer"></i> Print Invoice
                    </Button>
                  </div>
                </div>
                {/* OrderNumber */}
                <div className="OrderNumber d_flex d_justify">
                  {/* left */}
                  <div className="left">
                    <h4>
                      Order ID #{OrderDetails?.order_no}<CopyIcon
                        url={
                          OrderDetails?.order_no
                        }
                      />
                    </h4>
                    <ul>
                      <li>
                        <span>Order date: </span>{moment(OrderDetails?.created_at).format('DD MMM YYYY hh:mm:ss A')}
                        {/* 09 Dec 2022 06:37:46 PM */}
                      </li>
                      <li>
                        <span>Order status: </span>
                        <span className="status"> {courierStatusFormate(OrderDetails?.order_status)}</span>
                      </li>
                      <li>
                        <span>Payment method :</span>
                        Cash On Delivery
                      </li>
                      <li>
                        <span>Payment Status : </span>
                        <span className="unpaid"> Panding</span>
                      </li>
                      <li>
                        <span>Order Source : </span>
                        <span className="phone"> {courierStatusFormate(OrderDetails?.order_type)}</span>
                      </li>
                    </ul>
                  </div>
                  {/* right */}
                  <div className="right">
                    <h4>Customer Information</h4>
                    <ul>
                      <li>
                        <span>Name: </span>
                        <span className="name">{OrderDetails?.customer_name}</span>
                      </li>
                      <li>
                        <span>Phone: </span>
                        <span className="name">{OrderDetails?.phone}</span>
                        <CopyIcon
                          url={
                            OrderDetails?.phone
                          }
                        />
                      </li>
                      <li>Location: {OrderDetails?.address}</li>
                    </ul>
                  </div>
                </div>

                {/* table */}
                <div className="Table">
                  <table>
                    <thead>
                      <tr>
                        {/* <th><Checkbox/></th> */}
                        <th>SL</th>
                        <th>Item Details</th>
                        <th>Price</th>
                        <th>Product Code</th>
                        <th>QTY (BDT)</th>
                        <th>Discount</th>
                        <th>Total Price</th>
                      </tr>
                    </thead>

                    <tbody>
                      {
                        OrderDetails?.order_details?.map((item, index) => {

                          return (
                            <tr key={item?.id}>
                              <td>
                                {index + 1}
                              </td>
                              <td>
                                <img src={item?.media} alt={item?.product} />
                                <div>
                                  <p>{item?.product}</p>
                                  <p>
                                    {item?.variations !== null ? item?.variations?.variant : null}
                                  </p>
                                </div>

                              </td>
                              <td>
                                <i className="flaticon-taka"></i> {item?.variant !== null ? item?.variations?.price : item?.price}.00
                              </td>
                              <td>{item?.variant !== null ? item?.variations?.code : item?.product_code}</td>
                              <td>{item?.variant !== null ? item?.variations?.quantity : item?.quantity}</td>
                              <td>
                                <i className="flaticon-taka"></i> {item?.discount}
                              </td>
                              <td>
                                <i className="flaticon-taka"></i> {item?.variant !== null ? item?.variations?.price * item?.variations?.quantity : item?.price * item?.quantity}.00
                              </td>
                              {/* <td>
                                <i className="flaticon-taka"></i> 234.00
                              </td> */}
                            </tr>
                          )
                        })
                      }

                    </tbody>
                  </table>
                </div>

                {/* OrderTracking */}
                <div className="OrderTracking">
                  {/* left */}
                  <div className="OrderTrackingLeft">
                    {/* <div className="header">
                      <h4>Order Tracking Timeline</h4>
                    </div> */}

                    <div className="OrderTrackingLeftBox">
                      {/* <div className="OrderTrackingLeftLeft">
                        <div className="TrackingLink">
                          <h5>
                            Tracking Link:
                            <span>https://steadfast.com.bd/t/2252D1C4D</span>
                            <i className="flaticon-copy"></i>
                          </h5>
                        </div>
                        <div className="TrackingDetails">
                         
                          <div className="time">
                         
                            <div className="timeItem">
                              <h6>09 Dec 2022 </h6>
                              <h6>06:37:46 PM</h6>
                            </div>
                      
                            <div className="timeItem">
                              <h6>09 Dec 2022 </h6>
                              <h6>06:37:46 PM</h6>
                            </div>
                          </div>
                        
                          <div className="TrackingDetailsBg">
                            <div className="TrackingDetailsItem">
                              <img src="/images/order_bdr.png" alt="" />
                            </div>
                            <div className="TrackingDetailsItem">
                              <img src="/images/order_bdr.png" alt="" />
                            </div>
                          </div>

                          <div className="TrackingDetailsStatus">
                            <h4>Order received for landing page</h4>
                            <h4>Order received for landing page</h4>
                          </div>
                        </div>
                      </div> */}

                      <div className="OrderTrackingLeftRight">
                        {/* item */}
                        <div className="OrderNote">
                          <label>
                            <i className="flaticon-bill"></i>Order Note
                          </label>
                          <textarea defaultValue={OrderDetails?.order_note} name="" rows="5" onKeyDown={(event) =>
                            handleKeyDownNote(event, OrderDetails?.id, OrderDetails?.order_status)
                          }></textarea>
                        </div>
                        {/* item */}
                        <div className="OrderNote">
                          <label>
                            <i className="flaticon-wallet-1"></i>Invoice Note
                          </label>
                          <textarea defaultValue={OrderDetails?.invoice_note} name="" rows="5" onKeyDown={(event) =>
                            handleKeyDownNote(event, OrderDetails.id, OrderDetails.order_status)
                          }></textarea>
                        </div>
                        {/* item */}
                        <div className="OrderNote">
                          <label>
                            <i className="flaticon-express-delivery"></i>Courier
                            Note
                          </label>
                          <textarea defaultValue={OrderDetails?.courier_note} name="" rows="5" onKeyDown={(event) =>
                            handleKeyDownNote(event, OrderDetails.id, OrderDetails.order_status)
                          }></textarea>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* right */}
                  <div className="OrderTrackingRight">
                    <ul>
                      <li>
                        <span>Sub Total : </span>
                        <p>
                          <i className="flaticon-taka"></i>


                          {OrderDetails?.grand_total}.00
                        </p>
                      </li>
                      <li>
                        <span>Discount : </span>
                        <p>
                          <i className="flaticon-taka"></i> -
                          {
                            OrderDetails?.order_status === "pending" ||
                              OrderDetails?.order_status === "confirmed" ?
                              <input
                                key={OrderDetails.id}
                                type="text"
                                defaultValue={
                                  OrderDetails.discount_type === "percent"
                                    ? OrderDetails?.discount + "%"
                                    : OrderDetails?.discount
                                }
                                onKeyDown={event =>
                                  handleDiscount(
                                    event,
                                    OrderDetails?.id,
                                    OrderDetails?.order_status
                                  )
                                }
                              /> :
                              <>
                                {OrderDetails?.discount}.00
                              </>

                          }


                        </p>
                      </li>
                      <li>
                        <span>Advance Payment : </span>
                        <p>
                          <i className="flaticon-taka"></i> +
                          {
                            OrderDetails?.order_status === "pending" ||
                              OrderDetails?.order_status === "confirmed" ?
                              <input
                                key={OrderDetails.id}
                                type="text"
                                defaultValue={OrderDetails?.advanced}
                                onKeyDown={event =>
                                  handleAdvancedPayment(event, OrderDetails?.id)
                                }
                              /> :
                              <>
                                {OrderDetails?.advanced}.00
                              </>
                          }

                        </p>
                      </li>
                      <li>
                        <span>Delivery Fee : </span>
                        <p>
                          <i className="flaticon-taka"></i> + {OrderDetails?.shipping_cost}.00
                        </p>
                      </li>
                      <li>
                        <span>Total Due : </span>
                        <p>
                          <i className="flaticon-taka"></i> + {OrderDetails?.due}.00
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </Container>
      </section>
    </>
  );
};

export default OrderDetails;
