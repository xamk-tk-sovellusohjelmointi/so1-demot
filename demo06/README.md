# Demo 6: Reititysparametrit

## Oppimistavoitteet

Tämän demon jälkeen opiskelija osaa:
- selittää, mitä reititysparametrit ovat ja miksi niitä käytetään
- määritellä dynaamisen reitin `Route`-komponentissa (`:parametri`-syntaksi)
- lukea reititysparametrin arvon `useParams`-hookilla komponentissa
- muuntaa merkkijonomuotoisen parametrin numeroksi ja käyttää sitä taulukko-operaatioissa
- päivittää React-tilamuuttujan taulukkoa immutable-periaatteella `map`- ja `filter`-metodeilla
- rakentaa uudelleenkäytettävän apukomponentin (`Otsikko`) propsien ja `children`-ominaisuuden avulla

---

## 1. Reititysparametrit

### Mitä reititysparametrit ovat?

Demo 5:ssä opittiin reitityksen perusteet: jokainen näkymä sai oman kiinteän polkunsa (`/`, `/info`). Joskus tarvitaan kuitenkin **dynaamisia reittejä**, joissa polun osa vaihtelee. Esimerkiksi verkkokaupassa jokainen tuote ei tarvitse omaa reittiään (`/tuote/kengat`, `/tuote/paita`, `/tuote/laukku`), vaan yksi reitti riittää: `/tuote/:id`. Kaksoispisteellä alkava `:id` on **reititysparametri**, jonka arvo vaihtelee sen mukaan, mitä tuotetta katsotaan.

React Routerissa reititysparametri määritellään `Route`-komponentissa kaksoispisteellä:

```tsx
<Route path="/tuote/:id" element={<Tuote />} />
```

Tämä reitti vastaa kaikkia polkuja, joissa `/tuote/`-osan jälkeen on jokin arvo: `/tuote/1`, `/tuote/42`, `/tuote/abc`. Arvo luetaan komponentissa `useParams`-hookilla.

### useParams

`useParams` on React Routerin hook, joka palauttaa objektin sisältäen aktiivisen reitin parametrit avain-arvo-pareina:

```tsx
import { useParams } from 'react-router';

const { id } = useParams();
```

Parametrin nimi (`id`) vastaa reitissä määriteltyä nimeä (`:id`). Destructuring-syntaksilla `{ id }` poimitaan parametri suoraan objektista.

`useParams` palauttaa kaikki parametriarvot aina **merkkijonoina** (`string`), vaikka niiden sisältö olisi numero. Jos parametria käytetään numeerisena, tyyppimuunnos täytyy tehdä itse:

```tsx
const idNumero = Number(id);
```

