import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import Swal from "sweetalert2";
import { headers } from "../../pages/api";
import AddCategory from "./AddCategory";
import AddPayable from "./AddPayable";
import AddPayment from "./AddPayment";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import { useToast } from "../../hook/useToast";

const CashIn = ({
  fetchCaseInPayableData,
  caseInPaymentMethodData,
  caseInLedgerData,
  fetchCaseInLedgerData,
  fetchCaseInPaymentMethodData,
  caseInPayableData,
  openModal,
  closeCaseInModal,
  handleFetchMutiSearch,
}) => {
  const showToast = useToast();
  const [openSuggestNote, setOpenSuggestNote] = useState(false);
  const [openSuggestNote1, setOpenSuggestNote1] = useState(false);
  const [openSuggestNote2, setOpenSuggestNote2] = useState(false);
  const [inputValue, setInputValue] = useState(null);
  const [inputValue1, setInputValue1] = useState(null);
  const [paymentType, setPaymentType] = useState(null);
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
      setOpenSuggestNote(true);
    }
  };

  const handleSelectChange1 = selectedOption => {
    setInputValue1(selectedOption.value);

    if (selectedOption.value === "addPayable") {
      setOpenSuggestNote1(true);
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

  const cashForm = async data => {
    try {
      if(inputValue1 === 'addPayable'){
        showToast("Please select valid Payable option", 'error');
      }else if(inputValue === "add" || inputValue === ''){
        showToast("Please select valid Ledger option", 'error');
      }else if(paymentId === 'add'){
        showToast("Please select valid Payment Method option", 'error');
      }else{
        data.payor_id = inputValue1;
        data.ledger_id = inputValue;
        data.payment_type = paymentType;
        data.payment_id = paymentId;
  
        if (data.name !== "add") {
          const response = await axios.post(
            `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ACCOUNTS.CREATE_CASE_IN}`,
            data,
            {
              headers: headers,
            }
          );
          if (response?.data?.success) {
            Swal.fire("Cash In Successfully!", "success");
            closeCaseInModal();
            reset();
            setInputValue1(null);
            setInputValue(null);
            handleFetchMutiSearch();
          }
        }
      }
    } catch (error) {
      // If an error occurs during the API call, throw it to propagate to the calling function
      throw error;
    }
  };

  const handleSaveAndAddNew = data => {
    cashForm(data);
    reset(); // Reset the form
    setInputValue1(null);
    setInputValue(null);
  };

  return (
    <div className="AccountCashIn">
      <Modal
        open={openModal}
        onClose={closeCaseInModal}
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
              <div className="right" onClick={closeCaseInModal}>
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
                    placeholder="amount"
                  />
                  {errors.amount && (
                    <p className="error">This field is required</p>
                  )}
                </div>
                <div className="customInput">
                  <label>Payable/Payor </label>

                  <Select
                    options={caseInPayableData}
                    onChange={handleSelectChange1}
                    menuPosition="fixed"
                  />
                </div>
                <div className="customInput">
                  <label>Category/Ledger</label>
                  <Select
                    options={caseInLedgerData}
                    onChange={handleSelectChange}
                    menuPosition="fixed"
                  />
                  
                </div>
                <div className="customInput">
                  <label>Payment Method</label>
                  <Select
                    options={caseInPaymentMethodData}
                    onChange={handlePaymentTypeChange}
                    menuPosition="fixed"
                  />

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
                <Button type="button" onClick={handleSubmit(cashForm)}>
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

      {inputValue1 === "addPayable" && (
        <AddPayable
          openSuggestNote1={openSuggestNote1}
          handleCloseSuggestNote1={() => setOpenSuggestNote1(false)}
          type={"CashIn"}
          fetchCaseInPayableData={fetchCaseInPayableData}
          closeAllModal={closeCaseInModal}
        />
      )}
      {openSuggestNote2 ? (
        <AddPayment
          openSuggestNote1={openSuggestNote2}
          handleClosePaymentMethod={() => setOpenSuggestNote2(false)}
          type={"CashIn"}
          fetchCaseInPaymentMethodData={fetchCaseInPaymentMethodData}
          closeAllModal={closeCaseInModal}
        />
      ) : null}
      {openSuggestNote ? (<AddCategory
                    openSuggestNote={openSuggestNote}
                    handleCloseSuggestNote={() => setOpenSuggestNote(false)}
                    type={"CashIn"}
                    fetchLedgerData={fetchCaseInLedgerData}
                    closeAllModal={closeCaseInModal}
                  />) : null}
      
    </div>
  );
};

export default CashIn;
