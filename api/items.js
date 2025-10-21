import data from '../src/sample-data.json';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { zip } = req.query;

  if (!zip) {
    return res.status(400).json({ error: 'ZIP code is required' });
  }

  try {
    // Get items for the specific ZIP code
    const items = data[zip] || [];
    
    // If no items found for this ZIP, return a random set for demo
    if (items.length === 0) {
      const allZips = Object.keys(data);
      const randomZip = allZips[Math.floor(Math.random() * allZips.length)];
      const fallbackItems = data[randomZip] || [];
      
      return res.status(200).json({
        success: true,
        data: {
          zip: zip,
          items: fallbackItems,
          fallback: true
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        zip: zip,
        items: items,
        fallback: false
      }
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
}
