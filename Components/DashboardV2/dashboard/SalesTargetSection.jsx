import { cls } from "../lib/utils";
import { Grid, Box, Typography } from "@mui/material";
import styles from "../global.module.css";
import SalesTargetForm from "../components/sales-target-form/SalesTargetForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Button } from "../components/ui/button/button";
import Link from "next/link";
import CircularProgress from '@mui/material/CircularProgress';

export const SalesTargetSection = () => {
  const getColorByPercentage = (percentage, isTarget = false) => {
    const alpha = isTarget ? "/ 0.15" : "";
    if (percentage < 30) return `hsl(var(--destructive) ${alpha})`; // red
    if (percentage < 60) return `hsl(var(--warning) ${alpha})`; // orange
    if (percentage < 80) return `hsl(var(--success) ${alpha})`; // green
    return `hsl(var(--primary) ${alpha})`; // primary color
  };

  // Daily achievement percentage
  const dailyPercentage = (186 / 980) * 100;
  const monthlyPercentage = (9000 / 980) * 100;
  const customPercentage = (186 / 380) * 100;

  return (
    <section>
      <div className={cls(styles.header, styles["flex"])}>
        <Box className={cls(styles["flex-between"])} sx={{ width: 1 }}>
          <h1>Sales Target</h1>
          <Box
            sx={{ display: "flex", alignItems: "flex-end", gap: "0.5rem" }}
            className={styles["mobile-col"]}
          >
            <Link href="/sales-reports">
              <Button variant="outline" style={{ boxShadow: "none" }}>
                <span
                  style={{
                    borderBottom: "1px dotted hsl(var(--muted-foreground))",
                    lineHeight: "1",
                    color: "hsl(var(--foreground))",
                  }}
                >
                  View Reports
                </span>
              </Button>
            </Link>
            <SalesTargetForm />
          </Box>
        </Box>
      </div>

      <Grid container spacing={2} sx={{ mt: 0 }}>
        <Grid item xs={12} sm={4} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles["flex-between"]}>
                <h1 className={styles.card_value}>18%</h1>
              </div>
              <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={120}
                  thickness={4}
                  sx={{
                    color: getColorByPercentage(dailyPercentage, true),
                    position: 'absolute',
                  }}
                />
                <CircularProgress
                  variant="determinate"
                  value={dailyPercentage}
                  size={120}
                  thickness={4}
                  sx={{
                    color: getColorByPercentage(dailyPercentage),
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" component="div" color="text.primary">
                    {`${Math.round(dailyPercentage)}%`}
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sx={{ height: "fit-content" }}>
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
                        backgroundColor: getColorByPercentage(dailyPercentage),
                      }}
                    />
                    <h1 className={styles.card_title}>Achievement</h1>
                    <div
                      className={cls(
                        styles["card-analytics"],
                        styles["flex-end"],
                        styles.small
                      )}
                    >
                      186৳
                    </div>
                  </Box>
                </Grid>
                <Grid item xs={12} sx={{ height: "fit-content" }}>
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
                        backgroundColor: getColorByPercentage(
                          dailyPercentage,
                          true
                        ),
                      }}
                    />
                    <h1 className={styles.card_title}>Target</h1>
                    <div
                      className={cls(
                        styles["card-analytics"],
                        styles["flex-end"],
                        styles.small
                      )}
                    >
                      980৳
                    </div>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>Yesterday</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles["flex-between"]}>
                <h1 className={styles.card_value}>62%</h1>
              </div>
              <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={120}
                  thickness={4}
                  sx={{
                    color: getColorByPercentage(62, true),
                    position: 'absolute',
                  }}
                />
                <CircularProgress
                  variant="determinate"
                  value={62}
                  size={120}
                  thickness={4}
                  sx={{
                    color: getColorByPercentage(62),
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" component="div" color="text.primary">
                    62%
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sx={{ height: "fit-content" }}>
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
                        backgroundColor: getColorByPercentage(62),
                      }}
                    />
                    <h1 className={styles.card_title}>Achievement</h1>
                    <div
                      className={cls(
                        styles["card-analytics"],
                        styles["flex-end"],
                        styles.small
                      )}
                    >
                      250৳
                    </div>
                  </Box>
                </Grid>
                <Grid item xs={12} sx={{ height: "fit-content" }}>
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
                        backgroundColor: getColorByPercentage(62, true),
                      }}
                    />
                    <h1 className={styles.card_title}>Target</h1>
                    <div
                      className={cls(
                        styles["card-analytics"],
                        styles["flex-end"],
                        styles.small
                      )}
                    >
                      1000৳
                    </div>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>Monthly</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles["flex-between"]}>
                <h1 className={styles.card_value}>100%</h1>
              </div>
              <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={120}
                  thickness={4}
                  sx={{
                    color: getColorByPercentage(monthlyPercentage, true),
                    position: 'absolute',
                  }}
                />
                <CircularProgress
                  variant="determinate"
                  value={monthlyPercentage > 100 ? 100 : monthlyPercentage}
                  size={120}
                  thickness={4}
                  sx={{
                    color: getColorByPercentage(monthlyPercentage),
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" component="div" color="text.primary">
                    {`${Math.round(monthlyPercentage)}%`}
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sx={{ height: "fit-content" }}>
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
                        backgroundColor:
                          getColorByPercentage(monthlyPercentage),
                      }}
                    />
                    <h1 className={styles.card_title}>Achievement</h1>
                    <div
                      className={cls(
                        styles["card-analytics"],
                        styles["flex-end"],
                        styles.small
                      )}
                    >
                      9000৳
                    </div>
                  </Box>
                </Grid>
                <Grid item xs={12} sx={{ height: "fit-content" }}>
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
                        backgroundColor: getColorByPercentage(
                          monthlyPercentage,
                          true
                        ),
                      }}
                    />
                    <h1 className={styles.card_title}>Target</h1>
                    <div
                      className={cls(
                        styles["card-analytics"],
                        styles["flex-end"],
                        styles.small
                      )}
                    >
                      980৳
                    </div>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader
              className={styles["flex-between"]}
              style={{ flexDirection: "row" }}
            >
              <CardTitle>Custom Date</CardTitle>
              <h1 className={styles.card_title}>27-10-2024 - 31-10-2024</h1>
            </CardHeader>
            <CardContent>
              <div className={styles["flex-between"]}>
                <h1 className={styles.card_value}>49%</h1>
              </div>
              <Box sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={120}
                  thickness={4}
                  sx={{
                    color: getColorByPercentage(customPercentage, true),
                    position: 'absolute',
                  }}
                />
                <CircularProgress
                  variant="determinate"
                  value={customPercentage}
                  size={120}
                  thickness={4}
                  sx={{
                    color: getColorByPercentage(customPercentage),
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6" component="div" color="text.primary">
                    49%
                  </Typography>
                </Box>
              </Box>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sx={{ height: "fit-content" }}>
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
                        backgroundColor: getColorByPercentage(customPercentage),
                      }}
                    />
                    <h1 className={styles.card_title}>Achievement</h1>
                    <div
                      className={cls(
                        styles["card-analytics"],
                        styles["flex-end"],
                        styles.small
                      )}
                    >
                      186৳
                    </div>
                  </Box>
                </Grid>
                <Grid item xs={12} sx={{ height: "fit-content" }}>
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
                        backgroundColor: getColorByPercentage(
                          customPercentage,
                          true
                        ),
                      }}
                    />
                    <h1 className={styles.card_title}>Target</h1>
                    <div
                      className={cls(
                        styles["card-analytics"],
                        styles["flex-end"],
                        styles.small
                      )}
                    >
                      380৳
                    </div>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </section>
  );
};
