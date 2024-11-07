import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import {
  Grid,
  Table,
  TableHeaderRow,
} from "@devexpress/dx-react-grid-material-ui";

// Sample Proposal Data
const sampleProposals = [
  { id: 1, title: "Project Alpha", status: "Pending", dateSubmitted: "2024-04-01" },
  { id: 2, title: "Project Beta", status: "Approved", dateSubmitted: "2024-05-15" },
  { id: 3, title: "Project Gamma", status: "Rejected", dateSubmitted: "2024-06-10" },
];

// Exported ProposalList Component
export const AdminProposalList = () => {
  // Define columns based on the sampleProposals data
  const [columns] = useState([
    { name: "id", title: "ID" },
    { name: "title", title: "Title" },
    { name: "status", title: "Status" },
    { name: "dateSubmitted", title: "Date Submitted" },
  ]);

  // Define rows as sampleProposals data
  const [rows] = useState(sampleProposals);

  return (
    <div className="component-container-2">
      <Paper>
        <Grid rows={rows} columns={columns}>
          <Table />
          <TableHeaderRow />
        </Grid>
      </Paper>    
    </div>
  );
};
