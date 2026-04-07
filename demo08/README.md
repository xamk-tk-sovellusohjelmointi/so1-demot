# Demo 8: Tietojen tallentaminen localStoragella

## Oppimistavoitteet

Tämän demon jälkeen opiskelija osaa:
- selittää, mitä `localStorage` on ja mihin sitä käytetään
- tallentaa ja lukea tietoja selaimen paikallisesta muistista
- muuntaa JavaScript-objekteja JSON-merkkijonoksi ja takaisin (`JSON.stringify`, `JSON.parse`)
- luoda yksilöiviä tunnisteita `crypto.randomUUID()`-metodilla
- siirtää TypeScript-interfacen globaaliin tyyppitiedostoon

## 1. Tietojen pysyvyys React-sovelluksissa

Tähän asti kaikissa demosovelluksissa tilamuuttujien arvot ovat kadonneet, kun sivu ladataan uudelleen tai selain suljetaan. Reactin `useState` säilyttää tiedot vain käyttömuistissa sovelluksen suorituksen ajan.

Monissa sovelluksissa käyttäjän lisäämät tiedot pitää säilyttää myös selaimen sulkemisen jälkeen.

### 1.1 Mikä localStorage on?

**localStorage** on selaimen tarjoama avain-arvo-varasto (key-value store). Jokainen verkkosivusto saa oman, erillisen tallennustilan, joka säilyy niin kauan kuin käyttäjä ei tyhjennä selaimen tietoja.

Keskeiset ominaisuudet:

| Ominaisuus | Kuvaus |
|------------|--------|
| Tallennusmuoto | Avain-arvo-parit. Molemmat ovat merkkijonoja (`string`). |
| Koko | Pieni, tyypillisesti noin 5 Mt per. verkkosivusto |
| Elinkaari | Pysyvä. Ei vanhene automaattisesti. |
| Näkyvyys | Vain saman verkkosivuston koodi pääsee käsiksi tietoihin |
| Tietotyyppi | Vain merkkijonoja. Objektit ja taulukot pitää muuntaa JSON-merkkijonoiksi. |

### 1.2 localStoragen metodit

localStorage tarjoaa neljä metodia tietojen käsittelyyn:

| Metodi | Kuvaus | Esimerkki |
|--------|--------|-----------|
| `setItem(avain, arvo)` | Tallentaa arvon annetulla avaimella | `localStorage.setItem("nimi", "Matti")` |
| `getItem(avain)` | Lukee arvon avaimella. Palauttaa `null`, jos avainta ei ole. | `localStorage.getItem("nimi")` |
| `removeItem(avain)` | Poistaa yksittäisen avaimen ja sen arvon | `localStorage.removeItem("nimi")` |
| `clear()` | Tyhjentää koko localStoragen | `localStorage.clear()` |

Koska localStorage tallentaa vain merkkijonoja, objektit ja taulukot pitää muuntaa JSON-muotoon tallentaessa ja takaisin objekteiksi lukiessa:

```typescript
// Tallentaminen objektista JSON-merkkijonoksi
const tehtavat = [{ nimi: "Siivoa", tehty: false }];
localStorage.setItem("tehtavalista", JSON.stringify(tehtavat));

// Lukeminen JSON-merkkijonosta objektiksi
setTehtavat(JSON.parse(String(localStorage.getItem("tehtavalista"))));
```

`JSON.stringify()` muuntaa JavaScript-objektin tai -taulukon JSON-merkkijonoksi. `JSON.parse()` lukee merkkijonon ja palauttaa siitä JavaScript-objektin.

`String()`-muunnos on tarpeen, koska `getItem()` voi palauttaa `null`, ja `JSON.parse(null)` palauttaisi `null` ilman virhettä, mutta TypeScript varoittaa tyyppiyhteensopivuudesta.

### 1.3 useEffect-hook

**`useEffect`** on Reactin hook, jolla suoritetaan sivuvaikutuksia (side effects) komponentin renderöinnin yhteydessä. Sivuvaikutuksia ovat esimerkiksi tilamuuttujien muutokset.

```typescript
useEffect(() => {
  // Tämä koodi suoritetaan kerran renderöinnin jälkeen
}, []);
```

