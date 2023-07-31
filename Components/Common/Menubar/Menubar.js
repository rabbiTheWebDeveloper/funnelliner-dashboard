import {
  Button,
  Grid,
  Menu,
  MenuItem,
  Tooltip
} from "@mui/material";
import { Container } from "@mui/system";
import axios from "axios";
import { detect } from "detect-browser";
import Cookies from "js-cookie";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { headers, shopId } from "../../../pages/api";
import { setActiveTab } from "../../../redux/features/dropDownSlice/dropdownSlice";
import ShortNotification from "./ShortNotification";

import { useRef } from "react";
import style from './style.module.css';


const publicIp = require("react-public-ip");

const Menubar = ({ busInfo, myAddonsList, pendingOrderCount }) => {
  const dispatch = useDispatch();
  const { id } = busInfo;

  const [token, setToken] = useState("");
  const router = useRouter();


  useEffect(() => {
    // Perform localStorage action
    let token = localStorage.getItem("token");

    setToken(token);
  }, []);

  const browser = detect();
  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("Skip_status");
    router.push("/login")
    const ipAddress = (publicIp.v4()) || "";
    const browserName =
      browser.name === "chrome" ? "Google Chrome" : browser.name;
    let logoutHeaders = {
      ...headers,
      ipaddress: ipAddress,
      browsername: browserName,
    };
    window.location.href = "/login";
    axios
      .get(process.env.API_URL + "/client/logout", { headers: logoutHeaders })
      .then((response) => {
        if (response.status === 200) {
          Cookies.remove("token");
          Cookies.remove("Skip_status");
          Cookies.remove("domain_request");

          Cookies.remove();
          window.location.href = "/login";
          router.push("/login");
        }
      });
    Cookies.remove("token");
  };

  // set read 





  //dispatch call when dropdown change
  const handleDropdownChange = (value, popupState) => {
    popupState.close();
    dispatch(setActiveTab(value));
    handelNotify()
    // notificationRead()

  };

  const [notifyFac, setNotifyfac] = useState(false);

  const handelNotify = () => {
    setNotifyfac(true);
  }



  const [data, setData] = useState([])
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
    // setNotifyfac(false)
  }
  useEffect(() => {
    notification();
    // setNotifyfac(false)
  }, [id, notifyFac]);

  const unread = () => {
    const newdata = data.length > 0 && Array.isArray(data) ? data.filter(data => data.read === null) : []
    return newdata.length

  }
  // Sidebar All work
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState({
    product: false,
    stock: false,
    template: false,
    myPage: false,
    account: false,
  })
  const [isInsideLongSidebar, setIsInsideLongSidebar] = useState(false);
  const componentRef = useRef(null);

  const handleClickOutside = (event) => {
    if (!isInsideLongSidebar && componentRef.current && !componentRef.current.contains(event.target)) {
      setOpenSidebar(false);
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isInsideLongSidebar]);



  const handleClickSubmenu = (submenuName) => {
    setOpenSubmenu((prevState) => ({
      ...Object.keys(prevState).reduce((acc, key) => {
        acc[key] = key === submenuName ? !prevState[key] : false;
        return acc;
      }, {}),
    }));
    setOpenSidebar(true);
  }
  const handleToggle = () => {
    setOpenSidebar((prevState) => !prevState);
  };

  const handleLongSidebarClick = () => {
    setIsInsideLongSidebar(true);
    setTimeout(() => {
      setIsInsideLongSidebar(false);
    }, 0);
  };


  const notificationRead = (id) => {
    const orderBody = {
      notify_id: id,
      type: "order"
    }
    axios.post(process.env.API_URL + `/client/notifications-read`, orderBody, {
      headers: headers,
    })
      .then(function (res) {
        handelNotify()
        // setData(res.data.data)
      })
      .catch((error) => {

      });

    // setNotifyfac(false)
  }


  return (

    <>

      <div onClick={handleLongSidebarClick} ref={componentRef} className={openSidebar ? 'LongSidebar Sidebar' : 'Sidebar'}>

        {/* logo */}
        <div className="Logo">

          {/* <img className="ShortLogo" src="/images/short-logo.png" alt="" />*/}

          {/* <img className="LongLogo" src="/images/funnel-liner-logo-beta.png" alt="" /> */}

          <Link href='/'>
            {

              busInfo?.shop_logo?.name ? <img className="ShortLogo" src={busInfo?.shop_logo?.name} alt='' /> : <i className="flaticon-home-3"></i>
            }

          </Link>

          <h4>
            {
              openSidebar
                ?
                busInfo?.name
                :
                busInfo?.name?.slice(0, 6) + "..."
            }
          </h4>
          <p>ID: {shopId}</p>

        </div>

        {/* SideMenu */}
        <div className="SidebarMenu">

          <ul>

            {/* Dashboard */}
            <li className={router.pathname === "/" ? "active" : ""}>

              <Tooltip title="Dashboard" placement="right">
                <Link href='/'> <i className="flaticon-home-1"></i> <span> Dashboard </span> </Link>
              </Tooltip>

            </li>

            {/* Order */}
            <li className={router.pathname === "/order" ? "active" : ""}>

              <Tooltip title="Order" placement="right">
                <Link href='/order'> <i className="flaticon-order-delivery"></i> <span> Order </span> </Link>
              </Tooltip>

            </li>

            {/* Products */}
            <li className={openSubmenu.product && router.pathname === "/product" || openSubmenu.product && router.pathname === "/category-list" ? "active" : ""}>

              <Tooltip title="Products" placement="right">
                <h6 onClick={() => handleClickSubmenu('product')} > <i className="flaticon-checkout"></i> <span> Products </span> </h6>
              </Tooltip>

              {
                openSubmenu.product &&
                <ul className="Submenu">

                  <li>
                    <Link href='/product' className={router.pathname === "/product" ? "active" : ""}>Product</Link>
                    <Link href='/category-list' className={router.pathname === "/category-list" ? "active" : ""}>Category</Link>
                  </li>

                </ul>
              }

            </li>

            {/* Courier */}
            <li className={router.pathname === "/courier" ? "active" : ""}>

              <Tooltip title="Courier" placement="right">
                <Link href='/courier'> <i className="flaticon-express-delivery"></i> <span> Courier </span> </Link>
              </Tooltip>

            </li>

            {/* Stock */}
            <li className={router.pathname === "/inventory" || router.pathname === "/stockin" || router.pathname === "/product-return" ? "active" : ""}>

              <Tooltip title="Stock" placement="right">
                <h6 onClick={() => handleClickSubmenu('stock')}> <i className="flaticon-in-stock"></i> <span> Stock </span> </h6>
              </Tooltip>

              {
                openSubmenu.stock &&
                <ul className="Submenu">

                  <li>
                    <Link href='/inventory' className={router.pathname === "/inventory" ? "active" : ""}>Inventory</Link>
                    <Link href='/stockin' className={router.pathname === "/stockin" ? "active" : ""}>Stock In</Link>
                    <Link href='/product-return' className={router.pathname === "/product-return" ? "active" : ""}>Product Return</Link>
                  </li>

                </ul>
              }

            </li>

            {/* Bulk SMS */}
            <li className={router.pathname === "/bulk-sms" ? "active" : ""}>

              <Tooltip title="Bulk SMS" placement="right">
                <Link href='/bulk-sms'> <i className="flaticon-mail"></i> <span> Bulk SMS </span> </Link>
              </Tooltip>

            </li>

            {/* Support Ticket */}
            <li className={router.pathname === "/support-ticket" ? "active" : ""}>

              <Tooltip title="Support Ticket" placement="right">
                <Link href='/support-ticket'> <i className="flaticon-customer-service"></i> <span> Support Ticket </span> </Link>
              </Tooltip>

            </li>

            {/* Customers */}
            <li className={router.pathname === "/customer-list" ? "active" : ""}>

              <Tooltip title="Customers" placement="right">
                <Link href='/customer-list'> <i className="flaticon-people"></i> <span> Customers </span> </Link>
              </Tooltip>

            </li>

            {/* Templates */}
            <li className={router.pathname === "/landing-page" || router.pathname === "/multi-page" ? "active" : ""}>

              <Tooltip title="Templates" placement="right">
                <h6 onClick={() => handleClickSubmenu('template')}> <i className="flaticon-template"></i> <span> Templates </span> </h6>
              </Tooltip>

              {
                openSubmenu.template &&
                <ul className="Submenu">

                  <li>
                    <Link href='/landing-page' className={router.pathname === "/landing-page" ? "active" : ""}>Landing Page</Link>
                    <Link href='/multi-page' className={router.pathname === "/multi-page" ? "active" : ""}>Multi Page</Link>
                  </li>

                </ul>
              }

            </li>

            {/* My Page */}
            <li className={router.pathname === "/myLandingPage" || router.pathname === "/myMultiWebsite" || router.pathname === "/web-pages" || router.pathname === "/home-slider" || router.pathname === "/about-us" || router.pathname === "/terms-and-condition" || router.pathname === "/privacy-policy" ? "active" : ""}>

              <Tooltip title="My Page" placement="right">
                <h6 onClick={() => handleClickSubmenu('myPage')}> <i className="flaticon-computer"></i> <span> My Page </span> </h6>
              </Tooltip>

              {
                openSubmenu.myPage &&
                <ul className="Submenu">

                  <li>
                    <Link href='/myLandingPage' className={router.pathname === "/myLandingPage" ? "active" : ""}>Landing Page</Link>
                    <Link href='/myMultiWebsite' className={router.pathname === "/myMultiWebsite" ? "active" : ""}>Multi Page</Link>
                    <Link href='/web-pages' className={router.pathname === "/web-pages" ? "active" : ""}>Pages</Link>
                    <Link href='/home-slider' className={router.pathname === "/multi-page" ? "active" : ""}>All Slider</Link>
                    <Link href='/about-us' className={router.pathname === "/about-us" ? "active" : ""}>About us</Link>
                    <Link href='/terms-and-condition' className={router.pathname === "/terms-and-condition" ? "active" : ""}>Terms & Condition</Link>
                    <Link href='/privacy-policy' className={router.pathname === "/privacy-policy" ? "active" : ""}>Privacy & policy</Link>
                  </li>

                </ul>
              }

            </li>

            {/* Website Setting */}
            <li className={router.pathname === "/website-setting" ? "active" : ""}>

              <Tooltip title="Website Setting" placement="right">
                <Link href='/website-setting'> <i className="flaticon-settings-4"></i> <span> Website Setting </span> </Link>
              </Tooltip>

            </li>

            {/* Addons */}
            <li className={router.pathname === "/plug-in" ? "active" : ""}>

              <Tooltip title="Addons" placement="right">
                <Link href='/plug-in'> <i className="flaticon-people"></i> <span> Addons </span> </Link>
              </Tooltip>

            </li>

            {/* Bkash Merchant */}
            {Array.isArray(myAddonsList) ? myAddonsList?.map((addon, index) => {
              return (
                addon?.addons_details?.id === 17 && addon?.addons_details?.status === 1 &&

                <li className={router.pathname === "/bkash-marcent" ? "active" : ""}>

                  <Tooltip title="Bkash Merchant" placement="right">
                    <Link href='/bkash-marcent'> <i className="flaticon-people"></i> <span> Bkash Merchant </span> </Link>
                  </Tooltip>

                </li>
              )
            })
              :
              null}

            {/* Accounting Modules */}
            {
              Array.isArray(myAddonsList) ? myAddonsList?.map((addon, index) => {
                return (
                  addon?.addons_id === 16 && addon?.status === 1 &&
                  <li className={router.pathname === "/account-dashboard" || router.pathname === "/account-report" ? "active" : ""}>

                    <Tooltip title="Accounting Modules" placement="right">
                      <h6 onClick={() => handleClickSubmenu('account')}> <i className="flaticon-cash-on-delivery"></i> <span> Accounting Modules </span> </h6>
                    </Tooltip>

                    {
                      openSubmenu.account &&
                      <ul className="Submenu">

                        <li>
                          <Link href='/account-dashboard' className={router.pathname === "/account-dashboard" ? "active" : ""}>Dashboard</Link>
                          <Link href='/account-report' className={router.pathname === "/account-report" ? "active" : ""}>Report</Link>
                        </li>

                      </ul>
                    }

                  </li>

                )
              })
                :
                null
            }

            {/* Subscription */}
            <li className={router.pathname === "/subscription" ? "active" : ""}>

              <Tooltip title="Subscription" placement="right">
                <Link href='/subscription'> <i className="flaticon-subscribe"></i> <span> Subscription </span> </Link>
              </Tooltip>

            </li>

            {/* Billing */}
            <li className={router.pathname === "/billing" ? "active" : ""}>

              <Tooltip title="Billing" placement="right">
                <Link href='/billing'> <i className="flaticon-wallet"></i> <span> Billing </span> </Link>
              </Tooltip>

            </li>


          </ul>

        </div>

      </div>


      <section className={style.Menubar}>

        <Container>

          <Grid container spacing={2}>

            <Grid item xs={12}>

              <div className={style.MenubarContent}>

                {/* Left */}
                <div className={style.left}>

                  <div className={style.SideMenu}>
                    <h4>
                      <img ref={componentRef} onClick={handleToggle} src="/images/sidebar.png" alt="" />
                      Dashboard
                    </h4>
                  </div>

                </div>

                {/* Right */}
                <div className={style.right}>

                  <div className={style.Notification}>
                    <PopupState variant="popover" popupId="Profile">
                      {(popupState) => (
                        <>
                          <Button {...bindTrigger(popupState)} >
                            <i onClick={() => notificationRead(id)} className="flaticon-notification"></i>
                            <h6 onClick={() => notificationRead(id)}>{unread()}</h6>
                          </Button>
                          <Menu
                            {...bindMenu(popupState)}
                            className={style.NotificationContent}
                          >
                            <ShortNotification setNotifyfac={setNotifyfac} popupState={popupState} handleDropdownChange={handleDropdownChange} data={data} unread={unread} id={id} handelNotify={handelNotify}></ShortNotification>

                          </Menu>
                        </>
                      )}
                    </PopupState>
                  </div>

                  <div className={style.SupportTicket}>
                    <Link href="/support-ticket">
                      <i className="flaticon-customer-support"></i>
                    </Link>
                  </div>

                  <div className={style.Profile}>
                    <PopupState variant="popover" popupId="Profile">
                      {(popupState) => (
                        <>
                          <Button {...bindTrigger(popupState)}>
                            <div className={style.img} id="resources-button">
                              {busInfo?.shop_logo?.name ? (
                                <img src={busInfo?.shop_logo?.name} alt="" />
                              ) : (
                                <i className="flaticon-home-3"></i>
                              )}
                            </div>
                          </Button>
                          <Menu {...bindMenu(popupState)} className="ProfileMenu">
                            <MenuItem
                              onClick={() =>
                                handleDropdownChange("1", popupState)
                              }
                            >
                              <Link href="/dashboard-setting">
                                <i className="flaticon-home-2"></i> Dashboard Settings
                              </Link>
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleDropdownChange("2", popupState)
                              }
                            >
                              <Link href="/dashboard-setting"> <i className="flaticon-user-1"></i> Profile</Link>
                            </MenuItem>

                            <MenuItem
                              onClick={() =>
                                handleDropdownChange("3", popupState)
                              }
                            >
                              <Link href="/dashboard-setting">
                                <i className="flaticon-padlock-1"></i> Change Password
                              </Link>
                            </MenuItem>
                            <MenuItem onClick={logout}>
                              <Link className="d_flex" href="/login">
                                <i className="flaticon-logout-2"></i> Logout
                              </Link>
                            </MenuItem>
                          </Menu>
                        </>
                      )}
                    </PopupState>
                  </div>

                </div>

              </div>

            </Grid>

          </Grid>

        </Container>

      </section>

      <div className="MobileFooterMenu">

        <ul>

          <li className={router.pathname === "/" ? "active" : ""}>
            <Link href='/'> <i className="flaticon-home-1"></i>  </Link>
          </li>

          <li className={router.pathname === "/order" ? "active" : ""}>
            <Link href='/order'> <i className="flaticon-express-delivery"></i></Link>
          </li>

          <li className={router.pathname === "/product" ? "active" : ""}>
            <Link href='/product'> <i className="flaticon-order-delivery"></i> </Link>
          </li>

          <li className={router.pathname === "/myLandingPage" ? "active" : ""}>
            <Link href='/myLandingPage'><i className="flaticon-browser-1"></i></Link>
          </li>

          {/* <li className={router.pathname === "/support-ticket" ? "active" : ""}>
            <Link href='/support-ticket'> <i className="flaticon-customer-service"></i> </Link>
          </li>

          <li className={router.pathname === "/website-setting" ? "active" : ""}>
            <Link href='/website-setting'> <i className="flaticon-settings-4"></i>  </Link>
          </li> */}

        </ul>

      </div>

    </>

  );
};

export default Menubar;