// src/components/BarChart.tsx
import { ResponsiveBar } from "@nivo/bar";

const BarChart = ({
  data,
  keys,
  indexBy,
  axisBottomLegend,
  axisLeftLegend,
}) => {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1000px",
        height: "600px",
        margin: "0 auto",
      }}
    >
      <ResponsiveBar
        data={data}
        keys={keys}
        indexBy={indexBy}
        margin={{ top: 50, right: 130, bottom: 70, left: 60 }}
        padding={0.3}
        colors={{ scheme: "set2" }}
        axisBottom={{
          tickRotation: -30,
          legend: axisBottomLegend,
          legendPosition: "middle",
          legendOffset: 50,
        }}
        axisLeft={{
          legend: axisLeftLegend,
          legendPosition: "middle",
          legendOffset: -50,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
        animate={true}
        motionConfig="gentle"
      />
    </div>
  );
};

export default BarChart;
