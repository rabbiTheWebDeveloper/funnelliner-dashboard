import { Box, Modal } from "@mui/material";

const DeleteVariantAttributeWithValue = ({ openModal, closeModal, handleIsDeleteVariantType }) => {
  return (
    <Modal
      open={openModal}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="tableModal"
    >
      <Box>
        <div className="tableModalContent">
          <div className="header">
            <div className="left">
              <i className="flaticon-edit"></i>
              <h4>Are you sure want to delete?</h4>
            </div>
            <div className="right" onClick={closeModal}>
              <i className="flaticon-close-1"></i>
            </div>
          </div>
          <div className="category_delete_wrapper">
            <div className='confirm_btn' onClick={handleIsDeleteVariantType}>Yes</div>
            <div className='cancel_btn' onClick={closeModal}>No</div>
          </div>
        </div>
      </Box>
    </Modal>
  )
}

export default DeleteVariantAttributeWithValue;