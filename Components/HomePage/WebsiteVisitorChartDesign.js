import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const WebsiteVisitorChartDesign = ({data}) => {
  console.log(data.hourlyCounts);
  // Map the hourlyCounts into a chart-friendly format
  const chartData =data?.hourlyCounts?.map(item => ({
    hour: item?.hour,
    visitor: item?.count,
  }));


  console.log(chartData);
  const CustomYAxisTick = props => {
    const { x, y, payload } = props;

    const formattedValue =
      payload.value >= 1000 ? `${payload.value / 1000}k` : payload.value;

    return (
      <text x={x} y={y} dy={16} textAnchor="end" fill="#666">
        {formattedValue}
      </text>
    );
  };

  return (
    <div style={{ width: "100%", height: "400px" }}>
      {/* Display total visitor count */}
      <h3>Total Visitors: {data.totalCount}</h3>

      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 4" />
          <XAxis
            dataKey="hour"
            label={{ value: "Hour", position: "insideBottom", offset: -5 }}
            tick={{
              fontFamily: "Poppins",
              fontSize: "14px",
              color: "var(--grey-40, #A2A3A5)",
              lineHeight: "5px",
            }}
            padding={{ left: 30, right: 30 }}
          />
          <YAxis
            tickFormatter={value =>
              value >= 1000 ? `${value / 1000}k` : value
            }
            tick={CustomYAxisTick}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="visitor"
            stroke="#FB896B"
            activeDot={{ r: 8 }}
            strokeWidth={4}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WebsiteVisitorChartDesign;
