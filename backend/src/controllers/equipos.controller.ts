import { SuperLiga } from "../models/SuperLiga";
import { Request, Response } from "express";

export async function getPromedioEdadPorEquipo(req: Request, res: Response) {
  const equipo = req.params.equipo;
  if (!equipo) {
    return res.status(400).send("Falta el nombre del equipo");
  }

  let promedioEdad;
  try {
    promedioEdad = await SuperLiga.getTeamAgeAverage(equipo);
  } catch (err) {
    return res.status(500).send("Error al obtener promedio de edades:" + err);
  }

  res.send(promedioEdad);
}

export async function nombresMasComunes(req: Request, res: Response) {
  const equipo = req.params.equipo;
  const cantidad = Number(req.query.cantidad) || 0;

  // Primero busco lista de miembros del equipo
  let miembrosEquipo;
  try {
    miembrosEquipo = await SuperLiga.getMembers((miembro) => {
      return miembro.equipo === equipo;
    });
  } catch (err) {
    return res.status(500).send("Error al obtener miembros del equipo:" + err);
  }

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
    nombres.length = cantidad;
  }
  return res.send(nombres.map(({ nombre }) => nombre));
}
