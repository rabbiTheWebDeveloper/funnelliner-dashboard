import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { shopId } from "../../pages/api";
import axios from "axios";
import { visitorUrl } from "../../constant/constant";



// Custom Y-Axis Tick component for formatting large numbers (if needed)
const CustomYAxisTick = ({ x, y, payload }) => {
  const formattedValue =
    payload.value >= 1000 ? `${payload.value / 1000}k` : payload.value;
  return (
    <text x={x} y={y} dy={16} textAnchor="end" fill="#666">
      {formattedValue}
    </text>
  );
};

const LandingPageChart = ({data ,setOnlineVisitors,fetching, setFetching }) => {
  const [selectedSlug, setSelectedSlug] = useState(null);

  const handleSlugClick = (slug ,id) => {
    setSelectedSlug(slug);
    fetchVisitorData(id);
  };


  const fetchVisitorData = async (id) => {

    const payload = {
      shopId: shopId,
      landingPageId:id ? id : data[0]?.landingPageId,
    };
    try {
      const response = await axios.post(
        `${visitorUrl}landing-page/get-active-users`,payload
      );
      const { data } = response.data;
      // console.log("data", data);
      // Safely handle the online visitor count
      setOnlineVisitors(data.currentVisitors ?? 0);
      setFetching(false);
    } catch (error) {
      console.error("Error fetching visitor data:", error);

      // Optional: Set visitors to 0 if there's an error
      setOnlineVisitors(0);
    }
  };

  useEffect(() => {
    fetchVisitorData();
  }, [data[0]?.landingPageId] ,fetching);
  // Filter data based on selectedSlug for the hourly chart
  const filteredData = selectedSlug
    ? data.find(item => item.landingPageSlug === selectedSlug)?.hourlyCounts ||
      []
    : [];
    const chartData =data?.map(item => ({
      landing_Page_Name : item?.landingPageSlug,
      visitor_Number: item?.totalCount,
    }));
  return (
    <div>
      {/* Render buttons to select landing page */}
      <div style={{ display: "flex", marginBottom: "1rem", gap: "0.5rem" }}>
        {data.map(item => (
          <button
            key={item._id}
            style={{
              backgroundColor: "blue",
              color: "white",
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => handleSlugClick(item.landingPageSlug ,item?.landingPageId)}
          >
            {item.landingPageSlug}
          </button>
        ))}
      </div>

      {/* Default Bar Chart for Total Count */}
      {!selectedSlug && (
        <div style={{ width: "100%", height: "300px" }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 4" />
              <XAxis
                dataKey="landing_Page_Name"
                tick={{
                  fontFamily: "Poppins",
                  fontSize: "14px",
                  color: "var(--grey-40, #A2A3A5)",
                }}
                padding={{ left: 30, right: 30 }}
              />
              <YAxis
                tickFormatter={value =>
                  value >= 1000 ? `${value / 1000}k` : value
                }
              />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="visitor_Number"
                fill="#FB896B"
                barSize={30} // Adjust the width of the bars
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Hourly Chart when a slug is selected */}
      {selectedSlug && filteredData.length > 0 && (
        <div style={{ width: "100%", height: "400px" }}>
          <ResponsiveContainer>
            <BarChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Message for empty hourly data */}
      {selectedSlug && filteredData.length === 0 && (
        <p>No data available for {selectedSlug}.</p>
      )}
    </div>
  );
};

export default LandingPageChart;