`useEffect` ottaa vastaan kaksi parametria:

| Parametri | Kuvaus |
|-----------|--------|
| Funktio | Sivuvaikutuksen sisältävä funktio, joka suoritetaan renderöinnin jälkeen |
| Riippuvuustaulukko | Taulukko arvoja, joiden muuttuessa sivuvaikutus suoritetaan uudelleen |

Riippuvuustaulukko määrittää, milloin sivuvaikutus suoritetaan:

| Riippuvuustaulukko | Suoritusajankohta |
|--------------------|-------------------|
| `[]` (tyhjä taulukko) | Vain kerran, kun komponentti renderöidään ensimmäisen kerran |
| `[arvo]` | Aina kun `arvo` muuttuu |
| `[arvo1, arvo2]` | Aina kun `arvo1` tai `arvo2` muuttuu |

`useEffect`-funktio voi palauttaa **siivousfunktion** (cleanup function). Siivousfunktio suoritetaan, kun komponentti poistuu näkymästä tai ennen sivuvaikutuksen uudelleensuoritusta:

```typescript
useEffect(() => {
  // Tehdään jotain, esim. haetaan tehtävät ensimmäisen kerran

  return () => {
    kaynnistetty.current = true;
  };
}, []);
```

### 1.4 useRef ja StrictMode-ongelma

Reactin **StrictMode** suorittaa kehitystilassa jokaisen komponentin renderöinnin kahdesti. Tämä tarkoittaa, että `useEffect` tyhjällä riippuvuustaulukolla suoritetaan kahdesti kehitystilassa, vaikka tuotantoversiossa se suoritetaan vain kerran.

Tämä on ongelma localStorage-latauksen kanssa. Tiedot saatetaan ladata ja ylikirjoittaa tarpeettomasti. Ratkaisuna voidaan käyttää `useRef`-hookia tarkistuksena, joka estää koodin suorittamisen toisella kerralla:

```typescript
const kaynnistetty = useRef(false);

useEffect(() => {
  if (!kaynnistetty.current) {
    // Suoritetaan vain kerran
  }

  return () => {
    kaynnistetty.current = true;
  };
}, []);
```

`useRef` luo viittausobjektin, jonka `.current`-arvo säilyy renderöintien välillä. Toisin kuin `useState`, `useRef`-arvon muuttaminen ei aiheuta uudelleenrenderöintiä. Tässä `useRef` toimii tarkistuksena. Ensimmäisellä suorituksella `kaynnistetty.current` on `false`, ja siivousfunktio asettaa sen `true`-arvoon. Toisella suorituksella ehto `!kaynnistetty.current` on `false`, joten sisältö ohitetaan.

### 1.5 crypto.randomUUID()

Demossa 6 tehtävät tunnistettiin niiden taulukkoindeksillä. Tämä on ongelmallista, kun tietoja tallennetaan pysyvästi: indeksit muuttuvat, kun tehtäviä lisätään tai poistetaan.

Demossa 8 jokaiselle tehtävälle annetaan yksilöivä tunniste (**UUID**, Universally Unique Identifier). UUID luodaan selaimen `crypto.randomUUID()`-metodilla:

```typescript
const id = crypto.randomUUID();
// Esim. "3b241101-e2bb-4d7a-8613-e2e0f96de4a9"
```

UUID on 36 merkin mittainen merkkijono, joka on käytännössä aina uniikki. Tämä on turvallinen tapa tunnistaa yksittäisiä tietueita ilman palvelinta tai tietokantaa.

### 1.6 Globaali tyyppitiedosto (types.d.ts)

Demossa 6 `Tehtava`-interface määriteltiin erikseen jokaisessa tiedostossa, joka käytti sitä. Demossa 8 interface siirretään globaaliin **tyyppitiedostoon** `src/types.d.ts`.

`.d.ts`-päätteinen tiedosto on TypeScriptin **tyyppimäärittelytiedosto** (declaration file). Sen sisältämät tyypit ovat automaattisesti käytettävissä koko projektissa ilman erillistä `import`-lausetta. Tämä vähentää toistoa ja varmistaa, että sama tyyppi on yhdenmukainen kaikkialla.

