import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import React, { useEffect, useState } from "react";
import {shopId } from "../../pages/api";
import { filterOverview } from "./HomeUtlis";
import WebsiteVisitorChartDesign from "./WebsiteVisitorChartDesign";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

const WebsiteVisitorChart = () => {
  const [overview_data, setOverview_data] = useState("today");
  const [reportData, setReportData] = useState({});
  const [customDate, setCustomDate] = useState(new Date());

  // Dropdown
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const chart_data = {
    shopId: shopId,
    dateType: overview_data,
    ...(overview_data === "custom" && { customDate: customDate.toISOString().split("T")[0] })
  };
  useEffect(() => {
    axios
      .post(
        "https://funnelliner-report-api.vercel.app/api/v1/shop/get-visitor",
        chart_data,

      
      )
      .then(res => {
        console.log(res.data.data)
        setReportData(res.data.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [overview_data, customDate]);

  return (
    <>
      <div className="ChartJs boxShadow">
        {/* header */}
        <div className="Header d_flex d_justify">
          <div className="left">
            <h4>Website Visitor Performance </h4>
          </div>

          <div className="right">
            <div className="d_flex">
              <div>
                {overview_data === "custom" && (
                  //  <div className="mb-4">
                  <DatePicker
                    selected={customDate}
                    onChange={date => setCustomDate(date)}
                    dateFormat="yyyy-MM-dd"
                    //    className="border border-gray-300 p-2 rounded"
                  />
                  //    </div>
                )}
              </div>

              <div className="commonDropdown">
                <PopupState variant="popover" popupId="DropDown">
                  {popupState => (
                    <>
                      <Button
                        id="fade-button"
                        aria-controls={open ? "fade-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                        {...bindTrigger(popupState)}
                      >
                        {filterOverview(overview_data)}{" "}
                        <i className="flaticon-arrow-down-sign-to-navigate"></i>
                      </Button>

                      <Menu
                        id="fade-menu"
                        className="commonDropdownUl"
                        MenuListProps={{
                          "aria-labelledby": "fade-button",
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        {...bindMenu(popupState)}
                      >
                        <MenuItem
                          onClick={e => {
                            setOverview_data("today");
                            popupState.close();
                          }}
                        >
                          Today
                        </MenuItem>
                        <MenuItem
                          onClick={e => {
                            setOverview_data("yesterday");
                            popupState.close();
                          }}
                        >
                          Yesterday
                        </MenuItem>
                        <MenuItem
                          onClick={e => {
                            setOverview_data("custom");
                            popupState.close();
                          }}
                        >
                          Custom Date
                        </MenuItem>
                      </Menu>
                    </>
                  )}
                </PopupState>
              </div>
            </div>
          </div>
        </div>

        {/*  */}
        <div>
          <WebsiteVisitorChartDesign
            data={reportData}
          />
        </div>
      </div>
    </>
  );
};

export default WebsiteVisitorChart;
