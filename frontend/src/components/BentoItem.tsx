import { ReactNode } from "react";
import useFetch from "../hooks/useFetch";

export default function BentoItem({
  title,
  requests,
  render,
}: BentoItemProps): ReactNode {
  const { data } = useFetch(requests);

  if (data.length === 0) {
    return <p>Cargando datos...</p>;
  } else {
    return (
      <li>
        <h3>{title}</h3>
        {render(data)}
      </li>
    );
  }
}
