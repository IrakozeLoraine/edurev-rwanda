const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 5000;
connectDB();

let server;

const startServer = async () => {
  await connectDB();
  server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  return server;
};

const stopServer = async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
};

module.exports = { app, startServer, stopServer };
