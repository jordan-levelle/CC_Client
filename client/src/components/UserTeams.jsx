import React, { useEffect, useState } from 'react';
import { useTeamsContext } from '../context/TeamsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { deleteTeam } from '../api/teams';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { teamTooltips } from '../constants/Icons_Tooltips';
import { Tooltip } from 'react-tooltip';
import { faPencil, faFile, faTrash } from '@fortawesome/free-solid-svg-icons';
import 'react-tooltip/dist/react-tooltip.css';
import UserEditTeams from '../components/UserEditTeams'; // Import UserEditTeams

const UserTeams = () => {
  const { teams, fetchTeams } = useTeamsContext();
  const { user } = useAuthContext();

  const [showEditTeams, setShowEditTeams] = useState(false);
 
  useEffect(() => {
    if (user) {
      fetchTeams(); // Fetch teams when the component mounts and user is available
    }
  }, [fetchTeams, user]);

  const handleEditTeams = () => {
    setShowEditTeams(true);
  };

  const handleCancelEditTeams = () => {
    setShowEditTeams(false);
  };

  const handleDeleteClick = async (teamId) => {
    try {
      await deleteTeam(teamId, user.token);
      fetchTeams(); // Refresh the team list after deletion
    } catch (error) {
      console.error('Error deleting team:', error);
      // Optionally, display an error message to the user here
    }
  };

  return (
    <div>
      <table className="teams-table">
        <thead>
          <tr>
            <th>Team Name</th>
            <th className="members-column">Members</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(teams) && teams.length > 0 ? (
            teams
              .filter(team => team !== null && team !== undefined) // Filter out null or undefined teams
              .map((team) => (
                <tr key={team._id}>
                  <td>{team.teamName}</td>
                  <td>{team.members.length}</td>
                  <td className="actions-column">
                    <div
                      data-tooltip-id="edit-tooltip"
                      data-tooltip-html={teamTooltips.Edit}
                      style={{ cursor: 'pointer' }}
                    >
                      <FontAwesomeIcon 
                        icon={faPencil} 
                        className="action-icon" 
                        onClick={handleEditTeams}
                      />
                      {showEditTeams && <UserEditTeams onClose={handleCancelEditTeams} />}
                      <Tooltip id="edit-tooltip" />
                    </div>
                    <div
                      data-tooltip-id="create-tooltip"
                      data-tooltip-html={teamTooltips.Create}
                      style={{ cursor: 'pointer' }}
                    >
                      <FontAwesomeIcon icon={faFile} className="action-icon" />
                      <Tooltip id="create-tooltip" />
                    </div>
                    <div
                      data-tooltip-id="delete-tooltip"
                      data-tooltip-html={teamTooltips.Delete}
                      onClick={() => handleDeleteClick(team._id)} // Pass teamId here
                      style={{ cursor: 'pointer' }}
                    >
                      <FontAwesomeIcon icon={faTrash} className="action-icon" />
                      <Tooltip id="delete-tooltip" />
                    </div>
                  </td>
                </tr>
              ))
          ) : (
            <tr><td colSpan="3">No teams available</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTeams;


