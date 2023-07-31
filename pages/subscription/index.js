import React, { useEffect, useState } from "react";
import Subscription from "../../Components/Subscription/Subscription";
import SuperFetch from "../../hook/Axios";
import withAuth from "../../hook/PrivateRoute";
import { headers } from "../api";
import Cookies from "js-cookie";
import useLoading from "../../hook/useLoading";

const Index = ({ busInfo, handelFetchBusInfo }) => {
  const { merchant } = busInfo;
  const [subscriptions, setSubscriptions] = useState([]);
  const [isApiResponse, setIsApiResponse] = useState(false);
  useEffect(() => {
    SuperFetch.get("/client/subscription/info", { headers: headers }).then(
      (res) => {
        setSubscriptions(res.data?.data);
        Cookies.set("next_due_date", res.data?.data[0]?.next_due_date);
        setIsApiResponse(true);
      }
    );
  }, []);

  return (
    <>
      <Subscription
        subscriptions={subscriptions}
        merchant={merchant}
        handelFetchBusInfo={handelFetchBusInfo}
        isApiResponse={isApiResponse}
      />
    </>
  );
};

export default withAuth(Index, {
  isProtectedRoute: true,
  show: true,
});
