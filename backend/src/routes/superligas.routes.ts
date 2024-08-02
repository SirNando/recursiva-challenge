import express, { Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import {
  cargarLiga,
  getEquipos,
  getPoblacion,
  getJovenesFutbolerosConLaVidaResuelta,
  getPromedioEdades,
} from "../controllers/superligas.controller";

const dbPath = path.join(__dirname, "..", "db");
const upload = multer({ dest: dbPath });
const router = express.Router();

router.post("/superligas", upload.single("superliga"), cargarLiga);

router.get("/superligas", getEquipos);

router.get("/superligas/promedioEdades", getPromedioEdades);

router.get("/superligas/poblacion", getPoblacion);

router.get(
  "/superligas/jovenesFutbolerosConLaVidaResuelta?:cantidad",
  getJovenesFutbolerosConLaVidaResuelta
);

// Funcion auxiliar en caso de recibir un archivo con nombre distinto al esperado
router.use((err: any, req: Request, res: Response, next: NextFunction) => {
  return res
    .status(500)
    .json({ error: "El archivo enviado no tiene el nombre correcto" });
});

module.exports = router;
