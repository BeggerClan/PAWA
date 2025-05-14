import { Typography, Box } from "@mui/material";

const Header = ({ title, subtitle }) => (
  <Box mb={2}>
    <Typography variant="h4" fontWeight="bold">
      {title}
    </Typography>
    <Typography variant="subtitle1" color="text.secondary">
      {subtitle}
    </Typography>
  </Box>
);

export default Header;