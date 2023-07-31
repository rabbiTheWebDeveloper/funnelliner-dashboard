import React, { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import renderActiveShape from './HomePageCart/renderActiveShape';

const COLORS = ['#26BF94', '#F5B849', '#23B7E5', '#6B2CD1'];



const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label" style={{color:"black"}}>{`${payload[0].name}: ${payload[0].value}%`}</p>
      </div>
    );
  }

  return null;
};

const PieChartPage = ({ newCannelList }) => {
  const [activeIndex, setActiveIndex] = useState(-1); // Initialize activeIndex to -1

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1); // Reset activeIndex to -1 when leaving the pie chart
  };


  function convertToPercentages(arr) {
    const total = arr.reduce((acc, item) => acc + item.value, 0);
    const result = arr.map(item => ({
      name: item.name,
      value: parseFloat(((item.value / total) * 100).toFixed(2))
    }));
    return result;
  }

  // Usage example
  const transformedData = convertToPercentages(newCannelList);
  console.log(transformedData);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart width={600} height={500}>
        <Pie
          data={transformedData}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          innerRadius={40}
          outerRadius={100}
          fill="#8884d8"
          paddingAngle={1}
          dataKey="value"
          onMouseEnter={onPieEnter}
          onMouseLeave={onPieLeave} // Add onMouseLeave event handler
        >
          {transformedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartPage;
