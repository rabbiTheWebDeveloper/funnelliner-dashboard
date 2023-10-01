import { Box, Button, Grid, Modal } from "@mui/material";
import { useState } from "react";
import SuperFetch from "../../hook/Axios";
import useLoading from "../../hook/useLoading";
import { useToast } from "../../hook/useToast";
import { headers, shopId } from "../../pages/api";
import Spinner from "../commonSection/Spinner/Spinner";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import { Fragment } from "react";

const validationSchema = Yup.object({
  customer_name: Yup.string().required("Customer Name is required"),
  customer_phone: Yup.string().required("Customer Contact No. is required").matches(/^(?:\+8801|01)[3-9]\d{8}$/, "Customer Contact No. must be a valid "),
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
        .min(0, 'Shipping cost cannot be negative'),
    })
  ),
  order_type: Yup.string().required("Order Source is required"),
});

function replaceEmptyStringsWithNull(arr) {
  return arr.map((item) => (item === "" ? 0 : item));
}
const OrderModal = ({
  modalOpen,
  handleCloseModal,
  products,
  handleFetch,
  orderUpdate
}) => {
  const showToast = useToast();
  const [isLoading, startLoading, stopLoading] = useLoading();
  const [selectedProducts, setSelectedProducts] = useState([]);

  const createOrder = async inputData => {
    try {
      const productIds = inputData.products.map(product => product.product_id);
      const selectedVariants = inputData.products.map(product => product.variant_id);
      const productQuantities = inputData.products.map(
        product => product.product_qty
      );
      const shippingCosts = inputData.products.map(
        product => product.shipping_cost
      );
      const data = {
        customer_name: inputData.customer_name,
        customer_phone: inputData.customer_phone,
        customer_address: inputData.customer_address,
        order_type: inputData.order_type,
        product_id: productIds,
        product_qty: productQuantities,
        shipping_cost: shippingCosts,
        shop_id: shopId,
        variant_id:replaceEmptyStringsWithNull(selectedVariants)
      
      };
      console.log("data" , data)
      startLoading();
      const response = await SuperFetch.post(API_ENDPOINTS.ORDERS.CREATE_ORDER, data, {
        headers: headers,
      });
      if (response.data.success) {
        showToast("Order created successfully", "success");
        handleCloseModal();
        handleFetch();
        orderUpdate();
      }

    } catch (error) {
      if (error.response) {
        Object.keys(error?.response?.data?.msg).forEach((key) => {
          const errorMessage = error?.response?.data?.msg[key][0];
          showToast(errorMessage, "error");
        })
      }
    } finally {
      stopLoading();
    }
  };
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
              products: [{ product_id: "", variant_id: "", product_qty: 1, shipping_cost: 0 }],
            }}
            validationSchema={validationSchema}
            onSubmit={values => {
              createOrder(values);
            }}
          >
            {({ values, setFieldValue }) => (
              <Form>
                <div className="updateModalForm OrderModal">
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={7}>
                      <div className="customInput">
                        <label>
                          Enter Customer Name <span>*</span>
                        </label>
                        <Field
                          type="text"
                          name="customer_name"
                          placeholder="Enter Customer Name"
                        />
                        <ErrorMessage
                          name="customer_name"
                          component="div"
                          className="error"
                        />
                      </div>
                    </Grid>

                    <Grid item xs={12} sm={5}>
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
                        <ErrorMessage
                          name="customer_phone"
                          component="div"
                          className="error"
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={7}>
                      <div className="customInput">
                        <label>
                          Enter Customer Address <span>*</span>
                        </label>
                        <Field
                          type="text"
                          name="customer_address"
                          placeholder="Enter Customer Address"
                        />
                        <ErrorMessage
                          name="customer_address"
                          component="div"
                          className="error"
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12} sm={5}>
                      <div className="customInput">
                        <label>
                          Order Source<span>*</span>
                        </label>

                        <Field component="select" name="order_type">
                          <option value="">Select Order Source</option>

                          <option key={"social"} value={"social"}>
                            Social Media
                          </option>
                          <option key={"phone"} value={"phone"}>
                            Phone Call
                          </option>
                        </Field>
                        <ErrorMessage
                          name="order_type"
                          component="div"
                          className="error"
                        />
                      </div>
                    </Grid>
                    <Grid item xs={12}>
                      <div className="OrderAddProductModal">
                        <FieldArray name="products">
                          {arrayHelpers => (
                            <Fragment>
                              <div>
                                {values?.products?.map((product, index) => (
                                  <div key={index}>
                                    <Grid container spacing={2}>
                                      <Grid item xs={12} sm={4}>
                                        <div className="customInput">
                                          <label>
                                            Product Name <span>*</span>
                                          </label>
                                          <Field
                                            component="select"
                                            onChange={(e) => {
                                              const selectedProductId = e.target.value;
                                              setFieldValue(`products[${index}].product_id`, selectedProductId);
                                              setSelectedProducts((prevSelected) => {
                                                prevSelected[index] = selectedProductId;
                                                return [...prevSelected];
                                              });
                                            }}
                                            value={values.products[index].product_id || ""}
                                            name={`products[${index}].product_id`}
                                        
                                          >
                                            <option value="">
                                              Select Product
                                            </option>
                                            {Array.isArray(products)
                                              ? products?.map(data => (
                                                <option
                                                  key={data?.id}
                                                  value={data?.id}
                                  
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
                                      <Grid item xs={12} sm={2}>
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
                                          />{" "}
                                          <ErrorMessage
                                            name={`products.${index}.product_qty`}
                                            component="div"
                                            className="error"
                                          />
                                          {/* Display error for product_quantity if needed */}
                                        </div>
                                      </Grid>
                                      <Grid item xs={12} sm={2}>
                                        <div className="customInput">
                                          <label>Shipping Cost <span>*</span></label>
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
                                      {
                                        selectedProducts[index] &&
                                        products.find((product) => product.id == selectedProducts[index]) &&
                                        products.find((product) => product.id == selectedProducts[index])
                                          .variations.length > 0 ?
                                          <Grid item xs={12} sm={3}>
                                          <div className="customInput">
                                            <label>Variant</label>
                                            <Field
                                          
                                              component="select"
                                              name={`products[${index}].variant_id`}
                                            >
                                              <option value="">Select Variant</option>
                                              {selectedProducts[index] &&
                                                products.find((product) => product.id == selectedProducts[index]) &&
                                                products.find((product) => product.id == selectedProducts[index])
                                                  .variations.map((variant) => (
                                                    <option key={variant.id} value={variant.id}>
                                                      {variant.variant}
                                                    </option>
                                                  ))}
                                            </Field>
                                            <ErrorMessage
                                              name={`products[${index}].variant_id`}
                                              component="div"
                                              className="error"
                                            />
                                          </div>
                                        </Grid> : null
                                      }

                                    
                                      {
                                        values?.products.length > 1 ?
                                          <Grid item xs={12} sm={1}>
                                            <Button
                                              className="DeleteModalButton"
                                              type="button"
                                              onClick={() =>
                                                arrayHelpers.remove(index)
                                              }
                                            >
                                              <i className="flaticon-delete"></i>
                                            </Button>
                                          </Grid> : null
                                      }
                                    </Grid>
                                  </div>
                                ))}
                              </div>
                              <div className="HeaderButton">
                                <Button
                                  className="bg"
                                  onClick={() =>
                                    arrayHelpers.push({
                                      product_id: "",
                                      variant_id: "",
                                      product_qty: 1,
                                      shipping_cost: 0,
                                    })
                                  }
                                >
                                  Add Product <i className="flaticon-plus"></i>
                                </Button>
                              </div>
                            </Fragment>
                          )}
                        </FieldArray>
                      </div>
                    </Grid>
                  </Grid>
                </div>
                <div className="duelButton">
                  {isLoading ? (
                    <Button type="submit" className="One">
                      {" "}
                      <Spinner /> Add
                    </Button>
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