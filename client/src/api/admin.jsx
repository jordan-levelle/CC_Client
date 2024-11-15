const ADMIN_URL = process.env.REACT_APP_ADMIN_URL;

// Get All Proposals
export const fetchAllProposals = async () => {
    const headers = {
        'Content-Type': 'application/json'
    };

    const response = await fetch(`${ADMIN_URL}/allProposals`, {
        headers: headers,
    });

    if (!response.ok) {
        throw new Error('Failed to fetch proposals');
      }
    
      return response.json();
}


export const fetchAllUsers = async () => {
    const headers = {
        'Content-Type': 'application/json'
    };

    const response = await fetch(`${ADMIN_URL}/allUsers`, {
        headers: headers,
    });

    if (!response.ok) {
        throw new Error('Failed to fetch proposals');
      }
    
      return response.json();
}