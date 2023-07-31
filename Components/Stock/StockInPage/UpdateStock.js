import { Button, Modal } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "../../../hook/useToast";

import { headers } from "../../../pages/api/";
import Spinner from "../../commonSection/Spinner/Spinner";
import style from './style.module.css';
import useLoading from "../../../hook/useLoading";
const UpdateStock = ({ productId, handleFetch }) => {
    const [isLoading, startLoading, stopLoading] = useLoading();
    const showToast = useToast()
    const [stock, setStock] = useState({})
    const [openStock, setOpenStock] = useState(false);
    const handleOpenStock = () => setOpenStock(true);
    const handleStockClose = () => setOpenStock(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        axios.get(process.env.API_URL + `/client/stocks/stock-in/show/${productId}`, { headers: headers })
            .then(function (response) {
                setStock(response.data.data[0]);
            });
    }, []);

    const onSubmit = data => {
        startLoading()
        data.product_id = stock.id
       
        axios.post(process.env.API_URL + "/client/stocks/stock-in/update", data, { headers: headers })
            .then(function (response) {
                if (response.data.success) {
                    showToast("Stock Update   Successfully!", "success")
                    handleFetch()
                }
                stopLoading()
            })
            .catch(function (error) {
                stopLoading()
                showToast("Something went wrong", "error")
            });
        reset();
        setOpenStock(false);
    };

    return (
        <>
            <div onClick={handleOpenStock}> <i className="flaticon-edit"></i> </div>

            <Modal
                open={openStock}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className='updateModal'
            >
                <Box className='modalBox'>

                    <div className='modalContent'>

                        <div className='header'>

                            <div className='left'>
                                <i className="flaticon-edit"></i>
                                <h4>Update Stock</h4>
                                {/* <p>Update Your Stock, Increase And Decrease Your Stock</p> */}
                            </div>

                            <div className='right' onClick={handleStockClose}>
                                <i className="flaticon-cancel"></i>
                            </div>

                        </div>

                        <form onSubmit={handleSubmit(onSubmit)}>

                            <div className='updateModalForm'>

                                <div className='customInput'>
                                    <div className={style.uploadImage}>
                                        <img src={stock?.main_image?.name} alt="" />
                                        <h6>{stock?.product_name}</h6>
                                    </div>
                                </div>

                                <div className='customInput'>
                                    <h4>Current Stock:<span>{stock.product_qty}</span></h4>
                                    <label>Stock Update:</label>
                                    <input type="text"  {...register("stock_quantity", { required: true })} />
                                    {errors.stock_quantity &&
                                        <p className="error">Stock Quantity field is required</p>
                                    }
                                </div>

                            </div>

                            <div className="duelButton">
                                {
                                    isLoading ? <><Button disabled type="submit"><Spinner/> Update</Button></> : <Button type="submit"> Update</Button>
                                }
                                <Button type="reset" className="red">Reset</Button>
                            </div>

                        </form>

                    </div>

                </Box>

            </Modal>
        </>
    );
};

export default UpdateStock;