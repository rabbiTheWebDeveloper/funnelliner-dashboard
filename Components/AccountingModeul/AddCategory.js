import { Box, Button, Modal } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { baseTest } from '../../constant/constant';
import { headers } from '../../pages/api';

const AddCategory = ({ handleCloseSuggestNote, openSuggestNote ,handelFetchCategory}) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();


    const addCategory = (data) => {
        // data.name = inputValue
        // data.payment_recevier = inputValue1

        axios.post(baseTest + "/client/accounts/ledger/add", data, {
            headers: headers
        })
            .then(function (response) {
                
                handelFetchCategory()
                handleCloseSuggestNote()
            })
            .catch(function (error) {
                Swal.fire({
                    icon: "error",
                    title: error?.response?.data?.msg,

                });
            });
        reset()



    }


    return (
        <div className="NoteHover">
            <Modal
                open={openSuggestNote}
                onClose={handleCloseSuggestNote}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                className="tableModal"
            >
                <Box>
                    <form onSubmit={handleSubmit(addCategory)}>
                        <div className="tableModalContent">
                            <div className="header">
                                <div className="left">
                                    <i className="flaticon-edit"></i>
                                    <h4>Please Enter Your Category/Ledger</h4>
                                </div>
                                <div className="right" onClick={handleCloseSuggestNote}>
                                    <i className="flaticon-cancel"></i>
                                </div>
                            </div>
                            <div className="tableModalForm">
                                <div className="customInput">
                                    <label>Category/Ledger</label>
                                    <input type="text" placeholder='Enter Your Category/Ledger' {...register("name", { required: true, maxLength: 20 })} />
                                    {errors.name && <span>This field is required</span>}
                                </div>
                            </div>
                            <div className="duelButton">
                                <Button type='submit'>Update</Button>
                                {/* <Button className="red">Reset</Button> */}
                            </div>
                        </div>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default AddCategory;