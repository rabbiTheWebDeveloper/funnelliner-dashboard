import { Box, Button, Container, Grid, Modal } from "@mui/material";
import Clipboard from "clipboard";
import Link from "next/link";
import React, { useState } from "react";
import { domain } from "../../pages/api";

const WebsiteLink = ({ busInfo = {} }) => {
  const [mas, setMas] = useState("");
  const { domain_status, domain_request } = busInfo;
  // Model
  const [openModel, setOpenModel] = useState(false);

  const handleCloseModal = () => setOpenModel(false);

  const textToCopy = `https://funnelliner.com/${domain}`;
  const handleClick = () => {
    const clipboard = new Clipboard(".SocialLink", {
      text: () => textToCopy,
    });
    clipboard.on("success", (e) => {
      setMas("Copied to Link!");
      e.clearSelection();
    });
    clipboard.on("error", (e) => {});
  };
  setTimeout(function () {
    setMas("");
  }, 1000);

  return (
    <>
      <div className="WebsiteLinkContent d_flex d_justify">
        <div className="left">
          <ul>
            <li>
              <h5>
                Visit the following link to view your website
                {domain_status === "connected" ? (
                  <Link
                    target="_blank"
                    href={`https://${domain_request}`}
                    rel="noopener noreferrer"
                  >
                    {domain_request}
                  </Link>
                ) : (
                  <Link
                    target="_blank"
                    href={`https://funnelliner.com/${domain}`}
                    rel="noopener noreferrer"
                  >
                    https://funnelliner.com/{domain}
                  </Link>
                )}
              </h5>
            </li>

            <li>
              <Link
                href={
                  domain_status === "connected"
                    ? `https://${domain_request}`
                    : `https://funnelliner.com/${domain}`
                }
                target="_blank"
              >
                Visit Store <i className="flaticon-browser-1"></i>
              </Link>
            </li>

            <li>
              <Button
                onClick={handleClick}
                className="SocialLink"
                alt="Copy to clipboard"
              >
                Copy Link <i className="flaticon-link-2"></i>
              </Button>
            </li>

            {domain_status === "connected" ? (
              ""
            ) : (
              <li>
                <Link href="/website-setting?domain=3">
                  Add Your Custom Domain Name
                  <i className="flaticon-browser-1"></i>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      <section className="WebsiteLink">
        <Container maxWidth="sm">
          <Grid Container spacing={3}>
            <Grid item xs={12}>
              <div className="WelcomeModel">
                <Modal
                  open={openModel}
                  onClose={handleCloseModal}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box>
                    <div className="WelcomeModelContent">
                      <h3>Congratulations !</h3>
                      <h4>Your Account has been successfully Created !</h4>
                      <h5>Now you are on the Waiting List !</h5>

                      <div className="Gif d_flex d_justify">
                        <div className="img">
                          <img src="images/gif1.gif" alt="" />
                        </div>

                        <div className="img">
                          <img src="images/gif2.gif" alt="" />
                        </div>

                        <div className="img">
                          <img src="images/gif1.gif" alt="" />
                        </div>
                      </div>
                      <h4>
                        Please Compleat The Payment and Activate your account!
                      </h4>
                      <Link
                        href="https://shop.bkash.com/soft-it-carerm47396/pay/bdt1999/tJoBsF"
                        className="bg"
                      >
                        Pay Now
                      </Link>
                    </div>
                  </Box>
                </Modal>
              </div>
            </Grid>
          </Grid>
        </Container>
      </section>
    </>
  );
};

export default WebsiteLink;
