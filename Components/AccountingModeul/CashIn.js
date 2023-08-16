import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import Swal from "sweetalert2";
import { baseTest } from "../../constant/constant";
import { headers } from "../../pages/api";
import AddCategory from "./AddCategory";
import AddPayable from "./AddPayable";
import AddPayment from "./AddPayment";
import { useToast } from "../../hook/useToast";

const CashIn = ({
  handleFetch,
  balanceFetch,
  payment,
  data,
  categoryList,
  paymentList,
  reciverList,
  handelFetchCategory,
  handelFetchReciver,
  handelFetchPaymentlist,
}) => {
  const showToast = useToast();
  const [open, setOpen] = useState(false);
  const [openSuggestNote, setOpenSuggestNote] = useState(false);
  const [openSuggestNote1, setOpenSuggestNote1] = useState(false);
  const [openSuggestNote2, setOpenSuggestNote2] = useState(false);
  const [inputValue, setInputValue] = useState(null);
  const [inputValue1, setInputValue1] = useState(null);
  const [paymentType, setPaymentType] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenSuggestNote1 = () => setOpenSuggestNote1(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  let options =
    categoryList?.length === 0
      ? []
      : categoryList?.map(function (item) {
        return { value: item?.id, label: item?.name };
      });
  options.unshift({ value: "add", label: "+ Add New Category/Ledger" });

  let options1 =
    reciverList?.length === 0
      ? []
      : reciverList?.map(function (item) {
        return { value: item?.id, label: item?.name };
      });
  options1.unshift({ value: "addPayable", label: "+ Add New Payable/Payor" });

  let option3 =
    paymentList.length === 0
      ? []
      : paymentList.map(function (item) {
        return { value: item?.name, label: item?.name };
      });
  option3.unshift({ value: "addPayment", label: "+ Add New Payment Method" });

  const handleSelectChange = (selectedOption) => {
    setInputValue(selectedOption.value);
    if (selectedOption.value === "add") {
      setInputValue("");
      handleOpenSuggestNote();
    }
  };

  const handleSelectChange1 = (selectedOption) => {
    setInputValue1(selectedOption.value);

    if (selectedOption.value === "addPayable") {
      handleOpenSuggestNote1();
    }
  };

  const cashForm = async (data) => {
    try {
      data.payor_id = inputValue1;
      data.ledger_id = inputValue;
      data.payment_type =paymentType
  
      if (data.name !== "add") {
        const response = await axios.post(baseTest + "/client/accounts/cash-in", data, {
          headers: headers,
        });
        // Optionally, you can use the 'response' data here if needed
        if (data === "check") {
          // Do something with the response data if necessary
        }
      }
    } catch (error) {
      // If an error occurs during the API call, throw it to propagate to the calling function
      throw error;
    }
  };
  
  const handleSave = async (data) => {
    try {
      await cashForm(data); // Call the existing cashForm function using 'await' to catch any errors
  
      // If the API call was successful, show a success message
      Swal.fire("Cash In Successfully!", "success");
  
      // Additional logic for saving and adding new
      reset();
      setInputValue1("");
      setInputValue("");
      handleClose();
      handleFetch();
      balanceFetch();
      
      router.push("/account-dashboard");
    } catch (error) {
      // If an error occurs during the cashForm call, handle it here
      console.error("Error while performing cash in:", error);
      Swal.fire("Please Try again!", "fail");
    }
  };
  
  const handleSaveAndAddNew = (data) => {
    cashForm(data);
    reset(); // Reset the form
    setInputValue1(null);
    setInputValue(null);
  };

  const handlePaymentTypeChange = (e) => {
    const selectedValue = e.value;
    setPaymentType(selectedValue);
    if (selectedValue === "addPayment") {
      setOpenSuggestNote2(true);
    }
  };
  const handleClosePaymentMethod = () => {
    setOpenSuggestNote2(false);
  };
  const handleCloseSuggestNote1 = () => {
    setOpenSuggestNote1(false);
  };

  const handleOpenSuggestNote = () => {
    setOpenSuggestNote(true);
  };
  const handleCloseSuggestNote = () => {
    setOpenSuggestNote(false);
  };

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
                    <img src="/images/Cashin-money-bag.png" alt="" /> Cash In
                    Entry
                  </h3>
                </div>
                <div className="right" onClick={handleClose}>
                  <i className="flaticon-cancel"></i>
                </div>
              </div>
              <form onSubmit={handleSubmit(cashForm)}>
                <div className="updateModalForm">
                  <div className="customInput">
                    <label>
                      Amount <span>*</span>
                    </label>
                    <input
                      type="type"
                      {...register("amount", { required: true, maxLength: 20 })}
                      placeholder="amount"
                    />
                    {errors.amount && (
                      <p className="error">This field is required</p>
                    )}
                  </div>
                  <div className="customInput">
                    <label>Payable/Payor </label>

                    <Select options={options1} onChange={handleSelectChange1}    menuPosition="fixed" />
                    {inputValue1 === "addPayable" && (
                      <AddPayable
                        handelFetchReciver={handelFetchReciver}
                        openSuggestNote1={openSuggestNote1}
                        handleCloseSuggestNote1={handleCloseSuggestNote1}
                      />
                    )}
                  </div>
                  <div className="customInput">
                    <label>Category/Ledger</label>
                    <Select options={options} onChange={handleSelectChange}     menuPosition="fixed"/>
                    <AddCategory
                      handelFetchCategory={handelFetchCategory}
                      openSuggestNote={openSuggestNote}
                      handleCloseSuggestNote={handleCloseSuggestNote}
                    ></AddCategory>
                  </div>
                  <div className="customInput">
                    <label>Payment Method</label>
                    <Select
                      options={option3}
                      onChange={handlePaymentTypeChange}
                      menuPosition="fixed"
                    />
                    {/* <select
                      name=""
                      {...register("payment_type")}
                      onChange={handlePaymentTypeChange}
                    >
                      <option value="">Select Payment Method</option>
                      <option value="addPayment">
                        + Add New Payment Method
                      </option>
                      {Array.isArray(paymentList)
                        ? paymentList.map((payment, index) => (
                            <option key={index} value={payment.name}>
                              {payment.name}
                            </option>
                          ))
                        : null}
                    </select> */}
                    <AddPayment
                      handelFetchPaymentlist={handelFetchPaymentlist}
                      openSuggestNote1={openSuggestNote2}
                      handleClosePaymentMethod={handleClosePaymentMethod}
                    ></AddPayment>

                    {errors.payment_type && (
                      <p className="error">This field is required</p>
                    )}
                  </div>
                  <div className="customInput">
                    <label>Description</label>
                    <input
                      type="text"
                      {...register("description")}
                      placeholder="Description"
                    />
                  </div>
                </div>
                <div className="duelButton Account">
                  <Button type="button" onClick={handleSubmit(handleSave)}>
                    Save
                  </Button>
                  <Button
                    type="button"
                    style={{ marginLeft: "15px" }}
                    onClick={handleSubmit(handleSaveAndAddNew)}
                  >
                    Save & Add New
                  </Button>
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