### 1.7 Demosovellus

Tämä demo jatkaa demo 6:n tehtävälistasovellusta. Sovelluksen kolme näkymää ja reititysrakenne säilyvät samana. Uutta on tietojen pysyvä tallennus localStorageen ja tehtävien tunnistaminen UUID-tunnisteilla indeksien sijaan.

Muutokset demo 6:een verrattuna:

| Muutos | Demo 6 | Demo 8 |
|--------|--------|--------|
| Tehtävän tunniste | Taulukkoindeksi (`number`) | UUID-merkkijono (`string`) |
| Tehtava-interface | Määritelty jokaisessa tiedostossa erikseen | Globaali `types.d.ts` |
| Alkudata | Kolme kovakoodattua tehtävää | Tyhjä taulukko, tiedot ladataan localStoragesta |
| Tietojen pysyvyys | Katoaa sivun latauksen yhteydessä | Säilyy localStoragessa |
| Reititysparametri | `/poista/:indeksi` | `/poista/:id` |
| Uudet hookit | — | `useEffect`, `useRef` |

---

## 2. Demosovelluksen rakentuminen vaihe vaiheelta

Demo 8 rakennetaan demo 6:n päälle. Projektin luominen, riippuvuuksien asentaminen, `main.tsx`, `vite.config.ts` ja `Otsikko.tsx` ovat samat kuin demo 6:ssa. Tässä ohjeistuksessa käsitellään vain muuttuneet ja uudet tiedostot.

> **Huomio:** Lähtökohtana on toimiva demo 6 -sovellus. Kopioidaan demo 6:n koodi pohjaksi ja tehdään siihen alla kuvatut muutokset.

### Vaihe 1: Globaali tyyppitiedosto (types.d.ts)

Luodaan tiedosto `src/types.d.ts`:

```typescript
interface Tehtava {
    id : string,
    nimi : string,
    tehty : boolean
}
```

Demo 6:ssa `Tehtava`-interface sisälsi vain `nimi`- ja `tehty`-kentät. Demossa 8 lisätään `id`-kenttä, joka on tyypiltään `string`. UUID-tunniste tallennetaan tähän kenttään.

Koska tiedosto on `.d.ts`-päätteinen, TypeScript tunnistaa `Tehtava`-interfacen automaattisesti kaikissa projektin tiedostoissa. Yksittäisten komponenttien ei tarvitse tuoda (`import`) sitä erikseen eikä määritellä omaa `Tehtava`-interfacea.

Poistetaan samalla kaikista komponenteista (`App.tsx`, `Tehtavalista.tsx`, `UusiTehtava.tsx`, `PoistaTehtava.tsx`) niiden omat `interface Tehtava` -määrittelyt. Ne korvataan tällä globaalilla määrittelyllä.

### Vaihe 2: App.tsx

Korvataan `src/App.tsx`:n sisältö:

```typescript
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
```

Tiedostossa on useita muutoksia demo 6:een verrattuna. Käydään ne läpi järjestyksessä.

**Muutos 1: Uudet importit**

```typescript
import { useState, useRef, useEffect } from 'react';
```

Demo 6:ssa tuotiin vain `useState`. Demossa 8 tuodaan lisäksi `useRef` ja `useEffect`.

**Muutos 2: Tehtava-interface poistettu**

Demo 6:ssa `Tehtava`-interface määriteltiin suoraan `App.tsx`:ssä. Demossa 8 se on siirretty `types.d.ts`-tiedostoon, joten sitä ei tarvitse tuoda tai määritellä erikseen.

**Muutos 3: useRef-viittaus**

```typescript
const kaynnistetty = useRef(false);
```

`kaynnistetty` on tarkistus, joka estää localStorage-latauksen suorittamisen kahdesti StrictMode-kehitystilassa. Alkuarvo on `false`.

**Muutos 4: Tyhjä alkutila**

```typescript
const [tehtavat, setTehtavat] = useState<Tehtava[]>([]);
```

Demo 6:ssa `useState` alustettiin kolmella kovakoodatulla tehtävällä. Demossa 8 taulukko on aluksi tyhjä, koska tiedot ladataan localStoragesta `useEffect`-hookilla.

