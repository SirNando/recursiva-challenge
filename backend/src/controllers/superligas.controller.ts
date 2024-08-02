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

export async function getEdadesPromedios(req: Request, res: Response) {
  const teams = await SuperLiga.getTeams();
  if (teams.length === 0) {
    return res.status(404).send("No hay personas registradas");
  }

  let promedioEdadesPorEquipo = [];
  for (const team of teams) {
    const miembrosEquipo = await SuperLiga.getMembers((miembro) => {
      return miembro.equipo === team;
    });

    if (miembrosEquipo.length === 0) {
      return res.status(404).send("No hay miembros del equipo");
    }

    let promedioEdad = 0,
      minEdad,
      maxEdad;
    for (const miembro of miembrosEquipo) {
      promedioEdad += Number(miembro.edad);

      if (minEdad === undefined || miembro.edad < minEdad) {
        minEdad = miembro.edad;
      }

      if (maxEdad === undefined || miembro.edad > maxEdad) {
        maxEdad = miembro.edad;
      }
    }
    promedioEdad /= miembrosEquipo.length;

    promedioEdadesPorEquipo.push({
      equipo: team,
      cantidadMiembros: miembrosEquipo.length,
      promedioEdad: Math.floor(promedioEdad),
      minEdad,
      maxEdad,
    });
  }
  const finalResponse = promedioEdadesPorEquipo
    .sort((a, b) => {
      return b.cantidadMiembros - a.cantidadMiembros;
    })
    .map((element) => {
      return {
        equipo: element.equipo,
        minEdad: element.minEdad,
        maxEdad: element.maxEdad,
      };
    });
  res.send(finalResponse);
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
