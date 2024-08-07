import React, { useEffect } from 'react';
import { useTeamsContext } from '../context/TeamsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { deleteTeam } from '../api/teams';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'react-tooltip'; // Import Tooltip
import { teamTooltips } from '../constants/Icons_Tooltips'; // Import tooltips
import 'react-tooltip/dist/react-tooltip.css'; // Import Tooltip styles
import { faPencil, faFile, faTrash } from '@fortawesome/free-solid-svg-icons';

const UserTeams = () => {
  const { teams, fetchTeams } = useTeamsContext();
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      fetchTeams(); // Fetch teams when the component mounts and user is available
    }
  }, [fetchTeams, user]);

  useEffect(() => {
    console.log('Teams:', teams); // Debugging log
  }, [teams]);


  const handleDeleteClick = async () => {
    try {
      await deleteTeam();
      // Optionally, refresh the team list or provide feedback to the user
    } catch (error) {
      // Handle error (show error message, etc.)
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
            teams.map((team) => (
              <tr key={team._id}>
                <td>{team.teamName}</td>
                <td>{team.members.length}</td>
                <td className="actions-column">
                  <div
                    data-tooltip-id="edit-tooltip"
                    data-tooltip-html={teamTooltips.Edit}
                    style={{ cursor: 'pointer' }}
                  >
                    <FontAwesomeIcon icon={faPencil} className="action-icon" />
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
                    onClick={handleDeleteClick}
                    style={{ cursor: 'pointer' }} // Ensure the cursor indicates it's clickable
                  >
                    <FontAwesomeIcon icon={faTrash} className="action-icon" />
                    <Tooltip id="delete-tooltip" />
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No teams available</td> {/* Adjusted colSpan to 3 */}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTeams;

