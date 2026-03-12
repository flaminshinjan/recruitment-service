const { z } = require("zod");
const applicationService = require("../services/application.service");

const applySchema = z.object({
  candidate_id: z.coerce.number().optional(),
  job_id: z.coerce.number(),
  candidate: z
    .object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
    })
    .optional(),
});

async function apply(req, res) {
  try {
    const parsed = applySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }
    const data = parsed.data;
    if (!data.candidate_id && !data.candidate) {
      return res.status(400).json({ error: "candidate_id or candidate details required" });
    }
    const application = await applicationService.apply(data);
    res.status(201).json(application);
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ error: "Already applied to this job" });
    }
    res.status(500).json({ error: err.message });
  }
}

async function list(req, res) {
  try {
    const applications = await applicationService.listApplications();
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { apply, list };
