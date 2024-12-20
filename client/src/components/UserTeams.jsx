import React, { useEffect, useState } from 'react';
import { useTeamsContext } from '../context/TeamsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { deleteTeam } from '../api/teams';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { teamTooltips } from '../constants/Constants';
import { Tooltip } from 'react-tooltip';
import { faPencil, faFile, faTrash } from '@fortawesome/free-solid-svg-icons';
import UserEditTeams from '../components/UserEditTeams'; // Import UserEditTeams
import ProposalForm from './proposalForm';
import Modal from './PopupOverlay';
import { showSuccessToast, showErrorToast } from 'src/utils/toastNotifications';
import 'react-tooltip/dist/react-tooltip.css';

const UserTeams = () => {
  const { teams, fetchTeams, updateSelectedTeam } = useTeamsContext();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showEditTeams, setShowEditTeams] = useState(false);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      fetchTeams(); 
    }
  }, [fetchTeams, user]);

  const handleEditTeams = (team) => {
    setSelectedTeam(team);
    setShowEditTeams(true);
  };

  const handleCancelEditTeams = () => {
    setSelectedTeam(null);
    setShowEditTeams(false);
  };

  const handleFileIconClick = (team) => {
    updateSelectedTeam(team);
    setShowProposalForm(true);
  }

  const handleDeleteClick = async (teamId) => {
    try {
      await deleteTeam(teamId, user.token);
      fetchTeams(); 
      showSuccessToast('teamDeleteSuccess');
    } catch (error) {
      console.error('Error deleting team:', error);
      showErrorToast('teamDeleteError');
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
              .filter(team => team !== null && team !== undefined) 
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
                        onClick={() => handleEditTeams(team)}
                      />
                      {showEditTeams && <UserEditTeams onClose={handleCancelEditTeams} />}
                      <Tooltip id="edit-tooltip" />
                    </div>
                    <div
                      data-tooltip-id="create-tooltip"
                      data-tooltip-html={teamTooltips.Create}
                      style={{ cursor: 'pointer' }}
                    >
                      <FontAwesomeIcon 
                        icon={faFile} 
                        className="action-icon" 
                        onClick={() => handleFileIconClick(team)}
                      />
                      <Tooltip id="create-tooltip" />
                    </div>
                    <div
                      data-tooltip-id="delete-tooltip"
                      data-tooltip-html={teamTooltips.Delete}
                      onClick={() => handleDeleteClick(team._id)} 
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
      {showEditTeams && (
          <UserEditTeams 
            selectedTeam={selectedTeam} 
            onClose={handleCancelEditTeams} 
          />
      )}
      {showProposalForm && (
        <Modal isOpen={showProposalForm} onClose={() => setShowProposalForm(false)}>
          <ProposalForm />
        </Modal>
      )}
    </div>
  );
};

export default UserTeams;