**Muutos 5: Ensimmäinen useEffect tietojen lataamiseen**

```typescript
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
```

Tämä `useEffect` suoritetaan komponentin ensimmäisen renderöinnin jälkeen (tyhjä riippuvuustaulukko `[]`). Se lataa tehtävät localStoragesta.

Toimintalogiikka vaihe vaiheelta:

1. `if (!kaynnistetty.current)`: tarkistetaan, onko tämä ensimmäinen suorituskerta. StrictMode-kehitystilassa `useEffect` suoritetaan kahdesti, mutta tämä ehto varmistaa, että lataus tapahtuu vain kerran.
2. `if (localStorage.getItem("tehtavalista"))`: tarkistetaan, onko localStoragessa tallennettuja tehtäviä. Jos avainta ei ole olemassa, `getItem` palauttaa `null`.
3. `JSON.parse(String(localStorage.getItem("tehtavalista")))`: luetaan tallennettu JSON-merkkijono ja muunnetaan se takaisin JavaScript-taulukoksi.
4. `.map((tehtava: Tehtava) => { return { ...tehtava } })`: jokainen tehtävä kopioidaan uudeksi objektiksi spread-operaattorilla. Tämä varmistaa, että React saa uudet objektiviittaukset.
5. Siivousfunktio `return () => { kaynnistetty.current = true; }` asettaa tarkistuksen `true`:ksi, jotta toinen StrictMode-suoritus ohitetaan.

**Muutos 6: Toinen useEffect tietojen tallentamiseen**

```typescript
useEffect(() => {

  localStorage.setItem("tehtavalista", JSON.stringify(tehtavat));
}, [tehtavat])
```

Tämä `useEffect` suoritetaan aina, kun `tehtavat`-taulukko muuttuu (riippuvuustaulukossa on `[tehtavat]`). Se tallentaa koko tehtävälistan localStorageen JSON-muodossa.

`JSON.stringify(tehtavat)` muuntaa taulukon merkkijonoksi ja `localStorage.setItem()` tallentaa sen avaimella `"tehtavalista"`. Koska `useEffect` reagoi kaikkiin `tehtavat`-tilamuuttujan muutoksiin, tallennus tapahtuu automaattisesti lisäyksen, poiston ja tehdyksi merkitsemisen jälkeen.

**Muutos 7: Reititysparametri**

```typescript
<Route
  path="/poista/:id"
  element={<PoistaTehtava tehtavat={tehtavat} setTehtavat={setTehtavat} />}
/>
```

Demo 6:ssa reitti oli `/poista/:indeksi`. Demossa 8 parametri on `:id`, koska tehtävät tunnistetaan UUID-tunnisteella indeksin sijaan.

### Vaihe 3: Tehtavalista.tsx

Korvataan `src/components/Tehtavalista.tsx`:n sisältö:

