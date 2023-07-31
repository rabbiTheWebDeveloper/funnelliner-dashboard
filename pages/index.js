import axios from "axios";
import Cookies from "js-cookie";
import getConfig from "next/config";
import { Fragment, useEffect, useState } from "react";
import { headers } from "./api";
// Cart Img
import Dashboard from "../Components/HomePage/Dashboard";
import withAuth from "../hook/PrivateRoute";
import FirstSetup from "../Components/HomePage/FirstSetup/FirstSetup";

const HomePage = ({ busInfo }) => {
  const [allProduct, setAllProduct] = useState([]);
  const { publicRuntimeConfig } = getConfig();
  const apiUrl = publicRuntimeConfig.API_URL;
  const handleFetchSellsTarget = async () => {
    try {
      let data = await axios({
        method: "get",
        url: `${apiUrl}/client/orders`,
        headers: headers,
      });
      setAllProduct(data?.data?.data);
    } catch (err) {}
  };
  useEffect(() => {
    handleFetchSellsTarget();
  }, []);
  //

  const [info, setInfo] = useState({});
  //   basic info
  const handleFetchBasicInfo = async () => {
    try {
      let data = await axios({
        method: "get",
        url: `${apiUrl}/client/shop-steps`,
        headers: headers,
      });
      setInfo(data?.data?.data);
      Cookies.set("total_task", data?.data?.data.total_task);
    } catch (err) {}
  };

  useEffect(() => {
    handleFetchBasicInfo();
  }, []);

  const skip = () => {
    Cookies.set("Skip_status", true);
    window.location.href = "/";
  };
  const skip1 = Cookies.get("Skip_status");
  const total_task = Cookies.get("total_task");

  return (
    <div className="HomePage">
      <Fragment>
        {total_task != 6 ? (
          skip1 != "true" ? (
            <FirstSetup skip={skip} busInfo={busInfo} />
          ) : (
            <>
              <Dashboard busInfo={busInfo}></Dashboard>
            </>
          )
        ) : (
          <>
            <Dashboard busInfo={busInfo}></Dashboard>
          </>
        )}
      </Fragment>
    </div>
  );
};
export default withAuth(HomePage, {
  isProtectedRoute: true,
  show: false,
});
