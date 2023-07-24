import { Box, Button, Modal, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { headers } from "../../../pages/api";

const ShowCategory = ({ id }) => {
    const [products, setProducts] = useState([]);
    const [openSales, setOpenSales] = useState(false);
    const handleOpenSales = () => setOpenSales(true);
    const handleCloseSales = () => setOpenSales(false);
    useEffect(() => {
        axios.get(process.env.API_URL + "/client/categories/" + id, { headers: headers })
            .then(function (response) {
                // handle success
                setProducts(response.data.data);
            });
    }, [id]);
    return (
        <div>
            <Button className='viewActionBtn' onClick={handleOpenSales}> <i className="flaticon-view"></i></Button>
            {/* <div onClick={handleOpenSales}> <i className="flaticon-view"></i> </div> */}
            <Modal
                open={openSales}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className='viewModal'
            >
                <Box className='modalBox'>

                    <div className='modalContent'>

                        <div className='header'>

                            <div className='left'>
                                <i className="flaticon-view"></i>
                                <h4>View Category</h4>
                            </div>

                            <div className='right' onClick={handleCloseSales}>
                                <i className="flaticon-cancel"></i>
                            </div>

                        </div>

                        <div className="table">

                            <table>


                                <tr>

                                    <th>Category Name</th>
                                    <td>{products?.name}</td>

                                    <th>Category Image</th>
                                    <td><img src={products?.category_image?.name} alt="" /></td>

                                </tr>


                            </table>

                        </div>

                    </div>

                </Box>

            </Modal>

        </div>
    );
};

export default ShowCategory;