Dokumentaatio: [React Router — useParams](https://reactrouter.com/api/hooks/useParams), [React Router — dynaamiset segmentit](https://reactrouter.com/start/library/routing#dynamic-segments)

### Immutable-päivitys: map ja filter

Reactissa tilamuuttujan taulukkoa ei koskaan muuteta suoraan. Sen sijaan luodaan **uusi taulukko**, joka asetetaan uudeksi tilaksi. Tähän käytetään JavaScriptin `map`- ja `filter`-metodeja.

**`map`** käy läpi taulukon ja palauttaa uuden taulukon, jossa jokainen alkio on mahdollisesti muokattu. Alkuperäinen taulukko ei muutu:

```tsx
// Vaihdetaan indeksin 2 kohdalla olevan tehtävän tehty-tila
setTehtavat(
  tehtavat.map((tehtava, i) =>
    i === 2 ? { ...tehtava, tehty: !tehtava.tehty } : tehtava
  )
);
```

`{ ...tehtava, tehty: !tehtava.tehty }` luo uuden objektin spread-operaattorilla: kaikki alkuperäisen objektin kentät kopioidaan ja `tehty`-kenttä korvataan käänteisellä arvolla.

**`filter`** käy läpi taulukon ja palauttaa uuden taulukon, joka sisältää vain ne alkiot, joille ehto on tosi:

```tsx
// Poistetaan indeksin 2 kohdalla oleva tehtävä
setTehtavat(tehtavat.filter((_, idx) => idx !== 2));
```

Alleviivattu `_` tarkoittaa, että funktion ensimmäistä parametria (itse alkiota) ei käytetä. Tämä on JavaScript/TypeScript-käytäntö merkitä käyttämätön parametri.

### Demosovellus

Tässä demossa rakennetaan tehtävälistasovellus, jossa tehtäviä voidaan lisätä, merkitä tehdyiksi ja poistaa. Sovelluksessa on kolme näkymää:

| Reitti | Näkymä | Kuvaus |
|--------|--------|--------|
| `/` | Tehtävälista | Listaa tehtävät, merkintä tehdyksi, poistopainike |
| `/uusi` | Uusi tehtävä | Tekstikenttä ja tallennuspainike |
| `/poista/:indeksi` | Poista tehtävä | Vahvistus poistettavan tehtävän nimellä |

Demo 5:stä poiketen tässä demossa opitaan reititysparametrit: poistoreitti `/poista/:indeksi` käyttää dynaamista parametria, jolla tunnistetaan poistettava tehtävä. Navigaatiovalikkoa ei käytetä tässä demossa.

---

## 2. Demosovelluksen rakentuminen vaihe vaiheelta

### Vaihe 1: Projektin luominen

Luodaan uusi Vite + React + TypeScript -projekti:

```bash
npm create vite@latest demo06 -- --template react-ts
```

Siirrytään projektikansioon:

```bash
cd demo06
```

Asennetaan projektin perusriippuvuudet:

```bash
npm install
```

Siistitään Viten luoma oletussisältö. Poistetaan tarpeettomat tiedostot:

```bash
rm src/App.css src/index.css src/assets/react.svg
```

Korvataan `src/App.tsx` tyhjällä pohjalla:

```tsx
function App() {
  return (
    <>
      <h1>Demo 6</h1>
    </>
  );
}

export default App;
```

Korvataan `src/main.tsx` siistillä versiolla ilman `index.css`-tuontia:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

Asetetaan kehityspalvelimen portti muokkaamalla `vite.config.ts`-tiedostoa:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3006
  }
})
```

Käynnistetään kehityspalvelin ja tarkistetaan, että oletussivu avautuu selaimessa:

```bash
npm run dev
```

Sovellus avautuu osoitteessa `http://localhost:3006`.

### Vaihe 2: Riippuvuuksien asentaminen

Sammutetaan kehityspalvelin `Ctrl + C`:llä ja asennetaan kaikki demon tarvitsemat paketit.

**React Router:**

```bash
npm install react-router
```

**MUI ja sen tarvitsemat kirjastot:**

```bash
npm install @mui/material @emotion/react @emotion/styled
```

**MUI:n ikonit:**

```bash
npm install @mui/icons-material
```

**Roboto-fontti:**

```bash
npm install @fontsource/roboto
```

Käynnistetään kehityspalvelin asennusten jälkeen uudelleen:

```bash
npm run dev
```

### Vaihe 3: BrowserRouter ja Roboto-fontit (main.tsx)

Otetaan käyttöön `BrowserRouter` ja Roboto-fontit `main.tsx`-tiedostossa, kuten demo 5:ssä:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { BrowserRouter } from 'react-router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

`BrowserRouter` kääritään `App`-komponentin ympärille `StrictMode`-komponentin sisään, jotta kaikki sovelluksen komponentit voivat käyttää React Routerin reititysominaisuuksia.

### Vaihe 4: Otsikko-apukomponentti

Rakennetaan sovellukselle apukomponentti otsikoiden tulostamiseen. Tämä ei liity suoraan reititysparametreihin, mutta selkeyttää sovelluksen koodia: sen sijaan, että joka komponentissa kirjoitetaan sama `Typography`-rakenne, käytetään omaa `Otsikko`-komponenttia.

Luodaan `src/components/`-kansio:

```bash
mkdir src/components
```

Luodaan tiedosto `src/components/Otsikko.tsx`:

```tsx
import { Typography } from '@mui/material';

interface Props {
  children: React.ReactNode;
  tyyli?: 'pieni';
}

function Otsikko({ children, tyyli }: Props) {
  return (
    <Typography
      sx={{
        fontSize: tyyli === 'pieni' ? 18 : 22,
        marginTop: '10px',
        marginBottom: '10px',
      }}
    >
      {children}
    </Typography>
  );
}

export default Otsikko;
```

Komponentissa on kaksi ominaisuutta:

