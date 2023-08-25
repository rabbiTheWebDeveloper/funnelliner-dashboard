import { Box, Button, Container, Grid, Pagination, Stack } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { themeUrl } from "../../../constant/constant";
import { merchantLandingThemeList, shopId, userId } from "../../../pages/api";
import { domain } from "../../../pages/api/index";
import HeaderDescription from "../../Common/HeaderDescription/HeaderDescription";
import SmallLoader from "../../SmallLoader/SmallLoader";

const MyLandingPage = () => {
  // ViewPreviewModel

  const [isImportedTheme, setIsImportedTheme] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [multiPageTemplate, setMultiPageTemplate] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    merchantLandingThemeList("landing").then((result) => {
      setMultiPageTemplate(result?.data?.data);
      setIsLoading(false);
      if (result?.data?.data.length === 0) {
        setIsImportedTheme(true);
      }
    });
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(8);
  const indexOfLastProducts = currentPage * perPage;
  const indexOfFirstProducts = indexOfLastProducts - perPage;
  const currentItems = multiPageTemplate?.slice(
    indexOfFirstProducts,
    indexOfLastProducts
  );

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(multiPageTemplate?.length / perPage); i++) {
    pageNumbers.push(i);
  }
  const paginate = (pageNumber, value) => setCurrentPage(value);
  const domain_request = Cookies.get("domain_request");

  const token = Cookies.get("token");
  const editor = async () => {
    try {
      let data = await axios({
        method: "get",
        url: `https://editor.funnelliner.com/design.php?shop-id=${shopId}&id=${userId}`,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
          "shop-id": shopId,
          id: userId,
          "X-Requested-With": "XMLHttpRequest",
        },
      });
    } catch (err) {}
  };



  return (
    <>
      <section className="LandingWebsite">
        {isLoading && <SmallLoader />}
        {/* header */}
        <HeaderDescription
          headerIcon={"flaticon-website-design"}
          title={"Landing Page Template"}
          subTitle={"choose your theme here and customize as you want"}
          search={false}
        />

        <Container maxWidth="sm">
          <Grid Container spacing={3}>
            {/* LandingWebsite */}
            <div className="LandingWebsiteContent">
              {isImportedTheme === true && (
                <div style={{ textAlign: "center", marginTop: "100px" }}>
                  <p style={{ marginBottom: "20px" }}>
                    You Didn’t Import Any Landing Page Right Now. Please Choice
                    Your Template & Import It.
                  </p>
                  <Link href="/landing-page">
                    <Button
                      style={{ background: "#1565C0", color: "white" }}
                      variant="contained"
                    >
                      Import{" "}
                    </Button>
                  </Link>
                </div>
              )}

              <Grid container spacing={3}>
                {Array.isArray(currentItems)
                  ? currentItems?.map((item, index) => {
                      return (
                        <Grid key={index} item xs={12} sm={6} md={4}>
                          <div className="LandingWebsiteItem boxShadow">
                            <div className="img">
                              <img src={item?.media} alt={item?.page?.title} />                         
                              <h4>{item?.page?.title}</h4>
                            </div>

                            <div className="DuelButton d_flex d_justify">
                              <div className="left">
                                <a
                                  target="_blank"                                
                                  href={
                                    domain_request !== "null"
                                      ? `https://${domain_request}` +
                                        "/p/" +
                                        item?.page?.slug
                                      : `${themeUrl}/${domain}` +
                                        "/p/" +
                                        item?.page?.slug
                                  }
                                >
                                  <Button>Preview</Button>
                                </a>
                              </div>

                              <div className="right">
                                <a
                                  target="_blank"
                                  href={
                                    `https://editor.funnelliner.com/design.php?sid=` +
                                    item?.page?.shop_id +
                                    "&id=" +
                                    item?.page?.id +
                                    "&uid=" +
                                    item?.page?.user_id +
                                    "&au=" +
                                    `${token}`
                                  }
                                >
                                  <Button>Customize</Button>
                                </a>
                              </div>
                            </div>
                          </div>
                        </Grid>
                      );
                    })
                  : null}
              </Grid>
              <div>
                <Box
                  sx={{
                    margin: "auto",
                    width: "fit-content",
                    alignItems: "center",
                  }}
                >
                  <Stack spacing={2}>
                    <Pagination
                      count={pageNumbers.length}
                      variant="outlined"
                      page={currentPage}
                      onChange={paginate}
                    />
                  </Stack>
                </Box>
              </div>
            </div>
          </Grid>
        </Container>
      </section>
    </>
  );
};

export default MyLandingPage;
