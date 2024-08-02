import { ReactNode } from "react";
import useFetch from "../hooks/useFetch";

export default function BentoItem({
  title,
  fetchLink,
  render,
}: BentoItemProps): ReactNode {
  const { data } = useFetch(fetchLink.url, fetchLink.options);

  if (!data) {
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
