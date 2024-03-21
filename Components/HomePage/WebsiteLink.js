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

  const textToCopy = domain_status === "connected"
  ? `https://${domain_request}`: `https://funnelliner.com/${domain}`;
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
    </>
  );
};

export default WebsiteLink;
