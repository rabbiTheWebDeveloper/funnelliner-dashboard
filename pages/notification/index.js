import axios from "axios";
import React, { useEffect, useState } from "react";
import AllNotification from "../../Components/Common/AllNotification/AllNotification";
import { headers } from "../api";
import withAuth from "../../hook/PrivateRoute";

const index = ({ busInfo }) => {
  const [data, setData] = useState([])
  const { id } = busInfo
  const notification = () => {
    const orderBody = {
      notify_id: id,
      type: "order"
    }
    axios.post(process.env.API_URL + `/client/notifications-show`, orderBody, {
      headers: headers,

    })
      .then(function (res) {
        setData(res.data.data)
      })
      .catch((error) => {
      });
  }

  useEffect(() => {
    notification();
  }, [id]);

 
  return (
    <>
      <AllNotification data={data}></AllNotification>
    </>
  );
};

export default withAuth(index, {
  isProtectedRoute: true,
  show: false,
});
