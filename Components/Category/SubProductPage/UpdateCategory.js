import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { headers } from "../../../pages/api";

import style from './style.module.css';
import { useToast } from "../../../hook/useToast";



const UpdateCategory = ({ id }) => {
    const showToast = useToast()
    const [products, setProducts] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    const [openSales, setOpenSales] = useState(false);
    const handleOpenSales = () => setOpenSales(true);
    const handleCloseSales = () => setOpenSales(false);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();



    const onCategorySubmit = (data) => {
        const formData = new FormData();
        if (selectedImage) {
            formData.append('category_image', selectedImage);
        }
        formData.append('name', data.name);

        formData.append('_method', 'patch');


        axios.post(process.env.API_URL + "/client/categories/" + id, formData, { headers: headers }
        )

            .then(function (response) {
                showToast('Category Update Successfully')
                
            })
            .catch(function (error) {
                showToast('Something went wrong!', "error")
            });

        reset();
        setOpenSales(false);
    };


    useEffect(() => {
        axios.get(process.env.API_URL + "/client/categories/" + id, { headers: headers })
            .then(function (response) {
                let allProduct = response.data.data;
                setProducts(allProduct);


            });
    }, []);


    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (selectedImage) {
            setImageUrl(URL.createObjectURL(selectedImage));
        }
    }, [selectedImage]);



    return (
        <div>
            <Button className='updateActionBtn' onClick={handleOpenSales}><i className="flaticon-edit"></i></Button>
            {/* <div onClick={handleOpenSales}> <i className="flaticon-edit"></i> </div> */}

            <Modal
                open={openSales}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className='updateModal'
            >
                <Box className='modalBox'>

                    <div className='modalContent'>

                        <div className='header'>

                            <div className='left'>
                                <i className="flaticon-edit"></i>
                                <h4>Update Your Category</h4>
                            </div>

                            <div className='right' onClick={handleCloseSales}>
                                <i className="flaticon-cancel"></i>
                            </div>

                        </div>

                        <form onSubmit={handleSubmit(onCategorySubmit)}>

                            <div className='updateModalForm'>

                                <div className='customInput'>
                                    <label>Category Name <span>*</span></label>
                                    <input type="text" defaultValue={products?.name}  {...register("name", { required: true })}
                                        placeholder='Category Name'
                                    />
                                </div>

                                <div className='customInput'>

                                    <label>Category Image <span>*</span></label>
                                    {/* <p className={style.ImageUploadSize}><span>Image Type:</span> png, jpg, jpeg <span>Image Size:</span>Width: 500px, Height: 500px</p> */}

                                    <div className={style.imgUploader}>

                                        <input
                                            accept="image/*"
                                            type="file"
                                            id="select-image"
                                            style={{ display: "none" }}
                                            onChange={(e) => setSelectedImage(e.target.files[0])}
                                        />
                                        <label htmlFor="select-image">
                                            <Button className={style.SelectImgButton} variant="contained" color="primary" component="span">
                                                Upload Image
                                            </Button>
                                        </label>

                                        {imageUrl && selectedImage && (
                                            <Box mt={2} textAlign="center">
                                                <h6>Image Preview:</h6>
                                                <img src={imageUrl} alt={selectedImage.name} height="100px" />
                                            </Box>
                                        )}

                                        {
                                            imageUrl && selectedImage ? "" : <Box mt={2} textAlign="center">
                                                <h6>Image Preview:</h6>
                                                <img src={products?.category_image?.name} alt={products?.main_image?.type} height="100px" />
                                            </Box>
                                        }

                                    </div>

                                </div>

                            </div>

                            <div className="duelButton">
                                <Button type="submit">Update</Button>
                                {/* <Button type="reset" className="red">Reset</Button> */}
                            </div>

                        </form>

                    </div>

                </Box>

            </Modal>
        </div>
    );
};

export default UpdateCategory;


{/* <Box>

    <div className="SalesTargetModal">
        <div className="Header d_flex">
            <div className="svg">
                <BiReceipt />
            </div>

            <div className="text">
                <h5>Update Your Category</h5>
                <p>Update Your Category</p>
            </div>
        </div>

        <div className="CustomeInput">

            <form onSubmit={handleSubmit(onCategorySubmit)} >

                <div className="Item">

                    <label>Category Name <span>*</span></label>

                    <TextField id="outlined-basic" label="" variant="outlined"
                        defaultValue={products?.name}  {...register("name", { required: true })}
                        placeholder='Category Name' />

                </div>

                <div className="Item Upload">
                    <label>Category Image <span>*</span></label>
                    <p>Image must be a file of type: <span>png, jpg, jpeg</span></p>
                    <p>Image Size: <span>(Width: 500px, Height: 500px)</span></p>

                    <input
                        accept="image/*"
                        type="file"
                        id="select-image"
                        style={{ display: "none" }}
                        onChange={(e) => setSelectedImage(e.target.files[0])}
                    />
                    <label htmlFor="select-image">
                        <Button variant="contained" color="primary" component="span">
                            Upload Image
                        </Button>
                    </label>
                    {imageUrl && selectedImage && (
                        <Box mt={2} textAlign="center">
                            <h6>Image Preview:</h6>
                            <img src={imageUrl} alt={selectedImage.name} height="100px" />
                        </Box>
                    )}

                    {
                        imageUrl && selectedImage ? "" : <Box mt={2} textAlign="center">
                            <h6>Image Preview:</h6>
                            <img src={products?.category_image?.name} alt={products?.main_image?.type} height="100px" />
                        </Box>
                    }
                </div>

                <div className="Item">
                    <Button type='submit' className='Update'>Update</Button>
                    <Button type='reset' onClick={handleCloseSales} className='Cancle'>Cancle</Button>
                </div>
            </form>

        </div>

    </div>

</Box> */}