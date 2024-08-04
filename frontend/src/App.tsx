import { FormEvent, useState } from "react";
import BentoBox from "./components/BentoBox";
import BentoItem from "./components/BentoItem";
import BentoLoader from "./components/BentoLoader";
import {
  promedioEdadesRenderer,
  jovenesVidaResueltaRenderer,
  nombresMasComunesDeEquipoRenderer,
  poblacionTotalRenderer,
  promedioEdadEquipoRenderer,
} from "./util/renderers";

import appStyles from "./App.module.css";
import logo from "/logo.jpg";

function App() {
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    setUploadSuccess(false);
    event.preventDefault();
    const formData = new FormData();
    formData.append("superliga", event.currentTarget["superliga"].files[0]);

    const serverReply = await fetch("http://localhost:3000/superligas", {
      method: "POST",
      body: formData,
    });

    if (!serverReply.ok) {
      setError(true);
      return;
    }
    setUploadSuccess(true);
  }

  const requestObjects = {
    poblacionLink: {
      url: "http://localhost:3000/superligas/poblacion",
    } as FetchOptions,
    promedioEdadEquipoLink: {
      url: "http://localhost:3000/equipos/Racing/promedioEdad",
    } as FetchOptions,
    jovenesVidaResueltaLink: {
      url: "http://localhost:3000/superligas/jovenesFutbolerosConLaVidaResuelta?cantidad=100",
    } as FetchOptions,
    nombresComunesEquipoLink: {
      url: "http://localhost:3000/equipos/River/nombresMasComunes?cantidad=5",
    } as FetchOptions,
    promedioEdadesLink: {
      url: "http://localhost:3000/superligas/promedioEdades",
    } as FetchOptions,
  };

  return (
    <>
      <nav className={appStyles.mainNavigation}>
        <a href="#">
          <img src={logo} alt="Logo recursiva" />
        </a>
      </nav>
      <BentoBox>
        <BentoLoader title="Cargar archivo">
          <form onSubmit={handleSubmit}>
            <input type="file" name="superliga" />
            <button type="submit">Cargar</button>
            {error && !uploadSuccess && (
              <p>Ocurrió un error al cargar el archivo</p>
            )}
          </form>
        </BentoLoader>
        {uploadSuccess && (
          <>
            <BentoItem
              title="Poblacion total"
              requests={requestObjects.poblacionLink}
              render={poblacionTotalRenderer}
            />
            <BentoItem
              title="Promedio edad de socios de Racing"
              requests={requestObjects.promedioEdadEquipoLink}
              render={promedioEdadEquipoRenderer}
            />
            <BentoItem
              title="Jovenes con la vida resuelta"
              requests={requestObjects.jovenesVidaResueltaLink}
              render={jovenesVidaResueltaRenderer}
            />
            <BentoItem
              title="Nombres mas comunes de River"
              requests={requestObjects.nombresComunesEquipoLink}
              render={nombresMasComunesDeEquipoRenderer}
            />
            <BentoItem
              title="Promedio de edades por equipo, de mayor a menor"
              requests={requestObjects.promedioEdadesLink}
              render={promedioEdadesRenderer}
            />
          </>
        )}
      </BentoBox>
    </>
  );
}

export default App;
