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
   * Chequea que el archivo sea un CSV de superliga valido, y lo guarda
   */
  public static async saveLiga() {
    return new Promise((resolve, reject) => {
      const dbPath = path.join(__dirname, "..", "db");
      const previousDB = fs.readdirSync(dbPath);
      const oldFilePath = path.join(dbPath, previousDB[0]);
      const newFilePath = path.join(dbPath, "superliga.csv");
      fs.renameSync(oldFilePath, newFilePath);

      const parser = fs
        .createReadStream(newFilePath)
        .pipe(parse({ delimiter: ";", fromLine: 1, toLine: 1 }));

      parser.on("data", (data) => {
        if (data.length !== 5) {
          fs.unlinkSync(newFilePath);
          return reject(new Error("Formato CSV inválido"));
        }
      });

      parser.on("error", (err) => {
        fs.unlinkSync(newFilePath);
        console.error(err);
        return reject(new Error("No se pudo procesar el archivo"));
      });

      parser.on("end", () => {
        return resolve(true);
      });
    });
  }

  /**
   * Cuenta la cantidad de registros en el CSV usando un stream para minimizar uso de memoria
   */
  public static async getPopulation() {
    const dbPath = SuperLiga.getFilePaths();
    const dbExists = fs.existsSync(dbPath);
    if (!dbExists) {
      throw new Error("No existe el archivo");
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
      throw new Error("No existe el archivo");
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
  ): Promise<Miembro[]> {
    return new Promise(async (resolve, reject) => {
      const dbPath = SuperLiga.getFilePaths();
      const dbExists = fs.existsSync(dbPath);
      if (!dbExists) {
        return reject(new Error("No existe el archivo"));
      }

      const parser = fs
        .createReadStream(dbPath)
        .pipe(parse({ delimiter: ";" }));

      let population: Miembro[] = [];
      for await (const [
        nombre,
        edad,
        equipo,
        estadoCivil,
        estudios,
      ] of parser) {
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
        return reject(new Error("Ocurrio un error al procesar el archivo"));
      });
      return resolve(population);
    });
  }

  public static async getTeamAgeAverage(team: string): Promise<{
    promedioEdad: number;
    minEdad: number;
    maxEdad: number;
  }> {
    return new Promise(async (resolve, reject) => {
      let miembrosEquipo;
      try {
        miembrosEquipo = await SuperLiga.getMembers((miembro) => {
          return miembro.equipo === team;
        });
      } catch (err) {
        return reject(new Error("No existe el archivo"));
      }

      if (miembrosEquipo.length === 0) {
        return reject(new Error("No hay personas registradas"));
      }

      let promedioEdad = 0,
        minEdad = -1,
        maxEdad = -1;
      for (const miembro of miembrosEquipo) {
        promedioEdad += Number(miembro.edad);

        if (minEdad === -1 || miembro.edad < minEdad) {
          minEdad = miembro.edad;
        }

        if (maxEdad === -1 || miembro.edad > maxEdad) {
          maxEdad = miembro.edad;
        }
      }

      promedioEdad /= miembrosEquipo.length;

      return resolve({
        promedioEdad: Math.floor(promedioEdad),
        minEdad,
        maxEdad,
      });
    });
  }
}
