const { esClient, CANDIDATES_INDEX } = require("../config/elasticsearch");
const { prisma } = require("../config/prisma");

async function searchCandidates(query) {
  const q = typeof query === "string" ? query : query?.q || "";
  const result = await esClient.search({
    index: CANDIDATES_INDEX,
    body: {
      query: {
        bool: {
          should: [
            { match: { name: q } },
            { match_phrase_prefix: { email: q } },
            { match_phrase_prefix: { phone: q } },
          ],
          minimum_should_match: 1,
        },
      },
    },
  });
  const hits = result.body?.hits?.hits ?? result.hits?.hits ?? [];
  const ids = hits.map((h) => parseInt(h._id));
  if (ids.length === 0) return [];
  const candidates = await prisma.candidate.findMany({
    where: { id: { in: ids } },
  });
  const orderMap = {};
  ids.forEach((id, i) => (orderMap[id] = i));
  return candidates.sort((a, b) => orderMap[a.id] - orderMap[b.id]);
}

module.exports = { searchCandidates };
