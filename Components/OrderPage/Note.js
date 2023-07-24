import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, Modal, Tab } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { useToast } from '../../hook/useToast';
import { headers } from '../../pages/api';

const Note = ({ isOpenOrderNoteModal, handleCloseOrderNoteModal, handleFetch, id, status, orderIdOfModal, orderNo, orderNote, startLoading, stopLoading }) => {
  const [noteData, setNoteData] = useState(orderNote?.order_note);
  const [invoiceNote, setInvoiceNote] = useState(orderNote?.invoice_note);
  const [courierNote, setCourierNote] = useState(orderNote?.courier_note);
  const showToast = useToast();
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      let data = {
        note: event.target.value,
        type: status,
      };
      axios
        .post(process.env.API_URL + `/client/order/note/${id}/update`, data, {
          headers: headers,
        })
        .then(function (res) {
          handleFetch();
          showToast(res.data?.message);
          handleCloseOrderNoteModal();
        })
        .catch((error) => {
          showToast('Something went wrong. Please wait for some time', 'error');
        });
    }
  };
  // const handleKeyDownSuggest = (event) => {
  //   if (event.key === 'Enter') {
  //     let data = {
  //       note: event.target.value,
  //       type: status,
  //     };

  //     axios
  //       .post(process.env.API_URL + `/client/order/note/${id}/update`, data, {
  //         headers: headers,
  //       })
  //       .then(function (res) {
  //         handleFetch();
  //         showToast(res.data?.message);
  //         handleCloseNote();
  //       })
  //       .catch((error) => {
  //         showToast('Something went wrong. Please wait for some time', 'error');
  //       });
  //   }
  // };
  const handleSubmitNote = () => {
    startLoading()
    let data = {
      note: noteData,
      type: status,
      courier_note: courierNote,
      invoice_note: invoiceNote,

    }
    axios.post(process.env.API_URL + `/client/order/note/${orderNo}/update`, data, {
      headers: headers,
    })
      .then(function (res) {
        if (res.status === 200) {
          showToast(res.data?.message);
          handleFetch();
          handleCloseOrderNoteModal();
        }
      })
      .catch((error) => {
        showToast('Something went wrong. Please wait for some time', 'error');
      });
    stopLoading()
  };

  const [value, setValue] = useState('1');

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="NoteHover">
      <Modal
        open={isOpenOrderNoteModal && orderNo === orderIdOfModal}
        onClose={handleCloseOrderNoteModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="tableModal"
      >
        <Box>
          <div className="tableModalContent">
            <div className="header">
              <div className="left">
                <i className="flaticon-edit"></i>
                <h4>View and update your note</h4>
              </div>
              <div className="right" onClick={handleCloseOrderNoteModal}>
                <i className="flaticon-cancel"></i>
              </div>
            </div>
            <form action="">

              <div className="tableModalForm">

                <div className="CommonTab" style={{ marginTop: "30px" }}>

                  <Box>

                    <TabContext value={value}>

                      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                          <Tab label="Order Note" value="1" />
                          <Tab label="Invoice Note" value="2" />
                          <Tab label="Courier Note" value="3" />
                        </TabList>
                      </Box>

                      <TabPanel value="1">

                        <div className="customInput">

                          <label>Note</label>
                          <textarea
                            defaultValue={noteData}
                            onChange={(e) => setNoteData(e.target.value)}
                            rows="3"
                          >

                          </textarea>

                        </div>


                      </TabPanel>

                      <TabPanel value="2">

                        <div className="customInput">

                          <label>Note</label>
                          <textarea
                            defaultValue={invoiceNote}
                            onChange={(e) => setInvoiceNote(e.target.value)}
                            rows="3"
                          >

                          </textarea>

                        </div>

                        {/* <div className="duelButton">
                          <Button onClick={handleSubmitNote} style={{ color: "#FFF" }}>Invoice Update</Button>
                        </div> */}

                      </TabPanel>

                      <TabPanel value="3">

                        <div className="customInput">

                          <label>Note</label>
                          <textarea
                            defaultValue={courierNote}
                            onChange={(e) => setCourierNote(e.target.value)}
                            rows="3"
                          >

                          </textarea>

                        </div>

                        {/* <div className="duelButton">
                          <Button onClick={handleSubmitNote} style={{ color: "#FFF" }}>Courier Update</Button>
                        </div> */}

                      </TabPanel>

                    </TabContext>

                    <div className="duelButton">
                      <Button onClick={handleSubmitNote} style={{ color: "#FFF" }}>Update</Button>
                    </div>


                  </Box>

                </div>

              </div>

            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default Note;
