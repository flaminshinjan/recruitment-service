const searchService = require("../services/search.service");

async function searchCandidates(req, res) {
  try {
    const q = req.query.q || "";
    if (!q.trim()) {
      return res.status(400).json({ error: "Query parameter 'q' required" });
    }
    const candidates = await searchService.searchCandidates(q);
    res.json(candidates);
  } catch (err) {
    const msg = err.message || err.meta?.body?.error?.reason || "Elasticsearch error";
    res.status(500).json({ error: msg });
  }
}

module.exports = { searchCandidates };
