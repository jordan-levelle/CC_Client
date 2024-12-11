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
  console.log(`fetchDocument called with documentId: ${documentId}`);

  try {
    console.log(`Sending API request to: ${DOCS_URL}/${documentId}`);
    const response = await fetch(`${DOCS_URL}/${documentId}`);

    if (!response.ok) {
      console.error(`API responded with status: ${response.status} ${response.statusText}`);
      throw new Error('Failed to fetch document');
    }

    const document = await response.json();
    console.log('API response data:', document);

    if (!document.fileUrl) {
      console.error('Document fetched but fileUrl is missing');
      throw new Error('Document URL not found');
    }

    console.log('Document successfully fetched:', document);

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

  try {
    const response = await fetch(`${DOCS_URL}/${documentId}`, {
      method: 'DELETE', 
      headers: {
        'Authorization': `Bearer ${token}`, 
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to remove document');
    }

    return await response.json();
  } catch (error) {
    console.error('Error in removeDocument API call:', error.message);
    throw error; 
  }
};



