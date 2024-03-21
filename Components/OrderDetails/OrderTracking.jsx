import React from 'react';
import style from "./style.module.css";
import CopyIcon from '../UI/CopyIcon/CopyIcon';
const OrderTracking = () => {
  return (
    <div className={style.inner}>
    <div className={style.details}>
      Tracking Link:{" "}
      <a href="https://steadfast.com.bd/t/2252D1C4D">
        https://steadfast.com.bd/t/2252D1C4D
      </a>
      <CopyIcon
        className={style.copy}
        url="https://steadfast.com.bd/t/2252D1C4D"
      />
    </div>
    <div className={style.timeline}>
      <div className={style.item}>
        <div className={style.date}>
          <h1>Mar 13</h1>
          <h2>9:04 pm</h2>
        </div>

        <div className={style.visual}>
          <div className={style.line}></div>
          <div className={style.point}></div>
        </div>
        <h1 className={style.title}>
          Consignment has been marked as delivered by
          rider.
        </h1>
        <h1></h1>
      </div>
      <div className={style.item}>
        <div className={style.date}>
          <h1>Mar 13</h1>
          <h2>3:03 pm</h2>
        </div>

        <div className={style.visual}>
          <div className={style.line}></div>
          <div className={style.point}></div>
        </div>
        <h1 className={style.title}>
          Rider Note: "প্রাপক ফোন রিসিভ করেন নি"
        </h1>
        <h1></h1>
      </div>
      <div className={style.item}>
        <div className={style.date}>
          <h1>09 Dec 2022</h1>
          <h2>06:37:46 PM</h2>
        </div>

        <div className={style.visual}>
          <div className={style.line}></div>
          <div className={style.point}></div>
        </div>
        <h1 className={style.title}>
          Status has been updated as pending
        </h1>
        <h1></h1>
      </div>
      <div className={style.item}>
        <div className={style.date}>
          <h1>09 Dec 2022</h1>
          <h2>06:37:46 PM</h2>
        </div>

        <div className={style.visual}>
          <div className={style.line}></div>
          <div className={style.point}></div>
        </div>
        <h1 className={style.title}>
          Order received for the website
        </h1>
        <h1></h1>
      </div>
      <div className={style.item}>
        <div className={style.date}>
          <h1>09 Dec 2022</h1>
          <h2>06:37:46 PM</h2>
        </div>

        <div className={style.visual}>
          <div className={style.line}></div>
          <div className={style.point}></div>
        </div>
        <h1 className={style.title}>
          Order received for the website
        </h1>
        <h1></h1>
      </div>
      <div className={style.item}>
        <div className={style.date}>
          <h1>09 Dec 2022</h1>
          <h2>06:37:46 PM</h2>
        </div>

        <div className={style.visual}>
          <div className={style.line}></div>
          <div className={style.point}></div>
        </div>
        <h1 className={style.title}>
          Order received for the website
        </h1>
        <h1></h1>
      </div>
    </div>
  </div>
  );
};

export default OrderTracking;