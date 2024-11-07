import React, { useState, useEffect } from 'react';
import { AdminUserList } from '../components/AdminUserInfo';
import { AdminProposalList } from '../components/AdminProposalInfo';
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Box, Grid } from "@mui/material";

const Admin = () => {
  // State for storing user and proposal metrics
  const [userMetrics, setUserMetrics] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    inactiveUsers: 0,
  });

  const [proposalMetrics, setProposalMetrics] = useState({
    totalProposals: 0,
    proposalsLastMonth: 0,
  });

  useEffect(() => {
    // Fetch user metrics (replace with real API call)
    const fetchedUserMetrics = {
      totalUsers: 1200,
      activeUsers: 800,
      newUsers: 150,
      inactiveUsers: 250,
    };
    setUserMetrics(fetchedUserMetrics);

    // Fetch proposal metrics (replace with real API call)
    const fetchedProposalMetrics = {
      totalProposals: 300,
      proposalsLastMonth: 40,
    };
    setProposalMetrics(fetchedProposalMetrics);
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>

      {/* Metrics Section */}
      <Grid container spacing={3} style={{ marginBottom: "20px" }}>
        {/* User Metrics */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <Typography variant="h6">User Metrics</Typography>
            <Box mt={2}>
              <Typography>Total Users: {userMetrics.totalUsers}</Typography>
              <Typography>Active Users: {userMetrics.activeUsers}</Typography>
              <Typography>New Users: {userMetrics.newUsers}</Typography>
              <Typography>Inactive Users: {userMetrics.inactiveUsers}</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Proposal Metrics */}
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <Typography variant="h6">Proposal Metrics</Typography>
            <Box mt={2}>
              <Typography>Total Proposals: {proposalMetrics.totalProposals}</Typography>
              <Typography>Proposals Created Last Month: {proposalMetrics.proposalsLastMonth}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Tables Section */}
      <h4>User Table</h4>
      <AdminUserList />
      <h4>Proposal Table</h4>
      <AdminProposalList />
    </div>
  );
};

export default Admin;
