import { useState, useRef, useEffect } from 'react';
import { Route, Routes } from 'react-router';
import { Container, CssBaseline } from '@mui/material';
import Otsikko from './components/Otsikko';
import PoistaTehtava from './components/PoistaTehtava';
import Tehtavalista from './components/Tehtavalista';
import UusiTehtava from './components/UusiTehtava';

function App() {

  const kaynnistetty = useRef(false);

  const [tehtavat, setTehtavat] = useState<Tehtava[]>([]);

  // Ensimmäisen kerran käynnistys
  useEffect(() => {

    if (!kaynnistetty.current) {

      if (localStorage.getItem("tehtavalista")) {

        setTehtavat(JSON.parse(String(localStorage.getItem("tehtavalista"))).map((tehtava: Tehtava) => {
          return {
            ...tehtava
          }
        }));
      }
    }

    return () => {
      kaynnistetty.current = true;
    }
  }, []);

  // Tehtävälistan päivittyessä lähetetään uudet tiedot selaimen paikalliseen muistiin
  useEffect(() => {

    localStorage.setItem("tehtavalista", JSON.stringify(tehtavat));
  }, [tehtavat])

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">

        <Otsikko>Demo 8: Tietojen tallentaminen</Otsikko>

        <Routes>
          <Route
            path="/poista/:id"
            element={<PoistaTehtava tehtavat={tehtavat} setTehtavat={setTehtavat} />}
          />
          <Route
            path="/uusi"
            element={<UusiTehtava tehtavat={tehtavat} setTehtavat={setTehtavat} />}
          />
          <Route
            path="/"
            element={<Tehtavalista tehtavat={tehtavat} setTehtavat={setTehtavat} />}
          />
        </Routes>

      </Container>
    </>
  );
}

export default App;
