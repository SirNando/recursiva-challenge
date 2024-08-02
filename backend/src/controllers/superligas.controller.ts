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
    const teams = await SuperLiga.getTeams();
    const teamsWithMembers = [];
    for (const team of teams) {
      const teamPopulation = await SuperLiga.getMembers((miembros) => {
        return miembros.equipo === team;
      });
      teamsWithMembers.push({
        equipo: team,
        miembros: teamPopulation.length,
      });
    }
    res.send(teamsWithMembers);
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

export async function getPromedioEdades(req: Request, res: Response) {
  const teams = await SuperLiga.getTeams();
  if (teams.length === 0) {
    return res.status(404).send("No hay personas registradas");
  }

  let promedioEdadesPorEquipo = [];
  for (const team of teams) {
    const promedioEdadEquipo = await SuperLiga.getTeamAgeAverage(team);

    if (promedioEdadEquipo === null) {
      continue;
    }

    promedioEdadesPorEquipo.push({
      ...promedioEdadEquipo,
      equipo: team,
      cantidadMiembros: team.length,
    });
  }

  // ordeno de mayor a menor cantidad de miembros, y remuevo la cantidad de miembros
  res.send(
    promedioEdadesPorEquipo
      .sort((a, b) => {
        return b.cantidadMiembros - a.cantidadMiembros;
      })
      .map((element) => {
        return {
          equipo: element.equipo,
          promedioEdad: element.promedioEdad,
          minEdad: element.minEdad,
          maxEdad: element.maxEdad,
        };
      })
  );
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
      jovenesUniversitariosCasados.length = cantidad;
    }
    res.send(jovenesUniversitariosCasados);
  }
}
