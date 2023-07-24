import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { headers } from "../../../pages/api";


const ShowProduct = ({ id, product, modalOpen, handleCloseModal}) => {
    // const [products, setProducts] = useState([]);
    // useEffect(() => {
    //     axios.get(process.env.API_URL + "/client/products/" + id, { headers: headers })
    //         .then(function (response) {
    //             setProducts(response.data.data);
    //         });
    // }, [id]);

    return (
        <div>
           
            <Modal
                keepMounted
                open={modalOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className='viewModal'
            >
                <Box className='modalBox'>

                    <div className='modalContent'>

                        <div className='header'>
                            <div className='left'>
                                <i className="flaticon-view"></i>
                                <h4>Products</h4>
                            </div>

                            <div className='right' onClick={handleCloseModal}>
                                <i className="flaticon-cancel"></i>
                            </div>

                        </div>

                        <div className="table">

                            <table>


                                <tr>

                                    <th>Product Name</th>
                                    <td>{product?.product_name}</td>

                                    <th>Selling Price</th>
                                    <td>{product?.price}</td>

                                </tr>

                                <tr>

                                    <th>Product Code</th>
                                    <td>{product?.product_code}</td>

                                    <th>Available Quantity</th>
                                    <td>
                                        {product?.product_qty > 0 ? product?.product_qty : <p className="error"> stock out </p>}
                                    </td>

                                </tr>

                                <tr>

                                    <th>Product Image</th>
                                    <td><img src={product?.main_image?.name} alt="" /></td>

                                    <th></th>
                                    <td></td>

                                </tr>


                            </table>

                        </div>

                    </div>

                    {/* <div className="SalesTargetModal">
                        <div className="Form">
                            <div className="CustomeInput">
                                <label> </label>
                                <TextField id="outlined-basic" disabled variant="outlined" value={products?.product_qty > 0 ? products?.product_qty : <span style={{ color: 'red' }}> />
                            </div>
                            <div className="CustomeInput">
                                <label> </label>
                                
                            </div>
                        </div>
                    </div> */}
                </Box>
            </Modal>
        </div>
    );
};

export default ShowProduct;
