export {};

declare global {
  type BentoItemProps = {
    title: string;
    requests: FetchOptions | FetchOptions[];
    render: (data: any) => ReactElement; // gets fetched data and renders html using it
  };

  type Miembro = {
    nombre: string;
    edad: number;
    equipo: string;
    estadoCivil: "Casado" | "Soltero";
    estudios: "Universitario" | "Secundario" | "Terciario";
  };

  type FetchOptions = {
    url: string;
    options?: RequestInit;
  };
}
