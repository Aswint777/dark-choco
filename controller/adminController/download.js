const order = require("../../model/orderModel");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const downloadExcel = async (req, res) => {
  try {
    // Fetch data from MongoDB
    const orderList = await order.find();
    // console.log(orderList,'klkll');

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("orders");

    // Add headers
    worksheet.addRow([
      "First Name",
      "Last Name",
      "Email",
      "Order Date",
      "Payment Mode",
      "Product",
      "status",
      "Address",
      "City",
      "Sub Total",
      "Tax",
      "Total",
    ]);

    orderList.forEach((allOrder) => {
      const { userDetails, products, address } = allOrder;
      if (userDetails) {
        console.log("User Details:", userDetails);
        products.forEach((product) => {
          worksheet.addRow([
            userDetails.firstName,
            userDetails.secondName,
            userDetails.email,
            allOrder.date,
            allOrder.paymentMode,
            product.stock,
            allOrder.status,
            address.address,
            address.city,
            allOrder.subTotal,
            allOrder.tax,
            allOrder.total,
          ]);
        });
      }
    });

    // Set HTTP response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", 'attachment; filename="users.xlsx"');

    // Write workbook to response
    await workbook.xlsx.write(res);

    // End response
    res.end();
  } catch (err) {
    console.error("Error exporting data to Excel:", err);
    res.status(500).send("Internal Server Error");
  }
};

const downloadExcelByDate = async (req, res) => {
  try {
    console.log(req.body);
    const { startingDate, endingDate } = req.body;
    const startDate = new Date(startingDate);
    const endDate = new Date(endingDate);

    console.log(startDate, endDate);

    // Query orders within the date range
    const orderList = await order.find({
      date: { $gte: startDate, $lte: endDate },
    });

    console.log(orderList, "klkll");

    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("orders");

    // Add headers
    worksheet.addRow([
      "First Name",
      "Last Name",
      "Email",
      "Order Date",
      "Payment Mode",
      "Product",
      "status",
      "Address",
      "City",
      "Sub Total",
      "Tax",
      "Total",
    ]);

    orderList.forEach((allOrder) => {
      const { userDetails, products, address } = allOrder;
      if (userDetails) {
        console.log("User Details:", userDetails);
        products.forEach((product) => {
          worksheet.addRow([
            userDetails.firstName,
            userDetails.secondName,
            userDetails.email,
            allOrder.date,
            allOrder.paymentMode,
            product.stock,
            allOrder.status,
            address.address,
            address.city,
            allOrder.subTotal,
            allOrder.tax,
            allOrder.total,
          ]);
        });
      }
    });

    // Set HTTP response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", 'attachment; filename="users.xlsx"');

    // Write workbook to response
    await workbook.xlsx.write(res);

    // End response
    res.end();
  } catch (err) {
    console.error("Error exporting data to Excel:", err);
    res.status(500).send("Internal Server Error");
  }
};

const downloadPDF = async (req, res) => {
  try {
    // Fetch data from MongoDB
    const orderList = await order.find();

    // Create a new PDF document
    const doc = new PDFDocument();

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="orders.pdf"');

    // Pipe the PDF content to the response
    doc.pipe(res);

    // Add headers to the PDF document
    doc.font("Helvetica-Bold").fontSize(12);
    doc.text("First Name", 50, 50);
    doc.text("Last Name", 150, 50);
    doc.text("Email", 250, 50);
    doc.text("Order Date", 350, 50);
    doc.text("Payment Mode", 450, 50);
    doc.text("Product", 550, 50);
    doc.text("Status", 650, 50);
    doc.text("Address", 750, 50);
    doc.text("City", 850, 50);
    doc.text("Sub Total", 950, 50);
    doc.text("Tax", 1050, 50);
    doc.text("Total", 1150, 50);

    // Add data rows to the PDF document
    let yPos = 70;
    orderList.forEach((allOrder) => {
      const { userDetails, products, address } = allOrder;
      if (userDetails) {
        products.forEach((product) => {
          yPos += 20;
          doc.font("Helvetica").fontSize(10);
          doc.text(userDetails.firstName, 50, yPos);
          doc.text(userDetails.secondName, 150, yPos);
          doc.text(userDetails.email, 250, yPos);
          doc.text(allOrder.date.toString(), 350, yPos);
          doc.text(allOrder.paymentMode, 450, yPos);
          doc.text(product.stock, 550, yPos);
          doc.text(allOrder.status, 650, yPos);
          doc.text(address.address, 750, yPos);
          doc.text(address.city, 850, yPos);
          doc.text(allOrder.subTotal.toString(), 950, yPos);
          doc.text(allOrder.tax.toString(), 1050, yPos);
          doc.text(allOrder.total.toString(), 1150, yPos);
        });
      }
    });

    // Finalize the PDF
    doc.end();
  } catch (err) {
    console.error("Error exporting data to PDF:", err);
    res.status(500).send("Internal Server Error");
  }
};

const downloadPDFByDate = async (req, res) => {
  try {
    const { startingDate, endingDate } = req.body;
    const startDate = new Date(startingDate);
    const endDate = new Date(endingDate);

    console.log(startDate, endDate);

    // Query orders within the date range
    const orderList = await order.find({
      date: { $gte: startDate, $lte: endDate },
    });

    // Create a new PDF document
    const doc = new PDFDocument();

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="orders.pdf"');

    // Pipe the PDF content to the response
    doc.pipe(res);

    // Add headers to the PDF document
    doc.font("Helvetica-Bold").fontSize(12);
    doc.text("First Name", 50, 50);
    doc.text("Last Name", 150, 50);
    doc.text("Email", 250, 50);
    doc.text("Order Date", 350, 50);
    doc.text("Payment Mode", 450, 50);
    doc.text("Product", 550, 50);
    doc.text("Status", 650, 50);
    doc.text("Address", 750, 50);
    doc.text("City", 850, 50);
    doc.text("Sub Total", 950, 50);
    doc.text("Tax", 1050, 50);
    doc.text("Total", 1150, 50);

    // Add data rows to the PDF document
    let yPos = 70;
    orderList.forEach((allOrder) => {
      const { userDetails, products, address } = allOrder;
      if (userDetails) {
        products.forEach((product) => {
          yPos += 20;
          doc.font("Helvetica").fontSize(10);
          doc.text(userDetails.firstName, 50, yPos);
          doc.text(userDetails.secondName, 150, yPos);
          doc.text(userDetails.email, 250, yPos);
          doc.text(allOrder.date.toString(), 350, yPos);
          doc.text(allOrder.paymentMode, 450, yPos);
          doc.text(product.stock, 550, yPos);
          doc.text(allOrder.status, 650, yPos);
          doc.text(address.address, 750, yPos);
          doc.text(address.city, 850, yPos);
          doc.text(allOrder.subTotal.toString(), 950, yPos);
          doc.text(allOrder.tax.toString(), 1050, yPos);
          doc.text(allOrder.total.toString(), 1150, yPos);
        });
      }
    });

    // Finalize the PDF
    doc.end();
  } catch (err) {
    console.error("Error exporting data to PDF:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  downloadExcel,
  downloadPDF,
  downloadExcelByDate,
  downloadPDFByDate,
};
