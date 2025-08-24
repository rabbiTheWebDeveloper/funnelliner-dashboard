import { Container } from "@mui/material";
import styles from "./global.module.css";
import { propagateVariablesToRoot } from "./lib/utils";
import { useState } from "react";
import { WebsiteSection } from "./dashboard/WebsiteSection";
import { SalesPerformanceSection } from "./dashboard/SalesPerformanceSection";
import { SalesAnalyticsSection } from "./dashboard/SalesAnalyticsSection";
import { BusinessAnalyticsSection } from "./dashboard/BusinessAnalyticsSection";
import { SalesTargetSection } from "./dashboard/SalesTargetSection";
import { OrderAnalyticsSection } from "./dashboard/OrderAnalyticsSection";

export const Dashboard = ({ busInfo: data }) => {
  const [isCopiedWebLink, setIsCopiedWebLink] = useState(null);

  const copyWebLink = () => {
    if (isCopiedWebLink) setTimeout(isCopiedWebLink);

    window.navigator.clipboard
      .writeText(data.domain_request || "")
      .catch(err => console.error(err));

    const timeout = setTimeout(() => setIsCopiedWebLink(null), 2000);
    setIsCopiedWebLink(timeout);
  };

  return (
    <main
      ref={el => el && propagateVariablesToRoot(el)}
      className={styles.global + " WebsiteLink"}
    >
      <Container maxWidth="sm">
        <WebsiteSection 
          data={data}
          isCopiedWebLink={isCopiedWebLink}
          copyWebLink={copyWebLink}
        />
        <SalesPerformanceSection />
        <SalesAnalyticsSection />
        <BusinessAnalyticsSection />
        <SalesTargetSection />
        <OrderAnalyticsSection />
      </Container>
    </main>
  );
};