- `children`: Otsikon sisältö. Tyyppi on `React.ReactNode`, joka kattaa kaiken mahdollisen React-sisällön (tekstiä, elementtejä tai molempia). Tämä on oikea tyyppi, kun komponentti saa sisältönsä lapsielementteinä.
- `tyyli?: 'pieni'`: Valinnainen ominaisuus, jolla voidaan pyytää pienempää otsikkoa. Tyypiksi on asetettu merkkijonoliteraali `'pieni'` (eikä pelkkä `string`), jolloin TypeScript antaa virheen, jos ominaisuuteen yritetään antaa jokin muu arvo. Kysymysmerkki tekee ominaisuudesta valinnaisen.

Komponenttia voidaan käyttää kahdella tavalla:

```tsx
<Otsikko>Isompi otsikko</Otsikko>
<Otsikko tyyli="pieni">Pienempi otsikko</Otsikko>
```

### Vaihe 5: App.tsx — tehtävien tila ja reittirakenne

`App`-komponentti hallinnoi tehtävälistaa tilamuuttujana ja välittää sekä listan tiedot että niiden päivitysfunktion alinäkymille propsien kautta.

Korvataan `src/App.tsx`:n sisältö:

```tsx
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
```

> **Huomio:** `PoistaTehtava`-, `Tehtavalista`- ja `UusiTehtava`-komponentit luodaan seuraavissa vaiheissa. Sovellus ei käänny ennen kuin kaikki kolme komponenttia on luotu.

`Tehtava`-interface määritellään suoraan `App.tsx`-tiedostossa. Sama interface toistetaan jokaisessa komponentissa, joka käyttää tehtävätietoja.

Tilamuuttuja `tehtavat` on taulukko `Tehtava`-objekteja. `useState` on alustettu kolmella esimerkkitehtävällä, jotta sovelluksessa on heti jotain nähtävää.

`CssBaseline` nollaa selaimen oletustyylit, kuten demo 5:ssä. `Container maxWidth="sm"` asettaa sovelluksen sisällölle maksimileveyden ja pitää sen sivun keskellä.

Reitti `/poista/:indeksi` on **dynaaminen reitti**. Kaksoispisteellä alkava `:indeksi` on reititysparametri, jonka arvo vaihtelee. Esimerkiksi `/poista/0` ja `/poista/2` johtavat molemmat samaan `PoistaTehtava`-komponenttiin, mutta parametrin arvo on eri.

Jokainen reitti välittää alinäkymälle `tehtavat`-taulukon ja `setTehtavat`-funktion propseina. Näin alinäkymät pääsevät käsiksi yhteiseen tehtävälistaan ja voivat päivittää sitä.

### Vaihe 6: Tehtavalista-komponentti

Luodaan `src/components/Tehtavalista.tsx`. Tämä on sovelluksen aloitusnäkymä: se listaa kaikki tehtävät, tarjoaa painikkeen uuden tehtävän lisäämiseen ja poistopainikkeen jokaisen tehtävän yhteydessä.

```tsx
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router';
import Otsikko from './Otsikko';

interface Tehtava {
  nimi: string;
  tehty: boolean;
}

interface Props {
  tehtavat: Tehtava[];
  setTehtavat: (tehtavat: Tehtava[]) => void;
}

function Tehtavalista({ tehtavat, setTehtavat }: Props) {

  const merkitseTehdyksi = (indeksi: number) => {
    setTehtavat(
      tehtavat.map((tehtava, i) =>
        i === indeksi ? { ...tehtava, tehty: !tehtava.tehty } : tehtava
      )
    );
  };

  return (
    <>
      <Otsikko tyyli="pieni">Tehtävälista</Otsikko>

      <Button variant="contained" fullWidth component={Link} to="/uusi">
        Lisää uusi tehtävä
      </Button>

      <List>
        {tehtavat.map((tehtava, idx) => (
          <ListItem key={idx}>

            <ListItemIcon>
              <IconButton onClick={() => merkitseTehdyksi(idx)}>
                {tehtava.tehty
                  ? <CheckBoxIcon color="secondary" />
                  : <CheckBoxOutlineBlankIcon />
                }
              </IconButton>
            </ListItemIcon>

            <ListItemText primary={tehtava.nimi} />

            <ListItemIcon>
              <IconButton component={Link} to={`/poista/${idx}`} edge="end">
                <DeleteIcon />
              </IconButton>
            </ListItemIcon>

          </ListItem>
        ))}
      </List>
    </>
  );
}

export default Tehtavalista;
```

