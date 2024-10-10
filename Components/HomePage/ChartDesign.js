import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';




const ChartDesign = ({ data }) => {

  const CustomYAxisTick = (props) => {
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
    <div style={{ width: '100%', height: '300px' }}>
      <ResponsiveContainer>

        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
        >

          <CartesianGrid strokeDasharray="3 4" />
          <XAxis dataKey="name" tick={{
            fontFamily: 'Poppins',
            fontSize: '14px',
            color: 'var(--grey-40, #A2A3A5)',
            lineHeight: '5px',
            marginTop: '10px'
          
          }}
            margin={{ top: 50 }}   padding={{ left: 30, right: 30 , bottom: 30 }} />
          <YAxis
            tickFormatter={(value) => (value >= 1000 ? `${value / 1000}k` : value)}
            tick={CustomYAxisTick}
          />
          <Tooltip />
          <Legend />



          {/* <Line type="monotone" dataKey="product_qty" stroke="#7459D9" activeDot={{ r: 8 }} strokeWidth={4} /> */}
          <Line type="monotone" dataKey="Amount" stroke="#FB896B" activeDot={{ r: 8 }} strokeWidth={4} />
        </LineChart>
      </ResponsiveContainer>


    </div>
  );
};

export default ChartDesign;
