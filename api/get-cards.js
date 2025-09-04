export default async function handler(request, response) {
  try {
    // The real API URL is now hidden on the server-side
    const apiURL = 'https://api.dotgg.gg/cgfw/getcards?game=onepiece&mode=indexed&cache=6360';
    
    const apiResponse = await fetch(apiURL);

    if (!apiResponse.ok) {
      // If the API call failed, forward the error status
      return response.status(apiResponse.status).json({ error: 'Failed to fetch from external API' });
    }

    const data = await apiResponse.json();
    
    // Send the data back to your frontend
    // Set cache headers to tell browsers/CDNs to cache the response
    response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate'); // Cache for 1 hour
    response.status(200).json(data);

  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
}