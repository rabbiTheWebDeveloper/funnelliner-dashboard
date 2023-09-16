import { Box, Button, Container, Pagination, Stack } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment/moment";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useToast } from "../../../hook/useToast";
import { headers } from "../../../pages/api";
import { useGetCategoryQuery } from "../../../redux/features/category/categoryApi";
import HeaderDescription from "../../Common/HeaderDescription/HeaderDescription";
import ShowCategory from "./ShowCategory";
import UpdateCategory from "./UpdateCategory";
import SmallLoader from "../../SmallLoader/SmallLoader";
import { API_ENDPOINTS } from "../../../config/ApiEndpoints";

const SubProduct = () => {
  const showToast = useToast();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [isPageLoader, setIsPageLoader] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState();
  const [showViewCategoryPopup, setShowViewCategoryPopup] = useState(false);
  const [showDeleteCategoryPopup, setShowDeleteCategoryPopup] = useState(false);

  const hanldeFetchCategories = useCallback(() => {
    axios
      .get(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CATEGORY.GET_CATEGORIES}`, { headers: headers })
      .then(function (response) {
        let allProduct = response.data.data;
        setProducts(allProduct);
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
  }, []);

  useEffect(() => {
    hanldeFetchCategories();
  }, [hanldeFetchCategories]);

  const deleteProduct = (id) => {
    Swal.fire({
      text: "Are you sure you want to delete?",
      iconHtml: '<img src="/images/delete.png">',
      customClass: {
        icon: "no-border",
      },
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#894bca",
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsPageLoader(true);
        axios
          .delete(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CATEGORY.DELETE_CATEGORY}/${id}`, {
            headers: headers,
          })
          .then(function (result) {
            // handle success
            if (result) {
              setProducts((pd) => {
                const filter = products.filter((prod) => {
                  return prod.id !== id;
                });
                showToast("Category has been deleted.");
                return [...filter];
              });
            }
            setIsPageLoader(false);
          })
          .catch((err) => {
            setIsPageLoader(false);
          });
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

  const paginate = (pageNumber, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <section className="TopSellingProducts DashboardSetting Order">
        {isPageLoader && <SmallLoader />}

        {/* header */}
        <HeaderDescription
          headerIcon={"flaticon-product"}
          title={"Category"}
          subTitle={"Shop Category List"}
          search={false}
          order={false}
        />

        <Container maxWidth="sm">
          {/* DashboardSettingTabs */}
          <div className="DashboardSettingTabs WebsiteSettingPage">
            <div className="Pending">
              <div className="MoveToComplete d_flex d_justify">
                <div className="DropDown"></div>

                <Link href="/add-category" className="CreateNewBtn">
                  <i className="flaticon-plus"></i> Add Category
                </Link>
              </div>

              <div className="Table">
                <table>
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Image</th>
                      <th>Category Name</th>
                      <th>Added On</th>
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
                  ) : currentProduct.length > 0 ? (
                    <tbody>
                      {currentProduct?.map((product, index) => {
                        return (
                          <tr key={index}>
                            <td>
                              {index + 1 + currentPage * perPage - perPage}
                            </td>
                            <td>
                              <img
                                src={
                                  product?.category_image !== null
                                    ? product?.category_image
                                    : "/images/default-category.jpg"
                                }
                                alt=""
                              />
                            </td>
                            <td>{product?.name}</td>

                            <td>{moment(product?.created_at).format("LL")}</td>

                            <td>
                              <div className="action">
                                <Button
                                  className="viewActionBtn"
                                  onClick={() => {
                                    setShowViewCategoryPopup(true);
                                    setSelectedCategoryId(product?.id);
                                  }}
                                >
                                  {" "}
                                  <i className="flaticon-view"></i>
                                </Button>
                                <Button
                                  className="updateActionBtn"
                                  onClick={() => {
                                    setSelectedCategoryId(product?.id);
                                    setShowDeleteCategoryPopup(true);
                                  }}
                                >
                                  <i className="flaticon-edit"></i>
                                </Button>

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
                    </tbody>
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

                              <Link href="/add-category">Add Category</Link>

                              {/* <p>OR</p> */}

                              {/* <Link href='https://dashboard.funnelliner.com/landing-page'>Add New Page</Link> */}
                            </div>
                          </div>
                        </section>
                      </td>
                    </tr>
                  )}
                </table>
              </div>

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
        {showViewCategoryPopup && (
          <ShowCategory
            id={selectedCategoryId}
            isOpen={showViewCategoryPopup}
            closePopup={() => setShowViewCategoryPopup(false)}
          />
        )}
        {showDeleteCategoryPopup && (
          <UpdateCategory
            id={selectedCategoryId}
            isOpen={showDeleteCategoryPopup}
            closePopup={() => setShowDeleteCategoryPopup(false)}
            hanldeFetchCategories={hanldeFetchCategories}
          />
        )}
      </section>
    </>
  );
};

export default SubProduct;
