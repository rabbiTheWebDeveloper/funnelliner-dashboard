import { Box, Grid } from "@mui/material";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card/card";
import { cls } from "../lib/utils";
import { Phone, User } from "lucide-react";
import { Tooltip } from "recharts";
import { Badge } from "../components/ui/badge/badge";
import styles from "../global.module.css";
export const OrderAnalyticsSection = () => {
  return (
    <section>
      <div className={cls(styles.header, styles["flex"])}>
        <Box className={cls(styles["flex-between"])} sx={{ width: 1 }}>
          <h1>Order Analytics</h1>
        </Box>
      </div>

      <Grid container spacing={2} sx={{ mt: 0 }}>
        <Grid item xs={12} sm={6} lg={6}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>Recent Order</CardTitle>
            </CardHeader>
            <CardContent>
              <Box sx={{ overflow: "auto", maxHeight: "30rem" }}>
                <table
                  className={cls(styles.card_table, styles.table_highlight)}
                >
                  <thead>
                    <tr
                      className={cls(
                        styles.card_table_item,
                        styles.card_table_header
                      )}
                    >
                      <th
                        className={styles.card_table_cell}
                        style={{
                          whiteSpace: "nowrap",
                          paddingRight: "1rem",
                        }}
                      >
                        <h1 className={styles.card_title}>Order No & Date</h1>
                      </th>
                      <th
                        className={styles.card_table_cell}
                        style={{
                          whiteSpace: "nowrap",
                          paddingRight: "3.5rem",
                        }}
                      >
                        <h1 className={styles.card_title}>Customer Info</h1>
                      </th>
                      <th
                        className={styles.card_table_cell}
                        style={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        <h1 className={styles.card_title}>Product Info</h1>
                      </th>
                      <th
                        className={styles.card_table_cell}
                        style={{
                          whiteSpace: "nowrap",
                          paddingRight: "1rem",
                        }}
                      >
                        <h1 className={styles.card_title}>Total Price</h1>
                      </th>
                      <th
                        className={cls(
                          styles.card_table_cell,
                          styles.small,
                          styles.right
                        )}
                      >
                        <h1 className={styles.card_title}>Status</h1>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 10 }).map((_, index) => (
                      <tr className={styles.card_table_item}>
                        <td className={styles.card_table_cell}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.5,
                            }}
                          >
                            <h1
                              className={styles.card_title}
                              style={{
                                color: "hsl(var(--muted-foreground))",
                              }}
                            >
                              #7284930010
                            </h1>
                            <h1 className={styles.card_title}>27-10-2024</h1>
                          </Box>
                        </td>
                        <td className={styles.card_table_cell}>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.5,
                            }}
                          >
                            <h1 className={styles.card_title}>
                              <div
                                className={cls(
                                  styles["flex"],
                                  styles["order-customer-info"]
                                )}
                              >
                                <User />
                                M.H. Neshad
                              </div>
                            </h1>
                            <h1 className={styles.card_title}>
                              <a
                                href="tel:+8801771704439"
                                className={cls(
                                  styles["flex"],
                                  styles["order-customer-info"]
                                )}
                              >
                                <Phone />
                                01771704439
                              </a>
                            </h1>
                          </Box>
                        </td>

                        <td className={styles.card_table_cell}>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 0.5,
                            }}
                          >
                            <h1
                              className={cls(
                                styles.card_title,
                                styles.card_title_truncate
                              )}
                            >
                              <Tooltip
                                content="3 Set Kurti Combo Package"
                                placement="top"
                              >
                                <span className={styles.card_title_truncate}>
                                  3 Set Kurti Combo Package
                                </span>
                              </Tooltip>
                            </h1>
                            <Badge>27</Badge>
                          </Box>
                        </td>
                        <td
                          className={cls(styles.card_table_cell, styles.small)}
                        >
                          <h1 className={styles.card_title}>৳ 42500</h1>
                        </td>
                        <td
                          className={cls(styles.card_table_cell, styles.right)}
                        >
                          <Badge variant="outline">Pending</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={6}>
          <Card className={styles.dashboard_card}>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <Box sx={{ overflow: "auto", maxHeight: "30rem" }}>
                <table
                  className={cls(styles.card_table, styles.table_highlight)}
                >
                  <thead>
                    <tr
                      className={cls(
                        styles.card_table_item,
                        styles.card_table_header
                      )}
                    >
                      <th
                        className={cls(styles.card_table_cell)}
                        style={{
                          whiteSpace: "nowrap",
                          paddingRight: "1rem",
                        }}
                      >
                        <h1 className={styles.card_title}>Product Info</h1>
                      </th>
                      <th
                        className={styles.card_table_cell}
                        style={{
                          whiteSpace: "nowrap",
                          paddingRight: "3.5rem",
                        }}
                      >
                        <h1 className={styles.card_title}>Total Sold</h1>
                      </th>

                      <th
                        className={cls(
                          styles.card_table_cell,
                          styles["whitespace-nowrap"]
                        )}
                      >
                        <h1 className={styles.card_title}>Available Stock</h1>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 10 }).map((_, index) => (
                      <tr className={styles.card_table_item}>
                        <td className={styles.card_table_cell}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <figure className={styles.top_product_image}>
                              <img
                                src="https://cdn-s3.funnelliner.com/media/main-image/1637/O7Eh4Z1cmdkBSwuWNAK4ApLlvxwc1Ov38hlrL1gv.jpg"
                                alt=""
                              />
                            </figure>
                            <h1
                              className={cls(
                                styles.card_title,
                                styles["whitespace-nowrap"]
                              )}
                              style={{ paddingRight: "2rem" }}
                            >
                              3 Set Kurti Combo Package
                            </h1>
                          </Box>
                        </td>
                        <td className={styles.card_table_cell}>
                          <Badge>35098</Badge>
                        </td>
                        <td
                          className={cls(styles.card_table_cell)}
                        >
                          <h1 className={styles.card_title}>52526</h1>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </section>
  );
};
