import { Box, Modal } from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useToast } from "../../hook/useToast";
import { headers } from "../../pages/api";

const EditOrderModal = ({
  order,
  handleCloseViewModal,
  viewModalOpen,
  handleFetch,
}) => {
  const showToast = useToast();
  const today = new Date().toISOString().slice(0, 10);

  const handleKeyDownNote = (event, id, status) => {
    if (event.key === "Enter") {
      let data = {
        note: event.target.value,
        type: status,
      };
      axios.post(process.env.NEXT_PUBLIC_API_URL + `/client/order/note/${id}/update`, data, {
        headers: headers,
      })
        .then(function (res) {
          handleFetch();
          showToast(res.data?.message);
          handleCloseViewModal();
        })
        .catch((error) => {
          showToast("Something went wrong. Please wait for some time", "error");
        });
    }
  };

  return (
    <Modal
      key={order?.id}
      open={viewModalOpen}
      onClose={handleCloseViewModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      className="viewModal"
    >
      <Box className="modalBox">
        <div className="modalContent">
          <div className="header">
            <div className="left">
              <i className="flaticon-view"></i>
              <h4>View</h4>
            </div>

            <div className="right" onClick={handleCloseViewModal}>
              <i className="flaticon-close-1"></i>
            </div>
          </div>

          <div className="table">
            <table>
              <tr>
                <th>Order No</th>
                <td>{order?.order_no}</td>

                <th>Order Date</th>
                <td>
                  {order?.created_at?.slice(0, 10) >= today
                    ? moment(order?.created_at).fromNow()
                    : moment(order?.created_at).format("DD-MM-YYYY")}
                </td>
              </tr>

              <tr>
                <th>Product Name</th>

                {order?.order_details?.map((item, index) => {
                  return (
                    <ul>
                      <li>
                        {" "}
                        {index + 1} .{item?.product}{" "}
                      </li>
                    </ul>
                  );
                })}

                {/* <td>{products}</td> */}

                <th>Customer Name</th>

                <td>{order?.customer_name}</td>
              </tr>

              <tr>
                <th>Contact No</th>

                <td>{order?.phone}</td>

                <th>Address</th>

                <td>{order?.address}</td>
              </tr>

              <tr>
                <th>Quantity</th>

                <td>
                  {/* {order?.order_details?.length
                    ? order?.order_details[0]?.quantity
                    : null} */}

                  {order?.order_details?.reduce(
                    (prevVal, currentVal) => {
                      return prevVal + currentVal?.quantity;
                    },
                    0
                  )}
                </td>

                <th>Discount</th>

                <td>{order?.discount}</td>
              </tr>

              <tr>
                <th>Shipping Cost</th>

                <td>{order?.shipping_cost}</td>

                <th>Total Price</th>

                <td>{order?.grand_total}</td>
              </tr>

              <tr>
                <th>Advance</th>

                <td>{order?.advanced}</td>

                <th>Due</th>

                <td>{order?.due}</td>
              </tr>

              <tr>
                <th>Product Price</th>

                <td>
                  {order?.order_details?.map((item) => {
                    return <span> {item?.price}</span>;
                  })}
                </td>

                <th>Order Status</th>

                <td>
                  <div className="CustomeInput">
                    <select defaultValue={order?.order_status} disabled name="">
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="follow_up">Follow up</option>
                      <option value="shipped">shipped</option>
                    </select>

                    {/* <select name="" defaultValue={order?.order_status} disabled>
                                            <option value="pending">
                                                Pending
                                            </option>
                                        </select> */}
                  </div>
                </td>
              </tr>
            </table>
          </div>
          <div className="d_flex">
            <div className="ViewModalNote" style={{ marginRight: "20px" }}>
              <label>Note</label>
              <textarea
                rows="3"
                defaultValue={order?.order_note}
                onKeyDown={(event) =>
                  handleKeyDownNote(event, order.id, order.order_status)
                }
              />
            </div>
            <div className="ViewModalNote" style={{ marginRight: "20px" }}>
              <label>Invoice Note</label>
              <textarea
                rows="3"
                defaultValue={order?.invoice_note}
                onKeyDown={(event) =>
                  handleKeyDownNote(event, order.id, order.order_status)
                }
              />
            </div>
            <div className="ViewModalNote">
              <label>Courier Note</label>
              <textarea
                rows="3"
                defaultValue={order?.courier_note}
                onKeyDown={(event) =>
                  handleKeyDownNote(event, order.id, order.order_status)
                }
              />
            </div>
          </div>
        </div>

        {/* <div className="SalesTargetModal OrderModalPopup">

                    <div className="Form OrderModal">

                        <ul>

                            <li className="lastChild">

                                <div className="CustomeInput">
                                    <label>Order Status</label>

                                    <select
                                        defaultValue={order?.order_status}
                                        disabled
                                        name=""
                                    >
                                        <option value="pending">
                                            Pending
                                        </option>
                                        <option value="cancelled">
                                            Cancelled
                                        </option>
                                        <option value="confirmed">
                                            Confirmed
                                        </option>
                                        <option value="follow_up">
                                            Follow up
                                        </option>
                                        <option value="shipped">
                                            shipped
                                        </option>
                                    </select>

                                </div>
                            </li>

                            <li className="lastChild">
                                <div className="CustomeInput TextArea">
                                    <label>Note</label>
                                    <textarea rows="3" defaultValue={order?.note} onKeyDown={(e) => handleKeyDownNote(order?.id, event)} />
                                </div>
                            </li>

                        </ul>

                    </div>

                </div> */}
      </Box>
    </Modal>
  );
};
export default EditOrderModal;
