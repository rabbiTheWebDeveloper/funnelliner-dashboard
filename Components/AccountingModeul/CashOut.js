import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import Swal from "sweetalert2";
import { baseTest } from "../../constant/constant";
import { headers } from "../../pages/api";
import AddCategory from "./AddCategory";
import AddPayable from "./AddPayable";
import AddPayment from "./AddPayment";

const CashOut = ({
  handleFetch,
  balanceFetch,
  payment,
  categoryList,
  paymentList,
  reciverList,
  handelFetchCategory,
  handelFetchReciver,
  handelFetchPaymentlist,
}) => {
  const [open, setOpen] = useState(false);
  const [openSuggestNote, setOpenSuggestNote] = useState(false);
  const [openSuggestNote1, setOpenSuggestNote1] = useState(false);
  const [openSuggestNote2, setOpenSuggestNote2] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenSuggestNote = () => setOpenSuggestNote(true);
  const handleCloseSuggestNote = () => setOpenSuggestNote(false);
  const handleOpenSuggestNote1 = () => setOpenSuggestNote1(true);
  const handleCloseSuggestNote1 = () => setOpenSuggestNote1(false);
  const [inputValue, setInputValue] = useState("");
  const [inputValue1, setInputValue1] = useState("");
  const [paymentType, setPaymentType] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

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
      //   / Open the modal
    }
  };

  const handleSelectChange1 = (selectedOption) => {
    setInputValue1(selectedOption.value);

    if (selectedOption.value === "addPayable") {
      handleOpenSuggestNote1();
      // Open the modal
    }
  };

  const cashForm = (data) => {
    data.payor_id = inputValue1;
    data.ledger_id = inputValue;
    data.payment_type =paymentType

    axios
      .post(baseTest + "/client/accounts/cash-out", data, {
        headers: headers,
      })
      .then(function (response) {
        handleFetch();
        balanceFetch();
        Swal.fire("Cash Out Successfully!", response.data.msg, "success");

        handleClose();
      })
      .catch(function (error) {
        Swal.fire({
          icon: "error",
          title: error?.response?.data?.msg,
        });
      });
    reset();
    setInputValue1("");
    setInputValue("");
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
  return (
    <>
      <div className="AccountCashIn CashOut">
        <Button onClick={handleOpen}>
          {" "}
          <span>Cash Out</span> <img src="/images/money-up.png" alt="" />{" "}
        </Button>

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          className="CashInModal updateModal"
        >
          <Box className="modalBox">
            <div className="modalContent">
              <div className="header">
                <div className="left">
                  <h3>
                    {" "}
                    <img src="/images/money-bill-minus.png" alt="" /> Cash Out
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
                      placeholder="Amount"
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
                    />
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
                            <option key={paymentList.id} value={payment.name}>
                              {payment.name}
                            </option>
                          ))
                        : null}
                    </select> */}
                    <AddPayment
                      handelFetchPaymentlist={handelFetchPaymentlist}
                      openSuggestNote1={openSuggestNote2}
                      handleClosePaymentMethod={handleClosePaymentMethod}
                    />

                    {errors.payment_type && (
                      <span className="error">This field is required</span>
                    )}
                  </div>

                  <div className="customInput">
                    <label>Description</label>

                    <input
                      type="text"
                      {...register("description")}
                      placeholder="Description"
                    />
                    {errors.description && <span>This field is required</span>}
                  </div>
                </div>

                <div className="duelButton">
                  <Button type="submit">Save</Button>
                  {/* <Button type='reset' className="red">Save & Add New</Button> */}
                  {/* <Button type='reset' className="red">Save & Add New</Button> */}
                </div>
              </form>
            </div>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default CashOut;
