const { Client } = require("@elastic/elasticsearch");

const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || "http://localhost:9200",
});

const CANDIDATES_INDEX = "candidates";

async function ensureIndex() {
  try {
    let exists = false;
    try {
      await esClient.indices.exists({ index: CANDIDATES_INDEX });
      exists = true;
    } catch (e) {
      if (e.meta?.statusCode !== 404) throw e;
    }
    if (!exists) {
      await esClient.indices.create({
        index: CANDIDATES_INDEX,
        body: {
          mappings: {
            properties: {
              name: { type: "text" },
              email: { type: "keyword" },
              phone: { type: "keyword" },
            },
          },
        },
      });
    }
  } catch (err) {
    console.warn("Elasticsearch index setup:", err.message);
  }
}

module.exports = { esClient, CANDIDATES_INDEX, ensureIndex };
