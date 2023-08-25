import { Box, Button, Grid, Modal } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import SuperFetch from "../../hook/Axios";
import useLoading from "../../hook/useLoading";
import { useToast } from "../../hook/useToast";
import { headers, shopId } from "../../pages/api";
import Spinner from "../commonSection/Spinner/Spinner";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
  customer_name: Yup.string().required("Customer Name is required"),
  customer_phone: Yup.string().required("Customer Contact No. is required"),
  customer_address: Yup.string().required("Customer Address is required"),
  products: Yup.array().of(
    Yup.object().shape({
      product_id: Yup.string().required('Product is required'),
      product_qty: Yup.number()
        .typeError('Product quantity must be a number')
        .required('Product quantity is required')
        .min(1, 'Product quantity must be at least 1'),
      shipping_cost: Yup.number()
        .typeError('Shipping cost must be a number')
        .required('Product quantity is required')
        .min(1, 'Shipping cost cannot be negative'),
    })
  ),
  order_type: Yup.string().required("Order Source is required"),
});
const OrderModal = ({
  modalOpen,
  handleCloseModal,
  products,
  handleFetch,
  orderUpdate,
}) => {
  const showToast = useToast();
  const [availableProducts, setAvailableProducts] = useState([]);
  const [isLoading, startLoading, stopLoading] = useLoading();
  const createOrder = async (inputData) => {
    try {
      const productIds = inputData.products.map(product => product.product_id);
      const productQtys = inputData.products.map(product => product.product_qty);
      const shippingCosts = inputData.products.map(product => product.shipping_cost);

      const data = {
        customer_name: inputData.customer_name,
        customer_phone: inputData.customer_phone,
        customer_address: inputData.customer_address,
        order_type: inputData.order_type,
        product_id: productIds,
        product_qty: productQtys,
        shipping_cost: shippingCosts,
        shop_id: shopId
      };

      startLoading();
      const response = await SuperFetch.post("/client/orders", data, { headers: headers });

      showToast("Order created successfully", "success");
      handleCloseModal();
      handleFetch();
      orderUpdate();
    } catch (error) {
      console.error("Error creating order:", error);
      showToast("Something went wrong!", "error");
    } finally {
      stopLoading();
    }
  };
  useEffect(() => {
    setAvailableProducts(products); // Initialize availableProducts
  }, [products]);
  return (
    <Modal
      open={modalOpen}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="updateModal"
    >
      <Box className="modalBox">
        <div className="modalContent">
          <div className="header">
            <div className="left">
              <i className="flaticon-plus"></i>
              <h4>Add New Order</h4>
            </div>

            <div className="right" onClick={handleCloseModal}>
              <i className="flaticon-close-1"></i>
            </div>
          </div>
          <Formik
            initialValues={{
              customer_name: "",
              customer_phone: "",
              customer_address: "",
              order_type: "",
              products: [
                { product_id: "", product_qty: 1, shipping_cost: '' }
              ]
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              createOrder(values);
            }}
          >
            {({ values }) => (
              <Form>
                <div className="updateModalForm OrderModal">
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <div className="customInput">
                        <label>
                          Enter Customer Name <span>*</span>
                        </label>
                        <Field
                          type="text"
                          name="customer_name"
                        />

                        <ErrorMessage name="customer_name" component="div"
                          className="error" />
                      </div>
                    </Grid>

                    <Grid item xs={6}>
                      <div className="customInput">
                        <label>
                          Enter Customer Contact No. <span>*</span>
                        </label>
                        <Field
                          type="text"
                          name="customer_phone"

                          defaultValue="+88"
                          placeholder="Enter Customer Contact No"
                        // defa
                        />
                        <ErrorMessage name="customer_phone" component="div"
                          className="error" />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div className="customInput">
                        <label>
                          Enter Customer Address <span>*</span>
                        </label>
                        <Field
                          type="text"
                          name="customer_address"
                          placeholder="Enter Customer Address"
                        />
                        <ErrorMessage name="customer_address" component="div"
                          className="error" />
                      </div>
                    </Grid>
                  </Grid>

                  <div
                    className=""
                    style={{ width: "100%", marginTop: "10px" }}
                  >
                    <FieldArray name="products">
                      {(arrayHelpers) => (
                        <div>
                          {values?.products?.map((product, index) => (
                            <div key={index}>
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={5}>
                                  <div className="customInput">
                                    <label>
                                      Product Name <span>*</span>
                                    </label>
                                    <Field
                                      component="select"
                                      name={`products.${index}.product_id`}
                                    >
                                      <option value="">Select Product</option>
                                      {Array.isArray(products)
                                        ? products?.map((data) => (
                                          <option
                                            key={data?.id}
                                            value={data?.id}
                                            disabled={values.products.some(
                                              (p, i) =>
                                                p.product_id === data.id && i !== index
                                            )}
                                          >
                                            {data?.product_name}
                                          </option>
                                        ))
                                        : null}
                                    </Field>
                                    <ErrorMessage
                                      name={`products.${index}.product_id`}
                                      component="div"
                                      className="error"
                                    />
                                  </div>
                                </Grid>

                                <Grid item xs={12} sm={3}>
                                  <div className="customInput">
                                    <label>
                                      Product Quantity<span>*</span>
                                    </label>
                                    <Field
                                      type="number"
                                      variant="outlined"
                                      name={`products.${index}.product_qty`}
                                      placeholder="Enter Product Quantity"
                                    // defa
                                    />       <ErrorMessage
                                      name={`products.${index}.product_qty`}
                                      component="div"
                                      className="error"
                                    />
                                    {/* Display error for product_quantity if needed */}
                                  </div>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                  <div className="customInput">
                                    <label>Shipping Cost</label>
                                    <Field
                                      type="number"
                                      variant="outlined"
                                      name={`products.${index}.shipping_cost`}
                                      placeholder="Shipping Cost"
                                      defa
                                    />
                                    <ErrorMessage
                                      name={`products.${index}.shipping_cost`}
                                      component="div"
                                      className="error"
                                    />
                                  </div>
                                </Grid>
                                <Grid item xs={1}>
                                  <button
                                    type="button"
                                    onClick={() => arrayHelpers.remove(index)}
                                    className="red"
                                  >
                                    <img src="/images/close.png" alt="" />
                                  </button>
                                </Grid>
                              </Grid>
                            </div>
                          ))}
                          <button
                            type="button"
                            className="bg OrderBg"
                            onClick={() =>
                              arrayHelpers.push({
                                product_id: "",
                                product_qty: 0,
                                shipping_cost: 0,
                              })
                            }
                          >
                            Add Product
                          </button>
                        </div>
                      )}
                    </FieldArray>
                  </div>

                  <div className="customInput">
                    <label>
                      Order Source<span>*</span>
                    </label>

                    <Field
                      component="select"
                      name="order_type"
                    >
                      <option value="">Select Order Source</option>

                      <option key={"social"} value={"social"}>
                        Social Media
                      </option>
                      <option key={"phone"} value={"phone"}>
                        Phone Call
                      </option>
                    </Field>
                    <ErrorMessage name="order_type" component="div"
                      className="error" />
                  </div>


                </div>

                <div className="duelButton">
                  {isLoading ? (
                    <>
                      <Button type="submit" className="One">
                        {" "}
                        <Spinner /> Add
                      </Button>
                    </>
                  ) : (
                    <Button type="submit" className="One">
                      {" "}
                      Add Order
                    </Button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Box>
    </Modal>
  );
};
export default OrderModal;
