import express from "express";
import cluster from "cluster";
import { cpus } from "os";
import { argv } from "process";

const logicalCores = cpus().length;
const useClusters = argv.includes("cluster");

const app = express();
app.use((req, res, next) => {
  console.log(
    `Worker ${process.pid} received a ${req.method} request for ${req.url}`
  );
  next();
});

const superligasRoutes = require("./routes/superligas.routes");
const equiposRoutes = require("./routes/equipos.routes");
const cors = require("cors");

app.use(cors());
app.use(superligasRoutes);
app.use(equiposRoutes);

if (useClusters) {
  if (cluster.isPrimary) {
    // Create worker pool
    for (let i = 0; i < logicalCores; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker) => {
      console.log(`Worker ${worker.process.pid} died. Restarting...`);
      const newWorker = cluster.fork();
      console.log(`Worker ${newWorker.process.pid} started`);
    });
  } else {
    app.listen(3000, () => {
      console.log(`Worker ${process.pid} started and listening on port 3000`);
    });
  }
} else {
  app.listen(3000, () => {
    console.log(`Worker ${process.pid} started`);
  });
}
