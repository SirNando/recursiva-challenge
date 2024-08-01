import express from "express";
import cluster from "cluster";
import os from "os";

const logicalCores = os.cpus().length;

if (cluster.isPrimary) {
  // Crear worker pool
  for (let i = 0; i < logicalCores; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  const app = express();

  const superligasRoutes = require("./routes/superligas.routes");
  const equiposRoutes = require("./routes/equipos.routes");
  const cors = require("cors");

  app.use(cors());
  app.use(superligasRoutes);
  app.use(equiposRoutes);

  app.listen(3000, () => {
    console.log(`Worker ${process.pid} started`);
  });
}
