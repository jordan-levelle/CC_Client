const DOCS_URL = process.env.REACT_APP_DOCS_URL;

export const uploadDocument = async (proposalId, formData) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${DOCS_URL}/upload/${proposalId}`, {
    method: 'POST',
    body: formData,
    headers: {
      'Authorization': `Bearer ${token}`, // Include authorization token
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to upload document');
  }

  return await response.json();
};


export const fetchDocument = async (documentId) => {

  try {
    const response = await fetch(`${DOCS_URL}/${documentId}`);

    if (!response.ok) {
      console.error(`API responded with status: ${response.status} ${response.statusText}`);
      throw new Error('Failed to fetch document');
    }

    const document = await response.json();

    if (!document.fileUrl) {
      console.error('Document fetched but fileUrl is missing');
      throw new Error('Document URL not found');
    }

    // Open the document URL in a new tab
    window.open(document.fileUrl, '_blank');
    return document;
  } catch (error) {
    console.error('Error fetching document:', error.message);
    throw new Error('Unable to fetch document.');
  }
};

export const removeDocument = async (documentId) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Authentication token is missing. Please log in again.');
  }

  try {
    const response = await fetch(`${DOCS_URL}/${documentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Attempt to parse JSON error, fallback to generic message
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        throw new Error('Failed to remove document. Server returned an unexpected response.');
      }
      throw new Error(errorData.error || 'Failed to remove document');
    }

    // Check if response has a JSON body
    try {
      return await response.json();
    } catch {
      // If no JSON body, return a success indicator
      // TODO: Incorporate success true return for TOAST MESSAGES. Is it better? 
      return { success: true };
    }
  } catch (error) {
    console.error('Error in removeDocument API call:', error.message);
    throw error; // Re-throw to let caller handle it
  }
};




