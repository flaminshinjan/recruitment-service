const { z } = require("zod");
const jobService = require("../services/job.service");

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  location: z.string().optional(),
});

async function create(req, res) {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const job = await jobService.createJob(parsed.data);
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function list(req, res) {
  try {
    const jobs = await jobService.listJobs();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getById(req, res) {
  try {
    const job = await jobService.getJobById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { create, list, getById };
