import { Box, Button, Grid, Modal } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from '../../../hook/useToast';
import { headers } from '../../../pages/api';
import style from './addCategory.module.css';

const AddProductCategory = ({ handleCloseSuggestNote, openSuggestNote, handelFetchCategory ,HandelFetchCategory }) => {
    const showToast = useToast();
    const [selectedImage1, setSelectedImage1] = useState(null);
    const [imageUrl1, setImageUrl1] = useState(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const onCategorySubmit = (data) => {
        data.parent_id = "0";
        data.description = "";
        data.status = "1";
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('parent_id', data.parent_id);
        formData.append('status', data.status);
        axios.post(process.env.API_URL + "/client/categories", formData, { headers: headers })
            .then(function (response) {
                if (response?.data?.success) {
                    showToast(response?.data?.message, "success");
                    handleCloseSuggestNote();

                    HandelFetchCategory()
                }
            })
            .catch(function (error) {
                if (error?.response?.status === 422) {
                    showToast("This category already exists!", "error");
                } else if (error?.response?.status === 400) {
                    showToast("Category image is required!", "error");
                } else {
                    showToast("Something went wrong!", "error");
                }
            });
    };

    useEffect(() => {
        if (selectedImage1) {
            setImageUrl1(URL.createObjectURL(selectedImage1));
        }
    }, [selectedImage1]);

    return (
        <Modal
            open={openSuggestNote}
            onClose={handleCloseSuggestNote}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className='updateModal'
        >
            <Box className='modalBox'>
                <div className="modalContent">
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
                                                    <input
                                                        type="text"
                                                        {...register("name", { required: true })}
                                                        placeholder='Category Name'
                                                    />
                                                </div>

                                            </div>
                                            <div className={style.Submit}>
                                                <Button type="submit">
                                                    <i className="flaticon-install"></i> Add Category
                                                </Button>
                                            </div>
                                        </div>
                                    </form>
                                </Grid>
                            </Grid>
                        </div>
                    </div>
                </div>
            </Box>
        </Modal>
    );
};

export default AddProductCategory;
