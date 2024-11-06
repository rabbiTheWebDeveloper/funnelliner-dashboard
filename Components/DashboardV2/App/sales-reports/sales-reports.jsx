import { Box, Container } from "@mui/material";
import { cls } from "../../lib/utils";
import globalStyles from "../../global.module.css";
import { DateSelector } from "../../components/date-selector/DateSelector";
import { SelectItem } from "../../components/ui/select/select";
import { Card, CardContent } from "../../components/ui/card/card";
import { Button } from "../../components/ui/button/button";
import { FileDown, Printer } from "lucide-react";
import { Badge } from "../../components/ui/badge/badge";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import styles from "../reports/styles.module.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu/dropdown-menu";
import { Layout } from "../../layout";

export const SalesReportTabs = () => {
  const getColorByPercentage = percentage => {
    if (percentage < 30) return `hsl(var(--destructive))`; // red
    if (percentage < 60) return `hsl(var(--warning))`; // orange
    if (percentage < 80) return `hsl(var(--success))`; // green
    return `hsl(var(--primary))`; // primary color
  };

  const reportData = [
    {
      id: 1,
      date: "2024-03-20",
      target: 150000,
      achievement: 27000,
      percentage: 18,
    },
    {
      id: 2,
      date: "2024-03-21",
      target: 150000,
      achievement: 93000,
      percentage: 62,
    },
    {
      id: 3,
      date: "2024-03-22",
      target: 150000,
      achievement: 120000,
      percentage: 80,
    },
    {
      id: 4,
      date: "2024-03-23",
      target: 150000,
      achievement: 150000,
      percentage: 100,
    },
  ];

  const exportToExcel = () => {
    const exportData = reportData.map(row => ({
      Date: row.date,
      "Target Amount": `BDT ${row.target}`,
      "Achievement Amount": `BDT ${row.achievement}`,
      "Achievement %": `${row.percentage}%`,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Target Reports");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "sales_target_reports.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF("landscape", "pt", "a4");

    const tableData = reportData.map(row => [
      row.date,
      `BDT ${row.target}`,
      `BDT ${row.achievement}`,
      `${row.percentage}%`,
    ]);

    autoTable(doc, {
      head: [["Date", "Target Amount", "Achievement Amount", "Achievement %"]],
      body: tableData,
      theme: "plain",
      styles: {
        fontSize: 10,
        cellPadding: 8,
        font: "helvetica",
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { cellWidth: 100 }, // Date
        1: { cellWidth: 150 }, // Target
        2: { cellWidth: 150 }, // Achievement
        3: { cellWidth: 100 }, // Percentage
      },
      headStyles: {
        fillColor: [245, 245, 245],
        textColor: 80,
        fontSize: 10,
        fontStyle: "bold",
        font: "helvetica",
        halign: "left",
        cellPadding: 8,
      },
      didDrawPage: function (data) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Sales Target Reports", data.settings.margin.left, 30);
      },
    });

    doc.save("sales_target_reports.pdf");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Layout>
      <Container>
        <section>
          <div className={cls(globalStyles.header, globalStyles["flex"])}>
            <Box
              className={cls(globalStyles["flex-between"])}
              sx={{ gap: 1, width: "100%" }}
            >
              <h1>Sales Target Reports</h1>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={styles.dropdownMenuButton}
                    >
                      <FileDown />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={exportToExcel}>
                      <FileDown />
                      Export to Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={exportToPDF}>
                      <FileDown />
                      Export to PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handlePrint}>
                      <Printer />
                      Print
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DateSelector
                  placeholder="This Month"
                  defaultValue="this-month"
                >
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="september-24">September - 24</SelectItem>
                  <SelectItem value="august-24">August - 24</SelectItem>
                  <SelectItem value="july-24">July - 24</SelectItem>
                </DateSelector>
              </Box>
            </Box>
          </div>

          <Card className={globalStyles.dashboard_card}>
            <CardContent>
              <Box sx={{ overflow: "auto" }}>
                <table
                  className={cls(
                    globalStyles.card_table,
                    globalStyles.table_highlight
                  )}
                >
                  <thead>
                    <tr
                      className={cls(
                        globalStyles.card_table_item,
                        globalStyles.card_table_header
                      )}
                    >
                      <th className={globalStyles.card_table_cell}>
                        <h1 className={globalStyles.card_title}>Date</h1>
                      </th>
                      <th className={globalStyles.card_table_cell}>
                        <h1 className={globalStyles.card_title}>
                          Target Amount
                        </h1>
                      </th>
                      <th className={globalStyles.card_table_cell}>
                        <h1 className={globalStyles.card_title}>
                          Achievement Amount
                        </h1>
                      </th>
                      <th
                        className={cls(
                          globalStyles.card_table_cell,
                          globalStyles.right
                        )}
                      >
                        <h1 className={globalStyles.card_title}>
                          Achievement %
                        </h1>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map(row => (
                      <tr key={row.id} className={globalStyles.card_table_item}>
                        <td className={globalStyles.card_table_cell}>
                          <h1 className={globalStyles.card_title}>
                            {row.date}
                          </h1>
                        </td>
                        <td className={globalStyles.card_table_cell}>
                          <h1 className={globalStyles.card_title}>
                            BDT {row.target}
                          </h1>
                        </td>
                        <td className={globalStyles.card_table_cell}>
                          <h1 className={globalStyles.card_title}>
                            BDT {row.achievement}
                          </h1>
                        </td>
                        <td
                          className={cls(
                            globalStyles.card_table_cell,
                            globalStyles.right
                          )}
                        >
                          <Badge
                            style={{
                              backgroundColor: getColorByPercentage(
                                row.percentage
                              ),
                              color: "white",
                            }}
                          >
                            {row.percentage}%
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
            </CardContent>
          </Card>
        </section>
      </Container>
    </Layout>
  );
};
