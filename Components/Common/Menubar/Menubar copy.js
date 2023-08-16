import {
  Box,
  Button,
  Collapse,
  Drawer,
  Grid,
  List,
  ListItemButton,
  Menu,
  MenuItem
} from "@mui/material";
import { Container } from "@mui/system";
import axios from "axios";
import { detect } from "detect-browser";
import Cookies from "js-cookie";
import PopupState, { bindMenu, bindTrigger } from "material-ui-popup-state";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  AiOutlineBars,
  AiOutlineFileDone,
  AiOutlineHome,
  AiOutlineShoppingCart,
  AiOutlineStock
} from "react-icons/ai";
import { BiMessageRoundedDots, BiSupport } from "react-icons/bi";
import { BsPlug, BsShop } from "react-icons/bs";
import { FaLaptopCode } from "react-icons/fa";
import { FiChevronDown, FiLogOut } from "react-icons/fi";
import { GiWorld } from "react-icons/gi";
import { HiCurrencyDollar } from "react-icons/hi";
import { RiSettings2Line, RiTeamLine } from "react-icons/ri";
import { TbTruckDelivery } from "react-icons/tb";
import { useDispatch } from "react-redux";
import { headers, shopId } from "../../../pages/api";
import { setActiveTab } from "../../../redux/features/dropDownSlice/dropdownSlice";
import ShortNotification from "./ShortNotification";

import style from './style.module.css';

const publicIp = require("react-public-ip");

