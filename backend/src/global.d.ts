export {};

declare global {
  type Miembro = {
    nombre: string;
    edad: number;
    equipo: string;
    estadoCivil: "Casado" | "Soltero";
    estudios: "Universitario" | "Secundario" | "Terciario";
  };
}
