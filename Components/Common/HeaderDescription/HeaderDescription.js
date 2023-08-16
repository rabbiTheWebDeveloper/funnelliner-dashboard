import { Button, Container } from "@mui/material";
import React from "react";
import style from "./style.module.css";

const HeaderDescription = ({
  headerIcon,
  title,
  subTitle,
  search,
  setSearch,
}) => {
  return (
    <>
      <section className={style.HeaderDescription}>
        <Container maxWidth="sm">
          <div className="boxShadow">
            <div className={style.HeaderDescriptionContent}>
              {/* Left */}
              <div className={style.Left}>
                <div className={style.icon}>
                  <i className={headerIcon}></i>
                </div>

                <div className={style.text}>
                  <h4>{title}</h4>
                  <p>{subTitle}</p>
                </div>
              </div>

              {/* right */}
              <div className={style.Right}>
                {search != false && (
                  <div className={style.SearchFilter}>
                    <div className={style.customInput}>
                      <input
                        type="text"
                        placeholder="Search Here..."
                        onKeyUp={(e) => setSearch(e.target.value)}
                      />

                      {/* <Button id="orderSearchButton">
                        <i className="flaticon-search"></i>
                      </Button> */}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
};

export default HeaderDescription;
