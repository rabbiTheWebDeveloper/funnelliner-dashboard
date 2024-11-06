import { Box, Grid } from "@mui/material";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardIcon,
} from "../components/ui/card/card";
import { DateSelector } from "../components/date-selector/DateSelector";
import { SelectItem } from "../components/ui/select/select";
import { ArrowUp, ArrowDown, Minus, Eye, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import styles from "../global.module.css";
import { cls } from "../lib/utils";

export const SalesAnalyticsSection = () => {
  return (
    <section>
      <div className={cls(styles.header, styles["flex"])}>
        <Box className={cls(styles["flex-between"])} sx={{ gap: 1, width: '100%' }}>
          <h1>Sales Analytics</h1>
          <DateSelector placeholder="Last 7 Days" defaultValue="7d">
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </DateSelector>
        </Box>
      </div>

      <Grid container spacing={2} sx={{ mt: 0 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div className={styles["flex-between"]} style={{ width: '100%', alignItems: 'center' }}>
                  Average Store Views Per Day
                  <CardIcon color="#e3f2fd">
                    <Eye size={20} color="#2196f3" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles["flex-items-center"]} style={{ gap: '8px' }}>
                <h1 className={styles.card_value}>20808</h1>
                <div className={cls(styles["card-analytics"], styles.growth)}>
                  <ArrowUp /> 25%
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div className={styles["flex-between"]} style={{ width: '100%', alignItems: 'center' }}>
                  Average Orders Per Day
                  <CardIcon color="#e8f5e9">
                    <ShoppingCart size={20} color="#4caf50" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles["flex-items-center"]} style={{ gap: '8px' }}>
                <h1 className={styles.card_value}>808</h1>
                <div className={cls(styles["card-analytics"])}>
                  <Minus />
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div className={styles["flex-between"]} style={{ width: '100%', alignItems: 'center' }}>
                  Average Order Value
                  <CardIcon color="#fff3e0">
                    <DollarSign size={20} color="#ff9800" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles["flex-items-center"]} style={{ gap: '8px' }}>
                <h1 className={styles.card_value}>৳ 406024</h1>
                <div className={cls(styles["card-analytics"], styles.growth)}>
                  <ArrowUp /> 30%
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>
                <div className={styles["flex-between"]} style={{ width: '100%', alignItems: 'center' }}>
                  Average Sales per Day
                  <CardIcon color="#fce4ec">
                    <TrendingUp size={20} color="#e91e63" />
                  </CardIcon>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles["flex-items-center"]} style={{ gap: '8px' }}>
                <h1 className={styles.card_value}>৳ 2054</h1>
                <div className={cls(styles["card-analytics"], styles.down)}>
                  <ArrowDown /> 30%
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </section>
  );
};
