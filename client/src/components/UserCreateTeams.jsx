import React, { useState } from 'react';
import { createTeam, editTeam } from '../api/teams';
import { useTeamsContext } from '../context/TeamsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';

const UserCreateTeams = ({ existingTeam, onClose }) => {
  const [teamName, setTeamName] = useState(existingTeam ? existingTeam.teamName : '');
  const [rows, setRows] = useState(existingTeam ? existingTeam.members.map(member => ({ name: member.memberName, email: member.memberEmail })) : []);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const { fetchTeams } = useTeamsContext();
  const { user } = useAuthContext();

  const handleAddRow = () => {
    if (name) {
      const newRow = { name, email };
      setRows([...rows, newRow]);
      setName('');
      setEmail('');
    }
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleEmailChange = (index, value) => {
    const updatedRows = [...rows];
    updatedRows[index].email = value;
    setRows(updatedRows);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const members = rows.map(row => ({ memberName: row.name, memberEmail: row.email }));

        if (existingTeam) {
            await editTeam(existingTeam._id, { teamName, members }, user.token);
        } else {
            await createTeam({ teamName, members }, user.token);
        }

        setTeamName('');
        setRows([]);
        setError(null);
        fetchTeams(); // Refresh team list after creating or editing a team
        if (onClose) onClose(); // Call onClose if it is defined
    } catch (error) {
        setError('Failed to save team');
    }
  };

  return (
    <form className="user-create-teams" onSubmit={handleSubmit}>
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
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(rows) && rows.map((row, index) => (
            <tr key={index}>
              <td>{row.name}</td>
              <td>
                <input
                  type="email"
                  value={row.email || ''}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  placeholder="Optional"
                  className="email-input-field"
                />
              </td>
              <td>
                <button
                  type="button"
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
                type="button"
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
        type="submit"
        className="create-team-button"
      >
        {existingTeam ? 'Update Team' : 'Create Team'}
      </button>
    </form>
  );
};

export default UserCreateTeams;
