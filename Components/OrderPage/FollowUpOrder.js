import { Box, Button } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";

import Tooltip from "@mui/material/Tooltip";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { baseUrl } from "../../constant/constant";
import { headers } from "../../pages/api";
import { useGetOrdersQuery } from "../../redux/features/order/orderApi";
import Note from "./Note";
;



const handleClose = () => {
  setAnchorEl(null);
};

const FollowUpOrder = ({ searchQuery, allProducts, show, advanceStatus }) => {
  const { data, isLoading } = useGetOrdersQuery("follow_up");
  const [searchQueryString, setSearchQueryString] = useState(searchQuery);
  useEffect(() => {
    setSearchQueryString(searchQuery);
  }, [searchQuery]);

  const [products, setProducts] = useState([]);
  const [filterProducts, setFilterProducts] = useState();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(25);



  const [updateData, setUpdateData] = useState("");

  const [openStock, setOpenStock] = useState(false);
  const handleOpenStock = () => setOpenStock(true);





  useEffect(() => {
    const userProduct = data?.data?.filter(
      (word) => word?.order_status == "follow_up"
    );
    setProducts(userProduct);
    setFilterProducts(userProduct);
  }, [updateData]);

  const statusSubmit = (id, status) => {
    let statusUpdate = {
      order_id: id,
      status: status,
    };

    if (status === "cancelled") {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .post(
              process.env.NEXT_PUBLIC_API_URL + "/client/orders/status/update",
              statusUpdate,
              {
                headers: headers,
              }
            )
            .then(function (response) {
              toast.success("Order Status Update to Successfully", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
              });
              setUpdateData(response);
            })
            .catch(function (error) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: error?.response?.data?.msg,
                footer: error?.response?.data?.msg,
              });
            });
        }
      });
    } else {
      axios
        .post(
          process.env.NEXT_PUBLIC_API_URL + "/client/orders/status/update",
          statusUpdate,
          {
            headers: headers,
          }
        )
        .then(function (response) {
          toast.success("Order Status Update to Successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setUpdateData(response);
        })
        .catch(function (error) {
         
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error?.response?.data?.msg,
            footer: error?.response?.data?.msg,
          });
        });
    }
  };

  const indexOfLastProducts = currentPage * perPage;
  const indexOfFirstProducts = indexOfLastProducts - perPage;
  const currentProduct = data?.data?.slice(
    indexOfFirstProducts,
    indexOfLastProducts
  );

  const pageNumbers = [];
  if (searchQueryString?.length === 0) {
    for (let i = 1; i <= Math.ceil(data?.data?.length / perPage); i++) {
      pageNumbers.push(i);
    }
  } else if (searchQueryString?.length > 0) {
    for (let i = 1; i <= Math.ceil(filterProducts?.length / perPage); i++) {
      pageNumbers.push(i);
    }
  }

  // search method
  const handleChangeSearchBox = () => {
    const filtered = products.filter(
      (item) =>
        item?.order_no?.toString().includes(searchQuery) ||
        item?.customer_name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item?.phone?.includes(searchQuery)
    );
    setFilterProducts(filtered);
  };

  useEffect(() => {
    if (searchQueryString?.length > 0) {
      handleChangeSearchBox();
    }
  }, [searchQueryString]);

 

  const today = new Date().toISOString().slice(0, 10);



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


  // note update


  const handleKeyDown = (id, event) => {
    if (event.key === "Enter") {
      let data = {
        note: event.target.value,
        type: "follow_up",
      };

      axios
        .post(process.env.NEXT_PUBLIC_API_URL + `/client/order/note/${id}/update`, data, {
          headers: headers,
        })
        .then(function (response) {
          toast.success("Note updated for Pending order!", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });

        });
    }
  };

  var curr = new Date();
  curr.setDate(curr.getDate() + 3);




  const handleKeyDownAdvance = (id, event, tk) => {
    if (event.key === "Enter") {
      let adv = {
        advanced: tk,
      };
      if (tk?.length > 0) {
        axios
          .post(
            process.env.NEXT_PUBLIC_API_URL + `/client/order/advance-payment/${id}/update`,
            adv,
            {
              headers: headers,
            }
          )
          .then(function (response) {
            toast.success("Advance payment updated for order!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            setUpdateData(response);
          })
          .catch(function (error) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error?.response?.data?.msg,
              footer: error?.response?.data?.msg,
            });
          });
      }
    }
  };

  //filter follow up order by today, tomorrow, next seven days

  const [isOpenCustomDate, setIsIpenCustomDate] = useState(false);
  const handleChangeFollowUpDate = (e) => {
    // setSearchQueryString('click')
    const date = new Date();
    if (e.target.value === "Today") {
      const today = new Date().toISOString().slice(0, 10);
      const filterFollowUpOrderByToday = products?.filter(
        (item) => item?.follow_up_date?.slice(0, 10) === today
      );
      setFilterProducts(filterFollowUpOrderByToday);
      // setProducts(filterFollowUpOrderByToday)
      setIsIpenCustomDate(false);
    } else if (e.target.value === "Tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowDateData = tomorrow.toISOString().slice(0, 10);
      const filterFollowUpOrderByTomorrow = products?.filter(
        (item) => item?.follow_up_date?.slice(0, 10) === tomorrowDateData
      );
      setFilterProducts(filterFollowUpOrderByTomorrow);
      setIsIpenCustomDate(false);
    } else if (e.target.value === "Next 7 Days") {
      const currentDate = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(currentDate.getDate() + 7);
      date.setDate(date.getDate() + 7);
      const filterFollowUpOrderByTomorrow = products?.filter(
        (item) =>
          new Date(item?.follow_up_date) >= currentDate &&
          new Date(item?.follow_up_date) <= nextWeek
      );
      setFilterProducts(filterFollowUpOrderByTomorrow);
      // setProducts(filterFollowUpOrderByTomorrow)

      setIsIpenCustomDate(false);
    } else if (e.target.value === "Custom Date") {
      setIsIpenCustomDate(true);
      setFilterProducts(products);
    }
  };

  //filter followUp order by custom date range



  const [fromDate, setFormDate] = useState();
  const [toDate, setToDate] = useState();
  const handleChangeCustomDate = (e) => {
    if (e.target.name === "fromDate") {
      setFormDate(new Date(e.target.value));
    }
    if (e.target.name === "toDate") {
      setToDate(new Date(e.target.value));
      // handleDataFilterByCustomDate()
    }
  };
  const handleDataFilterByCustomDate = () => {
    setIsIpenCustomDate(false);
    if (fromDate && toDate) {
      const filterFollowUpOrderByDatesInRange = products.filter(
        (item) =>
          new Date(item?.follow_up_date) >= fromDate &&
          new Date(item?.follow_up_date) <= toDate
      );
      setFilterProducts(filterFollowUpOrderByDatesInRange);
    }
  };
 



  return (
    <>
      <div className="Pending">
        <div className="FollowUpOrderFilterSection">
          <div className="FollowUpOrderFilter ">
            <h4>Find Your Follow Up Order</h4>
            <select onChange={handleChangeFollowUpDate}>
              <option value="">Select Day</option>
              <option value="Today">Today</option>
              <option value="Tomorrow">Tomorrow</option>
              <option value="Next 7 Days">Next 7 Days</option>
              <option value="Custom Date">Select Custom Date Range</option>
            </select>
            {isOpenCustomDate && (
              <div className="InputDate">
                <div className="d_flex">
                  <div className="Item">
                    <label>From</label>
                    <input
                      onChange={handleChangeCustomDate}
                      name="fromDate"
                      type="date"
                    />
                  </div>

                  <div className="Item">
                    <label>To</label>
                    <input
                      onChange={handleChangeCustomDate}
                      name="toDate"
                      type="date"
                    />
                  </div>
                </div>

                <div className="Item" style={{}}>
                  <Button onClick={handleDataFilterByCustomDate}>Search</Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {searchQueryString?.length === 0 && (
          <div className="ProductTable">
            <table>
              <thead>
                <tr>
                  <th>{/* <Checkbox /> */}</th>
                  <th>SL</th>
                  <th>Order No</th>
                  <th>Customer Name</th>
                  <th>Order Date</th>
                  <th>Contact No.</th>
                  <th>Address</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  {advanceStatus === true && (
                    <>
                      <th>Adv</th>
                      <th>Due</th>
                    </>
                  )}
                  <th>Total Price</th>
                  <th>Follow Up Date</th>
                  <th>Status</th>
                  <th>Note</th>
                </tr>
              </thead>

              {isLoading ? (
                <tr>
                  <td colSpan={13}>
                    <Box sx={{ width: 40 }}>
                      <Skeleton width={1570} height={28} />
                      <Skeleton width={1570} height={28} />
                      <Skeleton width={1570} height={28} />
                      <Skeleton width={1570} height={28} />
                      <Skeleton width={1570} height={28} />
                      <Skeleton width={1570} height={28} />
                      <Skeleton width={1570} height={28} />
                      <Skeleton width={1570} height={28} />
                      <Skeleton width={1570} height={28} />
                      <Skeleton width={1570} height={28} />
                      <Skeleton width={1570} height={28} />
                      <Skeleton width={1570} height={28} />
                    </Box>
                  </td>
                </tr>
              ) : filterProducts?.length > 0 ? (
                <>
                  <tbody>
                    {filterProducts?.map((product, index) => {
                      return (
                        <tr key={product.order_no} product={product}>
                          <td>{/* <Checkbox /> */}</td>
                          <td>{index + 1}</td>
                          <td>{product.order_no}</td>
                          <td>
                            <Tooltip
                              title={product?.customer_name}
                              placement="top-start"
                            >
                              <span>
                                {product?.customer_name?.length <= 12 ? (
                                  <span>{product?.customer_name}</span>
                                ) : (
                                  <span>
                                    {product?.customer_name?.slice(0, 13)}...
                                  </span>
                                )}
                              </span>
                            </Tooltip>
                          </td>
                          <td>
                            {product.updated_at?.slice(0, 10) >= today
                              ? moment(product?.created_at).fromNow()
                              : moment(product?.created_at).format(
                                "DD-MM-YYYY"
                              )}
                          </td>

                          <td>{product?.phone}</td>
                          <td>
                            {" "}
                            <Tooltip
                              title={product?.address}
                              placement="top-start"
                            >
                              <span>
                                {product?.address?.length <= 15 ? (
                                  <span>{product?.address}</span>
                                ) : (
                                  <span>
                                    {product?.address?.slice(0, 13)}...
                                  </span>
                                )}
                              </span>
                            </Tooltip>
                          </td>
                          <td>
                            <Tooltip
                              title={product?.order_details[0]?.product}
                              placement="top-start"
                            >
                              <span>
                                {product?.order_details[0]?.product?.length <=
                                  20 ? (
                                  <span>
                                    {product?.order_details[0]?.product}
                                  </span>
                                ) : (
                                  <span>
                                    {product?.order_details[0]?.product?.slice(
                                      0,
                                      20
                                    )}
                                    ...
                                  </span>
                                )}
                              </span>
                            </Tooltip>
                          </td>
                          <td>
                            {product?.order_details?.reduce(
                              (prevVal, currentVal) => {
                                return prevVal + currentVal?.quantity;
                              },
                              0
                            )}
                          </td>
                          {advanceStatus === true && (
                            <>
                              <td>
                                {" "}
                                <input
                                  defaultValue={product?.advanced}
                                  onKeyDown={(e) =>
                                    handleKeyDownAdvance(
                                      product?.id,
                                      event,
                                      e.target.value
                                    )
                                  }
                                  // onBlur={(e) => {
                                  //     advanceAdd(
                                  //         product?.id,
                                  //         e.target.value
                                  //     );
                                  // }}
                                  type="text"
                                  placeholder="Advance"
                                />{" "}
                              </td>
                              <td>{product?.due}</td>
                            </>
                          )}
                          <td>{product?.grand_total}</td>
                          <td className="EditViewDelete">
                            <Button
                              className="UpdateStock"
                              onClick={handleOpenStock}
                            >
                              <input
                                defaultValue={product?.follow_up_date}
                                type="date"
                                name=""
                                onChange={(e) => onChangeDate(product?.id, e)}
                                id=""
                              />
                            </Button>
                          </td>

                          <td>
                            <select
                              onChange={(e) => {
                                statusSubmit(product?.id, e.target.value);
                              }}
                            >
                              <option>Select Status</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="NoteField">
                            {" "}
                            <input
                              defaultValue={product?.note}
                              type="text"
                              placeholder="Note"
                              onKeyDown={(e) =>
                                handleKeyDown(product?.id, event)
                              }
                            />{" "}
                            <Note note={product?.note} id={product?.id}></Note>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </>
              ) : (
                <tr>
                  <td colSpan={15}>
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
              )}
            </table>
          </div>
        )}

        {searchQueryString && (
          <div className="ProductTable">
            <table>
              <thead>
                <tr>
                  <th>{/* <Checkbox /> */}</th>
                  <th>SL</th>
                  <th>Order No</th>
                  <th>Customer Name</th>
                  <th>Order Date</th>
                  <th>Contact No.</th>
                  <th>Address</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  {advanceStatus === true && (
                    <>
                      <th>Adv</th>
                      <th>Due</th>
                    </>
                  )}
                  <th>Total Price</th>
                  <th>Follow Up Date</th>
                  <th>Status</th>
                  <th>Note</th>
                </tr>
              </thead>

              {isLoading ? (
                <tr>
                  <td colSpan={13}>
                    <Box sx={{ width: 40 }}>
                      <Skeleton width={1570} height={28} />
                      <Skeleton width={1570} height={28} />
                      <Skeleton width={1570} height={28} />
                      <Skeleton width={1570} height={28} />
                      <Skeleton width={1570} height={28} />
                      <Skeleton width={1570} height={28} />
                      <Skeleton width={1570} height={28} />
                      <Skeleton width={1570} height={28} />
                      <Skeleton width={1570} height={28} />
                      <Skeleton width={1570} height={28} />
                      <Skeleton width={1570} height={28} />
                      <Skeleton width={1570} height={28} />
                    </Box>
                  </td>
                </tr>
              ) : filterProducts?.length > 0 ? (
                <>
                  <tbody>
                    {filterProducts?.map((product, index) => {
                      return (
                        <tr key={product.order_no} product={product}>
                          <td>{/* <Checkbox /> */}</td>
                          <td>{index + 1}</td>
                          <td>{product.order_no}</td>
                          <td>
                            <Tooltip
                              title={product?.customer_name}
                              placement="top-start"
                            >
                              <span>
                                {product?.customer_name?.length <= 12 ? (
                                  <span>{product?.customer_name}</span>
                                ) : (
                                  <span>
                                    {product?.customer_name?.slice(0, 13)}...
                                  </span>
                                )}
                              </span>
                            </Tooltip>
                          </td>
                          <td>
                            {product.updated_at?.slice(0, 10) >= today
                              ? moment(product?.created_at).fromNow()
                              : moment(product?.created_at).format(
                                "DD-MM-YYYY"
                              )}
                          </td>

                          <td>{product?.phone}</td>
                          <td>
                            {" "}
                            <Tooltip
                              title={product?.address}
                              placement="top-start"
                            >
                              <span>
                                {product?.address?.length <= 15 ? (
                                  <span>{product?.address}</span>
                                ) : (
                                  <span>
                                    {product?.address?.slice(0, 13)}...
                                  </span>
                                )}
                              </span>
                            </Tooltip>
                          </td>
                          <td>
                            <Tooltip
                              title={product?.order_details[0]?.product}
                              placement="top-start"
                            >
                              <span>
                                {product?.order_details[0]?.product?.length <=
                                  20 ? (
                                  <span>
                                    {product?.order_details[0]?.product}
                                  </span>
                                ) : (
                                  <span>
                                    {product?.order_details[0]?.product?.slice(
                                      0,
                                      20
                                    )}
                                    ...
                                  </span>
                                )}
                              </span>
                            </Tooltip>
                          </td>
                          <td>
                            {product?.order_details?.reduce(
                              (prevVal, currentVal) => {
                                return prevVal + currentVal?.quantity;
                              },
                              0
                            )}
                          </td>
                          {advanceStatus === true && (
                            <>
                              <td>
                                {" "}
                                <input
                                  defaultValue={product?.advanced}
                                  onKeyDown={(e) =>
                                    handleKeyDownAdvance(
                                      product?.id,
                                      event,
                                      e.target.value
                                    )
                                  }
                                  // onBlur={(e) => {
                                  //     advanceAdd(
                                  //         product?.id,
                                  //         e.target.value
                                  //     );
                                  // }}
                                  type="text"
                                  placeholder="Advance"
                                />{" "}
                              </td>
                              <td>{product?.due}</td>
                            </>
                          )}
                          <td>{product?.grand_total}</td>
                          <td className="EditViewDelete">
                            <Button
                              className="UpdateStock"
                              onClick={handleOpenStock}
                            >
                              <input
                                defaultValue={product?.follow_up_date}
                                type="date"
                                name=""
                                onChange={(e) => onChangeDate(product?.id, e)}
                                id=""
                              />
                            </Button>
                          </td>
                          <td>
                            <select
                              onChange={(e) => {
                                statusSubmit(product?.id, e.target.value);
                              }}
                            >
                              <option>Select Status</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>

                          {/* <td className="NoteField">
                            {" "}
                            <input
                              defaultValue={product?.note}
                              type="text"
                              placeholder="Note"
                              onKeyDown={(e) =>
                                handleKeyDown(product?.id, event)
                              }
                            />{" "}
                          </td> */}
                        </tr>
                      );
                    })}
                  </tbody>
                </>
              ) : (
                <tr>
                  <td colSpan={15}>
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
              )}
            </table>
          </div>
        )}

        {/* <ToastContainer /> */}
      </div>
    </>
  );
};

export default FollowUpOrder;