```typescript
// React import
import { Link } from "react-router";
// MUI imports
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import DeleteIcon from "@mui/icons-material/Delete";
// Custom imports
import Otsikko from "./Otsikko";

interface Props {
  tehtavat: Tehtava[];
  setTehtavat: (tehtavat: Tehtava[]) => void;
}

function Tehtavalista({ tehtavat, setTehtavat }: Props) {
  const merkitseTehdyksi = (id: string) => {
    let indeksi: number = tehtavat.findIndex((tehtava: Tehtava) => {
      return tehtava.id === id;
    });

    let tehtavatApu: Tehtava[] = [...tehtavat];

    tehtavatApu[indeksi].tehty = !tehtavatApu[indeksi].tehty;

    setTehtavat(tehtavatApu);
  };

  return (
    <>
      <Otsikko tyyli="pieni">Tehtävälista</Otsikko>

      <Button variant="contained" fullWidth component={Link} to="/uusi">
        Lisää uusi tehtävä
      </Button>

      <List>
        {tehtavat.map((tehtava: Tehtava, idx: number) => (
          <ListItem key={idx}>
            <ListItemIcon>
              <IconButton onClick={() => merkitseTehdyksi(tehtava.id)}>
                {tehtava.tehty ? (
                  <CheckBoxIcon color="secondary" />
                ) : (
                  <CheckBoxOutlineBlankIcon />
                )}
              </IconButton>
            </ListItemIcon>

            <ListItemText primary={tehtava.nimi} />

            <ListItemIcon>
              <IconButton component={Link} to={`/poista/${tehtava.id}`} edge="end">
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

Muutokset demo 6:een verrattuna:

**Muutos 1: Tehtava-interface poistettu**

Tiedoston alussa ei enää määritellä omaa `interface Tehtava`. Se tulee globaalista `types.d.ts`-tiedostosta.

**Muutos 2: merkitseTehdyksi käyttää id-tunnistetta**

Demo 6:ssa `merkitseTehdyksi` sai parametrina taulukkoindeksin (`number`) ja käytti `map`-metodia. Demossa 8 funktio saa parametrina tehtävän `id`-merkkijonon (`string`):

```typescript
const merkitseTehdyksi = (id: string) => {
  let indeksi: number = tehtavat.findIndex((tehtava: Tehtava) => {
    return tehtava.id === id;
  });

  let tehtavatApu: Tehtava[] = [...tehtavat];

  tehtavatApu[indeksi].tehty = !tehtavatApu[indeksi].tehty;

  setTehtavat(tehtavatApu);
};
```

`findIndex` etsii taulukosta tehtävän, jonka `id` vastaa parametria, ja palauttaa sen indeksin. Taulukko kopioidaan spread-operaattorilla apumuuttujaan, kohdassa olevan tehtävän `tehty`-arvo käännetään, ja päivitetty taulukko asetetaan tilaan.

**Muutos 3: Checkbox-painikkeen onClick**

```typescript
<IconButton onClick={() => merkitseTehdyksi(tehtava.id)}>
```

Demo 6:ssa välitettiin `idx` (taulukkoindeksi). Demossa 8 välitetään `tehtava.id` (UUID-tunniste).

**Muutos 4: Poistopainikkeen reitti**

```typescript
<IconButton component={Link} to={`/poista/${tehtava.id}`} edge="end">
```

Demo 6:ssa reitissä käytettiin `idx`-indeksiä. Demossa 8 reitissä käytetään `tehtava.id`-tunnistetta.

### Vaihe 4: UusiTehtava.tsx

Korvataan `src/components/UusiTehtava.tsx`:n sisältö:

```typescript
// React import
import { useRef } from "react";
import { Link, useNavigate } from "react-router";
// MUI import
import { Button, TextField } from "@mui/material";
// Custom import
import Otsikko from "./Otsikko";

interface Props {
  tehtavat: Tehtava[];
  setTehtavat: (tehtavat: Tehtava[]) => void;
}

