import React, { useState, useEffect } from 'react';
import { createTeam, editTeam } from '../api/teams';
import { useTeamsContext } from '../context/TeamsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import Notification from './Notification';
import validator from 'validator';
import { showSuccessToast, showErrorToast } from 'src/utils/toastNotifications';

const UserCreateTeams = ({ existingTeam, defaultMembers = [], onClose }) => {
  const [teamName, setTeamName] = useState(existingTeam ? existingTeam.teamName : '');
  const [rows, setRows] = useState(() =>
    existingTeam
      ? existingTeam.members.map(member => ({ name: member.memberName, email: member.memberEmail }))
      : defaultMembers.length > 0 // Populate from defaultMembers if provided
        ? defaultMembers
        : [{ name: '', email: '' }]
  );
  const [error, setError] = useState(null);
  const { fetchTeams } = useTeamsContext();
  const { user } = useAuthContext();

  useEffect(() => {
    if (existingTeam) {
      setTeamName(existingTeam.teamName);
      setRows(
        existingTeam.members.map(
          member => ({ name: member.memberName, email: member.memberEmail })
        )
      );
    }
  }, [existingTeam]);

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows([...rows, { name: '', email: '' }]);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.name === 'name') {
      handleAddRow();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!teamName) {
      setError('Team name is required');
      return;
    }

    const requireName = rows.filter(row => !row.name.trim());
    if (requireName.length > 0) {
      setError('All names are required');
      return;
    }

    const invalidEmail = rows.filter(row => row.email && !validator.isEmail(row.email));
    if (invalidEmail.length > 0) {
      setError('One or more emails are invalid');
      return;
    }

    try {
      const sortedRows = [...rows].sort((a, b) => a.name.localeCompare(b.name));
      const members = sortedRows.map(row => ({ memberName: row.name, memberEmail: row.email }));

      if (existingTeam) {
        await editTeam(existingTeam._id, { teamName, members }, user.token);
        showSuccessToast('teamEditSuccess'); // Show success toast for edit
      } else {
        await createTeam({ teamName, members }, user.token);
        showSuccessToast('teamCreateSuccess'); // Show success toast for creation
      }
      setTeamName('');
      setRows([{ name: '', email: '' }]);
      setError(null);
      fetchTeams();
      if (onClose) onClose();
    } catch (error) {
      setError('Failed to save team');
      showErrorToast('teamError'); // Show error toast
    }
  };

  return (
    <form className="user-create-teams" onSubmit={handleSubmit}>
      <label htmlFor="team-name" className="team-name-label">Team Name</label>
      <input
        id="team-name"
        aria-label="Team Name"
        className="input-field"
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
              <td>
                <input
                  id='name'
                  name="name"
                  type="text"
                  value={row.name}
                  onChange={(e) => handleRowChange(index, 'name', e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Name"
                  className="input-field"
                  required
                />
              </td>
              <td>
                <input
                  id='email'
                  name='email'
                  type="email"
                  value={row.email}
                  onChange={(e) => handleRowChange(index, 'email', e.target.value)}
                  placeholder="Optional"
                  className="input-field"
                />
              </td>
              <td>
                <button
                  type="button"
                  className="icon-button delete-button"
                  onClick={() => handleDeleteRow(index)}
                  aria-label="Delete Row"
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan="3">
              <button
                type="button"
                className="icon-button add-button"
                onClick={handleAddRow}
                aria-label="Add Row"
              >
                <FontAwesomeIcon icon={faPlus} /> Add Member
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <Notification message={error} />
      <button
        type="submit"
        className="small-button"
      >
        {existingTeam ? 'Update Team' : 'Create Team'}
      </button>
    </form>
  );
};

export default UserCreateTeams;
