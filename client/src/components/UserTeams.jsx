import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { teamList } from '../api/teams';
import { useAuthContext } from '../hooks/useAuthContext';

const UserTeams = forwardRef((props, ref) => {
  const [teams, setTeams] = useState([]);
  const { user } = useAuthContext();

  const fetchTeams = async () => {
    try {
      const data = await teamList();
      setTeams(data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchTeams,
  }));

  useEffect(() => {
    if (user) {
      fetchTeams();
    }
  }, [user]);

  return (
    <div>
      <table className="teams-table">
        <thead>
          <tr>
            <th>Team Name</th>
            <th>Members</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr key={team._id}>
              <td>{team.teamName}</td>
              <td>{team.members.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default UserTeams;

