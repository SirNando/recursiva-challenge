import { ReactNode } from "react";
import useFetch from "../hooks/useFetch";

export default function BentoItem({
  title,
  requests,
  render,
}: BentoItemProps): ReactNode {
  const { data, error, isLoading, refetch } = useFetch(requests);

  if (isLoading) {
    return (
      <li>
        <p>Cargando datos...</p>
      </li>
    );
  } else if (error) {
    return (
      <li>
        <p>Error al cargar datos: {error}</p>
        <button onClick={refetch}>Reintentar</button>
      </li>
    );
  } else if (!isLoading) {
    return (
      <li>
        <h3>{title}</h3>
        {render(data)}
      </li>
    );
  }
}
