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
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { headers } from "../../../../pages/api";
import { API_ENDPOINTS } from "../../../../config/ApiEndpoints";

function formatDateToBST(date) {
  return date?.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });
}


const mapData = (data) => {
  const colorMapping = {
      Landing: "hsl(var(--primary))",
      Website: "hsl(var(--chart-1))",
      Phone: "hsl(var(--chart-2))",
      Social: "hsl(var(--chart-4))",
      Others: "hsl(var(--chart-5))"
  };

  return data.map((item) => ({
      order_source: 
          item.name === "Landing" ? "landing_page" :
          item.name === "Website" ? "website" :
          item.name === "Phone" ? "phone_call" :
          item.name === "Social" ? "social_media" :
          "others",
      value:`${item.value}%`,
      fill: colorMapping[item.name] || "hsl(var(--default))" // fallback color
  }));
};

function convertToPercentages(arr) {
  const total = arr.reduce((acc, item) => acc + item.value, 0);
  const result = arr.map(item => ({
    name: item.name,
    value: parseFloat(((item.value / total) * 100).toFixed(2)),
  }));
  return result;
}

const OrderSource = () => {
// const [customDateRange, setCustomDateRange] = useState({ startDate: null, endDate: null });
  const [cannel_date, setCannel_date] = useState('today');
const [cannelList, setCannelList] = useState({});
const [cannelRatio, setCannelRatio] = useState([]);

const handleFetchCannelList = useCallback(async () => {
        
  const params = {
      channel_status: cannel_date,
      // start_date:formatDateToBST(startDate),
      // end_date:formatDateToBST( endDate),

  }


  if (
      cannel_date === "custom" &&
      startDate !== null &&
      endDate !== null
  ) {
    try {
      let dataRes = await axios({
        method: "get",
        url: `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.DASHBOARD.PIH_CHART}`,
        headers: headers,
        params,
      });
      if (dataRes?.data?.success) {
          setCannelList(dataRes?.data?.data)

          
      }
    } catch (err) {
      // Handle the error here
    }
  } else if (
    cannel_date === "today" ||
    cannel_date == "yesterday" ||
    cannel_date === "weekly" ||
    cannel_date=== "monthly"
  ) {
    try {
      const params = {
          channel_status: cannel_date,
  
      }
      let dataRes = await axios({
        method: "get",
        url: `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.DASHBOARD.PIH_CHART}`,
        headers: headers,
        params,
      });
      console.log(dataRes)

      if (dataRes?.data?.success) {

          setCannelList(dataRes?.data?.data)
      }
    } catch (err) {
      // Handle the error here
    }
  }
}, [
  cannel_date, 
]);
const handleFetchCannelRatio = useCallback(async () => {
  
  const params = {
      phone: cannel_date,
      website: cannel_date,
      social: cannel_date,
      landing: cannel_date
  }
 

  if (
      cannel_date !== "custom"
  ) {
    try {
      let dataRes = await axios({
        method: "get",
        url: `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.DASHBOARD.CHANNEL_RATIO_STATISTICS}`,
        headers: headers,
        params,
      });
   

      if (dataRes?.data?.success) {
          setCannelRatio(dataRes?.data?.data)
      }
    } catch (err) {
      // Handle the error here
    }
  } 
}, [
  cannel_date
]);

useEffect(() => {
  handleFetchCannelList();
  handleFetchCannelRatio()

}, [handleFetchCannelList , handleFetchCannelRatio])
const newCannelList = Array.isArray(cannelList) ? cannelList?.filter(obj => obj.name !== "" && obj.name !== "Select Order Type") : [];
// const website = Array.isArray(cannelList) ? cannelList?.filter(obj => obj.name === 'Website') : [];
// const landing = Array.isArray(cannelList) ? cannelList?.filter(obj => obj.name === 'Landing') : [];
// const socal = Array.isArray(cannelList) ? cannelList?.filter(obj => obj.name === 'Social') : [];
// const phone = Array.isArray(cannelList) ? cannelList?.filter(obj => obj.name === 'Phone') : [];

const handleDateSelectorChange = (value, startDate, endDate) => {
  setCannel_date(value);
  // setCustomDateRange({ startDate, endDate });
};



const transformedData1 = convertToPercentages(newCannelList);

const transformedData = mapData(transformedData1);
console.log(`cannelRatio cannelList` , transformedData) 
  return (
    <Grid item xs={12} sm={6} lg={6}>
          <Card className={styles.dashboard_card}>
            <CardHeader className={cls(styles.performance_card_header)}>
              <CardTitle>Order Source</CardTitle>
              <DateSelector
                placeholder="Today"
                defaultValue="today"
                showCalender
              >
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last_7_days">Last 7 days</SelectItem>
                <SelectItem value="this_month">This month</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </DateSelector>
            </CardHeader>
            <CardContent>
              <div className={styles.order_source_content}>
                <div className={styles.metrics_container}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    {[
                      {
                        label: "Landing Page",
                        value: 7,
                        color: "hsl(var(--primary))",
                        percentage: "54%",
                      },
                      {
                        label: "Website",
                        value: 1,
                        color: "hsl(var(--chart-1))",
                        percentage: "8%",
                      },
                      {
                        label: "Phone Call",
                        value: 2,
                        color: "hsl(var(--chart-2))",
                        percentage: "15%",
                      },
                      {
                        label: "Social Media",
                        value: 3,
                        color: "hsl(var(--chart-4))",
                        percentage: "23%",
                      },
                    ].map(item => (
                      <Box className={styles["metric-item"]} key={item.label}>
                        <Box
                          className={styles["flex-center"]}
                          sx={{ gap: "0.5rem" }}
                        >
                          <Box
                            sx={{
                              height: "12px",
                              width: "12px",
                              borderRadius: "4px",
                              backgroundColor: item.color,
                            }}
                          />
                          <h1 className={styles.card_title}>{item.label}</h1>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.5rem",
                          }}
                        >
                          <span className={styles.metric_value}>
                            {item.value}
                          </span>
                          <span className={styles.metric_percentage}>
                            {item.percentage}
                          </span>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </div>
                <div className={styles.chart_container}>
                  <ChartContainer
                    config={{
                      order_source: {
                        label: "Order Source",
                      },
                      landing_page: {
                        label: "Landing Page",
                        color: "hsl(var(--primary))",
                      },
                      website: {
                        label: "Website",
                        color: "hsl(var(--chart-1))",
                      },
                      phone_call: {
                        label: "Phone Call",
                        color: "hsl(var(--chart-2))",
                      },
                      social_media: {
                        label: "Social Media",
                        color: "hsl(var(--chart-4))",
                      },
                    }}
                    style={{
                      height: "300px",
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart width={200} height={200}>
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                          data={[
                            {
                              order_source: "landing_page",
                              value: 7,
                              fill: "hsl(var(--primary))",
                            },
                            {
                              order_source: "website",
                              value: 1,
                              fill: "hsl(var(--chart-1))",
                            },
                            {
                              order_source: "phone_call",
                              value: 2,
                              fill: "hsl(var(--chart-2))",
                            },
                            {
                              order_source: "social_media",
                              value: 3,
                              fill: "hsl(var(--chart-4))",
                            },
                          ]}
                          dataKey="value"
                          nameKey="order_source"
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={100}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
  );
};

export default OrderSource;