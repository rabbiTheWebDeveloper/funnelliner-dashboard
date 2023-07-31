import { Box, Button, Container, Grid } from "@mui/material";
import Modal from "@mui/material/Modal";
import Cookies from "js-cookie";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import HeaderDescription from "../../Common/HeaderDescription/HeaderDescription";
import { domain, merchantThemeList } from "../../../pages/api";
import SmallLoader from "../../SmallLoader/SmallLoader";

const MyMultiWebsite = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const handlePreview = () => setOpenPreview(true);
  const previewClose = () => setOpenPreview(false);
  const [isImportedTheme, setIsImportedTheme] = useState(false);

  const [multiPageTemplate, setMultiPageTemplate] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    merchantThemeList("multiple").then((result) => {
      setMultiPageTemplate(result?.data?.data);
      setIsLoading(false);
      if (result?.data?.data.length === 0) {
        setIsImportedTheme(true);
      }
    });
  }, []);
  const domain_request = Cookies.get("domain_request");
  return (
    <>
      <section className="LandingWebsite">
        <HeaderDescription
          headerIcon={"flaticon-web-design"}
          title={"My Multipage Template"}
          subTitle={"choose your theme here and customize as you want"}
          search={false}
        ></HeaderDescription>
        {isLoading && <SmallLoader />}
        <Container maxWidth="sm">
          <Grid Container spacing={3}>        
            <div className="LandingWebsiteContent">
              {isImportedTheme === true && (
                <div style={{ textAlign: "center", marginTop: "100px" }}>
                  <p style={{ marginBottom: "20px" }}>
                    You Didn’t Import Any Multipage website Right Now. Please
                    Choice Your Multipage Theme & Import It.
                  </p>
                  <Link href="/multi-page">                  
                    <Button
                      style={{ background: "#1565C0", color: "white" }}
                      variant="contained"
                    >
                      Import Theme
                    </Button>
                  </Link>
                </div>
              )}

              <Grid container spacing={3}>
                {Array.isArray(multiPageTemplate)
                  ? multiPageTemplate?.map((item, index) => {
                      return (
                        <Grid key={index} item xs={12} sm={6} md={4}>
                          <div className="LandingWebsiteItem boxShadow">
                            <div className="img">
                              <img src={item.media.name} alt="" />
                              <h4>Multi Page</h4>
                            </div>

                            <div className="DuelButton d_flex d_justify">
                              <div className="left">
                                <Link
                                  target="_blank"
                                  href={
                                    domain_request !== "null"
                                      ? `https://${domain_request}`
                                      : `https://funnelliner.com/${domain}`
                                  }
                                  rel="noopener noreferrer"
                                >
                                  `<Button>Preview</Button>`
                                </Link>

                                <Modal
                                  open={openPreview}
                                  onClose={previewClose}
                                  aria-labelledby="modal-modal-title"
                                  aria-describedby="modal-modal-description"
                                >
                                  <Box>
                                    <div className="InvoiceModal">
                                      <img src={item.media.name} alt="" />
                                    </div>
                                  </Box>
                                </Modal>
                              </div>

                              <div className="right">
                                <Link
                                  target="_blank"
                                  href={
                                    domain_request !== "null"
                                      ? `https://${domain_request}`
                                      : `https://funnelliner.com/${domain}`
                                  }
                                  rel="noopener noreferrer"
                                >
                                  <Button Id={item.id}>Edit</Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </Grid>
                      );
                    })
                  : null}
              </Grid>
            </div>
          </Grid>
        </Container>
      </section>
    </>
  );
};

export default MyMultiWebsite;
