const DOCS_URL = process.env.REACT_APP_DOCS_URL;

export const uploadDocument = async (proposalId, formData) => {
  const response = await fetch(`${DOCS_URL}/${proposalId}`, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json', // Optional, but helpful for handling JSON responses
    }
  });

  if (!response.ok) {
    throw new Error('Failed to upload document');
  }

  const result = await response.json();
  return result;
};
