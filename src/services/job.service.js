const { prisma } = require("../config/prisma");

async function createJob(data) {
  return prisma.job.create({
    data: {
      title: data.title,
      description: data.description,
      location: data.location || null,
    },
  });
}

async function getJobById(id) {
  return prisma.job.findUnique({
    where: { id: parseInt(id) },
    include: { applications: { include: { candidate: true } } },
  });
}

async function listJobs() {
  return prisma.job.findMany({ orderBy: { createdAt: "desc" } });
}

module.exports = { createJob, getJobById, listJobs };
