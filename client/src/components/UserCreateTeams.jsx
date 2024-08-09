import React, { useState } from 'react';
import { createTeam } from '../api/teams';
import { useTeamsContext } from '../context/TeamsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const UserCreateTeams = () => {
  const [teamName, setTeamName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rows, setRows] = useState([]);
  const [error, setError] = useState(null);
  const { fetchTeams } = useTeamsContext(); // Get fetchTeams from context
  const { user } = useAuthContext();

  const handleAddRow = () => {
    if (name) { // Only require name, email is optional
      const newRow = { name, email };
      setRows([...rows, newRow]);
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
      await createTeam(teamName, members, user.token);
      setTeamName('');
      setRows([]);
      setError(null);
      fetchTeams(); // Refresh team list after creating a new team
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
            <th>Team Members</th>
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
                  className="icon-button delete-button"
                  onClick={() => handleDeleteRow(index)}
                  aria-label="Delete Row"
                >
                  <FontAwesomeIcon icon={faMinus} />
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
                placeholder="Optional"
                className="input-field"
              />
            </td>
            <td>
              <button
                className="icon-button add-button"
                onClick={handleAddRow}
                aria-label="Add Row"
              >
                <FontAwesomeIcon icon={faPlus} />
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


