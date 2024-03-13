const order = require("../../model/orderModel")
const ExcelJS = require('exceljs');

const downloadExcel = async (req, res) => {
    try {
        // Fetch data from MongoDB
        const orderList = await order.find();
        // console.log(orderList,'klkll');

        // Create a new workbook
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('orders');

        // Add headers
        worksheet.addRow(['First Name', 'Last Name', 'Email','Order Date','Payment Mode','Product','status','Address','City','Sub Total','Tax','Total']);

        orderList.forEach(allOrder => {
            const { userDetails, products,address } = allOrder;
            if (userDetails) {
                console.log("User Details:", userDetails);
                products.forEach(product => {
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
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename="users.xlsx"');

        // Write workbook to response
        await workbook.xlsx.write(res);

        // End response
        res.end();
    } catch (err) {
        console.error('Error exporting data to Excel:', err);
        res.status(500).send('Internal Server Error');
    }
}


module.exports = {
    downloadExcel
}