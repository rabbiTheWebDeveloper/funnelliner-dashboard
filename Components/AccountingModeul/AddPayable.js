import { Box, Button, Modal } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { baseTest } from '../../constant/constant';
import { headers } from '../../pages/api';

const AddPayable = ({ handleCloseSuggestNote1, openSuggestNote1, handelFetchReciver }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();


  const addPayable = (data) => {
    axios.post(baseTest + "/client/accounts/payor/add", data, {
      headers: headers
    })
      .then(function (response) {
    
        handelFetchReciver()
        handleCloseSuggestNote1()

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
        onClose={handleCloseSuggestNote1}
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
                  <h4>Please Enter Your Payable/Payor</h4>
                </div>
                <div className="right" onClick={handleCloseSuggestNote1}>
                  <i className="flaticon-cancel"></i>
                </div>
              </div>
              <div className="tableModalForm">
                <div className="customInput">
                  <label>Payable/Payor</label>
                  <input type="text" placeholder='Enter Your Category/Ledger' {...register("name", { required: true, maxLength: 20 })} />
                  {errors.name && <span>This field is required</span>}
                </div>
              </div>
              <div className="duelButton">
                <Button type='submit'>Add Payable/Payor</Button>
                {/* <Button className="red">Reset</Button> */}
              </div>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default AddPayable;
