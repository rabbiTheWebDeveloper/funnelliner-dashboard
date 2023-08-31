import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { headers } from '../../pages/api';
import CustomDate from './HomePageCart/CustomDate';
import PieChartPage from './PainChart';
import { filterChannelData } from './HomeUtlis';

const ChartJs = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [cannel_date, setCannel_date] = useState('weekly');
    const [cannelList, setCannelList] = useState({});
    const [cannelRatio, setCannelRatio] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const params = {
        channel_status: cannel_date,
        start_date: startDate,
        end_date: endDate,

    }
    // http://127.0.0.1:8000/api/v1/client/channel-statistics?channel_status=custom&start_date=2023-01-01&end_date=2023-07-01
    const handleFetchCannelList = async () => {
        try {
            let data = await axios({
                method: "get",
                params: params,
                url: `${process.env.NEXT_PUBLIC_API_URL}/client/channel-statistics`,
                headers: headers,
            });
            if (data.data.success === true) {
                setCannelList(data?.data?.data)
            }
        } catch (err) {
        }
    };

    const ratioParams = {
        phone: cannel_date,
        website: cannel_date,
        social: cannel_date,
        landing: cannel_date
        // start_date: startDate,
        // end_date: endDate,

    }
    const handleFetchCannelRatio = async () => {
        try {
            let data = await axios({
                method: "get",
                params: ratioParams,
                url: `${process.env.NEXT_PUBLIC_API_URL}/client/channel/ratio-statistics`,
                headers: headers,
            });

            if (data.data.success === true) {
                setCannelRatio(data.data?.data)
            }
        } catch (err) {
        }
    };

    useEffect(() => {
        handleFetchCannelList();
        cannel_date !== 'custom' && handleFetchCannelRatio()

    }, [cannel_date, endDate, startDate])
    const newCannelList = Array.isArray(cannelList) ? cannelList?.filter(obj => obj.name !== "" && obj.name !== "Select Order Type") : [];
    const website = Array.isArray(cannelList) ? cannelList?.filter(obj => obj.name === 'Website') : [];
    const landing = Array.isArray(cannelList) ? cannelList?.filter(obj => obj.name === 'Landing') : [];
    const socal = Array.isArray(cannelList) ? cannelList?.filter(obj => obj.name === 'Social') : [];
    const phone = Array.isArray(cannelList) ? cannelList?.filter(obj => obj.name === 'Phone') : [];
    return (
        <>
            <div className="ChartJs Channels boxShadow">

                {/* header */}
                <div className="Header d_flex d_justify">

                    <div className="left">
                        <h4>Order Source</h4>
                    </div>

                    <div className="right">
                        <div className="d_flex">
                            <div>
                                {cannel_date === 'custom' && (
                                    <CustomDate setEndDate={setEndDate} endDate={endDate} setStartDate={setStartDate} startDate={startDate} ></CustomDate>
                                )
                                }
                            </div>

                            <div className="commonDropdown">

                                <Button
                                    id="fade-button"
                                    aria-controls={open ? 'fade-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                >
                                    {filterChannelData(cannel_date)} <i className="flaticon-arrow-down-sign-to-navigate"></i>
                                </Button>
                                <Menu
                                    id="fade-menu"
                                    className='commonDropdownUl'
                                    MenuListProps={{
                                        'aria-labelledby': 'fade-button',
                                    }}
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    TransitionComponent={Fade}
                                >
                                    <MenuItem onClick={(e) => {
                                        setCannel_date('today');
                                        handleClose()
                                    }}>Today</MenuItem>
                                    <MenuItem onClick={(e) => {
                                        setCannel_date('yesterday');
                                        handleClose()
                                    }}>Yesterday</MenuItem>
                                    <MenuItem onClick={(e) => {
                                        setCannel_date('weekly');
                                        handleClose()
                                    }}> Last 7 Days </MenuItem>
                                    <MenuItem onClick={(e) => {
                                        setCannel_date('monthly');
                                        handleClose()
                                    }}> This Month</MenuItem>
                                    <MenuItem onClick={(e) => {
                                        setCannel_date('custom');
                                        handleClose()
                                    }}>Custom Date</MenuItem>

                                </Menu>

                            </div>
                        </div>



                    </div>

                </div>

                {/* MiddleContent */}
                <div className="ChannelContent d_flex d_justify">

                    <div className="left">

                        <div className="leftItem">
                            <p>Landing Page</p>
                            <h3>{landing[0]?.value > 0 ? landing[0]?.value : "0"}</h3>
                            <h6 className={cannelRatio?.landing?.startsWith("-") === false ? "increase" : "decrease"}>{cannel_date !== 'custom' && cannelRatio?.landing !== null ? cannelRatio?.landing : "0%"} <i className={cannelRatio?.landing?.startsWith("-") === false ? "flaticon-trending" : "flaticon-down-arrow-2"}></i> </h6>
                        </div>

                        <div className="leftItem">
                            <p>Website </p>
                            <h3>{website[0]?.value > 0 ? website[0]?.value : "0"}</h3>
                            <h6 className={cannelRatio?.website?.startsWith("-") === false ? "increase" : "decrease"}>{cannel_date !== 'custom' && cannelRatio?.website !== null ? cannelRatio?.website : "0%"}<i className={cannelRatio?.website?.startsWith("-") === false ? "flaticon-trending" : "flaticon-down-arrow-2"}></i> </h6>
                        </div>

                        <div className="leftItem">
                            <p>Phone Call</p>
                            <h3>{phone[0]?.value > 0 ? phone[0]?.value : "0"}</h3>
                            <h6 className={cannelRatio?.phone?.startsWith("-") === false ? "increase" : "decrease"}>{cannel_date !== 'custom' && cannelRatio?.phone !== null ? cannelRatio?.phone : "0%"}<i className={cannelRatio?.phone?.startsWith("-") === false ? "flaticon-trending" : "flaticon-down-arrow-2"}></i> </h6>
                        </div>

                        <div className="leftItem">
                            <p>Social Media</p>
                            <h3>{socal[0]?.value > 0 ? socal[0]?.value : "0"}</h3>
                            <h6 className={cannelRatio?.social?.startsWith("-") === false ? "increase" : "decrease"}>{cannel_date !== 'custom' && cannelRatio?.social !== null ? cannelRatio?.social : "0%"} <i className={cannelRatio?.social?.startsWith("-") === false ? "flaticon-trending" : "flaticon-down-arrow-2"}></i> </h6>
                        </div>

                    </div>

                    <div className="right">

                        {/* <div id="circle">
                            <div className="segment"></div>
                            <div className="segment"></div>
                            <div className="segment"></div>
                            <div className="segment"></div>
                        </div> */}

                    </div>
                    <PieChartPage newCannelList={newCannelList} ></PieChartPage>


                </div>

            </div>

        </>

    )
}

export default ChartJs
