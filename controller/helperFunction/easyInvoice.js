var easyinvoice = require("easyinvoice");
const fs = require("fs");

module.exports = {
  generateInvoice: async (orderDetails) => {
    try {
      console.log(orderDetails, "order details");
      if (!orderDetails || typeof orderDetails !== "object") {
        throw new Error("Invalid order details");
      }

      // Ensure orderDetails contains necessary properties
      const {
        subTotal,
        shipping,
        tax,
        total,
        quantity,
        status,
        products,
        paymentMode,
        address,
        userDetails,
        userData,
      } = orderDetails;
      // if (!subTotal || !shipping || !tax || !total || !quantity || !status || !products || !paymentMode || !address || !userDetails || !userData) {
      //     throw new Error('Missing required properties in order details');
      // }
      console.log("generateInvoice");
      const invoiceData = {
        sender: {
          company: "Dark Choco",
          address: "malappuram",
          zip: "673001",
          city: "Calicut",
          country: "Kerala",
        },
        client: {
          company: address.name || "",
          address: address.address || "",
          zip: address.pinCode || "",
          city: address.city || "",
          state: address.state || "",
        },
        information: {
          "Order ID": userData._id || "",
          date: new Date(),
          "invoice date": new Date(),
        },
        products: products.map((product) => ({
          quantity: product.quantity || 0,
          description: product.stock || "",
          "tax-rate": 5,
          price: product.amount || 0,
        })),
        "bottom-notice": "Thank You For Your Purchase",
        settings: {
          currency: "INR",
          "tax-notation": "GST",
          "margin-top": 50,
          "margin-right": 50,
          "margin-left": 50,
          "margin-bottom": 25,
        },
      };

      // Generate invoice PDF
      const result = await new Promise((resolve, reject) => {
        easyinvoice.createInvoice(invoiceData, (result) => {
          if (result.pdf) {
            const pdfBuffer = Buffer.from(result.pdf, "base64");
            resolve(pdfBuffer);
          } else {
            reject(new Error("Failed to generate invoice"));
          }
        });
      });

      return result;
    } catch (error) {
      console.log(error);
    }
  },
};
