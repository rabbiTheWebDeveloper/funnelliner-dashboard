import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import "jspdf-autotable";
import moment from "moment";

const DownloadOptionProduct = ({ orders }) => {
  const [selectedOption, setSelectedOption] = useState("");
  // Prepare data by flattening order details and their variations
  const prepareData = () =>
    orders.flatMap(order =>
      order.variations.map(variation => ({
        "Product Name": order.product_name,
        "Product Code": order.product_code,
        "Category ID": order.category_id,
        Variant: variation.variant || "N/A",
        Quantity: variation.quantity,
        "Price (Each)": variation.price,
        "Total Value": variation.quantity * variation.price,
        "Discount Type": order.discount_type || "N/A",
        "Discount Applied":
          order.discount_type === "flat"
            ? `Flat ${order.discount}`
            : `${order.discount}%`,
        "Delivery Charge": order.delivery_charge || "Free",
        "Order Status": order.status === 1 ? "Active" : "Inactive",
        "Created At": moment(order.created_at).format("DD.MM.YYYY"),
        "Updated At": moment(variation.updated_at).format("DD.MM.YYYY"),
      }))
    );

  // Generate Excel file
  const downloadExcelFile = () => {
    const data = prepareData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Product List");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(file, "product_list.xlsx");
  };

  // Generate PDF file
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Add Title
    doc.setFontSize(14);
    doc.text("Product List Report", pageWidth / 2, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Generated on: ${moment().format("DD.MM.YYYY")}`, pageWidth / 2, 30, {
      align: "center",
    });

    // Prepare table data
    const data = prepareData();
    doc.autoTable({
      head: [Object.keys(data[0])],
      body: data.map(row => Object.values(row)),
      startY: 40,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    // Save PDF
    doc.save("product_list.pdf");
  };

  // Handle dropdown change
  const handleOptionChange = event => {
    setSelectedOption(event.target.value);
    if (event.target.value === "excel") {
      downloadExcelFile();
    } else if (event.target.value === "pdf") {
      generatePDF();
    }
    setSelectedOption("");
  };

  return (
    <select
      name="downloadReport"
      value={selectedOption}
      onChange={handleOptionChange}
    >
      <option value="" disabled>
        Download Report
      </option>
      <option value="excel">As Excel</option>
      <option value="pdf">As PDF</option>
    </select>
  );
};

export default DownloadOptionProduct;
