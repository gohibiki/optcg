// File: /api/get-cards.js

export default async function handler(request, response) {
  try {
    const apiURL = 'https://api.dotgg.gg/cgfw/getcards?game=onepiece&mode=indexed&cache=6360';
    const apiResponse = await fetch(apiURL);

    if (!apiResponse.ok) {
      return response.status(apiResponse.status).json({ error: 'Failed to fetch from external API' });
    }

    const data = await apiResponse.json();
    response.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    response.status(200).json(data);

  } catch (error) {
    response.status(500).json({ error: 'Internal Server Error' });
  }
}