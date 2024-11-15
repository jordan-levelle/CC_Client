import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import { Grid, Table, TableHeaderRow } from "@devexpress/dx-react-grid-material-ui";
import { fetchAllUsers } from "src/api/admin";
export const AdminUserList = () => {
  // Define columns for the table
  const [columns] = useState([
    { name: "_id", title: "User ID" },
    { name: "email", title: "Email" },
    { name: "proposalCount", title: "Number of Proposals" },
    { name: "subscriptionStatus", title: "Subscription Status" },
  ]);

  // State for users data
  const [rows, setRows] = useState([]);

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await fetchAllUsers();
        // Add proposal count to each user object
        const processedData = data.map(user => ({
          ...user,
          proposalCount: user.proposals ? user.proposals.length : 0,
          subscriptionStatus: user.subscriptionStatus ? "Subscribed" : "Not Subscribed",
        }));
        setRows(processedData); // Set the processed data to rows
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="component-container-1">
      <Paper>
        <Grid rows={rows} columns={columns}>
          <Table />
          <TableHeaderRow />
        </Grid>
      </Paper>
    </div>
  );
};



