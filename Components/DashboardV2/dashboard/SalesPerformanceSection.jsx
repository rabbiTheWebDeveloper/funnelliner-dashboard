import { Grid, Box } from "@mui/material";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card/card";
import { DateSelector } from "../components/date-selector/DateSelector";
import { SelectItem } from "../components/ui/select/select";
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
} from "../components/ui/chart/chart";
import styles from "../global.module.css";
import { cls } from "../lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Tooltip } from "../components/ui/tooltip/tooltip";
import { Button } from "../components/ui/button/button";
import { RefreshCcw } from "lucide-react";
import { useState, useEffect } from "react";

const MAX_DATA_POINTS = 50;

export const SalesPerformanceSection = () => {
  const [realtimeData, setRealtimeData] = useState(() => {
    // Initialize with MAX_DATA_POINTS of data
    const initialData = [];
    for (let i = 0; i < MAX_DATA_POINTS; i++) {
      initialData.push({
        time: `${i}:00`,
        visitors: Math.floor(Math.random() * (250 - 100) + 100),
      });
    }
    return initialData;
  });

  const [growth, setGrowth] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData(prevData => {
        const newVisitors = Math.floor(Math.random() * (250 - 100) + 100);
        const lastVisitors = prevData[prevData.length - 1].visitors;

        const growthPercent =
          ((newVisitors - lastVisitors) / lastVisitors) * 100;
        setGrowth(Math.round(growthPercent));

        // Create new array by removing first element and adding new one
        const nextHour = parseInt(prevData[prevData.length - 1].time) + 1;
        const newData = [
          ...prevData.slice(1),
          {
            time: `${nextHour}:00`,
            visitors: newVisitors,
          },
        ];

        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section>
      <Grid container spacing={2} sx={{ mt: 0 }}>
        <Grid item xs={12} sm={6} lg={6}>
          <Card className={styles.dashboard_card}>
            <CardHeader className={cls(styles.performance_card_header)}>
              <CardTitle>Sales Performance</CardTitle>
              <DateSelector placeholder="Today" defaultValue="today">
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="last_7_days">Last 7 days</SelectItem>
                <SelectItem value="last_30_days">Last 30 days</SelectItem>
                <SelectItem value="this_year">This year</SelectItem>
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
                  amount: {
                    label: "Amount",
                    color: "hsl(var(--primary))",
                  },
                }}
                style={{
                  height: "300px",
                }}
              >
                <AreaChart
                  data={[
                    { month: "January", amount: 186 },
                    { month: "February", amount: 305 },
                    { month: "March", amount: 237 },
                    { month: "April", amount: 73 },
                    { month: "May", amount: 209 },
                    { month: "June", amount: 214 },
                  ]}
                  margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                >
                  <XAxis
                    dataKey="month"
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
                    width={30}
                  />
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--foreground) / 0.2)"
                  />
                  <Area
                    strokeWidth={2}
                    dataKey="amount"
                    stroke="hsl(var(--primary))"
                    fillOpacity={0.6}
                    fill="hsl(var(--primary))"
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    cursor={{ stroke: "hsl(var(--primary))!important" }}
                  />
                </AreaChart>
              </ChartContainer>
              <Box
                className={styles["flex-center"]}
                sx={{ gap: "0.25rem", mt: 1, height: "100%" }}
              >
                <Box
                  sx={{
                    height: "12px",
                    width: "12px",
                    borderRadius: "4px",
                    backgroundColor: "hsl(var(--primary))",
                  }}
                ></Box>
                <h1 className={styles.card_title}>Amount</h1>
                <div
                  className={cls(
                    styles["card-analytics"],
                    styles["flex-end"],
                    styles.growth,
                    styles.small
                  )}
                >
                  <ArrowUp /> 45%
                </div>
              </Box>
            </CardContent>
          </Card>
        </Grid>

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

        <Grid item xs={12} sm={6} lg={4}>
          <Card className={styles.dashboard_card}>
            <CardHeader className={cls(styles.performance_card_header)}>
              <CardTitle>Realtime Visitors</CardTitle>
              <Button
                variant="outline"
                size="icon"
                className={cls(styles.small_button, "box-shadow-none")}
              >
                <RefreshCcw size={14} />
              </Button>
            </CardHeader>
            <CardContent>
              <div className={styles["flex-between"]}>
                <h1 className={styles.card_value}>
                  {realtimeData[realtimeData.length - 1].visitors}
                </h1>
                <div
                  className={cls(
                    styles["card-analytics"],
                    growth >= 0 ? styles.growth : styles.down
                  )}
                >
                  {growth >= 0 ? <ArrowUp /> : <ArrowDown />} {Math.abs(growth)}
                  %
                </div>
              </div>

              <ChartContainer
                config={{
                  visitors: {
                    label: "Active Visitors",
                    color: "hsl(var(--primary))",
                  },
                }}
              >
                <AreaChart
                  data={realtimeData}
                  margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    hide
                    dataKey="time"
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
                    domain={["auto", "auto"]} // This will help maintain consistent scale
                  />
                  <Area
                    dataKey="visitors"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                    isAnimationActive={false} // Disable default animation
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent />}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </Grid>

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
                  data={[
                    { name: "Kurti Combo Pack", visitors: 486 },
                    { name: "Eid Collection", visitors: 280 },
                    { name: "Summer Sale", visitors: 350 },
                    { name: "Winter Collection", visitors: 420 },
                  ]}
                  margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
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
                    dataKey="visitors"
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
                {[
                  { name: "Kurti Combo Pack", value: 486, growth: 45 },
                  { name: "Eid Collection", value: 280, growth: 30 },
                  { name: "Summer Sale", value: 350, growth: 25 },
                  { name: "Winter Collection", value: 420, growth: 35 },
                ].map((item, index) => (
                  <Grid item xs={6} key={item.name}>
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
                      <Tooltip title={item.name} placement="top">
                        <h1 className={cls(styles.card_title, styles.truncate)}>
                          {item.name}
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
                        <ArrowUp /> {item.growth}%
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
                  data={[
                    { hour: "12 AM", visitors: 120 },
                    { hour: "3 AM", visitors: 45 },
                    { hour: "6 AM", visitors: 85 },
                    { hour: "9 AM", visitors: 255 },
                    { hour: "12 PM", visitors: 380 },
                    { hour: "3 PM", visitors: 420 },
                    { hour: "6 PM", visitors: 520 },
                    { hour: "9 PM", visitors: 340 },
                    { hour: "11 PM", visitors: 180 },
                  ]}
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
                    dataKey="visitors"
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
                      <ArrowUp /> 45%
                    </div>
                  </Box>
                </Grid>

                <Grid item xs={6}>
                  <Box
                    className={styles["flex-center"]}
                    sx={{ gap: "0.25rem", height: "100%" }}
                  >
                    <Tooltip title="Peak Hour" placement="top">
                      <h1 className={cls(styles.card_title, styles.truncate)}>
                        Peak Hour: 6 PM
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
                      520 visitors
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
      </Grid>
    </section>
  );
};
