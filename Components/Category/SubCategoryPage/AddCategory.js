import { Box, Button, Grid } from "@mui/material";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import useLoading from "../../../hook/useLoading";
import { useToast } from "../../../hook/useToast";
import { useAddCategoryMutation } from "../../../redux/features/category/categoryApi";
import Spinner from "../../commonSection/Spinner/Spinner";
import style from './addCategory.module.css';
import axios from "axios";
import { headers } from "../../../pages/api";


const AddCategory = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [text, setText] = useState('');
    const [addCategory, setAddCategory] = useAddCategoryMutation();
    const showToast = useToast()
    const [isLoading, startLoading, stopLoading] = useLoading();


    const router = useRouter();
    const onCategorySubmit = (data) => {
        data.parent_id = "0";
        data.description = "";
        data.status = "1";
        const formData = new FormData();
        if (selectedImage?.size > 1024 * 1024) {
            showToast("Image size is too big !", 'error')
            return;
        }
        if(selectedImage){
            formData.append('category_image', selectedImage);
        }     
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('parent_id', data.parent_id);
        formData.append('status', data.status);

       
        startLoading()
        axios.post(process.env.NEXT_PUBLIC_API_URL + "/client/categories", formData, { headers: headers })
            .then(function (response) {

                if (response?.data?.success) {
                    showToast(response?.data?.message, "success")
                    router.push("/category-list");
                }
            })
            .catch(function (error) {
                stopLoading()
                if (error?.response?.status === 422) {                     
                    showToast(error?.response?.data?.errors.category[0], "error")
                } else if (error?.response?.status === 400) {          
                    showToast(error?.response.data.message, "error")
                }
                else {
                    showToast("Something went wrong!", "error")
                }
            });

    };

    const handleTextChange = (event) => {
        setText(event.target.value);
    };

    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (selectedImage) {
            setImageUrl(URL.createObjectURL(selectedImage));
        }
    }, [selectedImage]);
    return (


        <div className="">

            {/* Shop Info */}
            <div className="DashboardFormItem">

                <Grid container spacing={3}>

                    <Grid item xs={12} sm={12}>
                        <form onSubmit={handleSubmit(onCategorySubmit)}>

                            <div className={style.AddProduct}>

                                <div className={style.header}>

                                    <h4>Category</h4>
                                    <p>This will be displayed on your Category page</p>

                                </div>

                                <div className={style.FormValidation}>

                                    <div className={style.customInput}>
                                        <label>Category Name <span>*</span></label>
                                        <input type="text" {...register("name", { required: true })}
                                            placeholder='Category Name'
                                            onChange={handleTextChange}
                                        />
                                    </div>

                                    <div className={style.customInput}>
                                        <label>Image <span className={style.mustBe}>Must be:</span> (png, jpg) ; <span className={style.mustBe}>Image Size: </span> (W:500px, h: 500px)</label>

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
                                                    <img src={imageUrl} alt={selectedImage.name} Height="100px" />
                                                </Box>
                                            )}

                                        </div>

                                    </div>

                                </div>

                                {/* Submit */}
                                <div className={style.Submit}>
                                    {
                                        isLoading ? <><Button disabled type="submit">
                                            <i><Spinner /></i>
                                            Add Category
                                        </Button></> : <Button type="submit">
                                            <i className="flaticon-install"> </i>
                                            Add Category
                                        </Button>
                                    }
                                </div>

                            </div>

                        </form>

                    </Grid>

                </Grid>

            </div>

        </div>

    );
};

export default AddCategory;