import { FormEvent, useState } from "react";
import BentoBox from "./components/BentoBox";
import BentoItem from "./components/BentoItem";
import BentoLoader from "./components/BentoLoader";
import {
  jovenesVidaResueltaRenderer,
  nombresMasComunesDeEquipoRenderer,
  poblacionTotalRenderer,
  promedioEdadEquipoRenderer,
} from "./util/renderers";

function App() {
  const [uploadSuccess, setUploadSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("superliga", event.currentTarget["superliga"].files[0]);

    const serverReply = await fetch("http://localhost:3000/superligas", {
      method: "POST",
      body: formData,
    });

    if (serverReply.ok) {
      setUploadSuccess(true);
    }
    console.log(serverReply);
  }

  const requestObjects = {
    poblacionLink: {
      url: "http://localhost:3000/superligas/poblacion",
    },
    promedioEdadEquipoLink: {
      url: "http://localhost:3000/equipos/Racing/promedioEdad",
    },
    jovenesVidaResueltaLink: {
      url: "http://localhost:3000/superligas/jovenesFutbolerosConLaVidaResuelta?cantidad=100",
    },
    nombresComunesEquipoLink: {
      url: "http://localhost:3000/equipos/River/nombresMasComunes?cantidad=5",
    },
  };

  return (
    <>
      <nav>
        <a href="#">
          <img src="" alt="Logo recursiva" />
        </a>
      </nav>
      <BentoBox>
        <BentoLoader title="Cargar archivo">
          <form onSubmit={handleSubmit}>
            <input type="file" name="superliga" />
            <button type="submit">Cargar</button>
          </form>
        </BentoLoader>
        {uploadSuccess && (
          <>
            <BentoItem
              title="Poblacion total"
              fetchLink={requestObjects.poblacionLink}
              render={poblacionTotalRenderer}
            />
            <BentoItem
              title="Promedio edad de socios de Racing"
              fetchLink={requestObjects.promedioEdadEquipoLink}
              render={promedioEdadEquipoRenderer}
            />
            <BentoItem
              title="Jovenes con la vida resuelta"
              fetchLink={requestObjects.jovenesVidaResueltaLink}
              render={jovenesVidaResueltaRenderer}
            />
            <BentoItem
              title="Nombres mas comunes de River"
              fetchLink={requestObjects.nombresComunesEquipoLink}
              render={nombresMasComunesDeEquipoRenderer}
            />
          </>
        )}
      </BentoBox>
    </>
  );
}

export default App;
