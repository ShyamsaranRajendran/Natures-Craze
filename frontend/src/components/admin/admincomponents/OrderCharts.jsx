import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import dayjs from "dayjs";

// Register necessary chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const OrderCharts = ({ orders }) => {
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    const daily = {};
    const weekly = {};
    const monthly = {};

    orders.forEach((order) => {
      const createdAt = dayjs(order.createdAt);
      const day = createdAt.format("YYYY-MM-DD");
      const week = createdAt.format("YYYY-W");
      const month = createdAt.format("YYYY-MM");

      daily[day] = (daily[day] || 0) + 1;
      weekly[week] = (weekly[week] || 0) + 1;
      monthly[month] = (monthly[month] || 0) + 1;
    });

    setDailyData(Object.keys(daily).map((day) => ({ day, count: daily[day] })));
    setWeeklyData(
      Object.keys(weekly).map((week) => ({ week, count: weekly[week] }))
    );
    setMonthlyData(
      Object.keys(monthly).map((month) => ({ month, count: monthly[month] }))
    );
  }, [orders]);

  return (
    <div className="w-full p-6 space-y-8">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Order Analytics
      </h2>

      <div className="flex flex-col md:flex-row md:space-x-8 space-y-6 md:space-y-0 justify-center items-center">
        {/* Daily Orders Chart */}
        <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-lg max-h-96">
          <h3 className="text-center text-lg font-semibold mb-2">
            Daily Orders
          </h3>
          <Bar
            data={{
              labels: dailyData.map((d) => d.day),
              datasets: [
                {
                  label: "Orders",
                  data: dailyData.map((d) => d.count),
                  backgroundColor: "rgba(255, 99, 132, 0.2)",
                  borderColor: "rgba(255, 99, 132, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  position: "top",
                },
              },
            }}
          />
        </div>

        {/* Weekly Orders Chart */}
        <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-lg max-h-96">
          <h3 className="text-center text-lg font-semibold mb-2">
            Weekly Orders
          </h3>
          <Bar
            data={{
              labels: weeklyData.map((w) => w.week),
              datasets: [
                {
                  label: "Orders",
                  data: weeklyData.map((w) => w.count),
                  backgroundColor: "rgba(54, 162, 235, 0.2)",
                  borderColor: "rgba(54, 162, 235, 1)",
                  borderWidth: 1,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: {
                legend: {
                  position: "top",
                },
              },
            }}
          />
        </div>
      </div>

      {/* Monthly Orders Data */}
      <div className="w-full md:w-1/3 bg-white p-4 rounded-lg shadow-lg max-h-96">
        <h3 className="text-center text-lg font-semibold mb-4">
          Monthly Orders
        </h3>
        <div className="h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg p-4">
          {monthlyData.map((m, index) => (
            <div
              key={index}
              className="w-full flex justify-between items-center p-2 mb-2 bg-white rounded shadow-md"
            >
              <span className="font-medium text-gray-600">{m.month}</span>
              <span className="font-bold text-gray-800">{m.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderCharts;
