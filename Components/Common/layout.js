import { useEffect, useState } from "react";
import { paymentStatus } from "../../pages/api";
import Subscribe from '../Subscribe/Subscribe';
import Menubar from './Menubar/Menubar';
import Sidebar from './Sidebar';
import Footer from "./Footer";

export default function Layout({ children, busInfo, myAddonsList, pendingOrderCount }) {
  const [isWindowExist, setIsWindowExist] = useState(false)
  const {merchant} =busInfo || {} ;
 

  useEffect(() => {
    if (window !== "undefined") {
      setIsWindowExist(true)
    }
  })
  if (isWindowExist !== false) {
    return (
      <>
        <Menubar busInfo={busInfo} myAddonsList={myAddonsList} pendingOrderCount={pendingOrderCount}></Menubar>
        {/* <Sidebar busInfo={busInfo} myAddonsList={myAddonsList} pendingOrderCount={pendingOrderCount} /> */}
        <div className="TopGaps"></div>
        <main>{children}</main>
        <Footer />

        {
         busInfo?.merchant && merchant?.payment_status!="paid" && <Subscribe></Subscribe>
        }
        
      </>
    )
  }
}