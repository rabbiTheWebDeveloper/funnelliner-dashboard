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
import { BsShop } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { headers } from "../../../pages/api";
import { setActiveTab } from "../../../redux/features/dropDownSlice/dropdownSlice";
import ShortNotification from "./ShortNotification";

import style from './style.module.css';

const publicIp = require("react-public-ip");

const Menubar2 = ({ busInfo }) => {
  const dispatch = useDispatch();
  const { id } = busInfo;
  const [openCategory, setOpenCategory] = React.useState(false);
  const [openStock, setOpenStock] = React.useState(false);
  const [openTemplate, setOpenTemplate] = React.useState(false);
  const [openMyTemplate, setOpenMyTemplate] = React.useState(false);
  const [token, setToken] = useState("");
  const router = useRouter();
  // handleCategory
  const handleCategory = () => {
    setOpenCategory(!openCategory);
  };
  // handleStock
  const handleStock = () => {
    setOpenStock(!openStock);
  };
  // handleTemplate
  const handleTemplate = () => {
    setOpenTemplate(!openTemplate);
  };
  // handleTemplate
  const handleMyTemplate = () => {
    setOpenMyTemplate(!openMyTemplate);
  };

  const handleClose = () => {
    setAnchorElMenu(null);
  };

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
      .get(process.env.NEXT_PUBLIC_API_URL + "/client/logout", { headers: logoutHeaders })
      .then((response) => {
        if (response.status === 200) {
          Cookies.remove("token");
          Cookies.remove("Skip_status");
          // Cookies.remove("total_task");
          Cookies.remove("domain_request");

          Cookies.remove();
          window.location.href = "/login";
          router.push("/login");
        }
      });
    Cookies.remove("token");
  };

  // set read 



  // SideMenu Toggle
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
  const [countNotify, setCountNotify] = useState('');


  const [data, setData] = useState([])
  const notification = () => {
    const orderBody = {
      notify_id: id,
      type: "order"
    }
    axios.post(process.env.NEXT_PUBLIC_API_URL + `/client/notifications-show`, orderBody, {
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
  const [openSubmenu, setOpenSubmenu] = useState(false);

  let handleClickSidebar = (e) => {
    setOpenSidebar(!openSidebar);
  }

  // handleSubmenu
  let handleSubmenu = () => {
    setOpenSubmenu(!openSubmenu);
  }


  return (

    <>

      {/* <div className={style.Sidebar}> */}
      <div className={openSidebar ? `${style.longSidebar} ${style.Sidebar}` : `${style.Sidebar}`}>

        <div className={style.Close}>
          <i onClick={handleClickSidebar} className="flaticon-close-1"></i>
        </div>

        {/* logo */}
        <div className={style.Logo}>

          <img className={style.ShortLogo} src="/images/short-logo.png" alt="" />

          <img className={style.LongLogo} src="/images/funnel-liner-logo-beta.png" alt="" />

        </div>

        {/* SideMenu */}
        <div className={style.SidebarMenu}>

          {/* Dashboard */}
          <div className={style.MenuItem}>

            <Tooltip title="Dashboard" placement="right">

              <Link href='/' className={router.pathname === '/' ? `${style.active}` : ''}>
                <i className="flaticon-home-1"></i>
                <span>Dashboard</span>
              </Link>

            </Tooltip>

          </div>

          {/* Order */}
          <div className={style.MenuItem}>

            <Tooltip title="Order" placement="right">

              <Link href='/order' className={router.pathname === '/order' ? `${style.active}` : ''}>
                <i className="flaticon-home-1"></i>
                <span>Orders</span>
              </Link>

            </Tooltip>

          </div>

          {/* Products */}
          <div className={style.MenuItem}>

            <Tooltip title="Products" placement="right">

              <h6 onClick={handleSubmenu} className={router.pathname === "/product" || router.pathname === "/product" || router.pathname === "/category-list" ? `${style.active}` : ""}>
                <i className="flaticon-home-1"></i>
                <span>Products</span>

                {/* Submenu */}
                <ul className={openSubmenu ? `${style.SubmenuOpen} ${style.Submenu}` : style.Submenu}>

                  <li>
                    <Link href={'/product'} className={router.pathname === "/product" ? `${style.active}` : ""}>Product</Link>
                  </li>

                  <li>
                    <Link href={'/category-list'} className={router.pathname === "/category-list" ? `${style.active}` : ""}>Category</Link>
                  </li>

                </ul>

              </h6>

            </Tooltip>

          </div>

          {/* Courier */}
          <div className={style.MenuItem}>

            <Tooltip title="Courier" placement="right">

              <Link href='/courier' className={router.pathname === '/courier' ? `${style.active}` : ''}>
                <i className="flaticon-home-1"></i>
                <span>Courier</span>
              </Link>

            </Tooltip>

          </div>

          {/* Stock */}
          <div className={style.MenuItem}>

            <Tooltip title="Stock" placement="right">

              <h6 onClick={handleSubmenu} className={router.pathname === "/inventory" || router.pathname === "/inventory" || router.pathname === "/stockin" || router.pathname === "/product-return" ? `${style.active}` : ""}>
                <i className="flaticon-home-1"></i>
                <span>Stock</span>

                {/* Submenu */}
                <ul className={openSubmenu ? `${style.SubmenuOpen} ${style.Submenu}` : style.Submenu}>

                  <li>
                    <Link href={'/inventory'} className={router.pathname === "/inventory" ? `${style.active}` : ""}>Inventory</Link>
                  </li>

                  <li>
                    <Link href={'/stockin'} className={router.pathname === "/stockin" ? `${style.active}` : ""}>Stock In</Link>
                  </li>

                  <li>
                    <Link href={'/product-return'} className={router.pathname === "/product-return" ? `${style.active}` : ""}>Product Return</Link>
                  </li>

                </ul>

              </h6>

            </Tooltip>

          </div>

          {/* Bulk SMS */}
          <div className={style.MenuItem}>

            <Tooltip title="Bulk SMS" placement="right">

              <Link href='/bulk-sms' className={router.pathname === '/bulk-sms' ? `${style.active}` : ''}>
                <i className="flaticon-home-1"></i>
                <span>Bulk SMS</span>
              </Link>

            </Tooltip>

          </div>

          {/* Support Ticket */}
          <div className={style.MenuItem}>

            <Tooltip title="Support Ticket" placement="right">

              <Link href='/support-ticket' className={router.pathname === '/support-ticket' ? `${style.active}` : ''}>
                <i className="flaticon-home-1"></i>
                <span>Support Ticket</span>
              </Link>

            </Tooltip>

          </div>

          {/* Customers */}
          <div className={style.MenuItem}>

            <Tooltip title="Customers" placement="right">

              <Link href='/customer-list' className={router.pathname === '/customer-list' ? `${style.active}` : ''}>
                <i className="flaticon-home-1"></i>
                <span>Customers</span>
              </Link>

            </Tooltip>

          </div>

          {/* Templates */}
          <div className={style.MenuItem}>

            <Tooltip title="Templates" placement="right">

              <h6 onClick={handleSubmenu} className={router.pathname === "/landing-page" || router.pathname === "/landing-page" || router.pathname === "/multi-page" ? `${style.active}` : ""}>
                <i className="flaticon-home-1"></i>
                <span>Templates</span>

                {/* Submenu */}
                <ul className={openSubmenu ? `${style.SubmenuOpen} ${style.Submenu}` : style.Submenu}>

                  <li>
                    <Link href={'/landing-page'} className={router.pathname === "/landing-page" ? `${style.active}` : ""}>Landing Page Website</Link>
                  </li>

                  <li>
                    <Link href={'/multi-page'} className={router.pathname === "/multi-page" ? `${style.active}` : ""}>Multi Page Website</Link>
                  </li>

                </ul>

              </h6>

            </Tooltip>

          </div>

          {/* My Page */}
          <div className={style.MenuItem}>

            <Tooltip title="My Page" placement="right">

              <h6 onClick={handleSubmenu} className={router.pathname === "/myLandingPage" || router.pathname === "/myLandingPage" || router.pathname === "/myMultiWebsite" || router.pathname === "/web-pages" || router.pathname === "/home-slider" || router.pathname === "/about-us" || router.pathname === "/terms-and-condition" || router.pathname === "/privacy-policy" ? `${style.active}` : ""}>
                <i className="flaticon-home-1"></i>
                <span>My Page</span>

                {/* Submenu */}
                <ul className={openSubmenu ? `${style.SubmenuOpen} ${style.Submenu}` : style.Submenu}>

                  <li>
                    <Link href={'/myLandingPage'} className={router.pathname === "/myLandingPage" ? `${style.active}` : ""}>Landing Page Website</Link>
                  </li>

                  <li>
                    <Link href={'/myMultiWebsite'} className={router.pathname === "/myMultiWebsite" ? `${style.active}` : ""}>Multi Page Website</Link>
                  </li>

                  <li>
                    <Link href={'/web-pages'} className={router.pathname === "/web-pages" ? `${style.active}` : ""}>Pages</Link>
                  </li>

                  <li>
                    <Link href={'/home-slider'} className={router.pathname === "/home-slider" ? `${style.active}` : ""}>All Slider</Link>
                  </li>

                  <li>
                    <Link href={'/about-us'} className={router.pathname === "/about-us" ? `${style.active}` : ""}>About us</Link>
                  </li>

                  <li>
                    <Link href={'/terms-and-condition'} className={router.pathname === "/terms-and-condition" ? `${style.active}` : ""}>Terms and Condition</Link>
                  </li>

                  <li>
                    <Link href={'/privacy-policy'} className={router.pathname === "/privacy-policy" ? `${style.active}` : ""}>Privacy and policy</Link>
                  </li>

                </ul>

              </h6>

            </Tooltip>

          </div>

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
                    <h4> <img onClick={handleClickSidebar} src="/images/sidebar.png" alt="" /> Dashboard</h4>
                  </div>

                </div>



                {/* Right */}
                <div className={style.right}>

                  <div className={style.Notification}>
                    <PopupState variant="popover" popupId="Profile">
                      {(popupState) => (
                        <>
                          <Button {...bindTrigger(popupState)}>
                            <i className="flaticon-notification"></i>
                            <h6>{unread()}</h6>
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
                                <BsShop />
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

    </>

  );
};

export default Menubar2;