import { Box, Button, Modal } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Select from "react-select";
import Swal from 'sweetalert2';
import { baseTest } from '../../constant/constant';
import { headers } from '../../pages/api';
import AddCategory from './AddCategory';
import AddPayable from './AddPayable';
import AddPayment from './AddPayment';

const CashIn = ({ handleFetch, balanceFetch, payment, data, categoryList, paymentList, reciverList, handelFetchCategory, handelFetchReciver, handelFetchPaymentlist }) => {
    const [open, setOpen] = useState(false);
    const [openSuggestNote, setOpenSuggestNote] = useState(false);
    const [openSuggestNote1, setOpenSuggestNote1] = useState(false);
    const [openSuggestNote2, setOpenSuggestNote2] = useState(false);
    const [inputValue, setInputValue] = useState(null);
    const [inputValue1, setInputValue1] = useState(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);



    const handleOpenSuggestNote1 = () => setOpenSuggestNote1(true);


    const handleOpenSuggestNote2 = () => setOpenSuggestNote1(true);
    const handleCloseSuggestNote2 = () => setOpenSuggestNote1(false);


    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const router = useRouter();

    let options = categoryList?.length === 0 ? [] : categoryList?.map(function (item) {
        return { value: item?.id, label: item?.name };
    });
    options.push({ value: "add", label: "+ Add New Category/Ledger" });

    let options1 = reciverList?.length === 0 ? [] : reciverList?.map(function (item) {
        return { value: item?.id, label: item?.name };
    });
    options1.push({ value: "addPayable", label: "+ Add New Payable/Payor" });

    const handleInputChange = (inputValue, action) => {
        if (action.action !== "input-blur" && action.action !== "menu-close") {
            setInputValue(inputValue);
        }
    };


    const handleSelectChange = (selectedOption) => {
        setInputValue(selectedOption.value);
        if (selectedOption.value === "add") {
            setInputValue("")
            handleOpenSuggestNote();
            //   / Open the modal
        }
    };

    const handleInputChange1 = (inputValue, action) => {
        if (action.action !== "input-blur" && action.action !== "menu-close") {
            setInputValue1(inputValue);
        }
    };

    const handleSelectChange1 = (selectedOption) => {
        setInputValue1(selectedOption.value);

        if (selectedOption.value === "addPayable") {
            // setInputValue1("");
            handleOpenSuggestNote1();
            // Open the modal
        }
    };

    const cashForm = (data) => {
        data.payor_id = inputValue1;
        data.ledger_id = inputValue;

        if (data.name !== "add") {
            axios.post(baseTest + "/client/accounts/cash-in", data, {
                headers: headers
            })
                .then(function (response) {

                    if (data === "check") {
                        // router.push("/account-dashboard");
                    }
                })
                .catch(function (error) {
                    // Swal.fire({
                    //     icon: "error",
                    //     title: error?.response?.data?.msg,
                    // });
                });


        }
    };




    const addPayable = (data) => {
        axios.post(baseTest + "/client/accounts/payor/add", data, {
            headers: headers
        })
            .then(function (response) {
                Swal.fire("Category/Ledger    Add!", response.data.msg, "success");
                // handleCloseSuggestNote(true)
            })
            .catch(function (error) {
             
                Swal.fire({
                    icon: "error",
                    title: error?.response?.data?.msg,
                });
            });
        // reset()
        // setInputValue1("");
        // setInputValue("");
    }

    const handleApiAlert = (response, successMessage) => {
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

    const handleSave = (data) => {
        cashForm(data);
        Swal.fire("Cash In Successfully!", "success");// Call the existing cashForm function to perform the API call
        router.push("/account-dashboard");
        // Additional logic for saving and adding new
        reset();
        setInputValue1("");
        setInputValue("");
        handleClose();
        handleFetch();
        balanceFetch();
    };
    const handleSaveAndAddNew = (data) => {
        cashForm(data);
        reset(); // Reset the form
        setInputValue1(null);
        setInputValue(null);

    };


    const handlePaymentTypeChange = (e) => {
        const selectedValue = e.target.value;
        if (selectedValue === "addPayment") {
            setOpenSuggestNote2(true);
        }
    };
    const handleClosePaymentMethod = () => {
        setOpenSuggestNote2(false);
    };
    const handleCloseSuggestNote1 = () => {
        setOpenSuggestNote1(false);

    }

    const handleOpenSuggestNote = () => {
        setOpenSuggestNote(true);

    }
    const handleCloseSuggestNote = () => {
        setOpenSuggestNote(false);
    }

    return (
        <>
            <div className="AccountCashIn">
                <Button onClick={handleOpen}>
                    <span>Cash In</span> <img src="/images/money-down.png" alt="" />
                </Button>
                <Modal
                    open={open}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className="CashInModal updateModal"
                >
                    <Box className="modalBox">
                        <div className="modalContent">
                            <div className="header">
                                <div className="left">
                                    <h3>
                                        <img src="/images/Cashin-money-bag.png" alt="" /> Cash In Entry
                                    </h3>
                                </div>
                                <div className="right" onClick={handleClose}>
                                    <i className="flaticon-cancel"></i>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit(cashForm)}>
                                <div className="updateModalForm">
                                    <div className="customInput">
                                        <label>Amount <span>*</span></label>
                                        <input type="type" {...register("amount", { required: true, maxLength: 20 })} placeholder='amount' />
                                        {errors.amount && <span>This field is required</span>}
                                    </div>
                                    <div className="customInput">
                                        <label>Payable/Payor </label>

                                        <Select options={options1} onChange={handleSelectChange1} />
                                        {inputValue1 === "addPayable" && (
                                            <AddPayable handelFetchReciver={handelFetchReciver} openSuggestNote1={openSuggestNote1} handleCloseSuggestNote1={handleCloseSuggestNote1} />
                                        )}
                                    </div>
                                    <div className="customInput">
                                        <label>Category/Ledger</label>
                                        <Select options={options} onChange={handleSelectChange} />
                                        <AddCategory handelFetchCategory={handelFetchCategory} openSuggestNote={openSuggestNote} handleCloseSuggestNote={handleCloseSuggestNote}  ></AddCategory>
                                    </div>
                                    <div className="customInput">
                                        <label>Payment Method</label>
                                        <select name="" {...register("payment_type")} onChange={handlePaymentTypeChange}>
                                            <option value="">Select Payment Method</option>
                                            {Array.isArray(paymentList) ? paymentList.map((payment, index) => (
                                                <option key={index} value={payment.name}>{payment.name}</option>

                                            )) : null}
                                            <option value="addPayment">+ Add New Payment Method</option>
                                        </select>
                                        <AddPayment handelFetchPaymentlist={handelFetchPaymentlist} openSuggestNote1={openSuggestNote2} handleClosePaymentMethod={handleClosePaymentMethod}></AddPayment>

                                        {errors.payment_type && <span>This field is required</span>}
                                    </div >
                                    <div className="customInput">
                                        <label>Description</label>
                                        <input type="text" {...register("description")} placeholder='Description' />

                                    </div>
                                </div>
                                <div className="duelButton">
                                    <Button type="button" onClick={handleSubmit(handleSave)}>Save</Button>
                                    <Button type="button" onClick={handleSubmit(handleSaveAndAddNew)}>Save & Add New</Button>
                                </div>
                            </form>
                        </div>
                    </Box>
                </Modal>
            </div>
        </>
    );
};

export default CashIn;