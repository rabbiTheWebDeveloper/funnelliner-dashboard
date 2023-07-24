import { Box, Button, Modal } from "@mui/material";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import SuperFetch from "../../hook/Axios";
import useLoading from "../../hook/useLoading";
import { useToast } from "../../hook/useToast";
import { headers, shopId } from "../../pages/api";
import Spinner from "../commonSection/Spinner/Spinner";

const OrderModal = ({ modalOpen, handleCloseModal, products, handleFetch, orderUpdate }) => {
    const showToast = useToast()
    const [isLoading, startLoading, stopLoading] = useLoading();
    const { register, handleSubmit, reset, formState: { errors }, } = useForm();
    const ref = useRef();
    const [charge, setCharge] = useState(null)
    const [selectedDeliveryLocation, setSelectedDeliveryLocation] = useState("inside_dhaka");
    const handleChangeDeliveryLocation = event => {
        setSelectedDeliveryLocation(event.target.value);
    };
  

    // const options = [
    //     { value: 'inside_dhaka', label: 'Inside Dhaka' },
    //     { value: 'outside_dhaka', label: 'Outside Dhaka' },
    // ]

    const createOrder = (data) => {

        if (data.product_id === "product_id") {
            showToast("Select product!", "error")
            return;
        }
        data.shop_id = shopId;
        data.product_id = [data.product_id];
        data.product_qty = [data.product_qty];
        if (charge === 'paid') {
            if (selectedDeliveryLocation === "") {
                return;
            }
            data.delivery_location = selectedDeliveryLocation
        }
        startLoading()
        SuperFetch.post("/client/orders", data, { headers: headers })
            .then(function (response) {
                showToast("Order create success", "success")
                handleCloseModal()
                reset()
                handleFetch()
                orderUpdate()
                stopLoading()

            })
            .catch(function (error) {
                stopLoading()
                showToast("Something went wrong!", "error")
            });
    };
    return (
        <Modal
            open={modalOpen}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className='updateModal'
        >

            <Box className='modalBox'>

                <div className='modalContent'>

                    <div className='header'>

                        <div className='left'>
                            <i className="flaticon-choices"></i>
                            <h4>Add New Order</h4>
                        </div>

                        <div className='right' onClick={handleCloseModal}>
                            <i className="flaticon-cancel"></i>
                        </div>

                    </div>

                    <form onSubmit={handleSubmit(createOrder)} ref={ref}>

                        <div className='updateModalForm'>

                            <div className='customInput'>
                                <label>Enter Customer Name <span>*</span></label>
                                <input type="text" {...register("customer_name", { required: true })} placeholder="Customer Name"
                                />

                                {errors.customer_name &&
                                    <p className="error">Customer Name required</p>
                                }
                            </div>

                            <div className='customInput'>
                                <label>Enter Customer Contact No. <span>*</span></label>
                                <input type="text" {...register("customer_phone", { required: true, pattern: /^(?:\+8801|01)[3-9]\d{8}$/ })} defaultValue="+88" placeholder="Enter Customer Contact No" />

                                {errors.customer_phone &&
                                    <p className="error">Valid phone number required</p>
                                }
                            </div>

                            <div className='customInput'>
                                <label>Enter Customer Address <span>*</span></label>
                                <input type="text" {...register("customer_address", { required: true },)} placeholder="Enter Customer Address"
                                />

                                {errors.customer_address &&
                                    <p className="error">Address required</p>
                                }
                            </div>

                            {/* <div className="CustomeInput">
                                <label>
                                    <span>*</span>
                                </label>
                                <div className="Dropdown">
                                    <FormControl fullWidth>
                                        <Select{...register("product_id", { required: true })} native={true}
                                            onChange={e => {
                                                setCharge(e?.target?.selectedOptions[0]?.attributes?.delivery_charge?.value)
                                            }}>
                                            <option>
                                                {products.length === 0 ? "Please Add Product" : "Select Product"}
                                            </option>
                                            {Array.isArray(products) ? products?.map((data) => {
                                                return (
                                                    <option key={data?.id} value={data.id} delivery_charge={data.delivery_charge}>
                                                        {data?.product_name}
                                                    </option>
                                                );
                                            }) : null}
                                        </Select>
                                    </FormControl>
                                </div>

                            </div> */}

                            <div className='customInput'>
                                <label>Product Name <span>*</span></label>

                                <select name="" {...register("product_id", { required: true })} native={true}
                                    onChange={e => {
                                        setCharge(e?.target?.selectedOptions[0]?.attributes?.delivery_charge?.value)
                                    }}>

                                    <option>
                                        {products.length === 0 ? "Please Add Product" : "Select Product"}
                                    </option>
                                    {Array.isArray(products) ? products?.map((data) => {
                                        return (
                                            <option key={data?.id} value={data.id} delivery_charge={data.delivery_charge}>
                                                {data?.product_name}
                                            </option>
                                        );
                                    }) : null}

                                </select>

                            </div>

                            <div className='customInput'>
                                <label> Enter Product Quantity<span>*</span></label>
                                <input type="text" defaultValue="1"
                                    variant="outlined"
                                    {...register("product_qty", { required: true })}
                                    placeholder="Enter Product Quantity"
                                />

                                {errors.product_qty &&
                                    <p className="error">Product Quantity Required</p>
                                }
                            </div>

                            <div className='customInput'>
                                <label>Order Source<span>*</span></label>

                                <select name="" {...register("order_type", { required: true })} native={true}>
                                    <option>
                                        Select Order Type
                                    </option>

                                    <option key={"social"} value={"social"}>
                                        Social Media
                                    </option>
                                    <option key={"phone"} value={"phone"}>
                                        Phone Call
                                    </option>

                                </select>

                            </div>

                            {/* {charge === 'paid' &&
                                <div className="CustomeInput">
                                    <label>
                                        Delivery location <span>*</span>
                                    </label>
                                    <div className="Dropdown">
                                        <ReactSelect onChange={handleChangeDeliveryLocation}
                                            options={options} />
                                        {selectedDeliveryLocation === '' && (
                                            <span
                                                style={{ color: "red" }}>Please Select Delivery  location</span>
                                        )}
                                    </div>
                                </div>
                            } */}

                            {charge === 'paid' &&
                                <div className="customInput">
                                    <label>
                                        Delivery location <span>*</span>
                                    </label>

                                    <select name="" onChange={handleChangeDeliveryLocation}>
                                        <option value="inside_dhaka">Inside Dhaka</option>
                                        <option value="outside_dhaka">Outside Dhaka</option>
                                        {selectedDeliveryLocation === '' && (
                                            <p className="error">Please Select Delivery  location</p>
                                        )}
                                    </select>
                                </div>
                            }

                            {/* {charge === 'free' &&
                                <div className="CustomeInput">
                                    <label>
                                        Shipping Cost
                                    </label>
                                    <div className="Dropdown">
                                        <TextField
                                            id="outlined-basic"
                                            variant="outlined"
                                            disabled
                                            value="Free"
                                        />
                                    </div>
                                </div>
                            } */}

                            {charge === 'free' &&
                                <div className="customInput">
                                    <label>
                                        Shipping Cost
                                    </label>

                                    <input type="text" disabled value="Free" />

                                </div>
                            }

                        </div>

                        <div className="duelButton">
                            {
                                isLoading ? <><Button type="submit" className="One"> <Spinner /> Add</Button></> : <Button type="submit" className="One"> Add Order</Button>
                            }
                            {/* <Button type="reset" className="red">Reset</Button> */}

                        </div>

                    </form>

                </div>

            </Box>
        </Modal>
    )
}
export default OrderModal