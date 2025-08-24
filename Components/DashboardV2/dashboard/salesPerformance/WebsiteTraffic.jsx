import { Grid, Box } from "@mui/material";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card/card";
import { DateSelector } from "../../components/date-selector/DateSelector";
import { SelectItem } from "../../components/ui/select/select";
import {
  AreaChart,
  CartesianGrid,
  Area,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart/chart";
import styles from "../../global.module.css";
import { cls } from "../../lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Tooltip } from "../../components/ui/tooltip/tooltip";
import { Button } from "../../components/ui/button/button";
import { RefreshCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { visitorUrl } from "../../../../constant/constant";
import axios from "axios";
import { shopId } from "../../../../pages/api";

const formatAmPm = (data) => {
  return data.map(item => {
      const period = item.hour < 12 ? "AM" : "PM";
      const hour = item.hour % 12 || 12; // Convert 0 -> 12, 13 -> 1, etc.
      return {
          hour: `${hour} ${period}`,
          count: item.count
      };
  });
};


const findPeakHour = (data=[]) => {
  // Find the item with the maximum count
  const peak = data.reduce((max, item) => (item.count > max.count ? item : max), data[0]);
  
  // Format the hour to AM/PM
  const period = peak?.hour < 12 ? "AM" : "PM";
  const hour = peak?.hour % 12 || 12; // Convert 0 -> 12, 13 -> 1, etc.
  
  return {
      hour: `${hour} ${period}`,
      count: peak?.count
  };
};
const WebsiteTraffic = () => {
  const [overview_data, setOverview_data] = useState("today");
  const [reportData, setReportData] = useState({});
  const [customDate, setCustomDate] = useState(new Date());
  const [onlineVisitors, setOnlineVisitors] = useState(5);
  const chart_data = {
    shopId: shopId,
    dateType: overview_data,
    ...(overview_data === "custom" && {
      customDate: customDate.toISOString().split("T")[0],
    }),
  };
  useEffect(() => {
    axios
      .post(`${visitorUrl}shop/get-visitor`, chart_data)
      .then(res => {
        // console.log(res.data.data);
        setReportData(res.data.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [overview_data, customDate]);

  const fetchVisitorData = async () => {
    try {
      const response = await axios.get(
        `${visitorUrl}shop-current-visit/active-users/${shopId}`
      );
      const { data } = response.data;
      // console.log("data", data);
      // Safely handle the online visitor count
      setOnlineVisitors(data.currentVisitors ?? 0);
    } catch (error) {
      console.error("Error fetching visitor data:", error);

      // Optional: Set visitors to 0 if there's an error
      setOnlineVisitors(0);
    }
  };

  useEffect(() => {
    fetchVisitorData();
  }, []);
  // console.log("reportData", reportData);
  return (
    <Grid item xs={12} sm={6} lg={4}>
    <Card className={styles.dashboard_card}>
      <CardHeader className={cls(styles.performance_card_header)}>
        <CardTitle>Website Traffic</CardTitle>
        <DateSelector
          placeholder="Today"
          defaultValue="today"
          showCalender
        >
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="yesterday">Yesterday</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </DateSelector>
      </CardHeader>
      <CardContent
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <ChartContainer
          config={{
            visitors: {
              label: "Visitors",
              color: "hsl(var(--primary))",
            },
          }}
        >
          <AreaChart
            data={formatAmPm(reportData.hourlyCounts || [])}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="hour"
              tick={{
                fontSize: 12,
                fontFamily: "var(--font-inter)",
              }}
            />
            <YAxis
              tick={{
                fontSize: 12,
                fontFamily: "var(--font-inter)",
              }}
            />
            <Area
              dataKey="count"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.6}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
          </AreaChart>
        </ChartContainer>
        <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
          <Grid item xs={6}>
            <Box
              className={styles["flex-center"]}
              sx={{ gap: "0.25rem", height: "100%" }}
            >
              <Box
                sx={{
                  height: "12px",
                  width: "12px",
                  borderRadius: "4px",
                  backgroundColor: "hsl(var(--primary))",
                }}
              ></Box>
              <Tooltip title="Total Visitors" placement="top">
                <h1 className={cls(styles.card_title, styles.truncate)}>
                  Total Visitors
                </h1>
              </Tooltip>
              <div
                className={cls(
                  styles["card-analytics"],
                  styles["flex-end"],
                  styles.growth,
                  styles.small
                )}
              >
                {/* <ArrowUp /> 45% */}
                {reportData?.totalCount}
              </div>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box
              className={styles["flex-center"]}
              sx={{ gap: "0.25rem", height: "100%" }}
            >
              <Tooltip title={findPeakHour(reportData?.hourlyCounts)?.hour} placement="top">
                <h1 className={cls(styles.card_title, styles.truncate)}>
                  Peak Hour: {findPeakHour(reportData?.hourlyCounts)?.hour}
                </h1>
              </Tooltip>
              <div
                className={cls(
                  styles["card-analytics"],
                  styles["flex-end"],
                  styles.growth,
                  styles.small
                )}
              >
                {findPeakHour(reportData.hourlyCounts).count} visitors
              </div>
            </Box>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            mt: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "hsl(var(--primary))",
              padding: "0.5rem",
              borderRadius: "var(--radius)",
              backgroundColor: "#e3ede4",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#138118",
                borderRadius: "50%",
                width: "12px",
                height: "12px",
              }}
            ></Box>
            <h1
              className={styles.card_title}
              style={{ color: "#138118" }}
            >
              380 online
            </h1>
          </Box>
          <Button
            variant="outline"
            size="icon"
            className={cls(styles.small_button, "box-shadow-none")}
          >
            <RefreshCcw size={14} />
          </Button>
        </Box>
      </CardContent>
    </Card>
  </Grid>
  );
};

export default WebsiteTraffic;