import { Box } from "@mui/material";
import { cls } from "../../lib/utils";
import globalStyles from "../../global.module.css";
import { DateSelector } from "../../components/date-selector/DateSelector";
import { SelectItem } from "../../components/ui/select/select";
import { Card, CardContent } from "../../components/ui/card/card";
import { Input } from "../../components/ui/input/input";
import { Dialog } from "../../components/ui/dialog/dialog";
import { Textarea } from "../../components/ui/textarea/textarea";
import { Button } from "../../components/ui/button/button";
import { useState } from "react";
import { MessageSquare, FileDown, Printer } from "lucide-react";
import { Tooltip } from "../../components/ui/tooltip/tooltip";
import { Badge } from "../../components/ui/badge/badge";
import styles from "./styles.module.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu/dropdown-menu";

export const ReportTabs = () => {
  const [noteDialog, setNoteDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState({ id: null, note: "" });
  const [rowValues, setRowValues] = useState({});

  const reportData = [
    {
      id: 1,
      date: "2024-03-20",
      productName: "3 Set Kurti Combo Package",
      receiveOrder: { qt: 100, amount: 150000 },
      confirmedOrder: { qt: 80, amount: 120000 },
      productCost: 80000,
      fixedCost: 20000,
      adSpend: 5000,
      return: 2000,
      profit: { percent: 10.83, amount: 13000 },
      note: "Initial campaign performed well",
    },
    {
      id: 2,
      date: "2024-03-21",
      productName: "3 Set Kurti Combo Package",
      receiveOrder: { qt: 200, amount: 250000 },
      confirmedOrder: { qt: 180, amount: 220000 },
      productCost: 100000,
      fixedCost: 21000,
      adSpend: 3000,
      return: 200,
      profit: { percent: 10.83, amount: 13000 },
      note: "Initial campaign performed well",
    },
    {
      id: 3,
      date: "2024-03-22",
      productName: "3 Set Kurti Combo Package",
      receiveOrder: { qt: 40, amount: 50000 },
      confirmedOrder: { qt: 30, amount: 35000 },
      productCost: 30000,
      fixedCost: 10000,
      adSpend: 3000,
      return: 200,
      profit: { percent: 10.83, amount: 13000 },
      note: "Initial campaign performed well",
    },
    {
      id: 4,
      date: "2024-03-23",
      productName: "3 Set Kurti Combo Package",
      receiveOrder: { qt: 600, amount: 750000 },
      confirmedOrder: { qt: 500, amount: 650000 },
      productCost: 80000,
      fixedCost: 20000,
      adSpend: 3000,
      return: 200,
      profit: { percent: 10.83, amount: 13000 },
      note: "Initial campaign performed well",
    },
    {
      id: 5,
      date: "2024-03-24",
      productName: "3 Set Kurti Combo Package",
      receiveOrder: { qt: 300, amount: 375000 },
      confirmedOrder: { qt: 250, amount: 325000 },
      productCost: 60000,
      fixedCost: 15000,
      adSpend: 5000,
      return: 2000,
      profit: { percent: 10.83, amount: 13000 },
      note: "Initial campaign performed well",
    },
    // Add more sample data as needed
  ];

  const handleNoteClick = (id, note) => {
    setSelectedNote({ id, note });
    setNoteDialog(true);
  };

  const handleNoteSave = () => {
    setNoteDialog(false);
  };

  const calculateProfit = (confirmedAmount, fixedCost, adSpend) => {
    const totalCost = Number(fixedCost) + Number(adSpend);
    const profitAmount = Number(confirmedAmount) - totalCost;
    const profitPercentage =
      totalCost > 0 ? ((profitAmount / totalCost) * 100).toFixed(2) : 0;

    return {
      amount: profitAmount,
      percent: profitPercentage,
    };
  };

  const handleValueChange = (rowId, field, value) => {
    setRowValues(prev => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [field]: value,
      },
    }));
  };

  const getValue = (rowId, field, originalValue) => {
    return rowValues[rowId]?.[field] ?? originalValue;
  };

  const exportToExcel = () => {
    const exportData = reportData.map(row => ({
      Date: row.date,
      "Product Name": row.productName,
      "Receive Order Quantity": row.receiveOrder.qt,
      "Receive Order Amount": row.receiveOrder.amount,
      "Confirmed Order Quantity": row.confirmedOrder.qt,
      "Confirmed Order Amount": row.confirmedOrder.amount,
      "Product Cost": row.productCost,
      "Fixed Cost": getValue(row.id, "fixedCost", row.fixedCost),
      "Ad Spend": getValue(row.id, "adSpend", row.adSpend),
      Return: row.return,
      "Profit %": calculateProfit(
        row.confirmedOrder.amount,
        getValue(row.id, "fixedCost", row.fixedCost),
        getValue(row.id, "adSpend", row.adSpend)
      ).percent,
      "Profit Amount": calculateProfit(
        row.confirmedOrder.amount,
        getValue(row.id, "fixedCost", row.fixedCost),
        getValue(row.id, "adSpend", row.adSpend)
      ).amount,
      Note: row.note,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Profit Reports");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(data, "profit_reports.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF('landscape', 'pt', 'a4');
    
    const tableData = reportData.map(row => [
      row.date,
      row.productName,
      `Qt: ${row.receiveOrder.qt}\nAmount: ${row.receiveOrder.amount}`,
      `Qt: ${row.confirmedOrder.qt}\nAmount: ${row.confirmedOrder.amount}`,
      `BDT ${row.productCost}`,
      `BDT ${getValue(row.id, "fixedCost", row.fixedCost)}`,
      `BDT ${getValue(row.id, "adSpend", row.adSpend)}`,
      `BDT ${row.return}`,
      `${calculateProfit(
        row.confirmedOrder.amount,
        getValue(row.id, "fixedCost", row.fixedCost),
        getValue(row.id, "adSpend", row.adSpend)
      ).percent}%\nBDT ${calculateProfit(
        row.confirmedOrder.amount,
        getValue(row.id, "fixedCost", row.fixedCost),
        getValue(row.id, "adSpend", row.adSpend)
      ).amount}`,
      row.note
    ]);

    autoTable(doc, {
      head: [[
        'Date',
        'Product Name',
        'Receive Order',
        'Confirmed Order',
        'Product Cost',
        'Fixed Cost',
        'Ad Spend',
        'Return',
        'Profit',
        'Note'
      ]],
      body: tableData,
      theme: 'plain',
      styles: {
        fontSize: 8,
        cellPadding: 4,
        font: 'helvetica',
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      columnStyles: {
        0: { cellWidth: 60 },  // Date
        1: { cellWidth: 100 }, // Product Name
        2: { cellWidth: 70 },  // Receive Order
        3: { cellWidth: 70 },  // Confirmed Order
        4: { cellWidth: 60 },  // Product Cost
        5: { cellWidth: 60 },  // Fixed Cost
        6: { cellWidth: 60 },  // Ad Spend
        7: { cellWidth: 60 },  // Return
        8: { cellWidth: 70 },  // Profit
        9: { cellWidth: 100 }, // Note
      },
      headStyles: {
        fillColor: [245, 245, 245], // Light gray background
        textColor: 80, // Dark gray text
        fontSize: 8,
        fontStyle: 'bold',
        font: 'helvetica',
        halign: 'left',
        cellPadding: 4,
      },
      didDrawPage: function(data) {
        // Add header
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Profit Reports', data.settings.margin.left, 30);
      },
      didDrawCell: function(data) {
        // Add bottom border to each cell
        if (data.cell.section === 'body') {
          const { x, y, width, height } = data.cell;
          doc.setDrawColor(200, 200, 200);
          doc.line(x, y + height, x + width, y + height);
        }
      },
    });

    doc.save('profit_reports.pdf');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section>
      <div className={cls(globalStyles.header, globalStyles["flex"])}>
        <Box
          className={cls(globalStyles["flex-between"])}
          sx={{ gap: 1, width: "100%" }}
        >
          <h1>Profit Reports</h1>
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
              placeholder="Last 7 Days"
              defaultValue="7d"
              showCalender
            >
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
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
                globalStyles.table_highlight,
                "profit-report-table"
              )}
            >
              <thead>
                <tr
                  className={cls(
                    globalStyles.card_table_item,
                    globalStyles.card_table_header
                  )}
                >
                  <th
                    className={globalStyles.card_table_cell}
                    style={{
                      whiteSpace: "nowrap",
                      paddingRight: "1rem",
                    }}
                  >
                    <h1 className={globalStyles.card_title}>Date</h1>
                  </th>
                  <th
                    className={globalStyles.card_table_cell}
                    style={{
                      whiteSpace: "nowrap",
                      paddingRight: "1rem",
                    }}
                  >
                    <h1 className={globalStyles.card_title}>Product Name</h1>
                  </th>
                  <th
                    className={globalStyles.card_table_cell}
                    style={{
                      whiteSpace: "nowrap",
                      paddingRight: "1rem",
                    }}
                  >
                    <h1 className={globalStyles.card_title}>Receive Order</h1>
                  </th>
                  <th
                    className={globalStyles.card_table_cell}
                    style={{
                      whiteSpace: "nowrap",
                      paddingRight: "1rem",
                    }}
                  >
                    <h1 className={globalStyles.card_title}>Confirmed Order</h1>
                  </th>
                  <th
                    className={globalStyles.card_table_cell}
                    style={{
                      whiteSpace: "nowrap",
                      paddingRight: "1rem",
                    }}
                  >
                    <h1 className={globalStyles.card_title}>Product Cost</h1>
                  </th>
                  <th
                    className={globalStyles.card_table_cell}
                    style={{
                      whiteSpace: "nowrap",
                      paddingRight: "1rem",
                    }}
                  >
                    <h1 className={globalStyles.card_title}>Fixed Cost</h1>
                  </th>
                  <th
                    className={globalStyles.card_table_cell}
                    style={{
                      whiteSpace: "nowrap",
                      paddingRight: "1rem",
                    }}
                  >
                    <h1 className={globalStyles.card_title}>Ad Spend</h1>
                  </th>
                  <th
                    className={globalStyles.card_table_cell}
                    style={{
                      whiteSpace: "nowrap",
                      paddingRight: "1rem",
                    }}
                  >
                    <h1 className={globalStyles.card_title}>Return</h1>
                  </th>
                  <th
                    className={globalStyles.card_table_cell}
                    style={{
                      whiteSpace: "nowrap",
                      paddingRight: "1rem",
                    }}
                  >
                    <h1 className={globalStyles.card_title}>Profit</h1>
                  </th>
                  <th
                    className={cls(
                      globalStyles.card_table_cell,
                      globalStyles.right
                    )}
                    style={{
                      whiteSpace: "nowrap",
                      paddingRight: "1rem",
                    }}
                  >
                    <h1 className={globalStyles.card_title}>Note</h1>
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportData.map(row => (
                  <tr key={row.id} className={globalStyles.card_table_item}>
                    <td>
                      <h1
                        className={cls(
                          globalStyles.card_title,
                          globalStyles.truncate_alt
                        )}
                        style={{
                          paddingRight: "1rem",
                        }}
                      >
                        {row.date}
                      </h1>
                    </td>
                    <td>
                      <Tooltip
                        title={row.productName}
                        placement="top"
                        className={styles.tooltipHidden}
                      >
                        <h1
                          className={cls(
                            globalStyles.card_title,
                            globalStyles.truncate,
                            "pdf-full-text"
                          )}
                        >
                          {row.productName}
                        </h1>
                      </Tooltip>
                    </td>
                    <td>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexDirection: "column",
                        }}
                      >
                        <h1
                          className={cls(
                            globalStyles.card_title,
                            globalStyles["flex"]
                          )}
                          style={{
                            gap: "0.25rem",
                          }}
                        >
                          <span
                            style={{ color: "hsl(var(--muted-foreground))" }}
                          >
                            Qt:
                          </span>
                          {row.receiveOrder.qt}
                        </h1>
                        <h1
                          className={cls(
                            globalStyles.card_title,
                            globalStyles["flex"]
                          )}
                          style={{
                            gap: "0.25rem",
                            paddingRight: "1.5rem",
                          }}
                        >
                          <span
                            style={{ color: "hsl(var(--muted-foreground))" }}
                          >
                            Amount:
                          </span>
                          {row.receiveOrder.amount}
                        </h1>
                      </Box>
                    </td>
                    <td>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexDirection: "column",
                        }}
                      >
                        <h1
                          className={cls(
                            globalStyles.card_title,
                            globalStyles["flex"]
                          )}
                          style={{
                            gap: "0.25rem",
                          }}
                        >
                          <span
                            style={{ color: "hsl(var(--muted-foreground))" }}
                          >
                            Qt:
                          </span>
                          {row.confirmedOrder.qt}
                        </h1>
                        <h1
                          className={cls(
                            globalStyles.card_title,
                            globalStyles["flex"]
                          )}
                          style={{
                            gap: "0.25rem",
                            paddingRight: "1.5rem",
                          }}
                        >
                          <span
                            style={{ color: "hsl(var(--muted-foreground))" }}
                          >
                            Amount:
                          </span>
                          {row.confirmedOrder.amount}
                        </h1>
                      </Box>
                    </td>
                    <td>
                      <h1
                        className={globalStyles.card_title}
                        style={{
                          paddingRight: "1.5rem",
                        }}
                      >
                        BDT {row.productCost}
                      </h1>
                    </td>
                    <td>
                      <Box
                        sx={{
                          display: "flex",
                          padding: ".5rem 0",
                          paddingRight: "1.5rem",
                        }}
                      >
                        <Input
                          type="number"
                          value={getValue(row.id, "fixedCost", row.fixedCost)}
                          onChange={e =>
                            handleValueChange(
                              row.id,
                              "fixedCost",
                              e.target.value
                            )
                          }
                          size="sm"
                          style={{
                            paddingRight: "1.5rem",
                            width: "6rem",
                          }}
                        />
                      </Box>
                    </td>
                    <td>
                      <Box
                        sx={{
                          display: "flex",
                          padding: ".5rem 0",
                          paddingRight: "1.5rem",
                        }}
                      >
                        <Input
                          type="number"
                          value={getValue(row.id, "adSpend", row.adSpend)}
                          onChange={e =>
                            handleValueChange(row.id, "adSpend", e.target.value)
                          }
                          size="sm"
                          style={{
                            paddingRight: "1.5rem",
                            width: "6rem",
                          }}
                        />
                      </Box>
                    </td>
                    <td>
                      <h1
                        className={globalStyles.card_title}
                        style={{
                          paddingRight: "4.5rem",
                        }}
                      >
                        BDT {row.return}
                      </h1>
                    </td>
                    <td>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          flexDirection: "column",
                          padding: ".65rem 0",
                          paddingRight: "1.5rem",
                          justifyContent: "center",
                        }}
                      >
                        <div>
                          <Badge>
                            %
                            {
                              calculateProfit(
                                row.confirmedOrder.amount,
                                getValue(row.id, "fixedCost", row.fixedCost),
                                getValue(row.id, "adSpend", row.adSpend)
                              ).percent
                            }
                          </Badge>
                        </div>
                        <h1
                          className={cls(
                            globalStyles.card_title,
                            globalStyles["flex"]
                          )}
                          style={{
                            color: "hsl(var(--primary))",
                          }}
                        >
                          BDT
                          {
                            calculateProfit(
                              row.confirmedOrder.amount,
                              getValue(row.id, "fixedCost", row.fixedCost),
                              getValue(row.id, "adSpend", row.adSpend)
                            ).amount
                          }
                        </h1>
                      </Box>
                    </td>
                    <td className={cls(globalStyles.right, globalStyles.card_table_cell)}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="note-button"
                        style={{
                          boxShadow: "none",
                        }}
                        onClick={() => handleNoteClick(row.id, row.note)}
                      >
                        Note
                      </Button>
                      <span 
                        className="note-text" 
                        style={{ 
                          display: 'none',
                          whiteSpace: 'normal',
                          maxWidth: '200px',
                          textAlign: 'left'
                        }}
                      >
                        {row.note}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={noteDialog} onClose={() => setNoteDialog(false)}>
        <div className={styles.dialogContent}>
          <h2>Add Note</h2>
          <Textarea
            value={selectedNote.note}
            onChange={e =>
              setSelectedNote(prev => ({ ...prev, note: e.target.value }))
            }
            placeholder="Enter your note here..."
          />
          <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
            <Button onClick={handleNoteSave}>Save</Button>
            <Button
              variant="outline"
              onClick={() => setNoteDialog(false)}
              className={globalStyles["box-shadow-none"]}
            >
              Cancel
            </Button>
          </Box>
        </div>
      </Dialog>
    </section>
  );
};
