
import { Box, Button, Modal } from "@mui/material";
import axios from "axios";

import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useToast } from "../../hook/useToast";
import { headers } from "../../pages/api";

const OrderUpdateModal = ({ order, orderId, handleCloseOrderUpdateModal, modalOpenUpdate, products, handleFetch ,orderUpdate }) => {
    const showToast = useToast();
    const { register, handleSubmit, formState: { errors } } = useForm();



    const { order_details } = order
    const formData = new FormData()


    let options = products?.length === 0 ? [] : products?.map(function (item) {
        return { value: item.id, label: item.product_name, };
    })


    const onSubmit = (data) => {

        formData.append("_method", "patch");
        formData.append("customer_name", data.customerName);
        formData.append("customer_address", data.address);
        formData.append("order_type", order?.order_type);
        formData.append("customer_phone", data.phone);
        formData.append("shipping_cost", data.shipping_cost);
        if(order?.order_status === "confirmed" || order?.order_status === "shipped"){
            formData.append("order_status", data.order_status);
        }
        else{
            formData.append("order_status", order?.order_status);

        }
      

        //    debugger
        axios.post(process.env.API_URL + "/client/orders/" + orderId, formData, {
            headers: headers,
        })
            .then(function (response) {
                showToast('Order Update   Successfully !', 'success');
                handleFetch()
                orderUpdate()


            })
            .catch(function (error) {
                Swal.fire({
                    icon: "error",
                    text: "Something went wrong",
                });
            });

        handleCloseOrderUpdateModal()
        handleFetch()

    }

    return (
        <Modal
            open={modalOpenUpdate}
            onClose={handleCloseOrderUpdateModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className='viewModal'
        >
            <Box className='modalBox'>

                <div className='modalContent'>

                    <div className='header'>
                        <div className='left'>
                            <i className="flaticon-edit"></i>
                            <h4>Update Order Details</h4>
                        </div>

                        <div className='right' onClick={handleCloseOrderUpdateModal}>
                            <i className="flaticon-close-1"></i>
                        </div>

                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className='updateModalForm'>

                            <div className='customInput'>
                                <label>Customer Name</label>
                                <input type="text" placeholder="Customer Name" defaultValue={order?.customer_name}
                                    {...register("customerName")} />
                            </div>

                            <div className='customInput'>
                                <label>Contact No</label>
                                <input type="text" placeholder="Contact No" defaultValue={order?.phone}
                                    {...register("phone")} />
                            </div>

                            <div className='customInput'>
                                <label>Address</label>
                                <input type="text" placeholder="Address" defaultValue={order?.address}
                                    {...register("address")} />
                            </div>

                            <div className='customInput'>
                                <label>Shipping Cost</label>
                                <input type="text" placeholder="Shipping Cost" defaultValue={order?.shipping_cost}
                                    {...register("shipping_cost")} />
                            </div>

                            {
                                order?.order_status === "confirmed" || order?.order_status === "shipped" ?
                                    <div className='customInput'>
                                        <label>
                                            Status</label>
                                        <select
                                            name="order_status"
                                            {...register("order_status")}
                                            native={true}
                                            defaultValue={order?.order_status}
                                        >
                                            <option value="">Select Status</option>

                                            <option key={"follow_up"} value={"follow_up"}>
                                                Follow Up
                                            </option>
                                            <option key={"cancelled"} value={"cancelled"}>
                                                Cancelled
                                            </option>
                                        </select>
                                    </div> : null

                            }


                        </div>

                        <div className="duelButton">
                            <Button type="submit">Update</Button>
                            {/* <Button className="red">Reset</Button> */}
                        </div>

                    </form>

                </div>

                {/* <div className="SalesTargetModal OrderModalPopup">
    <div className="Header d_flex">
        <div className="svg">
            <BiReceipt />
        </div>

        <div className="text">
            <h5>Update Order Details</h5>
        </div>
    </div>

    <form onSubmit={handleSubmit(onSubmit)}>
        <div className="Form OrderModal d_flex d_justify">

            <div className="CustomeInput">
                <label>Customer Name</label>
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    defaultValue={order?.customer_name}
                    {...register("customerName")}
                />
            </div>

            <div className="CustomeInput">
                <label>Contact No</label>
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    defaultValue={order?.phone}
                    {...register("phone")}
                />
            </div>

            <div className="CustomeInput">
                <label>Address</label>
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    defaultValue={order?.address}
                    {...register("address")}
                />
            </div>
            <div className="CustomeInput">
                <label>Shipping Cost</label>
                <TextField
                    key={order.id}
                    id="outlined-basic"
                    variant="outlined"
                    defaultValue={order?.shipping_cost}
                    {...register("shipping_cost")}
                />
            </div>
        </div>
        <div className="CustomeInput">
            <div className="DuelButton">
                <Button type="submit">Update</Button>
            </div>
        </div>
    </form>
</div> */}

            </Box>

        </Modal>
    )
}
export default OrderUpdateModal
