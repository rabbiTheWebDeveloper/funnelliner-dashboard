import { Button, Switch, Tooltip } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { headers, shopId } from "../../pages/api";
import { useToast } from "../../hook/useToast";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
import { pixel_demo_text } from "../../constant/constant";

const FacebookPixel = ({ shopName }) => {
  const showToast = useToast();
  const [websiteSettingsData, setWebsiteSettingData] = useState({});
  const label = { inputProps: { "aria-label": "Switch demo" } };
  const [advanceStatus, setAdvanceStatus] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = data => {
    const matches = data?.fb_pixel?.match(/'(\d+)'/);
    let pixelId
    if (matches && matches.length > 0) {
      pixelId = matches[0];
    }
    if (data?.fb_pixel.length>0 &&  pixelId === undefined || pixelId ==="undefined") {
      showToast("Invalid Pixel Code", "error");
      return;
    }
    data.c_status = advanceStatus;
    data.shop_name = shopName;
    data.shop_id = shopId;
    if(data.fb_pixel){
      data.fb_pixel = pixelId;
    }
    axios
      .post(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PIXEL.UPDATE_PIXEL}`, data, {
        headers: headers,
      })
      .then(function (response) {
        showToast(response?.data?.msg);
      })
      .catch(function (error) {
        showToast("Something went wrong!, Please provide valid data");
      });
  };

  useEffect(() => {
    axios
      .get(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.SETTINGS.BUSINESS_INFO}`, {
        headers: headers,
      })
      .then(function (response) {
        if (response.status === 200) {
          setWebsiteSettingData(response?.data?.data);
          if (response?.data?.data?.c_status === true || response?.data?.data?.c_status === "true") {
            setAdvanceStatus(true)
          }
        }
      });
  }, []);
  const facebookPixelCode = pixelID => {
    if (pixelID) {
      return `<script>
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init','${pixelID}');
            fbq('track', 'PageView');
          </script>
          <noscript>
            <img height="1" width="1" style="display:none" 
                 src="https://www.facebook.com/tr?id=${pixelID}&ev=PageView&noscript=1"/>
          </noscript>`;
    }
  };


  return (
    <div className="DashboardTabsItem FacebookPixel">
      <div className="Header">
        <h4>Facebook Pixel Setting</h4>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="ProductTable">
          <div className="FacebookPixel">
            <div className="Form">
              <div className="customInput">
                <label>FB Pixel Script
                  <Tooltip
                    title={pixel_demo_text}
                    placement="top-start"
                  >
                    <span style={{ margin: "5px 5px", color: "black", fontSize: "25px", verticalAlign: "middle", display: "inline-block" }}>
                      <i className="flaticon-info"></i>
                    </span>
                  </Tooltip>
                </label>
                <textarea
                  rows={10}
                  id="fb_pixel_id"
                  type="text"
                  {...register("fb_pixel")}
                  defaultValue={facebookPixelCode(websiteSettingsData?.fb_pixel)}
                  placeholder={`<script>.......</script>`}
                />
                {errors.fb_pixel && (
                  <p className="error">This field is required</p>
                )}

                <h6 className="padding">This code will load before head tag</h6>
              </div>

              <div className="customInput">
                <p>Enable Conversion API (Add The Token Below)</p>
                <Switch
                  // checked={advanceStatus}
                  onChange={event => setAdvanceStatus(event.target.checked)}
                  {...label}
                  checked={advanceStatus}
                />
              </div>
              {advanceStatus === true && (
                <div className="customInput">
                  <label>Conversion API (Recommended)</label>
                  <textarea
                    name=""
                    rows="5"
                    placeholder=""
                    {...register("c_api")}
                    defaultValue={websiteSettingsData?.c_api}
                  />
                  {errors.c_api && <span>This field is required</span>}
                  <h6 className="padding">
                    Send events directly from your web server to Facebook
                    through the conversion API. This can help you capture more
                    events. Anaccess token is required to use the server-side
                    API.
                  </h6>
                </div>
              )}

              <div className="customInput">
                <label>Test Event Code</label>
                <input
                  id="fb_pixel_id"
                  placeholder="Example: TEST12345"
                  type="text"
                  {...register("test_event")}
                  defaultValue={websiteSettingsData.test_event}
                />
                <h6 className="padding">
                  Use this if you need to test the server side event.{" "}
                  <Link href="">Remove it after testing</Link>
                </h6>
              </div>

              <div className="duelButton">
                <Button type="submit">Save</Button>
                <Button className="red">Reset</Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FacebookPixel;
