export function poblacionTotalRenderer(data: any) {
  return <p>{data}</p>;
}

export function promedioEdadEquipoRenderer(data: any) {
  return (
    <ul>
      <li>
        <p>Edad promedio: {data.promedioEdad}</p>
      </li>
      <li>
        <p>Edad maxima: {data.maxEdad}</p>
      </li>
      <li>
        <p>Edad minima: {data.minEdad}</p>
      </li>
    </ul>
  );
}

export function jovenesVidaResueltaRenderer(data: any) {
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
        {data.map((miembro: Miembro, key: number) => (
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

export function nombresMasComunesDeEquipoRenderer(data: any) {
  return (
    <ul>
      {data.map((nombre: string, key: number) => (
        <li key={key}>
          {key + 1}. {nombre}
        </li>
      ))}
    </ul>
  );
}
