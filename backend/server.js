const connectDB = require("./config/db");
const app = require("./app");

const PORT = process.env.PORT || 5000;
connectDB();

const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = server;
