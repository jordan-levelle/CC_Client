import React, { useState } from "react";
import { AdminUserList } from "../components/AdminUserInfo";
import { AdminProposalList } from "../components/AdminProposalInfo";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Box, Grid2 } from "@mui/material";

const Admin = () => {
  // State for storing user and proposal metrics
  const [userMetrics, setUserMetrics] = useState({
    totalUsers: 0,
  });

  const [proposalMetrics, setProposalMetrics] = useState({
    totalProposals: 0,
  });

  const updateUserMetrics = (count) => {
    setUserMetrics({ totalUsers: count });
  };

  const updateProposalMetrics = (count) => {
    setProposalMetrics({ totalProposals: count });
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {/* Metrics Section */}
      <Grid2 container spacing={3} style={{ marginBottom: "20px" }}>
        {/* User Metrics */}
        <Grid2 item xs={12} sm={6}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <Typography variant="h6">User Metrics</Typography>
            <Box mt={2}>
              <Typography>Total Users: {userMetrics.totalUsers}</Typography>
            </Box>
          </Paper>
        </Grid2>

        {/* Proposal Metrics */}
        <Grid2 item xs={12} sm={6}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <Typography variant="h6">Proposal Metrics</Typography>
            <Box mt={2}>
              <Typography>Total Proposals: {proposalMetrics.totalProposals}</Typography>
            </Box>
          </Paper>
        </Grid2>
      </Grid2>

      {/* Tables Section */}
      <h4>User Table</h4>
      <AdminUserList updateUserMetrics={updateUserMetrics} />
      <h4>Proposal Table</h4>
      <AdminProposalList updateProposalMetrics={updateProposalMetrics} />
    </div>
  );
};

export default Admin;

