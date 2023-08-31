import {
  Box,
  Button,
  Container,
  Grid,
  Pagination,
  Skeleton,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { MdOutlineInventory } from "react-icons/md";
import Swal from "sweetalert2";
import { headers } from "../../../pages/api";

import HeaderDescription from "../../../Components/Common/HeaderDescription/HeaderDescription";

const ProductReturn = () => {
  const [isLoading, setIsLoading] = useState(true);


  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    axios
      .get(process.env.NEXT_PUBLIC_API_URL + "/client/stocks/product-return/list", {
        headers: headers,
      })
      .then(function (response) {
        // handle success
        setProducts(response.data.data);
        setIsLoading(false);
      });
  }, []);
  const deleteProduct = (id) => {
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
          .delete(process.env.NEXT_PUBLIC_API_URL + "/client/products/" + id, {
            headers: headers,
          })
          .then(function (result) {
            // handle success

            if (result) {
              setProducts((pd) => {
                const filter = products.filter((prod) => {
                  return prod.id !== id;
                });
                return [...filter];
              });
            } 
            
          });
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
      }
    });
  };

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
  const [productSearchValue, setProductSearchValue] = useState("");
  const [filterProducts, setFilterProducts] = useState([]);
  const handleChangeSearchBox = (e) => {
    setProductSearchValue(e.target.value);
    const filtered = products.filter(
      (item) =>
        item?.id?.toString().includes(e.target.value) ||
        item?.product_name
          ?.toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        item?.product_code?.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilterProducts(filtered);
  };

  return (
    <>
      <section className="TopSellingProducts DashboardSetting Order">
        {/* header */}
        <HeaderDescription
          headerIcon={"flaticon-express-delivery"}
          title={"Product Return"}
          subTitle={"Return Product List by Courier"}
          search={false}
        />

        <Container maxWidth="sm">
          {/* DashboardSettingTabs */}
          <div className="DashboardSettingTabs WebsiteSettingPage">
            <div className="Pending">
              <div className="MoveToComplete d_flex d_justify">
                <div className="DropDown"></div>

                <div className="DropDown Download"></div>
              </div>

              <div className="Table">
                <table>
                  <thead>
                    <tr>
                      <th>Order No.</th>
                      <th>Order Date</th>
                      <th>Return Date</th>
                      <th>Customer Name</th>
                      <th>Contact No.</th>
                      <th>Address</th>
                      <th>Product Name</th>
                      <th>Quantity</th>
                      <th>Total Price</th>
                      <th>Cancellation Note</th>
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
                  ) : currentProduct.length > 0 ? (
                    <>
                      <tbody>
                        {productSearchValue === "" &&
                          currentProduct?.map((product) => {
                            return (
                              <tr key={product.id}>
                                <td>
                                  <img src={product.main_image} alt="" />
                                </td>
                                <td>{product?.id}</td>
                                <td>{product?.product_name}</td>
                                <td>{product.product_code}</td>
                                <td>{product.price}</td>
                                <td>
                                  {product?.product_qty > 0 ? (
                                    product?.product_qty
                                  ) : (
                                    <span style={{ color: "red" }}>
                                      stock out
                                    </span>
                                  )}
                                </td>
                                <td className="EditViewDelete">
                                  {/* Modal */}
                                  <UpdateStock
                                    productId={product?.id}
                                  ></UpdateStock>
                                </td>
                              </tr>
                            );
                          })}

                        {productSearchValue &&
                          filterProducts?.map((product) => {
                            return (
                              <tr key={product.id}>
                                <td>
                                  <img src={product.main_image} alt="" />
                                </td>
                                <td>{product?.id}</td>
                                <td>{product?.product_name}</td>
                                <td>{product.product_code}</td>
                                <td>{product.price}</td>
                                <td>
                                  {product?.product_qty > 0 ? (
                                    product?.product_qty
                                  ) : (
                                    <span style={{ color: "red" }}>
                                      stock out
                                    </span>
                                  )}
                                </td>
                                <td className="EditViewDelete">
                                  {/* Modal */}
                                  <UpdateStock
                                    productId={product?.id}
                                  ></UpdateStock>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </>
                  ) : (
                    <tr>
                      <td colSpan={10}>
                        <section className="MiddleSection">
                          <div className="MiddleSectionContent">
                            <div className="img">
                              <img src="images/empty.png" alt="" />
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
              <Box
                style={{
                  display: productSearchValue === "" ? "block" : "none",
                }}
              >
                <Stack spacing={2}>
                  <Pagination
                    count={pageNumbers.length}
                    variant="outlined"
                    page={page}
                    onChange={paginate}
                  />
                </Stack>
              </Box>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default ProductReturn;
