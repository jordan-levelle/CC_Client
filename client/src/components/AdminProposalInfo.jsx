import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import { Grid, Table, TableHeaderRow } from "@devexpress/dx-react-grid-material-ui";
import { fetchAllProposals } from "src/api/admin";
export const AdminProposalList = ({updateProposalMetrics}) => {
  // Define columns for the table
  const [columns] = useState([
    { name: "title", title: "Title" },
    { name: "name", title: "Name" },
    { name: "email", title: "Email" },
    { name: "user_id", title: "User ID" },
    { name: "uniqueUrl", title: "Url"},
    { name: "createdAt", title: "Created At" },
  ]);

  // State for proposals data
  const [rows, setRows] = useState([]);

  // Fetch proposals from the backend
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const data = await fetchAllProposals();
        setRows(data); // Set the fetched data to rows
        updateProposalMetrics(data.length);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      }
    };

    fetchProposals();
  }, [updateProposalMetrics]);

  const Cell = ({ column, value }) => {
    if (column.name === "uniqueUrl") {
      return (
        <Table.Cell>
          <a href={value} target="_blank" rel="noopener noreferrer">
            {value}
          </a>
        </Table.Cell>
      );
    }
    return <Table.Cell>{value}</Table.Cell>;
  };

  return (
    <div className="component-container-2">
      <Paper>
        <Grid rows={rows} columns={columns}>
          <Table cellComponent={Cell} />
          <TableHeaderRow />
        </Grid>
      </Paper>
    </div>
  );
};

