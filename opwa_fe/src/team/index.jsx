import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../theme";
import { mockDataTeam } from "../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../components/Header";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const handleEdit = (id) => {
    alert(`Edit user with ID: ${id}`);
    // TODO: Navigate or open modal
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      alert(`Deleted user with ID: ${id}`);
      // TODO: Delete logic
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "name",
      headerName: "Full Name",
      width: 180,
      cellClassName: "name-column--cell",
    },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 100,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
    },
    {
      field: "email",
      headerName: "Email",
      width: 220,
    },
    {
      field: "access",
      headerName: "Access Level",
      width: 180,
      renderCell: ({ row: { access } }) => {
        const icon =
          access === "admin" ? (
            <AdminPanelSettingsOutlinedIcon />
          ) : access === "manager" ? (
            <SecurityOutlinedIcon />
          ) : (
            <LockOpenOutlinedIcon />
          );

        const bgColor =
          access === "admin"
            ? colors.greenAccent[600]
            : colors.greenAccent[700];

        return (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            padding="4px 8px"
            borderRadius="4px"
            sx={{ backgroundColor: bgColor }}
          >
            {icon}
            <Typography color={colors.grey[100]} textTransform="capitalize">
              {access}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: ({ row }) => (
        <Box>
          <IconButton
            onClick={() => handleEdit(row.id)}
            sx={{ color: colors.blueAccent[300] }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(row.id)}
            sx={{ color: colors.redAccent ? colors.redAccent[400] : "red" }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Manage your team members effectively" />
      <Box
        mt="40px"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
            fontSize: 13,
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
            fontWeight: 500,
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
            fontSize: 14,
            fontWeight: "bold",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: colors.primary[500],
          },
        }}
      >
        <DataGrid
          autoHeight
          checkboxSelection
          rows={mockDataTeam}
          columns={columns}
          disableRowSelectionOnClick
          pageSizeOptions={[5, 10]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5, page: 0 } },
          }}
        />
      </Box>
    </Box>
  );
};

export default Team;
