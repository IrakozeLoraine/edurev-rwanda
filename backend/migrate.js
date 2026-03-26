const dotenv = require("dotenv");
dotenv.config();

const { connectDB, closeDB } = require("./config/db");
const initSchema = require("./config/schema");

const run = async () => {
  await connectDB();
  await initSchema();
  await closeDB();
  console.log("Migration complete");
};

run().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
