const TEAMS_URL = process.env.REACT_APP_TEAMS_URL;

export const createTeam = async (teamName, members) => {
    try {
      const response = await fetch(`${TEAMS_URL}/teams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Adjust if you are using a different method for token storage
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


export const deleteTeam = () => {

}

export const editTeam = () => {
    
}

export const teamList = async () => {
    try {
      const response = await fetch(`${TEAMS_URL}/teams`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch teams');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

