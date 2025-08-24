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
import axios from "axios";
import { useEffect, useState } from "react";
import { shopId } from "../../../../pages/api";


const LandingPageVisitor = () => {

  const [overview_data, setOverview_data] = useState("today");
  const [reportData, setReportData] = useState([]);
  const [customDate, setCustomDate] = useState(new Date());
  const [onlineVisitors, setOnlineVisitors] = useState(5);
  const [fetching, setFetching] = useState(false);

  const chart_data = {
    shopId: shopId,
    dateType: overview_data,
    ...(overview_data === "custom" && {
      customDate: customDate.toISOString().split("T")[0],
    }),
  };
  useEffect(() => {
    axios
      .post(
        "https://funnelliner-report-api.vercel.app/api/v1/shop/landing-page/get-visitor",
        chart_data
      )
      .then(res => {
        // console.log(res.data.data)
        setReportData(res.data.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, [overview_data, customDate]);

  // console.log("reportData", reportData);
  return (
    <Grid item xs={12} sm={6} lg={4}>
    <Card className={styles.dashboard_card}>
      <CardHeader className={cls(styles.performance_card_header)}>
        <CardTitle>Landing Page Visitors</CardTitle>
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
          <BarChart
            data={reportData}
            margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="landingPageSlug"
              tick={{
                fontSize: 12,
                fontFamily: "var(--font-inter)",
              }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{
                fontSize: 12,
                fontFamily: "var(--font-inter)",
              }}
            />
            <Bar
              dataKey="totalCount"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
          </BarChart>
        </ChartContainer>
        <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
          {reportData.map((item, index) => (
            <Grid item xs={6} key={item._id}>
              <Box
                className={styles["flex-center"]}
                sx={{ gap: "0.25rem", height: "100%" }}
              >
                <Box
                  sx={{
                    height: "12px",
                    width: "12px",
                    minWidth: "12px",
                    borderRadius: "4px",
                    backgroundColor: "hsl(var(--primary))",
                  }}
                ></Box>
                <Tooltip title={item.landingPageSlug} placement="top">
                  <h1 className={cls(styles.card_title, styles.truncate)}>
                    {item.landingPageSlug}
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
                  <ArrowUp /> {item.totalCount}%
                </div>
              </Box>
            </Grid>
          ))}
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
              gap: "0.25rem",
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
              240 online
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

export default LandingPageVisitor;