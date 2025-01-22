import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jsPDF } from "jspdf";
import { PDFDocument, StandardFonts } from "pdf-lib";
const backendURL = process.env.REACT_APP_BACKEND_URL;

const ProcessedOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null); // State to store selected order for viewing details

  useEffect(() => {
    const fetchProcessedOrders = async () => {
      try {
        console.log("Fetching from:", `${backendURL}/orders/processed`);
        const response = await axios.get(`${backendURL}/orders/processed`);
        setOrders(response.data);

        if (response.data.length === 0) {
          toast.info("No processed orders found.", {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.success("Processed orders fetched successfully!", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (err) {
        if (err.response) {
          toast.error(
            `Error ${err.response.status}: ${
              err.response.data.message || "Failed to fetch processed orders."
            }`,
            { position: "top-right", autoClose: 3000 }
          );
        } else if (err.request) {
          toast.error(
            "No response received from the server. Please check your connection.",
            { position: "top-right", autoClose: 3000 }
          );
        } else {
          toast.error("An unexpected error occurred.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
        console.error("Error details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProcessedOrders();
  }, []);

  // Handle the click on the card to view the full details of the order
  const handleOrderClick = (order) => {
    setSelectedOrder(order); // Set the clicked order as the selected order
  };

  // Function to close the order details view (if you implement a modal)
  const closeOrderDetails = () => {
    setSelectedOrder(null); // Close the selected order
  };


const downloadInvoice = async (order) => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Add a page to the document
  const page = pdfDoc.addPage([595, 842]); // Standard A4 size: 595x842 points
  const { width, height } = page.getSize();

  // Set up font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Helper function to calculate the starting position for left-aligned text starting from the center
  const calculateStartX = (maxWidth) => (width - maxWidth) / 2;

  // Define font size
  const fontSize = 12;

  // Calculate the maximum width for content
  const longestLine = Math.max(
    font.widthOfTextAtSize("Invoice", 18),
    font.widthOfTextAtSize(`Order ID: ${order._id}`, fontSize),
    font.widthOfTextAtSize(
      `Customer Name: ${order.username || "Unknown"}`,
      fontSize
    ),
    font.widthOfTextAtSize(
      `Phone Number: ${order.phoneNumber || "N/A"}`,
      fontSize
    ),
    font.widthOfTextAtSize(`Address: ${order.address || "N/A"}`, fontSize),
    font.widthOfTextAtSize(
      `Total Amount: ${order.totalAmount.toFixed(2)}`,
      fontSize
    ),
    font.widthOfTextAtSize(`Payment Status: ${order.paymentStatus}`, fontSize),
    font.widthOfTextAtSize(`Order Status: ${order.status}`, fontSize),
    ...(order.items || []).map((item) =>
      font.widthOfTextAtSize(
        `${item.name} - ${item.weight}, ${
          item.quantity
        } x ${item.price.toFixed(2)} = ${item.totalPrice.toFixed(2)}`,
        fontSize
      )
    )
  );
  const startX = calculateStartX(longestLine);

  // Add the title
  page.drawText("Invoice", {
    x: (width - font.widthOfTextAtSize("Invoice", 18)) / 2,
    y: height - 50,
    size: 18,
    font,
  });

  // Add order details
  let yOffset = height - 100;
  page.drawText(`Order ID: ${order._id}`, {
    x: startX,
    y: yOffset,
    size: fontSize,
    font,
  });
  yOffset -= 20;
  page.drawText(`Customer Name: ${order.username || "Unknown"}`, {
    x: startX,
    y: yOffset,
    size: fontSize,
    font,
  });
  yOffset -= 20;
  page.drawText(`Phone Number: ${order.phoneNumber || "N/A"}`, {
    x: startX,
    y: yOffset,
    size: fontSize,
    font,
  });
  yOffset -= 20;
  page.drawText(`Address: ${order.address || "N/A"}`, {
    x: startX,
    y: yOffset,
    size: fontSize,
    font,
  });
  yOffset -= 20;
  page.drawText(`Total Amount: ${order.totalAmount.toFixed(2)}`, {
    x: startX,
    y: yOffset,
    size: fontSize,
    font,
  });
  yOffset -= 20;
  page.drawText(`Payment Status: ${order.paymentStatus}`, {
    x: startX,
    y: yOffset,
    size: fontSize,
    font,
  });
  yOffset -= 20;
  // page.drawText(`Order Status: ${order.status}`, {
  //   x: startX,
  //   y: yOffset,
  //   size: fontSize,
  //   font,
  // });
  // yOffset -= 40;

  // Add Items section
  page.drawText("Items:", { x: startX, y: yOffset, size: fontSize, font });
  yOffset -= 20;

  // Loop through items and add them to the invoice
  if (order.items && order.items.length > 0) {
    order.items.forEach((item) => {
      const itemLine = `${item.name} - ${item.weight}, ${
        item.quantity
      } x ${item.price.toFixed(2)} = ${item.totalPrice.toFixed(2)}`;
      page.drawText(itemLine, { x: startX, y: yOffset, size: fontSize, font });
      yOffset -= 20;
    });
  } else {
    page.drawText("No items in this order.", {
      x: startX,
      y: yOffset,
      size: fontSize,
      font,
    });
    yOffset -= 20;
  }

  yOffset -= 20;

  // Add footer (timestamps)
  page.drawText(`Created At: ${new Date(order.createdAt).toLocaleString()}`, {
    x: startX,
    y: yOffset,
    size: fontSize,
    font,
  });
  yOffset -= 20;
  page.drawText(`Shipped At: ${new Date(order.updatedAt).toLocaleString()}`, {
    x: startX,
    y: yOffset,
    size: fontSize,
    font,
  });

  // Serialize the document to bytes
  const pdfBytes = await pdfDoc.save();

  // Download the PDF
  const link = document.createElement("a");
  link.href = URL.createObjectURL(
    new Blob([pdfBytes], { type: "application/pdf" })
  );
  link.download = `Invoice_${order._id}.pdf`;
  link.click();
};






  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div
        className="border-4 border-gray-300 border-t-black rounded-full w-12 h-12 animate-spin"
        aria-label="Loading..."
      ></div>
    </div>
  );

  return (
    <div className="p-6 mt-20">
            <ToastContainer />
      <h1 className="text-2xl font-bold mb-4">Processed Orders</h1>
      {orders.length === 0 ? (
        <p>No processed orders found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="p-6 border border-gray-300 rounded-lg shadow-lg bg-white cursor-pointer"
              onClick={() => handleOrderClick(order)} // Add onClick to view order details
            >
              <h3 className="text-lg font-semibold">
                ID:{" "}
                <span className="text-indigo-600">
                  ...{order._id.slice(-4)}
                </span>
              </h3>

              <p className="text-sm text-gray-700 mb-1">
                <strong>Customer Name:</strong> {order.username || "Unknown"}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Amount:</strong>{" "}
                <span className="text-green-600 font-bold">
                  ₹{order.totalAmount}
                </span>
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Status:</strong>{" "}
                <span
                  className={`${
                    order.status === "pending"
                      ? "text-yellow-500"
                      : "text-green-600"
                  }`}
                >
                  {order.status}
                </span>
              </p>

              {/* Add the Download Invoice button here */}
              <button
                onClick={() => downloadInvoice(order)}
                className="mt-4 ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Download Invoice
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Show order details in a modal or expanded view */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-3/4 md:w-1/2">
            <h2 className="text-2xl font-bold mb-4">Order Details</h2>
            <p>
              <strong>Order ID:</strong> {selectedOrder._id}
            </p>
            <p>
              <strong>Customer Name:</strong>{" "}
              {selectedOrder.username || "Unknown"}
            </p>
            <p>
              <strong>Phone Number:</strong>{" "}
              {selectedOrder.phoneNumber || "N/A"}
            </p>
            <p>
              <strong>Address:</strong> {selectedOrder.address || "N/A"}
            </p>
            <h3 className="font-semibold mt-4">Items:</h3>
            <ul className="list-disc ml-6 mt-2">
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                selectedOrder.items.map((item) => (
                  <li key={item._id} className="text-gray-700">
                    <span className="font-medium">{item.name}</span> -{" "}
                    <span>
                      {item.weight}, {item.quantity} x ₹{item.price.toFixed(2)}
                    </span>{" "}
                    ={" "}
                    <span className="font-bold">
                      ₹{item.totalPrice.toFixed(2)}
                    </span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No items in this order.</li>
              )}
            </ul>
            <p className="mt-4">
              <strong>Total Amount:</strong>{" "}
              <span className="text-green-600 font-bold">
                ₹{selectedOrder.totalAmount}
              </span>
            </p>
            <p>
              <strong>Payment Status:</strong>{" "}
              <span
                className={`${
                  selectedOrder.paymentStatus === "paid"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {selectedOrder.paymentStatus}
              </span>
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`${
                  selectedOrder.status === "pending"
                    ? "text-yellow-500"
                    : "text-green-600"
                }`}
              >
                {selectedOrder.status}
              </span>
            </p>
            <p className="text-sm text-gray-700">
              <strong>Created At :</strong>{" "}
              {new Date(selectedOrder.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Shipped At :</strong>{" "}
              {new Date(selectedOrder.updatedAt).toLocaleString()}
            </p>
            <button
              onClick={closeOrderDetails}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Close
            </button>
            {/* Add the Download Invoice button inside the modal */}
            <button
              onClick={() => downloadInvoice(selectedOrder)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Download Invoice
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessedOrder;
