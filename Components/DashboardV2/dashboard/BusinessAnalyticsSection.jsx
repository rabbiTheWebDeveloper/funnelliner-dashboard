import { Grid, Box } from "@mui/material";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardIcon,
} from "../components/ui/card/card";
import { DateSelector } from "../components/date-selector/DateSelector";
import { SelectItem } from "../components/ui/select/select";
import {
  Minus,
  ArrowDown,
  ArrowUp,
  MessageSquare,
  CheckCircle,
  Truck,
  RotateCcw,
  Users,
  ClipboardList,
  CheckSquare,
  Package,
  Clock,
  XCircle,
  Percent,
  Wallet,
} from "lucide-react";
import { Tooltip } from "../components/ui/tooltip/tooltip";
import styles from "../global.module.css";
import { cls } from "../lib/utils";

export const BusinessAnalyticsSection = () => {
  return (
    <section>
      <div className={cls(styles.header, styles["flex"])}>
        <Box
          className={cls(styles["flex-between"])}
          sx={{ gap: 1, width: "100%" }}
        >
          <h1>Business Analytics</h1>
          <DateSelector placeholder="Today" defaultValue="today" showCalender>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="lifetime">Lifetime</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </DateSelector>
        </Box>
      </div>

      {/* Rate Analysis Section */}
      <div className={styles.section_label}>Rate Analysis</div>
      <Grid container spacing={2} sx={{ mt: 0 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Conversation Rate
                  <CardIcon color="#e3f2fd">
                    <MessageSquare size={20} color="#2196f3" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className={styles["flex-between"]}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Landing Page</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>25%</h1>
                  <div className={cls(styles["card-analytics"])}>
                    <Minus />
                  </div>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Website</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>80%</h1>
                  <div className={cls(styles["card-analytics"])}>
                    <Minus />
                  </div>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Confirmation Rate
                  <CardIcon color="#e8f5e9">
                    <CheckCircle size={20} color="#4caf50" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className={styles["flex-between"]}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Based On Visitor</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>36%</h1>
                  <div className={cls(styles["card-analytics"], styles.down)}>
                    <ArrowDown /> 30%
                  </div>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Based on Order</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>79%</h1>
                  <div className={cls(styles["card-analytics"], styles.growth)}>
                    <ArrowUp /> 45%
                  </div>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Delivery Rate
                  <CardIcon color="#fff3e0">
                    <Truck size={20} color="#ff9800" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className={styles["flex-between"]}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Based on Order</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>95%</h1>
                  <div className={cls(styles["card-analytics"])}>
                    <Minus />
                  </div>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>
                  Based on Confirmed Order
                </h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>52%</h1>
                  <div className={cls(styles["card-analytics"])}>
                    <Minus />
                  </div>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Return Rate
                  <CardIcon color="#fce4ec">
                    <RotateCcw size={20} color="#e91e63" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className={styles["flex-between"]}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Based on Order</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>55%</h1>
                  <div className={cls(styles["card-analytics"])}>
                    <Minus />
                  </div>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>
                  Based on Confirmed Order
                </h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>20%</h1>
                  <div className={cls(styles["card-analytics"])}>
                    <Minus />
                  </div>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Traffic & Orders Section */}
      <div className={styles.section_label}>Traffic & Orders</div>
      <Grid container spacing={2} sx={{ mt: 0 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Visitor
                  <CardIcon color="#e1f5fe">
                    <Users size={20} color="#03a9f4" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className={styles["flex-between"]}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Landing Page</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>2500</h1>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Website</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>6500</h1>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Total</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>5500</h1>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Order Receive
                  <CardIcon color="#f3e5f5">
                    <ClipboardList size={20} color="#9c27b0" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className={styles["flex-between"]}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Quantity</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>45500</h1>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Amount</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>৳ 42500</h1>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Order Confirm
                  <CardIcon color="#e8f5e9">
                    <CheckSquare size={20} color="#4caf50" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className={styles["flex-between"]}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Quantity</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>45500</h1>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Amount</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>৳ 42500</h1>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Order Delivery
                  <CardIcon color="#fff3e0">
                    <Package size={20} color="#ff9800" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className={styles["flex-between"]}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Quantity</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>45500</h1>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  paddingLeft: 2,
                  position: "relative",
                }}
              >
                <span className={styles.card_content_indicator}></span>
                <h1 className={styles.card_content_title}>Amount</h1>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <h1 className={styles.card_value}>৳ 42500</h1>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Order Status Section */}
      <div className={styles.section_label}>Order Status</div>
      <Grid container spacing={2} sx={{ mt: 0 }}>
        <Grid item xs={6} sm={6} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Order Pending
                  <CardIcon color="#e8eaf6">
                    <Clock size={20} color="#3f51b5" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={styles["flex-items-center"]}
                style={{ gap: "8px" }}
              >
                <h1 className={styles.card_value}>20808</h1>
                <div className={cls(styles["card-analytics"], styles.growth)}>
                  <ArrowUp /> 25%
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Order Cancel
                  <CardIcon color="#ffebee">
                    <XCircle size={20} color="#f44336" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={styles["flex-items-center"]}
                style={{ gap: "8px" }}
              >
                <h1 className={styles.card_value}>808</h1>
                <div className={cls(styles["card-analytics"])}>
                  <Minus />
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Discount Amount
                  <CardIcon color="#ede7f6">
                    <Percent size={20} color="#673ab7" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={styles["flex-items-center"]}
                style={{ gap: "8px" }}
              >
                <h1 className={styles.card_value}>৳ 406024</h1>
                <div className={cls(styles["card-analytics"], styles.growth)}>
                  <ArrowUp /> 30%
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={6} sm={6} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div
                  className={styles["flex-between"]}
                  style={{ width: "100%", alignItems: "center" }}
                >
                  Courier Balance
                  <CardIcon color="#e0f2f1">
                    <Wallet size={20} color="#009688" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={styles["flex-items-center"]}
                style={{ gap: "8px" }}
              >
                <h1 className={styles.card_value}>৳ 2054</h1>
                <div className={cls(styles["card-analytics"])}>
                  <Minus />
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </section>
  );
};
