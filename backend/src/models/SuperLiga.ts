import { parse } from "csv-parse";
import fs from "fs";
import path from "path";

type Miembro = {
  nombre: string;
  edad: number;
  equipo: string;
  estadoCivil: "Casado" | "Soltero";
  estudios: "Universitario" | "Secundario" | "Terciario";
};

export class SuperLiga {
  private static getFilePaths() {
    return path.join(__dirname, "..", "db", "superliga.csv");
  }

  /**
   * Guarda el CSV recibido, pisando el anterior de ser necesario
   */
  public static saveLiga() {
    const dbPath = path.join(__dirname, "..", "db");
    const previousDB = fs.readdirSync(dbPath);
    const oldFilePath = path.join(dbPath, previousDB[0]);
    const newFilePath = path.join(dbPath, "superliga.csv");
    fs.renameSync(oldFilePath, newFilePath);
  }

  /**
   * Cuenta la cantidad de registros en el CSV usando un stream para minimizar uso de memoria
   */
  public static async getPopulation() {
    const dbPath = SuperLiga.getFilePaths();
    const dbExists = fs.existsSync(dbPath);
    if (!dbExists) {
      return [];
    }
    const parser = fs.createReadStream(dbPath).pipe(parse({ delimiter: ";" }));

    let population = 0;
    for await (const [, , equipo] of parser) {
      population++;
    }

    parser.on("error", () => {
      return [];
    });

    return population;
  }

  /**
   * Identifica los equipos en el CSV
   */
  public static async getTeams() {
    const dbPath = SuperLiga.getFilePaths();
    const dbExists = fs.existsSync(dbPath);
    if (!dbExists) {
      return [];
    }
    const parser = fs.createReadStream(dbPath).pipe(parse({ delimiter: ";" }));

    const equipos = new Set<string>();
    for await (const [, , equipo] of parser) {
      equipos.add(equipo);
    }

    parser.on("error", () => {
      return [];
    });

    return Array.from(equipos);
  }

  /**
   * Carga las entradas del CSV siguiendo una función de filtro
   */
  public static async getMembers(
    funcionFiltro: (miembro: Miembro) => boolean = () => true
  ) {
    const dbPath = SuperLiga.getFilePaths();
    const dbExists = fs.existsSync(dbPath);
    if (!dbExists) {
      return [];
    }

    const parser = fs.createReadStream(dbPath).pipe(parse({ delimiter: ";" }));

    let population: Miembro[] = [];
    for await (const [nombre, edad, equipo, estadoCivil, estudios] of parser) {
      if (funcionFiltro({ nombre, edad, equipo, estadoCivil, estudios })) {
        population.push({
          nombre,
          edad: Number(edad),
          equipo,
          estadoCivil,
          estudios,
        });
      }
    }

    parser.on("error", () => {
      return [];
    });

    return population;
  }

  public static async getTeamAgeAverage(team: string) {
    const miembrosEquipo = await SuperLiga.getMembers((miembro) => {
      return miembro.equipo === team;
    });

    if (miembrosEquipo.length === 0) {
      return null;
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

    return {
      promedioEdad: Math.floor(promedioEdad),
      minEdad,
      maxEdad,
    };
  }
}
