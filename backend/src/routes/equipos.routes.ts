import express from "express";
import {
  getPromedioEdadPorEquipo,
  nombresMasComunes,
} from "../controllers/equipos.controller";

const router = express.Router();

router.get("/equipos/:equipo/promedioEdad", getPromedioEdadPorEquipo);

router.get("/equipos/:equipo/nombresMasComunes?:cantidad", nombresMasComunes);

module.exports = router;
