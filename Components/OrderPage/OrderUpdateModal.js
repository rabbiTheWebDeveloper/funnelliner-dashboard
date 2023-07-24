
import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useToast } from "../../hook/useToast";
import { headers } from "../../pages/api";

const OrderUpdateModal = ({ order,orderId, handleCloseOrderUpdateModal, modalOpenUpdate, products, handleFetch }) => {
    const showToast = useToast();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const [openSales, setOpenSales] = useState(false)
    const [productId, setProductId] = useState([]);
    const handleOpenSales = () => setOpenSales(true);
    const handleCloseSales = () => setOpenSales(false);

    const { order_details } = order
    const formData = new FormData()
    const handleChangeItem = (data) => {

        const productIDs = []
        setProductId(productIDs)
    }

    let options = products?.length === 0 ? [] : products?.map(function (item) {
        return { value: item.id, label: item.product_name, };
    })

    const defaultProductForSelect = order && order?.order_details && order?.order_details.map(product => ({ value: product.product_id, label: product.product }));
    const onSubmit = (data) => {

        formData.append("_method", "patch");
        formData.append("customer_name", data.customerName);
        formData.append("customer_address", data.address);
        formData.append("customer_phone", data.phone);
        formData.append("shipping_cost", data.shipping_cost);

        //    debugger
        axios.post(process.env.API_URL + "/client/orders/" + orderId, formData, {
            headers: headers,
        })
            .then(function (response) {
                showToast('Order Update   Successfully !', 'success');
                handleFetch()
           
             
            })
            .catch(function (error) {
                Swal.fire({
                    icon: "error",
                    text: "Something went wrong",
                });
            });
        // setOpenSales(false);
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
                            <i className="flaticon-cancel"></i>
                        </div>

                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>

                        <div className='updateModalForm'>

                            <div className='customInput'>
                                <label>Customer Name</label>
                                <input type="text" placeholder="Name" defaultValue={order?.customer_name}
                                    {...register("customerName")} />
                            </div>

                            <div className='customInput'>
                                <label>Contact No</label>
                                <input type="text" placeholder="Name" defaultValue={order?.phone}
                                    {...register("phone")} />
                            </div>

                            <div className='customInput'>
                                <label>Address</label>
                                <input type="text" placeholder="Name" defaultValue={order?.address}
                                    {...register("address")} />
                            </div>

                            <div className='customInput'>
                                <label>Shipping Cost</label>
                                <input type="text" placeholder="Name" defaultValue={order?.shipping_cost}
                                    {...register("shipping_cost")} />
                            </div>

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
