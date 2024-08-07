const TEAMS_URL = process.env.REACT_APP_TEAMS_URL;
  
  export const createTeam = async (teamName, members, token) => {
    try {
      console.log('Creating team with token:', token); // Add logging
  
      const response = await fetch(`${TEAMS_URL}/createUserTeam`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Correctly set the Authorization header
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
  


  export const deleteTeam = async (teamId) => {
    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Add any authentication headers if necessary
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

export const editTeam = () => {
    
}

export const teamList = async (token) => {
  try {
    const response = await fetch(`${TEAMS_URL}/viewUserTeamList`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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

