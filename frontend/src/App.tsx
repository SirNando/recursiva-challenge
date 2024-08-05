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

let firstTime = true;

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const uploadSuccess = !isLoading && !error && !firstTime;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    firstTime = false;
    setIsLoading(true);
    setError(false);

    event.preventDefault();
    const formData = new FormData();
    formData.append("superliga", event.currentTarget["superliga"].files[0]);

    const serverReply = await fetch("http://localhost:3000/superligas", {
      method: "POST",
      body: formData,
    });

    if (!serverReply.ok) {
      setError(true);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    setError(false);
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
        <BentoLoader
          title={
            isLoading
              ? "Cargando..."
              : error
              ? "Error al cargar archivo"
              : "Cargar archivo"
          }
        >
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="file"
                accept=".csv"
                name="superliga"
                id="superliga"
              />
              <button type="submit" disabled={isLoading}>
                {(!isLoading && uploadSuccess) || (!isLoading && error)
                  ? "Volver a cargar"
                  : isLoading && !error
                  ? "Cargando..."
                  : "Cargar"}
              </button>
            </div>
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
              title="Promedio de edades por equipo, de mayor a menor según # de miembros"
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