const Menubar = ({ busInfo }) => {
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
    // setAnchorElMenu(null);
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
      .get(process.env.API_URL + "/client/logout", { headers: logoutHeaders })
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






  return (
    <>
      <section className={style.Menubar}>

        <Container maxWidth="sm">

          <Grid container spacing={2}>

            <Grid item xs={12}>

              {/* DesktopMenu */}
              <div className={`${style.MenubarContent} ${style.DesktopMenu}`}>

                <div className={style.Left}>
                  <h4>Dashboard</h4>
                </div>

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

              {/* MobileMenu */}
              <div className={`${style.MenubarContent} ${style.MobileMenu}`}>
                {/* right */}
                <div className={style.MobileToggleMenu}>
                  {/* Left */}
                  <div className={style.Left}>
                    {/* MobileIcon */}
                    <div className="MobileIcon">
                      <div
                        className="Iconbar"
                        onClick={() => setIsDrawerOpen(true)}
                      >
                        <AiOutlineBars />
                      </div>

                      <Drawer
                        anchor="left"
                        open={isDrawerOpen}
                        onClose={() => setIsDrawerOpen(false)}
                        className={style.MuiDrawerPaper}
                      >
                        <Box role="presentation" className={style.SideToggleMenu}>

                          {/* Shop */}
                          <div className={style.Shop}>
                            <Link href="/">
                              {busInfo?.shop_logo?.name ? (
                                <img src={busInfo?.shop_logo?.name} alt="" />
                              ) : (
                                <BsShop />
                              )}
                            </Link>
                            <div className={style.text}>
                              <h4>{busInfo?.name}</h4>
                              <p>ID: {shopId}</p>
                            </div>
                          </div>

                          <div className={style.MenuItemContent}>
                            {/* Dashboard */}
                            <div className="MenuItem">
                              <ListItemButton>
                                <Link
                                  href={"/"}
                                  className={
                                    router.pathname === "/" ? "active" : ""
                                  }
                                >
                                  <AiOutlineHome /> Dashboard
                                </Link>
                              </ListItemButton>
                            </div>

                            {/* Orders */}
                            <div className="MenuItem">
                              <ListItemButton>
                                <Link
                                  href={"/order"}
                                  className={
                                    router.pathname === "/order" ? "active" : ""
                                  }
                                >
                                  <AiOutlineFileDone /> Orders
                                </Link>
                              </ListItemButton>
                            </div>

                            {/* Products */}
                            <div className="MenuItem">
                              <ListItemButton
                                onClick={() => handleCategory(true)}
                              >
                                <h6
                                  className={
                                    router.pathname === "/product" ||
                                      router.pathname === "/category-list"
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <AiOutlineShoppingCart /> Products
                                  <span>
                                    <FiChevronDown />
                                  </span>
                                </h6>
                              </ListItemButton>

                              <Collapse
                                in={openCategory}
                                timeout="auto"
                                unmountOnExit
                              >
                                <List component="div" disablePadding>
                                  <Link href={"/product"}>Product</Link>
                                </List>

                                <List component="div" disablePadding>
                                  <Link href={"/category-list"}>Category</Link>
                                </List>
                              </Collapse>
                            </div>

                            {/* Orders */}
                            <div className="MenuItem">
                              <ListItemButton>
                                <Link
                                  href={"/courier"}
                                  className={
                                    router.pathname === "/courier"
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <TbTruckDelivery /> Courier
                                </Link>
                              </ListItemButton>
                            </div>

                            {/* Stock */}
                            <div className="MenuItem">
                              <ListItemButton onClick={() => handleStock(true)}>
                                <h6
                                  className={
                                    router.pathname === "/inventory" ||
                                      router.pathname === "/stockin" ||
                                      router.pathname === "/product-return"
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <AiOutlineStock /> Stock
                                  <span>
                                    <FiChevronDown />
                                  </span>
                                </h6>
                              </ListItemButton>

                              <Collapse
                                in={openStock}
                                timeout="auto"
                                unmountOnExit
                              >
                                <List component="div" disablePadding>
                                  <Link href={"/inventory"}>Inventory</Link>
                                </List>

                                <List component="div" disablePadding>
                                  <Link href={"/stockin"}>Stock In</Link>
                                </List>

                                <List component="div" disablePadding>
                                  <Link href={"/product-return"}>
                                    Product Return
                                  </Link>
                                </List>
                              </Collapse>
                            </div>

                            {/* Bulk SMS */}
                            <div className="MenuItem">
                              <ListItemButton>
                                <Link
                                  href="/bulk-sms"
                                  className={
                                    router.pathname === "/bulk-sms"
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <BiMessageRoundedDots /> Bulk SMS
                                </Link>
                              </ListItemButton>
                            </div>

                            {/* Support Ticket */}
                            <div className="MenuItem">
                              <ListItemButton>
                                <Link
                                  href={"/support-ticket"}
                                  className={
                                    router.pathname === "/support-ticket"
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <BiSupport />
                                  Support Ticket
                                </Link>
                              </ListItemButton>
                            </div>

                            {/* Customers */}
                            <div className="MenuItem">
                              <ListItemButton>
                                <Link
                                  href={"/customer-list"}
                                  className={
                                    router.pathname === "/customer-list"
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <RiTeamLine /> Customers
                                </Link>
                              </ListItemButton>
                            </div>

                            {/* Templates */}
                            <div className="MenuItem">
                              <ListItemButton
                                onClick={() => handleTemplate(true)}
                              >
                                <h6>
                                  <RiSettings2Line /> Templates
                                  <span>
                                    <FiChevronDown />
                                  </span>
                                </h6>
                              </ListItemButton>

                              <Collapse
                                in={openTemplate}
                                timeout="auto"
                                unmountOnExit
                              >
                                <List component="div" disablePadding>
                                  <Link
                                    href={"landing-page"}
                                    className={
                                      router.pathname === "/landing-page"
                                        ? "active"
                                        : ""
                                    }
                                  >
                                    Landing Page Website
                                  </Link>
                                </List>

                                <List component="div" disablePadding>
                                  <Link
                                    href={"multi-page"}
                                    className={
                                      router.pathname === "/multi-page"
                                        ? "active"
                                        : ""
                                    }
                                  >
                                    Multi Page Website
                                  </Link>
                                </List>
                              </Collapse>
                            </div>

                            {/* My Page */}
                            <div className="MenuItem">
                              <ListItemButton
                                onClick={() => handleMyTemplate(true)}
                              >
                                <h6>
                                  <FaLaptopCode /> My Page
                                  <span>
                                    <FiChevronDown />
                                  </span>
                                </h6>
                              </ListItemButton>

                              <Collapse
                                in={openMyTemplate}
                                timeout="auto"
                                unmountOnExit
                              >
                                <List component="div" disablePadding>
                                  <Link
                                    href={"/myLandingPage"}
                                    className={
                                      router.pathname === "/myLandingPage"
                                        ? "active"
                                        : ""
                                    }
                                  >
                                    Landing Page Website
                                  </Link>
                                </List>

                                <List component="div" disablePadding>
                                  <Link
                                    href={"/myMultiWebsite"}
                                    className={
                                      router.pathname === "/myMultiWebsite"
                                        ? "active"
                                        : ""
                                    }
                                  >
                                    Multi Page Website
                                  </Link>
                                </List>

                                <List component="div" disablePadding>
                                  <Link
                                    href={"/web-pages"}
                                    className={
                                      router.pathname === "/web-pages"
                                        ? "active"
                                        : ""
                                    }
                                  >
                                    Pages
                                  </Link>
                                </List>

                                <List component="div" disablePadding>
                                  <Link
                                    href={"/home-slider"}
                                    className={
                                      router.pathname === "/home-slider"
                                        ? "active"
                                        : ""
                                    }
                                  >
                                    Slider
                                  </Link>
                                </List>
                              </Collapse>
                            </div>

                            {/* Website Setting */}
                            <div className="MenuItem">
                              <ListItemButton>
                                <Link
                                  href={"/website-setting"}
                                  className={
                                    router.pathname === "/website-setting"
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <GiWorld /> Website Settings
                                </Link>
                              </ListItemButton>
                            </div>

                            {/* Plugins */}
                            <div className="MenuItem">
                              <ListItemButton>
                                <Link
                                  href="/plug-in"
                                  className={
                                    router.pathname === "/plug-in"
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <BsPlug /> Addons
                                </Link>
                              </ListItemButton>
                            </div>

                            {/* Offers */}
                            <div className="MenuItem">
                              <ListItemButton>
                                <Link
                                  href="/subscription"
                                  className={
                                    router.pathname === "/subscription"
                                      ? "active"
                                      : ""
                                  }
                                >
                                  <HiCurrencyDollar /> Subscription
                                </Link>
                              </ListItemButton>
                            </div>
                          </div>
                        </Box>
                      </Drawer>

                    </div>

                    {/* logo */}
                    <div className={style.Logo}>
                      <Link href={"/"}>
                        <img src="/images/logo.png" alt="" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Search Menu */}
                <div className={style.RightMenu}>

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

                  {/* SupportTicket */}
                  <div className={style.SupportTicket}>
                    <Link href="/support-ticket">
                      <i className="flaticon-customer-support"></i>
                    </Link>
                  </div>

                  {/* SupportTicket */}
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

                          <Menu {...bindMenu(popupState)}>
                            <MenuItem onClick={handleClose}>
                              <Link href="/dashboard-setting">Profile</Link>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                              <Link href="/dashboard-setting">
                                Website Settings
                              </Link>
                            </MenuItem>
                            <MenuItem onClick={handleClose}>
                              <Link href="">Change Password</Link>
                            </MenuItem>
                            <MenuItem onClick={logout}>
                              <Button className="d_flex" >
                                <FiLogOut /> Logout
                              </Button>
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

      </section> */}

      <section className={style.Menubar}>

        <Container>

          <div className={style.MenubarContent}>

            <Grid container spacing={2}>

              <Grid item xs={4}>

                <div className={style.SideMenu}>

                  <h4> <img src="/images/sidebar.png" alt="" /> Dashboard</h4>

                </div>

              </Grid>

            </Grid>

          </div>

        </Container>

      </section>

    </>
  );
};

export default Menubar;