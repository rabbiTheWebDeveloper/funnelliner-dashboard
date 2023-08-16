import {
  Box,
  Button,
  Container,
  Pagination,
  Skeleton,
  Stack,
} from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { headers } from "../../../pages/api";

import HeaderDescription from "../../../Components/Common/HeaderDescription/HeaderDescription";
import UpdateStock from "./UpdateStock";
import { API_ENDPOINTS } from "../../../config/ApiEndpoints";

const StockIn = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [fetchApi, setFetch] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const fetchStockProducts = useCallback(async () => {
    await axios
      .get(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.STOCK_IN.GET_STOCK_IN_PRODUCTS}`,
        { headers: headers }
      )
      .then(function (response) {
        setProducts(response.data.data);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchStockProducts();
  }, [fetchApi, fetchStockProducts]);

  //   const deleteProduct = (id) => {
  //     Swal.fire({
  //       title: "Are you sure?",
  //       text: "You won't be able to revert this!",
  //       icon: "warning",
  //       showCancelButton: true,
  //       confirmButtonColor: "#3085d6",
  //       cancelButtonColor: "#d33",
  //       confirmButtonText: "Yes, delete it!",
  //     }).then((result) => {
  //       if (result.isConfirmed) {
  //         axios
  //           .delete(process.env.API_URL + "/client/stocks/stock-in/list" + id, {
  //             headers: headers,
  //           })
  //           .then(function (result) {
  //             // handle success

  //             if (result) {
  //               setProducts((pd) => {
  //                 const filter = products.filter((prod) => {
  //                   return prod.id !== id;
  //                 });
  //                 return [...filter];
  //               });
  //             }
  //           });
  //         Swal.fire("Deleted!", "Your file has been deleted.", "success");
  //       }
  //     });
  //   };

  const indexOfLastProducts = currentPage * perPage;
  const indexOfFirstProducts = indexOfLastProducts - perPage;
  const currentProduct = products.slice(
    indexOfFirstProducts,
    indexOfLastProducts
  );

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(products.length / perPage); i++) {
    pageNumbers.push(i);
  }

  const paginate = (pageNumber, value) => setCurrentPage(value);

  //   const handleChangeSearchBox = (e) => {
  //     setProductSearchValue(e.target.value);
  //     const filtered = products.filter(
  //       (item) =>
  //         item?.id?.toString().includes(e.target.value) ||
  //         item?.product_name
  //           ?.toLowerCase()
  //           .includes(e.target.value.toLowerCase()) ||
  //         item?.product_code?.toLowerCase().includes(e.target.value.toLowerCase())
  //     );
  //     setFilterProducts(filtered);
  //   };


  return (
    <>
      <section className="TopSellingProducts DashboardSetting Order Stock">
        {/* header */}
        <HeaderDescription
          headerIcon={"flaticon-checklists"}
          title={"Stock In"}
          subTitle={"Update your inventory products stock"}
          search={false}
        />

        <Container maxWidth="sm">
          {/* DashboardSettingTabs */}
          <div className="DashboardSettingTabs WebsiteSettingPage">
            <div className="Pending">
              <div className="MoveToComplete d_flex d_justify">
                <div className="DropDown Download"></div>
              </div>

              <div className="Table">
                <table>
                  <thead>
                    <tr>
                      {/* <th><Checkbox/></th> */}
                      <th>SL</th>
                      <th>Image</th>
                      <th>Product Name</th>
                      <th>Product Code</th>
                      <th>Selling Price (BDT)</th>
                      <th>Quantity</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  {isLoading ? (
                    <tr>
                      <td colSpan={13}>
                        <Box sx={{ width: 40 }}>
                          <Skeleton width="100%" height={28} />
                          <Skeleton width="100%" height={28} />
                          <Skeleton width="100%" height={28} />
                          <Skeleton width="100%" height={28} />
                          <Skeleton width="100%" height={28} />
                          <Skeleton width="100%" height={28} />
                          <Skeleton width="100%" height={28} />
                          <Skeleton width="100%" height={28} />
                          <Skeleton width="100%" height={28} />
                          <Skeleton width="100%" height={28} />
                          <Skeleton width="100%" height={28} />
                          <Skeleton width="100%" height={28} />
                        </Box>
                      </td>
                    </tr>
                  ) : products.length > 0 ? (
                    <>
                      <tbody>
                        {products?.map((product, index) => {
                          return (
                            <tr key={product.id}>
                              <td>
                                {index + 1 + currentPage * perPage - perPage}
                              </td>
                              <td>
                                <img src={product?.main_image} alt="" />
                              </td>
                              <td>{product?.product_name}</td>
                              <td>{product.product_code}</td>
                              <td>{product.price}</td>
                              <td>
                                {product?.product_qty > 0 ? (
                                  product?.product_qty
                                ) : (
                                  <span style={{ color: "red" }}>
                                    stock out {product?.product_qty}{" "}
                                  </span>
                                )}
                              </td>
                              <td>
                                <div className="action">
                                  <Button
                                    className="updateActionBtn"
                                    onClick={() => {
                                      setShowEditPopup(true);
                                      setSelectedProductId(product?.id);
                                    }}
                                  >
                                    <div>
                                      {" "}
                                      <i className="flaticon-edit"></i>{" "}
                                    </div>
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {/* {productSearchValue &&
                          filterProducts?.map((product, index) => {
                            return (
                              <tr key={product.id}>
                                <td>{index + 1}</td>
                                <td>
                                  <img src={product?.main_image} alt="" />
                                </td>
                                <td>{product?.product_name}</td>
                                <td>{product.product_code}</td>
                                <td>{product.price}</td>
                                <td>
                                  {product?.product_qty > 0 ? (
                                    product?.product_qty
                                  ) : (
                                    <span style={{ color: "red" }}>
                                      stock out-{product?.product_qty}
                                    </span>
                                  )}
                                </td>
                                <td>
                                  <div className="action">
                                    <Button className="updateActionBtn">
                                      <UpdateStock
                                        productId={product?.id}
                                        handleFetch={handleFetch}
                                      ></UpdateStock>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })} */}
                      </tbody>
                    </>
                  ) : (
                    <tr>
                      <td colSpan={10}>
                        <section className="MiddleSection">
                          <div className="MiddleSectionContent">
                            <div className="img">
                              <img src="/images/empty.png" alt="" />
                            </div>

                            <div className="text">
                              <p>No Stock In </p>
                            </div>
                          </div>
                        </section>
                      </td>
                    </tr>
                  )}
                </table>
              </div>

              <Box
                style={{
                  display: products.length > 0 ? "block" : "none",
                }}
              >
                <Stack spacing={2}>
                  <Pagination
                    count={pageNumbers.length}
                    variant="outlined"
                    page={currentPage}
                    onChange={paginate}
                  />
                </Stack>
              </Box>
            </div>
          </div>
        </Container>
        {showEditPopup && (
          <UpdateStock
            productId={selectedProductId}
            open={showEditPopup}
            onClosePopup={() => setShowEditPopup(false)}
            fetchStockProducts={fetchStockProducts}
          />
        )}
      </section>
    </>
  );
};

export default StockIn;
