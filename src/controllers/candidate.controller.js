const { z } = require("zod");
const candidateService = require("../services/candidate.service");

const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
});

async function list(req, res) {
  try {
    const candidates = await candidateService.listCandidates();
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function create(req, res) {
  try {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const candidate = await candidateService.createCandidate(parsed.data);
    res.status(201).json(candidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getById(req, res) {
  try {
    const candidate = await candidateService.getCandidateById(req.params.id);
    if (!candidate) return res.status(404).json({ error: "Candidate not found" });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { create, list, getById };
