export function poblacionTotalRenderer(data: any[]) {
  return <p>{data}</p>;
}

export function promedioEdadEquipoRenderer(data: any[]) {
  return (
    <ul>
      <li>
        <p>Edad promedio: {data[0].promedioEdad}</p>
      </li>
      <li>
        <p>Edad maxima: {data[0].maxEdad}</p>
      </li>
      <li>
        <p>Edad minima: {data[0].minEdad}</p>
      </li>
    </ul>
  );
}

export function jovenesVidaResueltaRenderer(data: any[]) {
  return (
    <table>
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
    <ul>
      {data[0].map((nombre: string, key: number) => (
        <li key={key}>
          {key + 1}. {nombre}
        </li>
      ))}
    </ul>
  );
}

export function promedioEdadesRenderer(data: any[]) {
  console.log(data[0]);

  return (
    <ul>
      {data[0].map((info: any, key: number) => (
        <li key={key}>
          <p>{info.equipo}</p>
          <p>Edad maxima: {info.maxEdad}</p>
          <p>Edad minima: {info.minEdad}</p>
        </li>
      ))}
    </ul>
  );
}
