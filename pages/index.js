import axios from "axios";
import Cookies from "js-cookie";
import getConfig from "next/config";
import { Fragment, useCallback, useEffect, useState } from "react";
import { headers } from "./api";
// Cart Img
import Dashboard from "../Components/HomePage/Dashboard";
import withAuth from "../hook/PrivateRoute";
import FirstSetup from "../Components/HomePage/FirstSetup/FirstSetup";

const HomePage = ({ busInfo }) => {
  // const [allProduct, setAllProduct] = useState([]);
  const [isApiResponse, setIsApiResponse] = useState(false);
  const { publicRuntimeConfig } = getConfig();
  const [info, setInfo] = useState({});
  const apiUrl = publicRuntimeConfig.API_URL;
  const skip1 = Cookies.get("Skip_status");
  const total_task = Cookies.get("total_task");

  // const handleFetchSellsTarget = useCallback(async () => {
  //   try {
  //     let data = await axios({
  //       method: "get",
  //       url: `${apiUrl}/client/orders`,
  //       headers: headers,
  //     });
  //     setAllProduct(data?.data?.data);
  //   } catch (err) {}
  // }, [apiUrl]);

  //   basic info
  const handleFetchBasicInfo = useCallback(async () => {
    try {
      let data = await axios({
        method: "get",
        url: `${apiUrl}/client/shop-steps`,
        headers: headers,
      });
      setInfo(data?.data?.data);
      Cookies.set("total_task", data?.data?.data?.total_task);
      setIsApiResponse(true);
    } catch (err) { }
  }, [apiUrl]);

  useEffect(() => {

    handleFetchBasicInfo()
  }, [handleFetchBasicInfo]);
  //

  const skip = () => {
    Cookies.set("Skip_status", true);
    window.location.href = "/";
  };

  return (
    // <div className="HomePage">
    //   <Fragment>
    //     { total_task != 6 ? (
    //       skip1 != "true" ? (
    //         <FirstSetup skip={skip} busInfo={busInfo} />
    //       ) : (
    //         <>
    //           <Dashboard busInfo={busInfo}></Dashboard>
    //         </>
    //       )
    //     ) : (
    //       <>
    //         <Dashboard busInfo={busInfo}></Dashboard>
    //       </>
    //     )}
    //   </Fragment>
    // </div>

    <div className="HomePage">
    {isApiResponse ? ( // Render only when the API response is received
      total_task != 6 ? (
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
      )
    ) : (
      <div></div> // Show a loading indication while waiting for the response
    )}
  </div>
  );
};
export default withAuth(HomePage, {
  isProtectedRoute: true,
  show: false,
});
