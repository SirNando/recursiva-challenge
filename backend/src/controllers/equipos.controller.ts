import { SuperLiga } from "../models/SuperLiga";
import { Request, Response } from "express";

export async function getPromedioEdadPorEquipo(req: Request, res: Response) {
  const equipo = req.params.equipo;
  const miembrosEquipo = await SuperLiga.getMembers((miembro) => {
    return miembro.equipo === equipo;
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
  res.send({
    promedioEdad: Math.floor(promedioEdad),
    minEdad,
    maxEdad,
  });
}

export async function nombresMasComunes(req: Request, res: Response) {
  const equipo = req.params.equipo;
  const cantidad = Number(req.query.cantidad) || 0;

  // Primero busco lista de miembros del equipo
  const miembrosEquipo = await SuperLiga.getMembers((miembro) => {
    return miembro.equipo === equipo;
  });

  if (miembrosEquipo.length === 0) {
    return res.status(404).send("No hay miembros del equipo");
  }

  // Cuento la cantidad de repeticiones de cada nombre
  const nombres: { nombre: string; repeticiones: number }[] = [];
  miembrosEquipo.forEach((miembro) => {
    const index = nombres.findIndex(
      (nombreObj) => nombreObj.nombre === miembro.nombre
    );
    if (index !== -1) {
      nombres[index].repeticiones++;
    } else {
      nombres.push({ nombre: miembro.nombre, repeticiones: 1 });
    }
  });

  // Ordeno los nombres por cantidad de apariciones
  nombres.sort((a, b) => {
    return a.repeticiones - b.repeticiones;
  });

  // Devuelvo los N nombres mas comunes
  if (cantidad > 0) {
    nombres.splice(cantidad)[0];
  }
  return res.send(nombres.map(({ nombre }) => nombre));
}
