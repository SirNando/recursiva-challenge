import { SuperLiga } from "../models/SuperLiga";
import { Request, Response } from "express";

export async function cargarLiga(req: Request, res: Response) {
  if (!req.file) {
    console.log("No hay archivos");
    return res.status(400).send("No se recibió archivo");
  }

  let result;
  try {
    result = await SuperLiga.saveLiga();
  } catch (err) {
    console.error(err);
    return res.status(500).send("No se pudo cargar el archivo:" + err);
  }

  if (!result) {
    return res.status(500).send("No se pudo cargar archivo");
  }

  res.status(202).send("Archivo recibido correctamente");
}

export async function getEquipos(req: Request, res: Response) {
  let teams;
  try {
    teams = await SuperLiga.getTeams();
  } catch (err) {
    return res.status(500).send("Error obtener equipos:" + err);
  }

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
  let poblacion;
  try {
    poblacion = await SuperLiga.getPopulation();
  } catch (err) {
    return res.status(500).send("Error al obtener población:" + err);
  }

  if (poblacion === 0) {
    res.status(404).send("No hay superligas registradas");
  } else {
    res.send(String(poblacion));
  }
}

export async function getPromedioEdades(req: Request, res: Response) {
  let teams;
  try {
    teams = await SuperLiga.getTeams();
  } catch (err) {
    return res.status(500).send("Error al obtener promeido de edades:" + err);
  }

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
  let jovenesUniversitariosCasados;
  try {
    jovenesUniversitariosCasados = await SuperLiga.getMembers((miembro) => {
      return (
        miembro.estudios === "Universitario" && miembro.estadoCivil === "Casado"
      );
    });
  } catch (err) {
    return res
      .status(500)
      .send("Error al obtener jovenes universitarios casados:" + err);
  }

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
