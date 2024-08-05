import React, { useState } from 'react';
import { createTeam } from '../api/teams';
import { useAuthContext } from '../hooks/useAuthContext';

const UserCreateTeams = ({ onTeamCreated }) => {
  const [teamName, setTeamName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();

  const handleAddRow = () => {
    if (name && email) {
      setRows([...rows, { name, email }]);
      setName('');
      setEmail('');
    }
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((row, i) => i !== index);
    setRows(updatedRows);
  };

  const handleCreateTeam = async () => {
    try {
      const members = rows.map(row => ({ memberName: row.name, memberEmail: row.email }));
      const result = await createTeam(teamName, members);
      console.log('Team created successfully', result);
      setTeamName('');
      setRows([]);
      setError(null);
      if (onTeamCreated) {
        onTeamCreated(); // Notify the parent component to refresh the team list
      }
    } catch (error) {
      setError('Failed to create team');
    }
  };

  return (
    <div className="user-create-teams">
      <label htmlFor="team-name" className="team-name-label">Team Name</label>
      <input
        id="team-name"
        aria-label="Team Name"
        className="team-name-input"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />
      <table className="teams-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(rows) && rows.map((row, index) => (
            <tr key={index}>
              <td>{row.name}</td>
              <td>{row.email}</td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => handleDeleteRow(index)}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                className="input-field"
              />
            </td>
            <td>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="input-field"
              />
            </td>
            <td>
              <button
                className="add-button"
                onClick={handleAddRow}
              >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      {error && <div className="error-message">{error}</div>}
      <button
        className="create-team-button"
        onClick={handleCreateTeam}
      >
        Create Team
      </button>
    </div>
  );
};

export default UserCreateTeams;
