export {};

declare global {
  type BentoItemProps = {
    title: string;
    fetchLink: {
      url: string;
      options?: RequestInit;
    };
    render: (data: any) => ReactElement; // gets fetched data and renders html using it
  };

  type Miembro = {
    nombre: string;
    edad: number;
    equipo: string;
    estadoCivil: "Casado" | "Soltero";
    estudios: "Universitario" | "Secundario" | "Terciario";
  };
}
