import { Container, CssBaseline } from '@mui/material';
import { useState } from 'react';
import { Route, Routes } from 'react-router';
import Otsikko from './components/Otsikko';
import PoistaTehtava from './components/PoistaTehtava';
import Tehtavalista from './components/Tehtavalista';
import UusiTehtava from './components/UusiTehtava';

interface Tehtava {
  nimi: string;
  tehty: boolean;
}

function App() {

  const [tehtavat, setTehtavat] = useState<Tehtava[]>([
    { nimi: 'Käy kaupassa', tehty: false },
    { nimi: 'Siivoa', tehty: true },
    { nimi: 'Ulkoiluta koiraa', tehty: false },
  ]);

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">

        <Otsikko>Demo 6: Reititysparametrit</Otsikko>

        <Routes>
          <Route
            path="/poista/:indeksi"
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
