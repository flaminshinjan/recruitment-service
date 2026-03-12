const { prisma } = require("../config/prisma");
const { esClient, CANDIDATES_INDEX } = require("../config/elasticsearch");

async function indexCandidate(candidate) {
  try {
    await esClient.index({
      index: CANDIDATES_INDEX,
      id: String(candidate.id),
      refresh: true,
      document: {
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone || null,
      },
    });
  } catch (err) {
    console.warn("Elasticsearch index error:", err.message);
  }
}

async function createCandidate(data) {
  const candidate = await prisma.candidate.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
    },
  });
  await indexCandidate(candidate);
  return candidate;
}

async function listCandidates() {
  return prisma.candidate.findMany({ orderBy: { createdAt: "desc" } });
}

async function getCandidateById(id) {
  return prisma.candidate.findUnique({
    where: { id: parseInt(id) },
    include: { applications: { include: { job: true } } },
  });
}

async function findOrCreateCandidate(data) {
  const existing = await prisma.candidate.findFirst({
    where: { email: data.email },
  });
  if (existing) return existing;
  return createCandidate(data);
}

module.exports = {
  createCandidate,
  listCandidates,
  getCandidateById,
  findOrCreateCandidate,
  indexCandidate,
};