`Tehtava`-interface ja `Props`-interface määritellään tiedoston alussa. `Props` sisältää `tehtavat`-taulukon ja `setTehtavat`-funktion, jotka `App`-komponentti välittää propseina.

**`merkitseTehdyksi`-funktio** päivittää tehtävän `tehty`-tilan. `tehtavat.map(...)` luo uuden taulukon, jossa vastaavan indeksin kohdalle luodaan uusi objekti spread-operaattorilla `{ ...tehtava, tehty: !tehtava.tehty }` ja muut alkiot palautetaan sellaisenaan. Tämä on immutable-päivitys: alkuperäistä taulukkoa ei muuteta.

**Tehtävälista** renderöidään `tehtavat.map(...)`:lla. Jokainen tehtävä saa oman `ListItem`-rivin. Vasemmalla on checkbox-ikoni, jota painamalla tehtävä merkitään tehdyksi. Oikealla on `DeleteIcon`-poistopainike.

**Poistopainikkeen** `to`-ominaisuudessa käytetään template literal -syntaksia: `` `/poista/${idx}` `` upottaa tehtävän indeksin osaksi reittiä. Kun painiketta painetaan, selain siirtyy esimerkiksi osoitteeseen `/poista/1`, ja `PoistaTehtava`-komponentti saa tiedon, että poistetaan tehtävä indeksillä `1`.

**"Lisää uusi tehtävä" -painike** käyttää samaa `component={Link} to="/uusi"` -rakennetta kuin demo 5:ssä.

**Ehdollinen renderöinti** checkbox-ikonissa: `tehtava.tehty` on `true` → näytetään täytetty `CheckBoxIcon`, muuten tyhjä `CheckBoxOutlineBlankIcon`.

### Vaihe 7: UusiTehtava-komponentti

Luodaan `src/components/UusiTehtava.tsx`. Tämä on lisäysnäkymä, jossa käyttäjä voi kirjoittaa uuden tehtävän ja tallentaa sen.

```tsx
import { Button, TextField } from '@mui/material';
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import Otsikko from './Otsikko';

interface Tehtava {
  nimi: string;
  tehty: boolean;
}

interface Props {
  tehtavat: Tehtava[];
  setTehtavat: (tehtavat: Tehtava[]) => void;
}

function UusiTehtava({ tehtavat, setTehtavat }: Props) {

  const navigate = useNavigate();
  const uusiTehtavaRef = useRef<HTMLInputElement>(null);

  const lisaaTehtava = () => {
    const uusiTehtava: Tehtava = {
      nimi: uusiTehtavaRef.current?.value || 'Nimetön tehtävä',
      tehty: false,
    };

    setTehtavat([...tehtavat, uusiTehtava]);
    navigate('/');
  };

  return (
    <>
      <Otsikko tyyli="pieni">Lisää uusi tehtävä</Otsikko>

      <TextField
        inputRef={uusiTehtavaRef}
        variant="outlined"
        fullWidth
        placeholder="Kirjoita tehtävä..."
        sx={{ marginBottom: '10px' }}
      />

      <Button
        variant="contained"
        fullWidth
        onClick={lisaaTehtava}
      >
        Tallenna
      </Button>

      <Button fullWidth component={Link} to="/">
        Peruuta
      </Button>
    </>
  );
}

export default UusiTehtava;
```

Komponentissa käytetään `useRef`-hookia syöttökentän arvon lukemiseen. `useRef` luo viittauksen DOM-elementtiin. Kun `inputRef`-ominaisuudella liitetään ref MUI:n `TextField`-komponenttiin, `uusiTehtavaRef.current` viittaa siihen HTML-input-elementtiin ja sieltä voidaan lukea arvo `.value`-ominaisuudella.

Tämä on **ohjaamaton komponentti** (uncontrolled component): syöttökentän arvo ei tallennu Reactin tilamuuttujaan jokaisen näppäinpainalluksen yhteydessä, vaan luetaan vasta tallennuksen hetkellä. Toisin kuin `useState`-pohjaisessa ratkaisussa, tässä ei tapahdu uudelleenrenderöintiä kirjoittaessa.

`uusiTehtavaRef.current?.value` käyttää **optional chaining** -operaattoria `?.`. Se tarkoittaa: "lue `value`, jos `current` ei ole `null`". Tämä on tarpeen, koska TypeScript tietää, että ref on `null` ennen kuin komponentti on renderöity.

