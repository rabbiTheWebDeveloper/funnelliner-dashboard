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
  const [info, setInfo] = useState({});
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const skip1 = Cookies.get("Skip_status");
  const total_task = Cookies.get("total_task");
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
    <div className="HomePage">
      {isApiResponse ? ( 
        total_task != 6 ? (
          skip1 != "true" ? (
            <FirstSetup skip={skip} busInfo={busInfo} />
          ) : (
            <>
              <Dashboard busInfo={busInfo} />
            </>
          )
        ) : (
          <>
            <Dashboard busInfo={busInfo} />
          </>
        )
      ) : (
        null
      )}
    </div>
  );
};
export default withAuth(HomePage, {
  isProtectedRoute: true,
  show: false,
});
