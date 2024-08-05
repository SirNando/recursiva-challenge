import styles from "./renderers.module.css";

export function poblacionTotalRenderer(data: any[]) {
  return <p className={styles.shared}>{data} miembros</p>;
}

export function promedioEdadEquipoRenderer(data: any[]) {
  return (
    <ul className={`${styles.shared} ${styles.promedioEdadEquipo}`}>
      <li>
        <p>
          <span>Edad promedio:</span> {data[0].promedioEdad}
        </p>
      </li>
      <li>
        <p>
          <span>Edad maxima:</span> {data[0].maxEdad}
        </p>
      </li>
      <li>
        <p>
          <span>Edad minima:</span> {data[0].minEdad}
        </p>
      </li>
    </ul>
  );
}

export function jovenesVidaResueltaRenderer(data: any[]) {
  return (
    <table className={styles.jovenesVidaResuelta}>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Edad</th>
          <th>Equipo</th>
        </tr>
      </thead>
      <tbody>
        {data[0].map((miembro: Miembro, key: number) => (
          <tr key={key}>
            <td>{miembro.nombre}</td>
            <td>{miembro.edad}</td>
            <td>{miembro.equipo}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function nombresMasComunesDeEquipoRenderer(data: any[]) {
  return (
    <ol className={styles.shared}>
      {data[0].map((nombre: string, key: number) => (
        <li key={key}>{nombre}</li>
      ))}
    </ol>
  );
}

export function promedioEdadesRenderer(data: any[]) {
  return (
    <ul className={`${styles.shared} ${styles.promedioEdades}`}>
      {data[0].map((info: any, key: number) => (
        <li key={key}>
          <p className="equipo">
            {info.equipo} <span>{info.cantidadMiembros} miembros</span>
          </p>
          <p>Edad promedio: {info.promedioEdad}</p>
          <p>Edad maxima: {info.maxEdad}</p>
          <p>Edad minima: {info.minEdad}</p>
        </li>
      ))}
    </ul>
  );
}