`lisaaTehtava`-funktio luo uuden `Tehtava`-objektin, lisää sen tehtävälistaan spread-operaattorilla (`[...tehtavat, uusiTehtava]`) ja navigoi takaisin aloitusnäkymään `navigate('/')`-kutsulla. Spread-operaattori luo uuden taulukon, johon kopioidaan kaikki vanhat tehtävät ja lisätään uusi perään.

### Vaihe 8: PoistaTehtava-komponentti ja useParams-hook

Luodaan `src/components/PoistaTehtava.tsx`. Tämä on demon ydinkomponentti, jossa opitaan reititysparametrien vastaanottaminen `useParams`-hookilla.

```tsx
import { Button, Typography } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router';
import Otsikko from './Otsikko';

interface Tehtava {
  nimi: string;
  tehty: boolean;
}

interface Props {
  tehtavat: Tehtava[];
  setTehtavat: (tehtavat: Tehtava[]) => void;
}

function PoistaTehtava({ tehtavat, setTehtavat }: Props) {

  const navigate = useNavigate();
  const { indeksi } = useParams();
  const indeksiNum = Number(indeksi);

  const vahvistaPoisto = () => {
    setTehtavat(tehtavat.filter((_, idx) => idx !== indeksiNum));
    navigate('/');
  };

  return (
    <>
      <Otsikko tyyli="pieni">Poista tehtävä</Otsikko>

      <Typography sx={{ marginBottom: '20px' }}>
        Haluatko varmasti poistaa tehtävän "{tehtavat[indeksiNum]?.nimi}"?
      </Typography>

      <Button
        variant="contained"
        fullWidth
        onClick={vahvistaPoisto}
      >
        Poista tehtävä
      </Button>

      <Button fullWidth component={Link} to="/">
        Peruuta
      </Button>
    </>
  );
}

export default PoistaTehtava;
```

**`useParams`** palauttaa objektin, josta destructuroidaan `indeksi`-parametri. Parametrin nimi vastaa `App.tsx`:ssä reitille määriteltyä `:indeksi`-osaa (`/poista/:indeksi`).

Koska `useParams` palauttaa parametriarvot aina merkkijonoina, indeksi muunnetaan numeroksi omaan muuttujaansa: `const indeksiNum = Number(indeksi)`.

**`vahvistaPoisto`-funktio** päivittää tehtävälistan `filter`-metodilla. `filter` käy läpi taulukon ja palauttaa uuden taulukon, joka sisältää vain ne alkiot, joille ehto on tosi. Ehto `idx !== indeksiNum` säilyttää kaikki tehtävät, joiden indeksi **ei** ole poistettavan tehtävän indeksi. Poiston jälkeen `navigate('/')` ohjaa takaisin aloitusnäkymään.

**Vahvistusviestissä** näytetään poistettavan tehtävän nimi: `tehtavat[indeksiNum]?.nimi`. Optional chaining `?.` varmistaa, ettei sovellus kaadu, jos indeksi olisi jostakin syystä virheellinen.

Tallennetaan tiedosto. Sovelluksen kaikkien kolmen näkymän pitäisi nyt toimia: tehtäviä voi merkitä tehdyiksi, lisätä uusia ja poistaa olemassa olevia.

### Projektin lopullinen rakenne

```
demo06/
├── node_modules/                    # Asennetut riippuvuudet (ei versionhallintaan)
├── public/                          # Staattiset tiedostot
├── src/
│   ├── components/
│   │   ├── Otsikko.tsx              # Uudelleenkäytettävä otsikkokomponentti
│   │   ├── PoistaTehtava.tsx        # Poistonäkymä (useParams, filter)
│   │   ├── Tehtavalista.tsx         # Aloitusnäkymä (lista, checkbox, poistopainike)
│   │   └── UusiTehtava.tsx          # Lisäysnäkymä (useRef, useNavigate)
│   ├── App.tsx                      # Reittien määrittely ja tehtävien tilamuuttuja
│   ├── main.tsx                     # Sovelluksen aloituspiste (BrowserRouter)
│   └── vite-env.d.ts                # Viten TypeScript-ympäristötyypit
├── eslint.config.js                 # ESLint-konfiguraatio
├── index.html                       # HTML-pohja
├── package.json                     # Riippuvuudet ja käynnistyskomennot
├── tsconfig.json                    # TypeScript-konfiguraatio
├── tsconfig.app.json                # TypeScript-konfiguraatio sovelluskoodille
├── tsconfig.node.json               # TypeScript-konfiguraatio Vite-konfiguraatiolle
└── vite.config.ts                   # Vite-konfiguraatio (portti 3006)
```

