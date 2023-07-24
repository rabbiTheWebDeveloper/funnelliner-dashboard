import React, { useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import renderActiveShape from './HomePageCart/renderActiveShape';

const COLORS = ['#26BF94', '#F5B849', '#23B7E5', '#6B2CD1'];

const PieChartPage = ({ newCannelList }) => {
  const [activeIndex, setActiveIndex] = useState(-1); // Initialize activeIndex to -1

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1); // Reset activeIndex to -1 when leaving the pie chart
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart width={600} height={500}>
        <Pie
          data={newCannelList}
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
          {newCannelList.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartPage;
