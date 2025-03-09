import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Search, Filter, RefreshCw,Download, Trash } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import * as XLSX from "xlsx"; // Import XLSX
import { jsPDF } from "jspdf";

const backendURL = process.env.REACT_APP_BACKEND_URL;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    paymentMethod: "",
    startDate: "",
    endDate: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage, setOrdersPerPage] = useState(10);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${backendURL}/orders/all`);
      setOrders(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.patch(
        `${backendURL}/orders/edit/${id}`,
        { status: newStatus },
        { headers: { "Content-Type": "application/json" } }
      );
      fetchOrders();
      toast.success("Order status updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  // Handle filtering
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      !filters.search ||
      order.username.toLowerCase().includes(filters.search.toLowerCase()) ||
      order.order_id.slice(-4).includes(filters.search); // Search by last 4 digits of order ID

    const matchesStatus = !filters.status || order.status === filters.status;
    const matchesPaymentMethod =
      !filters.paymentMethod || order.paymentStatus === filters.paymentMethod;
    const matchesDate =
      (!filters.startDate ||
        new Date(order.createdAt) >= new Date(filters.startDate)) &&
      (!filters.endDate ||
        new Date(order.createdAt) <= new Date(filters.endDate));

    return (
      matchesSearch && matchesStatus && matchesPaymentMethod && matchesDate
    );
  });


const handleDownload = (order) => {
  // Create a new instance of jsPDF
  const doc = new jsPDF();

  // Add Title
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Order Invoice", 105, 15, { align: "center" });

  // Add Order Details
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const leftAlignX = 10;
  const rightAlignX = 200;

  let y = 30; // Starting vertical position
  const lineSpacing = 10; // Space between lines

  doc.text(`Order ID: ${order.order_id}`, leftAlignX, y);
  y += lineSpacing;
  doc.text(`Customer Name: ${order.username}`, leftAlignX, y);
  y += lineSpacing;
  doc.text(`Phone Number: ${order.phoneNumber}`, leftAlignX, y);
  y += lineSpacing;
  if (order.alternatePhoneNumber) {
    doc.text(`Alternate Phone: ${order.alternatePhoneNumber}`, leftAlignX, y);
    y += lineSpacing;
  }
  doc.text(`Address: ${order.address}`, leftAlignX, y);
  y += lineSpacing;
  doc.text(
    `Order Date: ${new Date(order.createdAt).toLocaleDateString()}`,
    leftAlignX,
    y
  );
  y += lineSpacing;
  doc.text(`Payment Status: ${order.paymentStatus}`, leftAlignX, y);
  y += lineSpacing * 2; // Add extra space before the next section

  // Add Items Header
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Items:", leftAlignX, y);
  y += lineSpacing;

  // Add Table Header
  const tableStartY = y;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Item", leftAlignX, tableStartY);
  doc.text("Price", 100, tableStartY, { align: "center" });
  doc.text("Quantity", 140, tableStartY, { align: "center" });
  doc.text("Total", rightAlignX, tableStartY, { align: "right" });

  y = tableStartY + lineSpacing;

  // Add Items List
  doc.setFont("helvetica", "normal");
  order.items.forEach((item, index) => {
    doc.text(`${index + 1}. ${item.name} (${item.weight})`, leftAlignX, y);
    doc.text(`${item.price}`, 100, y, { align: "center" });
    doc.text(`${item.quantity}`, 140, y, { align: "center" });
    doc.text(`${item.price * item.quantity}`, rightAlignX, y, { align: "right" });
    y += lineSpacing; // Move to the next line for the next item
  });

  y += lineSpacing; // Add extra space before the total

  // Add Total Amount
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Amount: ${order.totalAmount}`, leftAlignX, y);

  // Save the PDF
  doc.save(`order-invoice-${order.order_id}.pdf`);
};




  // Pagination logic
  const totalOrders = filteredOrders.length;
  const totalPages = Math.ceil(totalOrders / ordersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleExportToExcel = () => {
    const formattedOrders = filteredOrders.map((order) => ({
      "Order ID": order.order_id,
      Customer: order.username,
      Contact: order.phoneNumber,
      Amount: order.totalAmount,
      Status: order.status,
      "Payment Status": order.paymentStatus,
      Date: new Date(order.createdAt).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(formattedOrders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");

    // Save the Excel file
    XLSX.writeFile(wb, "orders.xlsx");
  };

  // Slice the orders for the current page
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );


  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="h-10 bg-gray-200 rounded"></div>
      ))}
    </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        Error loading orders: {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Filters */}
      <ToastContainer />
      <div className="p-4 border-b border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders..."
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
              className=" p-2 pl-10  w-full border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              className="w-full p-2 border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 p-2"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="processed">Processed</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              className="w-full  p-2 border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              className="w-full  p-2 border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleExportToExcel}
          className="bg-amber-500 text-white py-2 px-4 rounded-md hover:bg-amber-600"
        >
          Export to Excel
        </button>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="max-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Razorpay ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
  Customer
</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Download
              </th>
              
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentOrders.length > 0 ? (
              currentOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.ID}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.razorpayOrderId}
                  </td>
                  <td className="px-6 py-4 whitespace-wrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.username}
                    </div>
                    <div className="text-sm text-gray-500 break-words w-40">
                      {order.address}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.phoneNumber}
                    <br />
                    {order.alternatePhoneNumber !== null &&
                      order.alternatePhoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{order.totalAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusUpdate(order._id, e.target.value)
                      }
                      className="text-sm  p-2 border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="processed">Processed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.paymentStatus === "successful"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleDownload(order)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() =>
                        handleStatusUpdate(order._id, order.status)
                      }
                      className="text-amber-600 hover:text-amber-900"
                    >
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center py-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 text-sm font-medium text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Orders;