---

## 3. Muistilista

### React Router — reititysparametrit

| Käsite | Syntaksi | Kuvaus |
|--------|----------|--------|
| Dynaaminen reitti | `path="/poista/:indeksi"` | Kaksoispisteellä alkava osa on muuttuva parametri |
| `useParams()` | `const { indeksi } = useParams()` | Palauttaa reitin parametrit objektina |
| Parametrin tyyppi | Aina `string` | Numeerinen käyttö vaatii `Number()`-muunnoksen |
| `useNavigate()` | `navigate('/')` | Ohjelmallinen navigointi funktion sisällä |
| `Link` | `component={Link} to="/reitti"` | MUI-komponentin polymorfinen navigointi |

### Immutable-taulukkojen päivitys

| Operaatio | Metodi | Esimerkki |
|-----------|--------|-----------|
| Lisäys | Spread-operaattori | `setTehtavat([...tehtavat, uusiTehtava])` |
| Muokkaus | `map` | `setTehtavat(tehtavat.map((t, i) => i === idx ? { ...t, tehty: !t.tehty } : t))` |
| Poisto | `filter` | `setTehtavat(tehtavat.filter((_, i) => i !== idx))` |

> **Huomio:** Reactissa tilaobjekteja ja -taulukoita ei koskaan muuteta suoraan. `push`, `splice` ja suora `taulukko[i] = ...` -sijoitus eivät käynnistä uudelleenrenderöintiä, koska React ei havaitse muutosta. `map`, `filter` ja spread-operaattori luovat aina uuden taulukon, jonka React tunnistaa muutokseksi.

### MUI-komponentit tässä demossa

| Komponentti | Dokumentaatio | Käyttötarkoitus |
|-------------|---------------|-----------------|
| `<Container>` | [Container](https://mui.com/material-ui/react-container/) | Keskittävä säilökomponentti, `maxWidth="sm"` |
| `<Typography>` | [Typography](https://mui.com/material-ui/react-typography/) | Tekstikomponentti |
| `<Button>` | [Button](https://mui.com/material-ui/react-button/) | Painike, `variant="contained"` täytetyllä tyylillä |
| `<TextField>` | [TextField](https://mui.com/material-ui/react-text-field/) | Tekstinsyöttökenttä |
| `<List>` | [List](https://mui.com/material-ui/react-list/) | Listasäilö |
| `<ListItem>` | [List](https://mui.com/material-ui/react-list/) | Yksittäinen listarivi |
| `<ListItemIcon>` | [List](https://mui.com/material-ui/react-list/) | Ikoni listarivin vasemmalla tai oikealla puolella |
| `<ListItemText>` | [List](https://mui.com/material-ui/react-list/) | Teksti listarivissä |
| `<IconButton>` | [IconButton](https://mui.com/material-ui/api/icon-button/) | Ikonipainike |
| `<CssBaseline>` | [CssBaseline](https://mui.com/material-ui/react-css-baseline/) | Selaimen oletustyylien nollaus |

### Asennuskomennot

| Komento | Selitys |
|---------|---------|
| `npm create vite@latest demo06 -- --template react-ts` | Luo uuden Vite + React + TypeScript -projektin |
| `npm install react-router` | Asentaa React Router -kirjaston |
| `npm install @mui/material @emotion/react @emotion/styled` | Asentaa MUI:n ja Emotion-kirjastot |
| `npm install @mui/icons-material` | Asentaa MUI:n ikonipakkauksen |
| `npm install @fontsource/roboto` | Asentaa Roboto-fontin |
| `npm run dev` | Käynnistää Vite-kehityspalvelimen |

---

## Sovelluksen käynnistys

Jos projekti kloonataan valmiina tai halutaan käynnistää se uudelleen:

**1. Asennetaan riippuvuudet:**

```bash
npm install
```

`npm install` asentaa `package.json`-tiedostossa listatut riippuvuudet `node_modules/`-kansioon. Tämä on tarpeen aina, kun projekti kloonataan tai `node_modules/`-kansio puuttuu, koska sitä ei lisätä versionhallintaan.

**2. Käynnistetään kehityspalvelin:**

```bash
npm run dev
```

Sovellus avautuu osoitteessa `http://localhost:3006`.
