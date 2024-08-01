import { SuperLiga } from "../models/SuperLiga";
import { Request, Response } from "express";

export async function cargarLiga(req: Request, res: Response) {
  if (!req.file) {
    console.log("No hay archivos");
    return res.status(400).send("No se recibió archivo");
  }

  SuperLiga.saveLiga();
  res.status(202).send("File received");
}

export async function getEquipos(req: Request, res: Response) {
  const teams = await SuperLiga.getTeams();
  if (teams.length === 0) {
    res.status(404).send("No hay equipos registrados");
  } else {
    res.send(await SuperLiga.getTeams());
  }
}

export async function getPoblacion(req: Request, res: Response) {
  const poblacion = await SuperLiga.getPopulation();
  if (poblacion === 0) {
    res.status(404).send("No hay superligas registradas");
  } else {
    res.send(String(poblacion));
  }
}

export async function getJovenesFutbolerosConLaVidaResuelta(
  req: Request,
  res: Response
) {
  const jovenesUniversitariosCasados = await SuperLiga.getMembers((miembro) => {
    return (
      miembro.estudios === "Universitario" && miembro.estadoCivil === "Casado"
    );
  });

  if (jovenesUniversitariosCasados.length === 0) {
    res.status(404).send("No hay personas registradas");
  } else {
    jovenesUniversitariosCasados.sort((a, b) => {
      return a.edad - b.edad;
    });
    const cantidad = Number(req.query.cantidad) || 0;
    if (cantidad > 0) {
      jovenesUniversitariosCasados.splice(cantidad)[0];
    }
    res.send(jovenesUniversitariosCasados);
  }
}
