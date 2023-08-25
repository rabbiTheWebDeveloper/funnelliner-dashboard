import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import Swal from "sweetalert2";
import { baseTest } from "../../constant/constant";
import { headers } from "../../pages/api";
import AddCategory from "./AddCategory";
import AddPayable from "./AddPayable";
import AddPayment from "./AddPayment";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import { useToast } from "../../hook/useToast";

const CashOut = ({
  fetchCaseOutPayableData,
  fetchCaseOutLedgerData,
  caseOutPayableData,
  caseOutLedgerData,
  caseOutPaymentMethodData,
  fetchCaseOutPaymentMethodData,
  handleFetchMutiSearch,
  closeCashOutModal,
  openModal,
}) => {
  const showToast = useToast();
  const [openSuggestNote, setOpenSuggestNote] = useState(false);
  const [openSuggestNote1, setOpenSuggestNote1] = useState(false);
  const [openSuggestNote2, setOpenSuggestNote2] = useState(false);
  const handleOpenSuggestNote = () => setOpenSuggestNote(true);
  const handleCloseSuggestNote = () => setOpenSuggestNote(false);
  const handleOpenSuggestNote1 = () => setOpenSuggestNote1(true);
  const handleCloseSuggestNote1 = () => setOpenSuggestNote1(false);
  const [inputValue, setInputValue] = useState("");
  const [inputValue1, setInputValue1] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [paymentId, setPaymentId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleSelectChange = selectedOption => {
    setInputValue(selectedOption.value);
    if (selectedOption.value === "add") {
      setInputValue("");
      handleOpenSuggestNote();
      //   / Open the modal
    }
  };

  const handleSelectChange1 = selectedOption => {
    setInputValue1(selectedOption.value);

    if (selectedOption.value === "addPayable") {
      handleOpenSuggestNote1();
      // Open the modal
    }
  };

  const cashForm = async data => {
    if (inputValue1 === "addPayable") {
      showToast("Please select valid Payable option", "error");
    } else if (inputValue === "add" || inputValue === '') {
      showToast("Please select valid Ledger option", "error");
    } else if (paymentId === "add") {
      showToast("Please select valid Payment Method option", "error");
    } else {
      data.payor_id = inputValue1;
      data.ledger_id = inputValue;
      data.payment_type = paymentType;
      data.payment_id = paymentId;

      const cashOutRes = await axios.post(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ACCOUNTS.CREATE_CASE_OUT}`,
        data,
        {
          headers: headers,
        }
      );
      if (cashOutRes?.data?.success) {
        handleFetchMutiSearch();
        Swal.fire("Cash Out Successfully!", cashOutRes.data.msg, "success");
        reset();
        setInputValue1("");
        setInputValue("");
      } else {
        Swal.fire({
          icon: "error",
          title: error?.cashOutRes?.data?.msg,
        });
      }
      closeCashOutModal();
    }
  };

  const handlePaymentTypeChange = e => {
    const selectedValue = e.value;
    setPaymentType(e?.label);
    setPaymentId(selectedValue)
    if (selectedValue === "add") {
      setOpenSuggestNote2(true);
    }
  };
  const handleClosePaymentMethod = () => {
    setOpenSuggestNote2(false);
  };

  return (
    <>
      <div className="AccountCashIn CashOut">
        <Modal
          open={openModal}
          onClose={closeCashOutModal}
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
                <div className="right" onClick={closeCashOutModal}>
                  <i className="flaticon-close-1"></i>
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
                    <Select
                      options={caseOutPayableData}
                      onChange={handleSelectChange1}
                      menuPosition="fixed"
                    />
                  </div>

                  <div className="customInput">
                    <label>Category/Ledger</label>

                    <Select
                      options={caseOutLedgerData}
                      onChange={handleSelectChange}
                      menuPosition="fixed"
                    />
                  </div>

                  <div className="customInput">
                    <label>Payment Method</label>
                    <Select
                      options={caseOutPaymentMethodData}
                      onChange={handlePaymentTypeChange}
                      menuPosition="fixed"
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
      {openSuggestNote2 ? (
        <AddPayment
          openSuggestNote1={openSuggestNote2}
          handleClosePaymentMethod={handleClosePaymentMethod}
          type={"CashOut"}
          fetchCaseOutPaymentMethodData={fetchCaseOutPaymentMethodData}
        />
      ) : null}

      {openSuggestNote ? (
        <AddCategory
          openSuggestNote={openSuggestNote}
          handleCloseSuggestNote={handleCloseSuggestNote}
          type={"CashOut"}
          fetchLedgerData={fetchCaseOutLedgerData}
        />
      ) : null}

      {openSuggestNote1 && inputValue1 === "addPayable" ? (
        <AddPayable
          openSuggestNote1={openSuggestNote1}
          handleCloseSuggestNote1={handleCloseSuggestNote1}
          type={"CashOut"}
          fetchCaseOutPayableData={fetchCaseOutPayableData}
          closeAllModal={closeCashOutModal}
        />
      ) : null}
    </>
  );
};

export default CashOut;
