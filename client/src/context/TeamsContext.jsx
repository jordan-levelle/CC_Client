
import React, { createContext, useContext, useState, useCallback } from 'react';
import { teamList } from '../api/teams';
import { useAuthContext } from '../hooks/useAuthContext';

const TeamsContext = createContext();

export const useTeamsContext = () => {
  return useContext(TeamsContext);
};

export const TeamsContextProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);
  const { user } = useAuthContext();

  const fetchTeams = useCallback(async () => {
    if (user && user.token) {
      try {
        const response = await teamList(user.token);
        if (response.teams && Array.isArray(response.teams)) {
          setTeams(response.teams);
        } else {
          console.error('Unexpected response format:', response);
        }
      } catch (error) {
        console.error('Failed to fetch teams:', error);
      }
    }
  }, [user]);

  return (
    <TeamsContext.Provider value={{ teams, fetchTeams }}>
      {children}
    </TeamsContext.Provider>
  );
};

