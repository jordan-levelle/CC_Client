import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import {
  Grid,
  Table,
  TableHeaderRow,
} from "@devexpress/dx-react-grid-material-ui";

// Sample Data
const sampleUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", signupDate: "2024-01-15" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", signupDate: "2024-02-10" },
  { id: 3, name: "Alice Johnson", email: "alice@example.com", signupDate: "2024-03-05" },
];

// Exported UserList Component
export const AdminUserList = () => {
  // Define columns based on the sampleUsers data
  const [columns] = useState([
    { name: "id", title: "ID" },
    { name: "name", title: "Name" },
    { name: "email", title: "Email" },
    { name: "signupDate", title: "Signup Date" },
  ]);

  // Define rows as sampleUsers data
  const [rows] = useState(sampleUsers);

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



