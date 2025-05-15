import { Box, colors } from "@mui/material";
import Header from "../../components/Header";
import GeographyChart from "../../components/GeographyChart";

const Geography = () => {
  return (
    <Box m="20px">
      <Header title="Geography Chart" subtitle="Simple Geography Chart" />
      <Box height="700px" width="1000px" border={`1px solid ${colors.orange[100]}`} borderRadius="4px" >
        <GeographyChart />
      </Box>
    </Box>
  );
};

export default Geography;