import { Box, Button, Modal } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { baseTest } from '../../constant/constant';
import { headers } from '../../pages/api';

const AddPayment = ({ handleClosePaymentMethod, openSuggestNote1, handelFetchReciver ,handelFetchPaymentlist }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const handleApiAlert = (response, successMessage) => {
        handleCloseSuggestNote1()
        if (response.success) {
            Swal.fire({
                icon: "success",
                title: "Category/Ledger Added!",
                text: successMessage,
            });
            handleCloseSuggestNote1(); // Close the modal
        } else {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: response.error,
            });
        }
    }

    const addPayable = (data) => {
        axios.post(baseTest + "/client/accounts/payment-method-add", data, {
            headers: headers
        })
            .then(function (response) {
                handelFetchPaymentlist()
                // handelFetchReciver()
                handleClosePaymentMethod()
                    // handleApiAlert(response.data, "Category/Ledger Added!");
                    // Swal.fire("Category/Ledger Added!", response.data.msg, "success");
                    ; // Close the modal
            })
            .catch(function (error) {
                Swal.fire({
                    icon: "error",
                    title: error?.response?.data?.msg,
                });
            });
        reset()
    };

    return (
        <div className="NoteHover">
            <Modal
                open={openSuggestNote1}
                onClose={handleClosePaymentMethod}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="tableModal"
            >
                <Box>
                    <form onSubmit={handleSubmit(addPayable)}>
                        <div className="tableModalContent">
                            <div className="header">
                                <div className="left">
                                    <i className="flaticon-edit"></i>
                                    <h4>Please Enter Your Payment Method </h4>
                                </div>
                                <div className="right" onClick={handleClosePaymentMethod}>
                                    <i className="flaticon-cancel"></i>
                                </div>
                            </div>
                            <div className="tableModalForm">
                                <div className="customInput">
                                    <label>Payment Method</label>
                                    <input type="text" placeholder='Enter Your Payment Method' {...register("name", { required: true, maxLength: 20 })} />
                                    {errors.name && <span>This field is required</span>}
                                </div>
                            </div>
                            <div className="duelButton">
                                <Button type='submit'>Add Payment Method</Button>
                                {/* <Button className="red">Reset</Button> */}
                            </div>
                        </div>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default AddPayment;
