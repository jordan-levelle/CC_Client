// api/teams.js

const TEAMS_URL = process.env.REACT_APP_TEAMS_URL;

export const createTeam = async ({ teamName, members }, token) => {
  try {
    const response = await fetch(`${TEAMS_URL}/createUserTeam`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ teamName, members }),
    });

    if (!response.ok) {
      throw new Error('Failed to create team');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const fetchTeam = async (teamId, token) => {
  try {
    const response = await fetch(`${TEAMS_URL}/viewUserTeam/${teamId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch team');
    }

    const data = await response.json();
    return data; // Ensure that `data` has the expected structure
  } catch (error) {
    console.error('Error fetching team:', error);
    throw error;
  }
};

export const deleteTeam = async (teamId, token) => {
  try {
    const response = await fetch(`${TEAMS_URL}/deleteUserTeam/${teamId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete team');
    }

    return await response.json(); // Assuming the response is JSON
  } catch (error) {
    console.error('Error deleting team:', error);
    throw error; // Rethrow the error for further handling
  }
};

export const editTeam = async (teamId, { teamName, members }, token) => {
  try {
    const response = await fetch(`${TEAMS_URL}/editUserTeam/${teamId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ teamName, members }), // Ensure the payload matches what the backend expects
    });

    if (!response.ok) {
      throw new Error('Failed to update team');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating team:', error);
    throw error;
  }
};

export const teamList = async (token) => {
  try {
    const response = await fetch(`${TEAMS_URL}/viewUserTeamList`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch teams');
    }

    const data = await response.json();
    return data; // Ensure that `data` has the expected structure
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};


