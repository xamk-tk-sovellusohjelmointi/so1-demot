# Demo 6: Reititysparametrit

Demossa 6 jatketaan React Routerin käyttöä ja opitaan uusi tärkeä konsepti: **reititysparametrit** (engl. route parameters). Reititysparametrien avulla samaa komponenttia voidaan käyttää erilaisen datan näyttämiseen reitin osana välitettävän arvon perusteella — ilman, että jokaiselle yksittäiselle näkymälle tarvitsee luoda oma komponenttinsa.

Demosovelluksena on tehtävälista, jossa tehtäviä voidaan lisätä, merkitä tehdyiksi ja poistaa. Poistaminen toteutetaan omassa näkymässään, jonne navigoidaan reitillä `/poista/:indeksi`. Kaksoispisteellä alkava `:indeksi` on reititysparametri — se vaihtelee sen mukaan, mitä tehtävää ollaan poistamassa.

Tärkeimmät linkit opiskeluun:

- [React Router — useParams](https://reactrouter.com/api/hooks/useParams)
- [React Router — dynaamiset segmentit](https://reactrouter.com/start/library/routing#dynamic-segments)

## 1. Asennukset

### 1.1 Asennetaan tarvittavat paketit

Tämä demo tarvitsee samat paketit kuin Demo 5: React Router, MUI, MUI:n ikonit ja Roboto-fontti. Jos asensit ne edellisessä demossa, asennat nyt ne uudelleen tähän projektiin.

```bash
npm install react-router @mui/material @emotion/react @emotion/styled @mui/icons-material @fontsource/roboto
```

### 1.2 Otetaan BrowserRouter ja fontit käyttöön main.tsx-tiedostossa

Aivan kuten Demo 5:ssä, koko sovellus kääritään `BrowserRouter`-komponentin sisään ja Roboto-fontit lisätään tuonteina:

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

## 2. Sovelluksen tietorakenne — Tehtava-interface

Tässä demossa useat komponentit käyttävät samaa `Tehtava`-tietotyyppiä. Tyyppi määritellään `interface`-rakenteena jokaisessa tiedostossa, jossa sitä tarvitaan:

```tsx
interface Tehtava {
  nimi: string;
  tehty: boolean;
}
```

`Tehtava`-tyyppi on objekti, jolla on kaksi kenttää:
- `nimi`: tehtävän nimi tekstinä
- `tehty`: onko tehtävä merkitty tehdyksi (totuusarvo)

Sama `interface` kirjoitetaan `App.tsx`-tiedostoon sekä kaikkiin komponentteihin, jotka käyttävät tehtävätietoja (`Tehtavalista`, `UusiTehtava`, `PoistaTehtava`).

## 3. Otsikko-apukomponentti

Rakennetaan sovellukselle pieni apukomponentti otsikoiden tulostamiseen. Se ei liity suoraan reititysparametreihin, mutta selkeyttää sovelluksen koodia: sen sijaan, että kirjoitetaan joka paikassa sama `Typography`-rakenne, käytetään omaa `Otsikko`-komponenttia.

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

- `children`: Otsikon teksti. Tyyppi on `React.ReactNode`, joka kattaa kaiken mahdollisen React-sisällön — tekstiä, elementtejä tai molempia. Tämä on oikea tyyppi, kun komponentti saa sisältönsä lapsielementteinä.
- `tyyli?: 'pieni'`: Valinnainen ominaisuus, jolla voidaan pyytää pienempää otsikkoa. Tyypiksi on asetettu merkkijonoliteraali `'pieni'` (eikä pelkkä `string`), jolloin TypeScript antaa virheen, jos ominaisuuteen yritetään antaa jokin muu arvo. Kysymysmerkki tekee ominaisuudesta valinnaisen.

Komponenttia voidaan käyttää kahdella tavalla:
```tsx
<Otsikko>Isompi otsikko</Otsikko>
<Otsikko tyyli="pieni">Pienempi otsikko</Otsikko>
```

## 4. App.tsx — tehtävien tila ja reittirakenne

`App`-komponentti toimii sovelluksen "aivoina". Se hallinnoi tehtävälistaa tilamuuttujana ja välittää sekä listan tiedot että niiden päivitysfunktion alinäkymille propsien kautta.

### 4.1 Luodaan tehtävien tilamuuttuja ja sovelluksen kehys

Korvataan Viten oletussisältö App.tsx:ssä. Luodaan ensin tehtävien tilamuuttuja ja sovelluksen perusrakenne:

```tsx
import { Container, CssBaseline } from '@mui/material';
import { useState } from 'react';
import { Route, Routes } from 'react-router';
import Otsikko from './components/Otsikko';
import { Tehtava } from './types';

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
          {/* Reitit tulevat tähän */}
        </Routes>

      </Container>
    </>
  );
}

export default App;
```

Tilamuuttuja `tehtavat` on taulukko `Tehtava`-objekteja. Sen tyypiksi on merkitty `Tehtava[]` (taulukko Tehtava-objekteja). `useState` on alustettu kolmella esimerkkitehtävällä, jotta sovelluksessa on heti jotain nähtävää.

Huomaa, miten `Tehtava`-tyyppi tuodaan äsken luodusta `./types`-tiedostosta. Sama tuonti toistuu kaikissa komponenteissa, jotka käyttävät tätä tyyppiä.

`Container maxWidth="sm"` asettaa sovelluksen sisällölle maksimileveyden ja pitää sen automaattisesti sivun keskellä — kuten Demo 4:ssäkin.

### 4.2 Lisätään reitit App.tsx:ään

Lisätään `Routes`-lohkoon kolme reittiä ja tuodaan alinäkymäkomponentit:

```tsx
import { Container, CssBaseline } from '@mui/material';
import { useState } from 'react';
import { Route, Routes } from 'react-router';
import Otsikko from './components/Otsikko';
import PoistaTehtava from './components/PoistaTehtava';
import Tehtavalista from './components/Tehtavalista';
import UusiTehtava from './components/UusiTehtava';
import { Tehtava } from './types';

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

Kaksi ensimmäistä reittiä ovat tuttuja Demo 5:stä: `/uusi` vie uuden tehtävän lisäysnäkymään ja `/` on aloitusnäkymä tehtävälistoineen.

Kolmas reitti `/poista/:indeksi` on uusi. Siinä `:indeksi` on **reititysparametri**. Kaksoispisteellä alkava osa reitissä tarkoittaa, että se on muuttuva osa — sen arvo voi olla mitä tahansa. Esimerkiksi:
- `/poista/0` → indeksi on `"0"`
- `/poista/2` → indeksi on `"2"`

Kaikki nämä polut johtavat samaan `PoistaTehtava`-komponenttiin, ja komponentti saa tiedon siitä, mikä numero reitissä on.

Jokainen reitti välittää alinäkymälle `tehtavat`-taulukon ja `setTehtavat`-funktion propseina. Näin alinäkymät pääsevät käsiksi yhteiseen tehtävälistaan ja voivat päivittää sitä.

## 5. Tehtavalista-komponentti

Luodaan `src/components/Tehtavalista.tsx`. Tämä on sovelluksen aloitusnäkymä: se listaa kaikki tehtävät, tarjoaa painikkeen uuden tehtävän lisäämiseen ja poistopainikkeen jokaisen tehtävän yhteydessä.

### 5.1 Luodaan listan perusrakenne

Aloitetaan rakentamalla listan perusrakenne — tehtävärivit checkbox-ikoneineen. Poistopainike lisätään seuraavassa kohdassa:

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
import { Tehtava } from '../types';
import Otsikko from './Otsikko';

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

          </ListItem>
        ))}
      </List>
    </>
  );
}

export default Tehtavalista;
```

Komponentille välitetään propseina `tehtavat`-taulukko ja `setTehtavat`-funktio. Props-tyyppi `Props` määritellään omassa interfacessa käyttäen yhteistä `Tehtava`-tyyppiä.

`merkitseTehdyksi`-funktio päivittää tehtävän `tehty`-tilan. Tärkeää on huomata, miten päivitys tehdään: `tehtavat.map(...)` luo täysin **uuden taulukon** eikä muuta olemassa olevaa. Jokaiselle alkiolle tarkistetaan indeksi — vastaavalle kohdalle luodaan uusi objekti spread-operaattorilla (`{ ...tehtava, tehty: !tehtava.tehty }`), muut alkiot palautetaan sellaisenaan. Tämä on Reactin **immutable-päivitys**: alkuperäistä tilaobjektia ei koskaan muuteta suoraan.

Tehtävät listataan `tehtavat.map(...)`:lla, aivan kuten aiemmissakin demoissa. Jokainen tehtävä saa oman `ListItem`-rivin, johon tulee vasemmalle checkbox-ikoni ja oikealle tehtävän nimi.

### 5.2 Lisätään navigointipainikkeet

Lisätään "Lisää uusi tehtävä" -painike ja poistopainike jokaisen tehtävärivin oikeaan laitaan:

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
import { Tehtava } from '../types';
import Otsikko from './Otsikko';

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

Poistopainike on `IconButton`, johon on asetettu `component={Link} to={`/poista/${idx}`}`. Tässä syntyy reititysparametrin syöttö: jokaisen tehtävän kohdalla `idx` (tehtävän indeksi taulukossa) upotetaan osaksi reittiä. Kun painiketta painetaan, selain siirtyy esimerkiksi osoitteeseen `/poista/1` — ja `PoistaTehtava`-komponentti saa tiedon, että poistetaan tehtävä indeksillä `1`.

Huomaa template literal -syntaksi: `` `/poista/${idx}` `` (backtick-merkit ja `${}`). Tällä tavalla JavaScript-muuttujan arvo upotetaan merkkijonon sisään.

## 6. UusiTehtava-komponentti

Luodaan `src/components/UusiTehtava.tsx`. Tämä on lisäysnäkymä, jossa käyttäjä voi kirjoittaa uuden tehtävän ja tallentaa sen.

```tsx
import { Button, TextField } from '@mui/material';
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { Tehtava } from '../types';
import Otsikko from './Otsikko';

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

      <Button variant="contained" fullWidth onClick={lisaaTehtava}>
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

Tässä käytetään `useRef`-hookia syöttökentän arvon lukemiseen. `useRef` luo viittauksen DOM-elementtiin. Kun `inputRef`-ominaisuudella liitetään ref MUI:n `TextField`-komponenttiin, `uusiTehtavaRef.current` viittaa aina siihen HTML-input-elementtiin ja sieltä voidaan lukea arvo suoraan `.value`-ominaisuudella.

Tämä on niin sanottu **ohjaamaton komponentti** (uncontrolled component) -lähestymistapa: syöttökentän arvo ei tallennu Reactin tilamuuttujaan jokaisen näppäinpainalluksen yhteydessä, vaan luetaan vasta tallennuksen hetkellä. Toisin kuin `useState`-pohjaisessa ratkaisussa, tässä ei tapahdu uudelleenrenderöintiä kirjoittaessa.

`uusiTehtavaRef.current?.value` — kysymysmerkki `?.` on **optional chaining** -operaattori. Se tarkoittaa: "lue `value` jos `current` ei ole `null`". Tämä on tarpeen, koska TypeScript tietää, että ref on `null` ennen kuin komponentti on renderöity.

`lisaaTehtava`-funktio luo uuden `Tehtava`-objektin, lisää sen tehtävälistaan spread-operaattorilla ja navigoi takaisin aloitusnäkymään `navigate('/')`-komennolla.

## 7. PoistaTehtava-komponentti ja useParams-hook

Luodaan `src/components/PoistaTehtava.tsx`. Tämä on demon ydinkomponentti, jossa opitaan reititysparametrien vastaanottaminen `useParams`-hookilla.

```tsx
import { Button, Typography } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router';
import { Tehtava } from '../types';
import Otsikko from './Otsikko';

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

      <Button variant="contained" fullWidth onClick={vahvistaPoisto}>
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

### useParams — reititysparametrien vastaanottaminen

`useParams` on React Routerin hook, joka palauttaa objektin sisältäen kaikki aktiivisen reitin parametrit avain-arvo-pareina:

```tsx
const { indeksi } = useParams();
```

Tässä haetaan `indeksi`-parametri, jonka nimi vastaa App-komponentissa reitille määriteltyä `:indeksi`-osaa (`/poista/:indeksi`). Destructuring-syntaksilla `{ indeksi }` poimitaan juuri tämä parametri suoraan ilman, että ensin täytyy viitata koko objektiin.

**Tärkeä huomio:** `useParams` palauttaa kaikki parametriarvot aina **merkkijonoina** (`string`), vaikka niiden sisältö olisi numero. Tästä syystä indeksiä käytettäessä täytyy tehdä tyyppimuunnos. Muunnos tehdään heti omaan muuttujaansa:

```tsx
const indeksiNum = Number(indeksi);
```

Tämän jälkeen `indeksiNum` on numerotyyppiä ja sitä voidaan käyttää taulukko-operaatioissa.

### Tehtävän poistaminen filter-metodilla

`vahvistaPoisto`-funktiossa tehtävälista päivitetään `filter`-metodilla:

```tsx
setTehtavat(tehtavat.filter((_, idx) => idx !== indeksiNum));
```

`filter` käy läpi taulukon ja palauttaa uuden taulukon, joka sisältää vain ne alkiot, joille ehto on tosi. Tässä ehto on `idx !== indeksiNum` — kaikki tehtävät, joiden indeksi **ei** ole poistettavan tehtävän indeksi, säilytetään. Alleviivattu `_` tarkoittaa, että funktion ensimmäistä parametria (itse alkiota) ei käytetä tässä — se on TypeScript/JavaScript-käytäntö merkitä käyttämätön parametri.

Tämäkin on immutable-päivitys: alkuperäistä `tehtavat`-taulukkoa ei muuteta, vaan `filter` luo uuden taulukon.

### Poistettavan tehtävän tiedot näytetään käyttäjälle

Vahvistusviestissä näytetään poistettavan tehtävän nimi:

```tsx
<Typography sx={{ marginBottom: '20px' }}>
  Haluatko varmasti poistaa tehtävän "{tehtavat[indeksiNum]?.nimi}"?
</Typography>
```

`tehtavat[indeksiNum]` hakee tehtävän taulukosta indeksillä. Optional chaining `?.nimi` varmistaa, ettei sovellus kaadu, jos indeksi olisi jostakin syystä virheellinen — esimerkiksi jos käyttäjä kirjoittaa osoitteen suoraan selaimen osoiteriville.

## 8. Lopuksi

Tässä demossa opittiin reititysparametrien käyttö React Routerissa. Keskeisimmät uudet asiat:

- **`:parametrinnimi` reitissä** — kaksoispisteellä alkava osa polkua on muuttuva reititysparametri, esim. `path="/poista/:indeksi"`.
- **`useParams()`** — hook, joka palauttaa aktiivisen reitin parametrit objektina. Parametriarvot ovat aina merkkijonoja.
- **Tyyppimuunnos** — numeerista parametria käytettäessä muunnos `Number(parametri)` on tarpeen.
- **Yhteinen tyypitiedosto** (`types.ts`) — jaettu `interface` määritellään kerran ja tuodaan kaikista komponenteista.
- **Immutable-päivitys** — tilan taulukkoja ei koskaan muuteta suoraan; `map` ja `filter` luovat aina uuden taulukon.

Reititysparametrit mahdollistavat dynaamisten näkymien rakentamisen: sama komponentti voi näyttää eri sisältöä sen perusteella, mikä arvo reitissä on. Tätä mallia käytetään laajasti oikeissa sovelluksissa — esimerkiksi tuotesivuilla (`/tuote/123`), käyttäjäprofiileissa (`/kayttaja/juha`) ja vastaavissa.
