export default async function handler(request, response) {
  try {
    // Get the set number from query parameters
    const { set } = request.query;
    
    // Validate set parameter
    if (!set || !/^\d{2}$/.test(set)) {
      return response.status(400).json({ error: 'Invalid set parameter. Must be a 2-digit number.' });
    }
    
    // The real API URL is now hidden on the server-side
    const apiURL = `https://opbountypck.s3.us-east-1.amazonaws.com/stats/regular/Stats_OP${set}.json`;
    
    const apiResponse = await fetch(apiURL);

    if (!apiResponse.ok) {
      // If the API call failed, forward the error status
      return response.status(apiResponse.status).json({ error: 'Failed to fetch from external API' });
    }

    // Get the raw data (it's base64 encoded and compressed)
    const rawData = await apiResponse.text();
    
    // Send the raw data back to your frontend
    // Set cache headers to tell browsers/CDNs to cache the response
    response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // Cache for 1 hour
    response.setHeader('Content-Type', 'text/plain'); // Keep as text since it's base64 encoded
    response.status(200).send(rawData);

  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
}