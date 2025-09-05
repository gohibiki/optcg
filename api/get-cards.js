import { URL } from 'url';

export default async function handler(request, response) {
  try {
    // Get the 'set' query parameter from the request URL
    const requestUrl = new URL(request.url, `http://${request.headers.host}`);
    const setNumber = requestUrl.searchParams.get('set');

    if (!setNumber) {
      return response.status(400).json({ error: 'Set number parameter is required.' });
    }

    // Construct the real (and hidden) API URL
    const apiUrl = `https://opbountypck.s3.us-east-1.amazonaws.com/stats/regular/Stats_OP${setNumber}.json`;
    
    const apiResponse = await fetch(apiUrl);

    if (!apiResponse.ok) {
      return response.status(apiResponse.status).json({ error: 'Failed to fetch stats data.' });
    }

    // The data is text that needs to be decoded on the client, so we pass it as text
    const rawData = await apiResponse.text();
    
    response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    response.status(200).send(rawData);

  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' });
  }
}