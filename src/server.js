require("dotenv").config();
const app = require("./app");
const { ensureIndex } = require("./config/elasticsearch");

const PORT = process.env.PORT || 3000;

ensureIndex()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.warn("Elasticsearch setup failed:", err.message);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (ES disabled)`);
    });
  });
