import { Box, Button, Container, Pagination, Stack } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";

import ProductUpdate from "./ProductUpdate";
import ShowProduct from "./ShowProduct";

import useConfirmationDialog from "../../../hook/useConfirmationDialog";
import { useToast } from "../../../hook/useToast";
import { headers } from "../../../pages/api";
import HeaderDescription from "../../Common/HeaderDescription/HeaderDescription";
import SmallLoader from "../../SmallLoader/SmallLoader";
import { useRouter } from "next/router";

const Product = ({ category, busInfo }) => {
  const router = useRouter()
  const showToast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [productSearchValue, setProductSearchValue] = useState("");
  const [filterProducts, setFilterProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  //confirmation alert
  const handleConfirmationDialog = useConfirmationDialog(
    "Delete Product?",
    "Are you sure you want to delete?",
    "Yes, delete"
  );
  const fetchProduct = () => {
    axios
      .get(process.env.NEXT_PUBLIC_API_URL + "/client/products", {
        headers: headers,
      })
      .then(function (response) {
        // handle success
        setProducts(response.data.data);
        setIsLoading(false);
      })
      .catch(function (error) {
        if (error.response.data.api_status === "401") {
          window.location.href = "/login";
          Cookies.remove("token");
          localStorage.clear("token");
          Cookies.remove("user");
          localStorage.clear("user");

          window.location.href = "/login";
        }
      });
  };
  useEffect(() => {
    fetchProduct();
  }, []);

  const deleteProduct = async id => {
    const confirmed = await handleConfirmationDialog();
    if (confirmed) {
      setIsLoading(true);
      axios
        .delete(process.env.NEXT_PUBLIC_API_URL + "/client/products/" + id, {
          headers: headers,
        })
        .then(function (result) {
          if (result.data.success) {
            setProducts(pd => {
              const filter = products.filter(prod => {
                return prod.id !== id;
              });
              return [...filter];
            });
            showToast("Product delete successfully!", "success");
          } else {
            showToast("Something went wrong!", "error");
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error("err", err);
          setIsLoading(false);
        });
    }
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
  const handleChangeSearchBox = e => {
    setProductSearchValue(e.target.value);
    const filtered = products.filter(
      item =>
        item?.id?.toString().includes(e.target.value) ||
        item?.product_name
          ?.toLowerCase()
          .includes(e.target.value.toLowerCase()) ||
        item?.product_code?.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilterProducts(filtered);
  };

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [productModalViewId, setProductModalViewId] = useState(null);
  const [ProductEditModalID, setProductEditModalID] = useState(null);
  const handleOpenModal = (id, modal) => {
    if (modal === "edit") {
      setProductEditModalID(id);
      setEditModalOpen(true);
    }
    if (modal === "view") {
      setProductModalViewId(id);
      setViewModalOpen(true);
    }
  };
  const handleCloseModal = () => {
    setProductModalViewId(null);
    setProductEditModalID(null);
    setViewModalOpen(false);
    setEditModalOpen(false);
  };
  return (
    <>
      <section className="TopSellingProducts DashboardSetting Order">
        {isLoading && (
          <div className="orderSection_preloader">
            {" "}
            <SmallLoader />{" "}
          </div>
        )}

        {/* header */}
        <HeaderDescription
          headerIcon={"flaticon-product"}
          title={"Product List"}
          subTitle={"Find Your Product"}
          search={false}
          order={false}
          videoLink={
            {
              video: "https://www.youtube.com/embed/u6C2KvB5Kzs?si=Qv2g-PI-ebPmsATK",
              title: "How to add your products & categories step by step in FunnelLiner"
            }}
        />

        <Container maxWidth="sm">
          {/* DashboardSettingTabs */}
          <div className="DashboardSettingTabs WebsiteSettingPage">
            <div className="Pending">
              <div className="MoveToComplete d_flex d_justify">
                <div className="DropDown"></div>

                <Link href="/add-product" className="CreateNewBtn">
                  <i className="flaticon-plus"></i> Add Product
                </Link>
              </div>

              <div className="Table">
                <table>
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Image</th>

                      <th>Product Name</th>
                      <th>Product Code</th>
                      <th>Selling Price (BDT)</th>
                      <th>Quantity</th>
                      <th>Added On</th>
                      <th>Shipping Cost</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  {isLoading ? (
                    <tr>
                      <td colSpan={13}>
                        <Box sx={{ width: 40 }}>
                          {[...Array(15)].map((_, index) => (
                            <Skeleton width="100%" key={index} height={28} />
                          ))}
                        </Box>
                      </td>
                    </tr>
                  ) : currentProduct.length > 0 ? (
                    <>
                      <tbody>
                        {productSearchValue === "" &&
                          currentProduct?.map((product, index) => {
                            return (
                              <tr key={product.id}>
                                <td>
                                  {index + 1 + currentPage * perPage - perPage}
                                </td>
                                <td>
                                  <img src={product?.main_image} alt="" />
                                </td>

                                <td>
                                  <Tooltip
                                    title={product?.product_name}
                                    placement="top-start"
                                  >
                                    <span>
                                      {product?.product_name.length < 15 ? (
                                        <span>{product?.product_name}</span>
                                      ) : (
                                        <span>
                                          {product?.product_name?.slice(0, 15)}
                                          ...
                                        </span>
                                      )}
                                    </span>
                                  </Tooltip>
                                </td>
                                <td>{product.product_code}</td>
                                <td>{product.price}</td>

                                <td>
                                  {product?.product_qty >= 0 ? (
                                    product?.product_qty
                                  ) : (
                                    <span style={{ color: "red" }}>
                                      stock out {product?.product_qty}
                                    </span>
                                  )}
                                </td>
                                <td>
                                  {moment(product.created_at).format("LL")}
                                </td>
                                <td>
                                  {product?.delivery_charge !== "paid" ? (
                                    <p>
                                      <span>Delivery Free</span>
                                    </p>
                                  ) : (
                                    <>
                                      <p>
                                        In Dhaka -{" "}
                                        <span>{product?.inside_dhaka}TK</span>
                                      </p>
                                      <p>
                                        Out Dhaka -{" "}
                                        <span>{product?.outside_dhaka}TK</span>
                                      </p>
                                      {product?.sub_area_charge ? (
                                        <p>
                                          Sub Area Charge -{" "}
                                          <span>
                                            {product?.sub_area_charge}TK
                                          </span>
                                        </p>
                                      ) : null}
                                    </>
                                  )}
                                </td>

                                <td className="EditViewDelete">
                                  <div className="action">
                                    <Button
                                      className="viewActionBtn"
                                      onClick={() =>
                                        handleOpenModal(product.id, "view")
                                      }
                                    >
                                      <i className="flaticon-view"></i>
                                    </Button>
                                    {product.id === productModalViewId && (
                                      <ShowProduct
                                        id={product.id}
                                        modalOpen={viewModalOpen}
                                        handleCloseModal={handleCloseModal}
                                        product={product}
                                      />
                                    )}

                                    <Button
                                      className="updateActionBtn"
                                      onClick={() =>
                                        router.push(`/edit-product?id=${product?.id}`)
                                      }
                                    >
                                      <i className="flaticon-edit"></i>
                                    </Button>
                                    {product.id === ProductEditModalID && (
                                      <ProductUpdate
                                        id={product.id}
                                        category={category}
                                        modalOpen={editModalOpen}
                                        handleCloseModal={handleCloseModal}
                                        product={product}
                                        fetchProduct={fetchProduct}
                                        busInfo={busInfo}
                                      />
                                    )}

                                    <Button
                                      className="deleteActionBtn"
                                      onClick={() => deleteProduct(product.id)}
                                    >
                                      <i className="flaticon-delete"></i>
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}

                        {/* filter product */}
                        {productSearchValue &&
                          filterProducts?.map((product, index) => {
                            return (
                              <tr key={product.id}>
                                <td>
                                  <td>{index + 1}</td>
                                </td>
                                <td>
                                  <img src={product?.main_image} alt="" />
                                </td>

                                <td>
                                  <Tooltip
                                    title={product?.product_name}
                                    placement="top-start"
                                  >
                                    <span>
                                      {product?.product_name.length < 15 ? (
                                        <span>{product?.product_name}</span>
                                      ) : (
                                        <span>
                                          {product?.product_name?.slice(0, 15)}
                                          ...
                                        </span>
                                      )}
                                    </span>
                                  </Tooltip>
                                </td>
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
                                <td>
                                  {moment(product.created_at).format("LL")}
                                </td>
                                <td>
                                  {product?.delivery_charge !== "paid" ? (
                                    <p>
                                      <span>Delivery Free</span>
                                    </p>
                                  ) : (
                                    <React.Fragment>
                                      <p>
                                        In Dhaka -{" "}
                                        <span>{product?.inside_dhaka}TK</span>
                                      </p>
                                      <p>
                                        Sub Area -{" "}
                                        <span>
                                          {product?.sub_area_charge}TK
                                        </span>
                                      </p>
                                      <p>
                                        Out Dhaka -{" "}
                                        <span>{product?.outside_dhaka}TK</span>
                                      </p>
                                    </React.Fragment>
                                  )}
                                </td>
                                <td className="EditViewDelete">
                                  <Button className="ButtonEdit" href="">
                                    <ShowProduct id={product.id} />
                                  </Button>
                                  <Button className="ButtonEdit">
                                    <ProductUpdate
                                      id={product.id}
                                      category={category}
                                      fetchProduct={fetchProduct}
                                      busInfo={busInfo}
                                    />
                                  </Button>
                                  <Link
                                    href=""
                                    onClick={() => deleteProduct(product.id)}
                                  >
                                    <RiDeleteBin6Line />
                                  </Link>
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
                              <img src="/images/empty.png" alt="" />
                            </div>

                            <div className="text">
                              <p>Not Found</p>

                              <Button className="CreateNewBtn">
                                <Link href="/add-product">Add Products</Link>
                              </Button>
                            </div>
                          </div>
                        </section>
                      </td>
                    </tr>
                  )}
                </table>
              </div>
            </div>

            <div
              style={{ display: productSearchValue === "" ? "block" : "none" }}
            >
              <Box
                sx={{
                  margin: "auto",
                  width: "fit-content",
                  alignItems: "center",
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
      </section>
    </>
  );
};

export default Product;
