import {
  Box,
  Typography,
  useTheme,
  Button,
  CircularProgress,
  Chip,
  Stack,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import { fetchTeam, deleteUserById } from "./teamapi"; // <-- add deleteUserById
import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeam()
      .then((data) => setTeam(data))
      .catch((err) => alert(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (!confirm) return;

    try {
      await deleteUserById(id);
      setTeam((prev) =>
        prev.filter((user) => user._id !== id && user.id !== id)
      );
      alert("User deleted successfully!");
    } catch (err) {
      alert(err.message || "Failed to delete user");
    }
  };

  const columns = [
    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "nationalId",
      headerName: "National ID",
      width: 180,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
    },
    {
      field: "role",
      headerName: "Role",
      width: 130,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          sx={{
            textTransform: "capitalize",
            backgroundColor:
              value === "ADMIN"
                ? colors.redAccent[500]
                : colors.greenAccent[500],
            color: "#fff",
            fontWeight: "bold",
          }}
        />
      ),
    },
    {
      field: "employed",
      headerName: "Employed",
      width: 130,
      renderCell: ({ value }) => (
        <Chip
          label={value ? "Yes" : "No"}
          color={value ? "success" : "error"}
          variant="outlined"
          sx={{ fontWeight: "bold" }}
        />
      ),
    },
    {
      field: "shift",
      headerName: "Shift",
      width: 120,
      renderCell: ({ value }) => (
        <Chip
          label={value}
          sx={{
            textTransform: "capitalize",
            backgroundColor:
              value === "DAY"
                ? colors.blueAccent[500]
                : colors.purpleAccent?.[500] || "#9c27b0",
            color: "#fff",
            fontWeight: "bold",
          }}
        />
      ),
    },
    {
      field: "action",
      headerName: "Action",
      width: 180,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            color="primary"
            onClick={() => navigate(`/dashboard/team/view/${params.row.id}`)}
            title="View"
          >
            <VisibilityIcon />
          </IconButton>
          <IconButton
            color="info"
            onClick={() => navigate(`/dashboard/team/updateStaff/${params.row.id}`)}
            title="Edit"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row.id)}
            title="Delete"
          >
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="TEAM" subtitle="Manage your team members effectively" />
      <Box mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/dashboard/team/addStaff")}
        >
          Add Staff
        </Button>
      </Box>
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
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={300}
          >
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            autoHeight
            checkboxSelection
            rows={team.map((user) => ({
              id: user._id || user.id, // Required
              email: user.email,
              nationalId: user.nationalId,
              phone: user.phone,
              role: user.role,
              employed: user.employed,
              shift: user.shift,
            }))}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10]}
            initialState={{
              pagination: { paginationModel: { pageSize: 5, page: 0 } },
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default Team;
