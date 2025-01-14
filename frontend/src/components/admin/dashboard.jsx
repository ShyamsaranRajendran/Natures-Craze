import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState(0);
  const [newRegistrations, setNewRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the total users and new registrations
        const usersResponse = await axios.get("/api/users/count");
        const newRegistrationsResponse = await axios.get(
          "/api/users/new-registrations"
        );

        setTotalUsers(usersResponse.data.count);
        setNewRegistrations(newRegistrationsResponse.data.registrations);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleManageProducts = () => {
    navigate("/manage-products");
  };

  const handleViewHistory = () => {
    navigate("/product-history");
  };

  return (
    <div className="dashboard">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="dashboard-content">
          <h1>Dashboard</h1>
          <div className="stats">
            <div className="total-users">
              <h3>Total Users: {totalUsers}</h3>
            </div>
            <div className="new-registrations">
              <h3>New Registrations:</h3>
              <ul>
                {newRegistrations.map((user) => (
                  <li key={user._id}>{user.name}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="actions">
            <button onClick={handleManageProducts}>Manage Products</button>
            <button onClick={handleViewHistory}>View Product History</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
