import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Button, Container, Tab } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import useLoading from "../../../hook/useLoading";
import { useToast } from "../../../hook/useToast";
import { headers } from "../../../pages/api";
import HeaderDescription from "../../Common/HeaderDescription/HeaderDescription";
import Spinner from "../../commonSection/Spinner/Spinner";
import AddProductCategory from "./AddProductCategory";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import style from "./addProduct.module.css";
import 'react-quill/dist/quill.snow.css';
import ProductImage from "../../edit-theme/ProductImage";
import QuillEditor from "../Description/Description";

const AddProduct = () => {
  const router = useRouter();
  const showToast = useToast();
  const [isLoading, startLoading, stopLoading] = useLoading();
  const [value, setValue] = useState("1");
  const [category, setCategory] = useState([]);
  const [delivery, setDelivery] = useState("default");
  const [insideDhaka, setInsideDhaka] = useState();
  const [outDhaka, setOutDhaka] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [productImage, setProductImage] = useState([])
  const [productDescription, setProductDescription] = useState('')
  const [productSummary, setProductSummary] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [categoryID, setCategoryID] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [update, setUpdate] = useState(false);
  const [openSuggestNote, setOpenSuggestNote] = useState(false);
  const handleOpenSuggestNote = () => setOpenSuggestNote(true);
  const handleCloseSuggestNote = () => setOpenSuggestNote(false);
  const [selectedCategory, setSelectedCategory] = useState({});
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  const handleChangeItem = (e) => {
    setSelectedCategory(e);
    if (e.value === "add") {
      handleOpenSuggestNote();
      return;
    }
    setCategoryID(e.value);
  };
  //  add product form
  const onSubmit = (data) => {
    if (openSuggestNote) {
      return;
    }
    if (selectedImage?.size > 10 * 1024 * 1024) {
      showToast("Product image size is too big !", "error");
      return;
    } else if (categoryID == null) {
      showToast("Category required", "error");
      return;
    } else if (selectedImage === null) {
      showToast("Product Image required", "error");
      return;
    }
    data.discount = "0";
    data.price = data.price.replace(/,/g, "");
    if (delivery === "default") {
      showToast("Select delivery Charge", "error");
      return;
    } else if (delivery === "Paid Delivery Charge") {
      if (insideDhaka === undefined) {
        showToast("Delivery charge required inside Dhaka", "error");
        return;
      } else if (outDhaka === undefined) {
        showToast("Delivery charge required outside Dhaka", "error");
        return;
      }
      data.delivery_charge = "paid";
      data.inside_dhaka = insideDhaka;
      data.outside_dhaka = outDhaka;
    } else if (delivery === "Free Delivery Charge") {
      data.delivery_charge = "free";
    }
    startLoading();
    const formData = new FormData();
    formData.append("main_image", selectedImage);
    if (productImage.length) {
      for (let i = 0; i < productImage.length; i++) {
        formData.append('gallery_image[]', productImage[i]);
      }
    }
    if (category.length) {
      formData.append("category_id", categoryID);
    } else {
      formData.append("category_name", data.category_name);
    }
    formData.append("product_name", data.product_name);
    formData.append("price", data.price);
    formData.append("discount", "0");
    formData.append("product_code", data.product_code);
    formData.append("product_qty", data.product_qty);
    formData.append("short_description", productSummary);
    formData.append("long_description", productDescription);

    if (delivery === "Free Delivery Charge") {
      formData.append("delivery_charge", "free");
    }
    if (delivery === "Paid Delivery Charge") {
      formData.append("delivery_charge", "paid");
      formData.append("inside_dhaka", data.inside_dhaka);
      formData.append("outside_dhaka", data.outside_dhaka);
    }

    axios
      .post(process.env.NEXT_PUBLIC_API_URL + "/client/products", formData, {
        headers: headers,
      })
      .then(function (response) {
        if (response.status === 200) {
          stopLoading();
          showToast("Product Add successfully!", "success");
          if (router.query.redirect_from) {
            router.push("/?current_steap=panel3");
          } else if (router.query.redirect_from !== true) {
            router.push("/product");
          }
        }
      })
      .catch(function (error) {
        stopLoading();
        if (error.response.status === 400) {
          showToast(error.response.data.error, "error");
        } else {
          showToast("Something went wrong!", "error");
        }
      });
  };

  const fetchCategoriesData = useCallback(async () => {
    await axios
      .get(process.env.NEXT_PUBLIC_API_URL + "/client/categories", { headers: headers })
      .then(function (response) {
        if (response.data.data?.length) {
          const filterData = response.data.data?.map((item) => {
            return { value: item.id, label: item.name };
          });
          setCategory([
            { value: "add", label: "+ Add New Category" },
            ...filterData,
          ]);
        }
      })
      .catch(function (error) {
        if (error?.response?.data?.api_status === "401") {
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
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }

    if (category.length === 0) {
      setCategory([...category, { value: "add", label: "+ Add New Category" }]);
    }
  }, [selectedImage, category]);

  useEffect(() => {
    fetchCategoriesData();
  }, [fetchCategoriesData]);

  const handleChangeProductDescription = (editor) => {
    setProductDescription(editor)
  }
  const handleChangeProductSummary = (editor) => {
    setProductSummary(editor)
  }
  return (
    <>
      <section className="DashboardSetting">
        {/* header */}
        <HeaderDescription
          headerIcon={"flaticon-product"}
          title={"Add New Products"}
          subTitle={"Add new products in your shop"}
          search={false}
        />

        <Container maxWidth="sm">
          {/* DashboardSettingTabs */}
          <div className="DashboardSettingTabs">
            <Box className="boxShadow">
              <TabContext value={value}>
                <div className="CommonTab">
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                      onChange={handleChangeTab}
                      aria-label="lab API tabs example"
                    >
                      <Tab label="Product Information" value="1" />
                      <div
                        style={{
                          backgroundColor: "black",
                          color: "white",
                          borderRadius: "30px",
                          marginBottom: "10px",
                          padding: "0px 15px 0 10px",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          cursor: "pointer",
                        }}
                        onClick={() => router.back()}
                      >
                        <ArrowBackIcon /> Back
                      </div>
                    </TabList>
                  </Box>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Business Information */}
                  <TabPanel value="1">
                    <div className={style.AddProduct}>
                      <div className={style.header}>
                        <h4>Add Products</h4>
                        <p>This will be displayed on your product page</p>
                      </div>

                      <div className={style.FormValidation}>
                        <div className={style.customInput}>
                          <label>
                            Product Name <span>*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Enter product name here"
                            {...register("product_name", { required: true })}
                          />
                          {errors.product_name ? (
                            <p className="error">This Product Name required</p>
                          ) : null}
                        </div>

                        <div className={style.customInput}>
                          <label>
                            Selling Price <span>*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Example: 599"
                            {...register("price", {
                              required: true,
                              pattern: /^(?!0)[1-9][0-9]*$/,
                            })}
                          />
                          {errors.price ? (
                            <p className="error">Invalid Price</p>
                          ) : null}
                        </div>

                        <div className={style.customInput}>
                          <label>
                            Product Code <span>*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Example: A103"
                            {...register("product_code", {
                              required: true,
                            })}
                          />
                          {errors.product_code ? (
                            <p className="error">Product Code required</p>
                          ) : null}
                        </div>

                        <div className={style.customInput}>
                          <label>
                            Available Quantity <span>*</span>
                          </label>
                          <input
                            type="text"
                            placeholder="Enter available quantity here"
                            {...register("product_qty", {
                              required: true,
                              pattern: /^[0-9]+$/,
                            })}
                          />
                          {errors.product_qty && (
                            <p className="error">Invalid Quantity</p>
                          )}
                        </div>

                        <div className={style.customInput}>
                          <label>
                            Category Name <span>*</span>
                          </label>
                          <Select
                            options={category}
                            onChange={handleChangeItem}
                            menuPosition="fixed"
                          />
                          <AddProductCategory
                            HandelFetchCategory={() => setUpdate(true)}
                            openSuggestNote={openSuggestNote}
                            handleCloseSuggestNote={handleCloseSuggestNote}
                            setSelectedCategory={setSelectedCategory}
                            fetchCategoriesData={fetchCategoriesData}
                          />
                        </div>

                        <div className={style.customInput}>
                          <label>
                            Delivery Charge <span>*</span>
                          </label>
                          <select
                            name=""
                            onChange={(e) => {
                              setDelivery(e.target.value);
                            }}
                          >
                            <option value="default">
                              Select Delivery Charge
                            </option>
                            <option value="Free Delivery Charge">
                              Free Delivery Charge
                            </option>
                            <option value="Paid Delivery Charge">
                              Paid Delivery Charge
                            </option>
                          </select>

                          {delivery === "Paid Delivery Charge" && (
                            <div className={style.duelInput}>
                              <div className={style.customInput}>
                                <label> Delivery charge in Dhaka </label>
                                <input
                                  type="text"
                                  onChange={(e) =>
                                    setInsideDhaka(e.target.value)
                                  }
                                  placeholder="Delivery charge in Dhaka"
                                />
                              </div>

                              <div className={style.customInput}>
                                <label>Delivery charge out of Dhaka</label>
                                <input
                                  type="text"
                                  onChange={(e) => setOutDhaka(e.target.value)}
                                  placeholder="Delivery charge out of Dhaka"
                                />
                              </div>
                            </div>
                          )}
                        </div>


                        <div className={style.customInput}>
                          <label> Product Main Image</label> <br></br>
                          <label>
                            Image  <span className={style.mustBe}>Must be:</span>{" "}
                            (png, jpg, jpeg) ;{" "}
                            <span className={style.mustBe}>Image Size: </span>{" "}
                            (Max-width: 500px, Max-height: 500px) <span>*</span>
                          </label>

                          <div className={style.imgUploader}>
                            <input
                              accept="image/*"
                              type="file"
                              id="select-image"
                              style={{ display: "none" }}
                              onChange={(e) =>
                                setSelectedImage(e.target.files[0])
                              }
                            />

                            <label htmlFor="select-image">
                              <Button
                                className={style.SelectImgButton}
                                variant="contained"
                                color="primary"
                                component="span"
                              >
                                Upload Image
                              </Button>
                            </label>
                            {imageUrl && selectedImage ? (
                              <Box mt={2} textAlign="center">
                                <img
                                  src={imageUrl}
                                  alt={selectedImage.name}
                                  height="100px"
                                />
                              </Box>
                            ) : null}
                          </div>
                        </div>
                        <div className={style.customInput}>
                          <div className="EditTheme  CustomeInput">
                            <label> Product Gallery Image (Maximum 5) </label>
                            <ProductImage productImage={productImage} setProductImage={setProductImage} other_images={[]} />
                          </div>
                        </div>
                        <div className="product_sort_description">
                          <label>
                            Product Short Description
                          </label>
                          <div>
                            <QuillEditor value={productSummary} onChange={handleChangeProductSummary} placeholder="Please Describe  Your Product Short Description " />

                          </div>



                        </div>


                        <div className="product_long_description" >
                          <label>
                            Product Description
                          </label>
                          <div>
                            <QuillEditor value={productDescription} onChange={handleChangeProductDescription} placeholder="Please Describe  Your Product Description " />
                          </div>

                        </div>


                      </div>


                      {/* Submit */}
                      <div className={style.Submit}>
                        {isLoading ? (
                          <>
                            <Button disabled type="submit">
                              <i>
                                <Spinner />
                              </i>
                              Add Product
                            </Button>
                          </>
                        ) : (
                          <Button disabled={openSuggestNote} type="submit">
                            <i className="flaticon-install"> </i>
                            Add Product
                          </Button>
                        )}
                      </div>
                    </div>
                  </TabPanel>
                </form>
              </TabContext>
            </Box>
          </div>
        </Container>
      </section>
    </>
  );
};

export default AddProduct;
