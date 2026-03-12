const { prisma } = require("../config/prisma");
const { findOrCreateCandidate } = require("./candidate.service");

async function apply(data) {
  let candidateId = data.candidate_id;
  if (!candidateId && data.candidate) {
    const candidate = await findOrCreateCandidate(data.candidate);
    candidateId = candidate.id;
  }
  if (!candidateId) {
    throw new Error("Either candidate_id or candidate details required");
  }
  const jobId = parseInt(data.job_id);
  if (!jobId) throw new Error("job_id required");

  const application = await prisma.application.create({
    data: { candidateId, jobId },
    include: {
      candidate: true,
      job: true,
    },
  });
  return application;
}

async function listApplications() {
  return prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    include: { candidate: true, job: true },
  });
}

module.exports = { apply, listApplications };
