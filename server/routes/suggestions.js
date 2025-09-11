import express from 'express';

const router = express.Router();

// Simple in-memory cache
const cache = new Map();
const putCache = (key, value, ttlMs = 10 * 60 * 1000) => {
  cache.set(key, { value, expireAt: Date.now() + ttlMs });
};
const getCache = (key) => {
  const e = cache.get(key);
  if (!e) return null;
  if (Date.now() > e.expireAt) { cache.delete(key); return null; }
  return e.value;
};

// Simple heuristic suggestions with optional Gemini API
router.post('/', async (req, res) => {
  try {
    const { budget = 'medium', tripType = 'leisure', origin = '', month = '' } = req.body || {};

    // Heuristic set of destinations
    const pools = {
      budget: {
        low: ['Bangkok', 'Bali', 'Hoi An', 'Lisbon', 'Budapest'],
        medium: ['Barcelona', 'Istanbul', 'Prague', 'Mexico City', 'Cape Town'],
        high: ['Tokyo', 'Zurich', 'Reykjavik', 'Sydney', 'New York']
      },
      adventure: ['Queenstown', 'Cusco', 'Banff', 'Chamonix', 'Interlaken'],
      leisure: ['Santorini', 'Amalfi Coast', 'Phuket', 'Maui', 'Maldives'],
      culture: ['Kyoto', 'Marrakesh', 'Rome', 'Athens', 'Cairo']
    };

    const budgetKey = ['low','medium','high'].includes(String(budget)) ? String(budget) : 'medium';
    const tripTypeKey = ['adventure','leisure','culture'].includes(String(tripType)) ? String(tripType) : 'leisure';

    const base = new Set(pools.budget[budgetKey] || pools.budget.medium);
    const flavor = pools[tripTypeKey] || pools.leisure;
    flavor.forEach((d) => base.add(d));

    const cacheKey = `sugg:${budget}:${tripType}:${origin}:${month}`;
    const cached = getCache(cacheKey);
    if (cached) return res.json(cached);

    let suggestions = Array.from(base).slice(0, 8);

    // Optionally refine with Gemini if key provided
    if (process.env.GEMINI_API_KEY) {
      try {
        const prompt = `Suggest 5 travel destinations for a ${tripType} trip with a ${budget} budget in ${month || 'any month'}, starting near ${origin || 'anywhere'}. Return JSON array of objects {name, why}.`;
        const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + process.env.GEMINI_API_KEY, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        const data = await r.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const jsonText = (text.match(/\[[\s\S]*\]/) || [])[0] || '[]';
        const json = JSON.parse(jsonText);
        if (Array.isArray(json) && json.length) {
          suggestions = json.map((o) => o && o.name).filter(Boolean).slice(0, 8);
        }
      } catch (e) {
        // Fallback silently
      }
    }

    const resp = { suggestions };
    putCache(cacheKey, resp);
    res.json(resp);
  } catch (e) {
    res.status(500).json({ message: 'Failed to generate suggestions' });
  }
});

export default router;