function UusiTehtava({ tehtavat, setTehtavat }: Props) {
  const navigate = useNavigate();

  const uusiTehtavaRef = useRef<HTMLInputElement>(null);

  const lisaaTehtava = () => {
    const uusiTehtava: Tehtava = {
      id: crypto.randomUUID(),
      nimi: uusiTehtavaRef.current?.value || "Nimetön tehtävä",
      tehty: false,
    };

    setTehtavat([...tehtavat, uusiTehtava]);

    navigate("/");
  };

  return (
    <>
      <Otsikko tyyli="pieni">Lisää uusi tehtävä</Otsikko>

      <TextField
        label="Tehtävän nimi"
        inputRef={uusiTehtavaRef}
        variant="outlined"
        fullWidth
        sx={{ marginBottom: "10px" }}
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

Muutokset demo 6:een verrattuna:

**Muutos 1: Tehtava-interface poistettu**

Kuten muissakin komponenteissa, paikallinen `interface Tehtava` on poistettu.

**Muutos 2: id-kenttä lisätty uuteen tehtävään**

```typescript
const uusiTehtava: Tehtava = {
  id: crypto.randomUUID(),
  nimi: uusiTehtavaRef.current?.value || "Nimetön tehtävä",
  tehty: false,
};
```

Demo 6:ssa `Tehtava`-objektissa oli vain `nimi` ja `tehty`. Demossa 8 lisätään `id`, joka luodaan `crypto.randomUUID()`-metodilla. Jokainen tehtävä saa yksilöivän UUID-tunnisteen luontihetkellä.

**Muutos 3: TextField-komponentin label**

Demo 6:ssa `TextField` käytti `placeholder`-ominaisuutta. Demossa 8 käytetään `label`-ominaisuutta, joka näyttää tekstin MUI:n Material Design -tyylisen kelluvan otsikon (floating label) syöttökentän yläpuolella.

### Vaihe 5: PoistaTehtava.tsx

Korvataan `src/components/PoistaTehtava.tsx`:n sisältö:

```typescript
// React import
import { Link, useNavigate, useParams } from "react-router";
// MUI import
import { Button, Typography } from "@mui/material";
// Custom import
import Otsikko from "./Otsikko";

interface Props {
  tehtavat: Tehtava[];
  setTehtavat: (tehtavat: Tehtava[]) => void;
}

function PoistaTehtava({ tehtavat, setTehtavat }: Props) {
  const navigate = useNavigate();

  const { id } = useParams();

  const poistettavaTehtava: Tehtava | undefined = tehtavat.find(
    (tehtava: Tehtava) => {
      return tehtava.id === id;
    },
  );

  const vahvistaPoisto = () => {
    setTehtavat(tehtavat.filter((tehtava: Tehtava) => tehtava.id !== id));

    navigate("/");
  };

  return (
    <>
      <Otsikko tyyli="pieni">Poista tehtävä</Otsikko>

      <Typography sx={{ marginBottom: "20px" }}>
        Haluatko varmasti poistaa tehtävän "{poistettavaTehtava!.nimi}"?
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

Muutokset demo 6:een verrattuna:

**Muutos 1: Tehtava-interface poistettu**

Paikallinen `interface Tehtava` on poistettu.

**Muutos 2: Reititysparametri on id**

```typescript
const { id } = useParams();
```

Demo 6:ssa parametri oli `indeksi` (tyypiltään `string`, joka muunnettiin `Number()`-funktiolla numeroksi). Demossa 8 parametri on `id`, jota käytetään suoraan merkkijonona.

**Muutos 3: Tehtävän haku find-metodilla**

```typescript
const poistettavaTehtava: Tehtava | undefined = tehtavat.find(
  (tehtava: Tehtava) => {
    return tehtava.id === id;
  },
);
```

Demo 6:ssa poistettava tehtävä haettiin indeksillä: `tehtavat[indeksiNum]?.nimi`. Demossa 8 käytetään `find`-metodia, joka etsii taulukosta ensimmäisen alkion, jonka `id` vastaa reitin parametria. `find` palauttaa `undefined`, jos tehtävää ei löydy, siksi tyypiksi on merkitty `Tehtava | undefined`.

**Muutos 4: Non-null assertion (huutomerkki)**

```typescript
poistettavaTehtava!.nimi
```

Huutomerkki `!` on TypeScriptin **non-null assertion** -operaattori. Se kertoo TypeScriptille, että arvo ei ole `null` tai `undefined` tässä kohtaa. Tämä on tarpeen, koska `find` palauttaa `Tehtava | undefined`, mutta tässä tiedetään, että tehtävä löytyy (reitti on muodostettu olemassa olevan tehtävän id:stä).

**Muutos 5: Poistologiikka id:llä**

```typescript
setTehtavat(tehtavat.filter((tehtava: Tehtava) => tehtava.id !== id));
```

Demo 6:ssa suodatettiin indeksin perusteella: `idx !== indeksiNum`. Demossa 8 suodatetaan `id`-tunnisteen perusteella. `filter` palauttaa uuden taulukon, jossa on kaikki tehtävät paitsi poistettava.

### Projektin lopullinen rakenne

```
demo08/
├── node_modules/                    # Asennetut riippuvuudet (ei versionhallintaan)
├── public/                          # Staattiset tiedostot
├── src/
│   ├── components/
│   │   ├── Otsikko.tsx              # Uudelleenkäytettävä otsikkokomponentti (sama kuin demo 6)
│   │   ├── PoistaTehtava.tsx        # Poistonäkymä (useParams, find, filter id:llä)
│   │   ├── Tehtavalista.tsx         # Aloitusnäkymä (lista, checkbox, poistopainike id:llä)
│   │   └── UusiTehtava.tsx          # Lisäysnäkymä (useRef, crypto.randomUUID)
│   ├── App.tsx                      # Reitit, localStorage-lataus ja -tallennus (useEffect)
│   ├── main.tsx                     # Sovelluksen aloituspiste (BrowserRouter, sama kuin demo 6)
│   ├── types.d.ts                   # Globaali Tehtava-interface (UUSI)
│   └── vite-env.d.ts                # Viten TypeScript-ympäristötyypit
├── eslint.config.js                 # ESLint-konfiguraatio
├── index.html                       # HTML-pohja
├── package.json                     # Riippuvuudet ja käynnistyskomennot
├── tsconfig.json                    # TypeScript-konfiguraatio
├── tsconfig.app.json                # TypeScript-konfiguraatio sovelluskoodille
├── tsconfig.node.json               # TypeScript-konfiguraatio Vite-konfiguraatiolle
└── vite.config.ts                   # Vite-konfiguraatio (portti 3008)
```

---

## 3. localStorage ja useEffect: muistilista

### localStorage-metodit

| Metodi | Paluuarvo | Kuvaus |
|--------|-----------|--------|
| `localStorage.setItem(avain, arvo)` | `void` | Tallentaa merkkijonon avaimella |
| `localStorage.getItem(avain)` | `string \| null` | Lukee arvon. `null` jos avainta ei ole. |
| `localStorage.removeItem(avain)` | `void` | Poistaa yksittäisen avaimen |
| `localStorage.clear()` | `void` | Tyhjentää koko localStoragen |

### JSON-muunnokset

| Suunta | Metodi | Esimerkki |
|--------|--------|-----------|
| Objekti → merkkijono | `JSON.stringify()` | `JSON.stringify([{id: "abc", nimi: "Testi"}])` |
| Merkkijono → objekti | `JSON.parse()` | `JSON.parse('{"id":"abc","nimi":"Testi"}')` |

### useEffect-riippuvuudet

| Riippuvuustaulukko | Milloin suoritetaan |
|--------------------|---------------------|
| `[]` | Kerran, ensimmäisen renderöinnin jälkeen |
| `[tehtavat]` | Aina kun `tehtavat` muuttuu |
| Ei taulukkoa | Jokaisen renderöinnin jälkeen (ei suositella) |

### Demo 6 → Demo 8: muutosyhteenveto

| Tiedosto | Muutos |
|----------|--------|
| `src/types.d.ts` | **Uusi tiedosto.** Globaali `Tehtava`-interface (`id`, `nimi`, `tehty`). |
| `src/App.tsx` | `useRef` + kaksi `useEffect`-hookia. Tyhjä alkutila. Reitti `:id`. |
| `src/components/Tehtavalista.tsx` | `merkitseTehdyksi` käyttää `id`:tä ja `findIndex`:iä. Poistoreitti `tehtava.id`:llä. |
| `src/components/UusiTehtava.tsx` | `crypto.randomUUID()` lisätty uuteen tehtävään. `label` `placeholder`:n tilalla. |
| `src/components/PoistaTehtava.tsx` | `useParams` palauttaa `id`. Haku `find`:llä, poisto `filter`:llä `id`:n perusteella. |
| `src/components/Otsikko.tsx` | Ei muutoksia. |
| `src/main.tsx` | Ei muutoksia. |

---

## Sovelluksen käynnistys

**1. Asenna riippuvuudet:**

```bash
npm install
```

**2. Käynnistä kehityspalvelin:**

```bash
npm run dev
```

**3. Avaa selaimessa:**

Sovellus avautuu osoitteessa `http://localhost:3008`.

**4. Testaa localStorage-tallennusta:**

Lisää muutama tehtävä, merkitse jokin tehdyksi ja lataa sivu uudelleen selaimessa (`F5` tai `Ctrl + R`). Tehtävien pitäisi säilyä.

LocalStoragen sisältöä voi tarkastella selaimen kehittäjätyökaluissa: `F12` → Application → Local Storage → `http://localhost:3008`.
