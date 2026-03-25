# Demo 7: Lomakkeiden käsittely

## Oppimistavoitteet

Tämän demon jälkeen opiskelija osaa:
- rakentaa HTML `<form>`-elementin React-sovelluksessa ja käsitellä sen lähetyksen `onSubmit`-tapahtumalla
- estää lomakkeen oletustoiminnon (`e.preventDefault()`) sivun uudelleenlatauksen välttämiseksi
- tallentaa lomakkeen syötteet `useRef`-hookilla ilman tarpeetonta uudelleenrenderöintiä
- toteuttaa yhteisen `onChange`-käsittelijän usealle kentälle `name`-attribuutin avulla
- validoida lomakkeen tiedot lähetyksen yhteydessä ja näyttää kenttäkohtaiset virheilmoitukset
- käyttää MUI:n lomakekomponentteja: `TextField`, `RadioGroup`, `Checkbox`, `FormControl` ja `FormHelperText`

---

## 1. Lomakkeiden käsittely Reactissa

### HTML-lomake React-sovelluksessa

HTML:n `<form>`-elementti on vakiintunut tapa ryhmitellä lomakkeen kentät yhteen. Selain käsittelee `<form>`-elementin lähetyksen oletuksena lataamalla sivun uudelleen, mikä nollaa React-sovelluksen tilan kokonaan. Tämä estetään `e.preventDefault()`-kutsulla lomakkeen `onSubmit`-käsittelijässä:

```tsx
const lomakeKasittelija = (e: SubmitEvent): void => {
    e.preventDefault();
    // lomakkeen käsittely tässä
};

<form onSubmit={lomakeKasittelija}>
    {/* kentät */}
    <Button type="submit">Lähetä</Button>
</form>
```

`type="submit"` tekee painikkeesta lomakkeen lähetysnapin. Painikkeen klikkaus laukaisee `onSubmit`-tapahtuman `<form>`-elementissä.

`SubmitEvent` on lomakkeen lähetystapahtuman tyyppi, joka tuodaan `react`-paketista. Se tuodaan `import type` -syntaksilla, koska sitä käytetään ainoastaan tyypitykseen eikä ajonaikaisena arvona:

```tsx
import type { SubmitEvent } from 'react';
```

### useRef vs useState lomakkeissa

Demo 4:ssä lomakkeen syötteet tallennettiin `useState`-tilamuuttujaan. `useState` uudelleenrenderöi komponentin joka kerta, kun arvo muuttuu. Lomakkeissa tämä tarkoittaa uudelleenrenderöintiä jokaisen kirjoitetun merkin kohdalla, mikä on useimmiten tarpeetonta.

`useRef` tallentaa tiedon `.current`-ominaisuuteen ilman uudelleenrenderöintiä. Lomakkeissa tiedot luetaan vasta lähetyksen yhteydessä, joten välirenderöinnille ei ole tarvetta.

| Ominaisuus | `useState` (demo 4) | `useRef` (demo 7) |
|------------|--------------------|--------------------|
| Tiedon tallennus | Tilamuuttujaan | `.current`-ominaisuuteen |
| Uudelleenrenderöinti | Joka muutoksella | Ei koskaan |
| Käyttötapaus | Kun näkymän pitää reagoida jokaiseen muutokseen | Kun tieto luetaan vasta myöhemmin (esim. lähetys) |
| Esimerkki | Reaaliaikainen hakukenttä | Lomakkeen lähetys |

Molemmat tavat ovat oikeita. `useRef` sopii hyvin lomakkeisiin, joissa kenttien arvoja ei tarvitse näyttää muualla komponentissa ennen lähetystä.

### onChange-käsittelijä ja name-attribuutti

Kun lomakkeessa on useita kenttiä, jokaiselle ei tarvitse kirjoittaa omaa käsittelijäfunktiota. HTML:n `name`-attribuutilla kentät tunnistetaan, ja yksi yhteinen `onChange`-käsittelijä tallentaa kaikki arvot:

```tsx
import type { ChangeEvent } from 'react';

const syoteKasittelija = (e: ChangeEvent<HTMLInputElement>): void => {
    lomaketiedot.current[e.target.name] =
        e.target.type === 'checkbox' ? Boolean(e.target.checked) : e.target.value;
};
```

`e.target.name` on kentän `name`-propsin arvo, jolla tieto tallennetaan oikeaan avaimeen `lomaketiedot.current`-objektissa. Valintaruuduille (`checkbox`) tallennetaan `e.target.checked`-arvo (boolean), muille kentille `e.target.value` (merkkijono).

`ChangeEvent<HTMLInputElement>` on Reactin tapahtumatyyppi, joka kuvaa syöttökentän muutostapahtumaa. Se tuodaan `import type` -syntaksilla, kuten `SubmitEvent`.

### Lomakkeen validointi

Lomakkeen tiedot tarkistetaan lähetyksen yhteydessä. Virheet kerätään objektiin, ja jos virheitä löytyy, ne näytetään kenttien yhteydessä MUI:n `error`- ja `helperText`-propsien avulla. Virheilmoitukset tallennetaan `useState`-tilamuuttujaan, koska niiden muutos pitää näkyä käyttöliittymässä välittömästi.

### MUI:n lomakekomponentit

Tässä demossa käytetään seuraavia MUI:n lomakekomponentteja:

| Komponentti | Dokumentaatio | Käyttötarkoitus |
|-------------|---------------|-----------------|
| [`TextField`](https://mui.com/material-ui/react-text-field/) | Tekstinsyöttökenttä | Nimi, sähköposti |
| [`Radio`](https://mui.com/material-ui/react-radio-button/) | Valintanappi | Tilausjakson valinta |
| [`RadioGroup`](https://mui.com/material-ui/react-radio-button/) | Valintanappien ryhmä | Ryhmittää Radio-napit |
| [`Checkbox`](https://mui.com/material-ui/react-checkbox/) | Valintaruutu | Käyttöehtojen hyväksyntä |
| [`FormControl`](https://mui.com/material-ui/api/form-control/) | Lomakekentän säilö | Kokoaa kentän, otsikon ja virheilmoituksen |
| [`FormControlLabel`](https://mui.com/material-ui/api/form-control-label/) | Kentän otsikko | Yhdistää Radio/Checkbox-komponentin ja tekstin |
| [`FormLabel`](https://mui.com/material-ui/api/form-label/) | Ryhmän otsikko | RadioGroup-ryhmän otsikko |
| [`FormHelperText`](https://mui.com/material-ui/api/form-helper-text/) | Aputeksti / virheviesti | Virheilmoituksen näyttäminen kentän alla |

### Demosovellus

Tässä demossa rakennetaan uutiskirjeen tilauslomake. Lomakkeella on kaksi tekstikenttää (nimi ja sähköposti), valintanappien ryhmä (tilausjakso) ja valintaruutu (käyttöehdot). Lomakkeen lähetyksessä tarkistetaan kaikki kentät ja näytetään kenttäkohtaiset virheilmoitukset, jos tietoja puuttuu tai sähköpostiosoite on virheellinen.

Demo 4:stä poiketen tämä demo käyttää `useRef`-hookia lomakkeen tietojen tallentamiseen, HTML:n `<form>`-elementtiä lähetystapahtumalla ja kenttäkohtaista validointia virheilmoituksineen. Reititystä ei käytetä tässä demossa.

---

## 2. Demosovelluksen rakentuminen vaihe vaiheelta

### Vaihe 1: Projektin luominen

Luodaan uusi Vite + React + TypeScript -projekti:

```bash
npm create vite@latest demo07 -- --template react-ts
```

Siirrytään projektikansioon:

```bash
cd demo07
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
      <h1>Demo 7</h1>
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
    port: 3007
  }
})
```

Käynnistetään kehityspalvelin ja tarkistetaan, että oletussivu avautuu selaimessa:

```bash
npm run dev
```

Sovellus avautuu osoitteessa `http://localhost:3007`.

### Vaihe 2: Riippuvuuksien asentaminen

Sammutetaan kehityspalvelin `Ctrl + C`:llä ja asennetaan kaikki demon tarvitsemat paketit.

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

MUI, Emotion ja Roboto-fontti asennettiin ja esiteltiin demo 4:ssä. Tässä demossa ei käytetä React Routeria, koska sovellus koostuu yhdestä näkymästä.

Käynnistetään kehityspalvelin asennusten jälkeen uudelleen:

```bash
npm run dev
```

### Vaihe 3: Roboto-fontit (main.tsx)

Lisätään Roboto-fonttien tuonnit `main.tsx`-tiedostoon:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

`@fontsource/roboto` tuo Roboto-fontin paikallisesti, ilman erillistä verkkoyhteyttä. MUI käyttää Roboto-fonttia oletuksena.

### Vaihe 4: Sovelluksen runko ja lomakkeen perusta

Korvataan `src/App.tsx`:n sisältö. Rakennetaan ensin sovelluksen runko ja tyhjä lomake lähetyspainikkeella:

```tsx
import {
  Button,
  Container,
  CssBaseline,
  Typography,
} from '@mui/material';
import type { SubmitEvent } from 'react';

function App() {

  const lomakeKasittelija = (e: SubmitEvent): void => {
    e.preventDefault();
    window.alert('Lomake lähetetty!');
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">

        <Typography variant="h5">Demo 7: Lomakkeiden käsittely</Typography>

        <Typography sx={{ marginTop: '10px', marginBottom: '10px' }}>
          Uutiskirjeen tilaus v2.0
        </Typography>

        <form onSubmit={lomakeKasittelija}>

          <Button
            type="submit"
            variant="contained"
            fullWidth={true}
            size="large"
          >
            Tilaa uutiskirje
          </Button>

        </form>

      </Container>
    </>
  );
}

export default App;
```

`CssBaseline` normalisoi selaimen oletustyylit. `Container maxWidth="sm"` rajoittaa sisällön leveyttä.

`lomakeKasittelija` vastaanottaa `SubmitEvent`-tyyppisen tapahtuman. `e.preventDefault()` estää selaimen oletustoiminnon eli sivun uudelleenlatauksen. Ilman tätä kutsua React-sovelluksen tila nollautuisi joka lähetyksellä.

`SubmitEvent` tuodaan `import type` -syntaksilla, koska sitä käytetään ainoastaan tyypitykseen. `import type` kertoo TypeScript-kääntäjälle, että tuonti voidaan poistaa käännetystä JavaScript-koodista, koska sitä ei tarvita ajon aikana.

Tallennetaan tiedosto ja testataan, että nappi näyttää alert-viestin.

### Vaihe 5: Tietorakenteet ja useRef

Lisätään lomakkeen tietorakenteet ja `useRef`-viite tietojen tallentamiseen. Tämä korvaa demo 4:ssä käytetyn `useState`-lähestymistavan.

Päivitetään `src/App.tsx`:

```tsx
import {
  Button,
  Container,
  CssBaseline,
  Typography,
} from '@mui/material';
import { useRef, useState } from 'react';
import type { SubmitEvent } from 'react';

const tekstikenttaTyyli = {
  marginTop: '10px',
  marginBottom: '5px',
};

interface Lomaketiedot {
  [key: string]: any;
  nimi?: string;
  sahkoposti?: string;
  kayttoehdot?: boolean | string;
}

interface Virheet extends Lomaketiedot {}

function App() {

  const [virheilmoitukset, setVirheilmoitukset] = useState<Virheet>({});

  const lomaketiedot = useRef<Lomaketiedot>({});

  const lomakeKasittelija = (e: SubmitEvent): void => {
    e.preventDefault();
    console.log(lomaketiedot.current);
  };

  // return (...) kuten aiemmin
}
```

**`Lomaketiedot`-interface** kuvaa lomakkeen kenttiä. Kentät ovat valinnaisia (`?`), koska lomake on alussa tyhjä. `[key: string]: any` on **indeksisignatuuri**: se sallii minkä tahansa merkkijonoavaimen käytön dynaamisesti. Tämä tarvitaan, koska `syoteKasittelija` tallentaa kentät `name`-attribuutin perusteella (`lomaketiedot.current[e.target.name] = ...`), ja TypeScript vaatii indeksisignatuurin tällaista dynaamista avainten käyttöä varten.

**`interface Virheet extends Lomaketiedot {}`** perii `Lomaketiedot`-interfacen. `extends`-avainsanalla luodaan uusi interface, joka sisältää kaikki perityn interfacen kentät. Tässä `Virheet` ei lisää omia kenttiä (tyhjät aaltosulkeet `{}`), joten se on rakenteellisesti sama kuin `Lomaketiedot`. Erillinen interface parantaa koodin luettavuutta: kun koodissa näkee tyypin `Virheet`, on selvää, että kyseessä on virheilmoitusten tietorakenne, vaikka se teknisesti onkin sama.

**`useRef<Lomaketiedot>({})`** luo viitteen, jonka alkuarvo on tyhjä objekti. Tyyppiparametri `<Lomaketiedot>` kertoo TypeScriptille, minkä muotoista tietoa `.current`-ominaisuus sisältää. Lomakkeen kenttiä kirjoittaessa tieto tallentuu `lomaketiedot.current`-objektiin ilman uudelleenrenderöintiä.

**`useState<Virheet>({})`** tallentaa virheilmoitukset. Virheilmoituksille käytetään `useState`-hookia eikä `useRef`-hookia, koska niiden muutos pitää näkyä käyttöliittymässä välittömästi.

**`tekstikenttaTyyli`** on tavallinen JavaScript-objekti, joka sisältää tekstikenttien yhteiset tyylit. Muuttuja vähentää toistoa, kun sama tyyli on useammalla kentällä.

### Vaihe 6: onChange-käsittelijä ja tekstikentät

Lisätään yhteinen `syoteKasittelija` ja kaksi `TextField`-kenttää lomakkeeseen.

Päivitetään importit ja lisätään käsittelijä sekä kentät:

```tsx
import {
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from '@mui/material';
import { useRef, useState } from 'react';
import type { ChangeEvent, SubmitEvent } from 'react';

// ... (tekstikenttaTyyli, interfacet ja tilamuuttujat kuten aiemmin)

  const syoteKasittelija = (e: ChangeEvent<HTMLInputElement>): void => {
    lomaketiedot.current[e.target.name] =
      e.target.type === 'checkbox' ? Boolean(e.target.checked) : e.target.value;
  };
```

`syoteKasittelija` on yleiskäyttöinen käsittelijä, jota käytetään kaikissa kentissä. `e.target.name` on kentän `name`-propsin arvo, jonka perusteella tieto tallentuu oikeaan avaimeen. `e.target.type`-tarkistus erottaa valintaruudut tekstikentistä: valintaruuduille tallennetaan `checked`-arvo (boolean), muille `value` (merkkijono).

Lisätään tekstikentät `<form>`-elementin sisään, ennen `Button`-komponenttia:

```tsx
        <form onSubmit={lomakeKasittelija}>

          <TextField
            sx={tekstikenttaTyyli}
            name="nimi"
            label="Nimi"
            placeholder="Etunimi Sukunimi"
            fullWidth={true}
            onChange={syoteKasittelija}
            error={Boolean(virheilmoitukset.nimi)}
            helperText={virheilmoitukset.nimi}
          />

          <TextField
            sx={{ ...tekstikenttaTyyli, marginBottom: '15px' }}
            name="sahkoposti"
            label="Sähköpostiosoite"
            fullWidth={true}
            onChange={syoteKasittelija}
            error={Boolean(virheilmoitukset.sahkoposti)}
            helperText={virheilmoitukset.sahkoposti}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth={true}
            size="large"
          >
            Tilaa uutiskirje
          </Button>

        </form>
```

`name`-propsi on olennainen: sen arvo määrittää, mihin avaimeen `lomaketiedot.current`-objektissa tieto tallentuu. `error`-propsi värjää kentän reunan punaiseksi, kun arvo on `true`. `Boolean(virheilmoitukset.nimi)` muuntaa mahdollisen `undefined`-arvon `false`-arvoksi, koska `error` odottaa boolean-arvoa. `helperText` näyttää virheilmoituksen kentän alla.

Sähköpostikentän tyylissä käytetään spread-operaattoria `{ ...tekstikenttaTyyli, marginBottom: '15px' }`, joka kopioi yhteisen tyylin ja lisää siihen ylimääräisen alavälin erottamaan tekstikentät seuraavasta osiosta.

### Vaihe 7: RadioGroup — tilausjakson valinta

Lisätään valintanappien ryhmä tilausjakson valintaa varten. `FormControl` kokoaa yhteen otsikon (`FormLabel`), valintanapit (`RadioGroup` + `Radio`) ja virheilmoituksen (`FormHelperText`).

Päivitetään MUI-importit:

```tsx
import {
  Button,
  Container,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
```

Lisätään `RadioGroup`-osio lomakkeeseen, sähköpostikentän ja painikkeen väliin:

```tsx
          <FormControl fullWidth sx={{ marginTop: '10px' }}>
            <FormLabel>Haluan uutiskirjeen </FormLabel>
            <RadioGroup>
              <FormControlLabel
                value="paiva"
                label="Päivittäin"
                control={<Radio name="jakso" size="small" onChange={syoteKasittelija} />}
              />
              <FormControlLabel
                value="viikko"
                label="Viikoittain"
                control={<Radio name="jakso" size="small" onChange={syoteKasittelija} />}
              />
              <FormControlLabel
                value="kuukausi"
                label="Kuukausittain"
                control={<Radio name="jakso" size="small" onChange={syoteKasittelija} />}
              />
            </RadioGroup>
            <FormHelperText error={Boolean(virheilmoitukset.jakso)}>
              {virheilmoitukset.jakso}
            </FormHelperText>
          </FormControl>
```

`FormControlLabel` yhdistää valintanapin (`control`-propsi) ja tekstiotsikon (`label`-propsi). `value`-propsi on arvo, joka välittyy kun nappi valitaan. Kaikilla `Radio`-napeilla on sama `name="jakso"`, jolloin tieto tallentuu `lomaketiedot.current.jakso`-avaimeen.

`FormHelperText` näyttää virheilmoituksen ryhmän alla. `error`-propsi värjää tekstin punaiseksi.

### Vaihe 8: Checkbox — käyttöehtojen hyväksyntä

Lisätään valintaruutu käyttöehtojen hyväksymiseen. Rakenne on sama kuin valintanapeilla: `FormControl` kokoaa kentän ja virheilmoituksen yhteen.

Lisätään `Checkbox` import-listaan:

```tsx
import {
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
```

Lisätään `Checkbox`-osio lomakkeeseen, `RadioGroup`-osion ja painikkeen väliin:

```tsx
          <FormControl>
            <FormControlLabel
              control={<Checkbox name="kayttoehdot" onChange={syoteKasittelija} />}
              label="Hyväksyn käyttöehdot"
            />
            <FormHelperText error={Boolean(virheilmoitukset.kayttoehdot)}>
              {virheilmoitukset.kayttoehdot}
            </FormHelperText>
          </FormControl>
```

`Checkbox`-komponentille annetaan `name="kayttoehdot"`, jolloin `syoteKasittelija` tallentaa arvon `lomaketiedot.current.kayttoehdot`-avaimeen. Koska kentän tyyppi on `checkbox`, käsittelijässä tallennetaan `Boolean(e.target.checked)`.

### Vaihe 9: Lomakkeen validointi

Toteutetaan `lomakeKasittelija`-funktion täydellinen validointi. Tarkistetaan jokainen kenttä ja kerätään virheet objektiin. Jos virheitä löytyy, päivitetään `virheilmoitukset`-tila. Jos kaikki on kunnossa, näytetään onnistumisviesti.

Korvataan aiempi `lomakeKasittelija`-funktio:

```tsx
  const lomakeKasittelija = (e: SubmitEvent): void => {

    e.preventDefault();

    console.log(lomaketiedot.current);

    let virheet: Virheet = {};

    if (!lomaketiedot.current.nimi) {
      virheet = { ...virheet, nimi: 'Nimi puuttuu.' };
    }

    if (!lomaketiedot.current.sahkoposti) {
      virheet = { ...virheet, sahkoposti: 'Sähköposti puuttuu.' };
    } else {
      if (lomaketiedot.current.sahkoposti.search('@') === -1) {
        virheet = { ...virheet, sahkoposti: 'Virheellinen sähköpostiosoite.' };
      }
    }

    if (!lomaketiedot.current.kayttoehdot) {
      virheet = { ...virheet, kayttoehdot: 'Hyväksy käyttöehdot.' };
    }

    if (!lomaketiedot.current.jakso) {
      virheet = { ...virheet, jakso: 'Valitse tilausjakso.' };
    }

    if (Object.entries(virheet).length > 0) {
      setVirheilmoitukset({ ...virheet });
    } else {
      setVirheilmoitukset({});
      window.alert('Olet tilannut uutiskirjeemme, kiitos!');
    }
  };
```

Virheet kerätään ensin paikalliseen `virheet`-muuttujaan. Jokainen kenttä tarkistetaan erikseen:

- `!lomaketiedot.current.nimi` on `true`, jos nimi on tyhjä tai puuttuu kokonaan (falsy-arvo).
- Sähköpostille tehdään kaksiportainen tarkistus: ensin tarkistetaan onko kenttä täytetty, sitten tarkistetaan muoto `.search('@')`-metodilla. `.search()` palauttaa `-1`, jos `@`-merkkiä ei löydy.
- Virheitä kerätään spread-operaattorilla `{ ...virheet, kentta: 'viesti' }`, joka luo joka askeleella uuden objektin aiemmat virheet säilyttäen.

`Object.entries(virheet).length > 0` tarkistaa, löytyikö yhtään virhettä. `Object.entries()` palauttaa objektin avain-arvo-parit taulukkona. Jos taulukko on tyhjä, virheitä ei löytynyt, ja näytetään onnistumisviesti.

Tallennetaan tiedosto. Lomakkeen pitäisi nyt näyttää virheilmoitukset kentissä, jos tietoja puuttuu, ja näyttää onnistumisviesti, kun kaikki on kunnossa.

### Projektin lopullinen rakenne

```
demo07/
├── node_modules/                    # Asennetut riippuvuudet (ei versionhallintaan)
├── public/                          # Staattiset tiedostot
├── src/
│   ├── App.tsx                      # Lomakesovellus (ainoa komponentti)
│   ├── main.tsx                     # Sovelluksen aloituspiste (Roboto-fontit)
│   └── vite-env.d.ts                # Viten TypeScript-ympäristötyypit
├── eslint.config.js                 # ESLint-konfiguraatio
├── index.html                       # HTML-pohja
├── package.json                     # Riippuvuudet ja käynnistyskomennot
├── tsconfig.json                    # TypeScript-konfiguraatio
├── tsconfig.app.json                # TypeScript-konfiguraatio sovelluskoodille
├── tsconfig.node.json               # TypeScript-konfiguraatio Vite-konfiguraatiolle
└── vite.config.ts                   # Vite-konfiguraatio (portti 3007)
```

---

## 3. Muistilista

### Lomakkeen käsittely Reactissa

| Käsite | Kuvaus |
|--------|--------|
| `<form onSubmit={fn}>` | HTML-lomake, jonka lähetys käsitellään React-funktiolla |
| `e.preventDefault()` | Estää sivun uudelleenlatauksen lomakkeen lähetyksessä |
| `type="submit"` | Painike, joka laukaisee `<form>`-elementin `onSubmit`-tapahtuman |
| `useRef<T>({})` | Viite, joka tallentaa tietoa ilman uudelleenrenderöintiä |
| `ref.current` | Viitteen senhetkinen arvo |
| `name`-attribuutti | Kentän tunniste, jolla `onChange`-käsittelijä tietää mihin tallentaa |
| `e.target.name` | Tapahtuman kohteena olevan kentän `name`-attribuutin arvo |
| `e.target.value` | Tekstikentän arvo |
| `e.target.checked` | Valintaruudun tila (boolean) |

### Tapahtumatyypit

| Tyyppi | Tuonti | Käyttötarkoitus |
|--------|--------|-----------------|
| `SubmitEvent` | `import type { SubmitEvent } from 'react'` | Lomakkeen `onSubmit`-käsittelijän tapahtumatyyppi |
| `ChangeEvent<HTMLInputElement>` | `import type { ChangeEvent } from 'react'` | Syöttökentän `onChange`-käsittelijän tapahtumatyyppi |

> **Huomio:** `import type` on TypeScriptin syntaksi, joka kertoo kääntäjälle, että tuonti on pelkkä tyyppi eikä ajonaikainen arvo. Kääntäjä poistaa nämä tuonnit valmiista JavaScript-koodista.

### MUI:n lomakekomponentit

| Komponentti | Dokumentaatio | Käyttötarkoitus |
|-------------|---------------|-----------------|
| `<TextField>` | [TextField](https://mui.com/material-ui/react-text-field/) | Tekstinsyöttökenttä (`name`, `label`, `error`, `helperText`) |
| `<Radio>` | [Radio](https://mui.com/material-ui/react-radio-button/) | Yksittäinen valintanappi |
| `<RadioGroup>` | [Radio](https://mui.com/material-ui/react-radio-button/) | Valintanappien ryhmä |
| `<Checkbox>` | [Checkbox](https://mui.com/material-ui/react-checkbox/) | Valintaruutu |
| `<FormControl>` | [FormControl](https://mui.com/material-ui/api/form-control/) | Kokoaa kentän, otsikon ja virheilmoituksen |
| `<FormControlLabel>` | [FormControlLabel](https://mui.com/material-ui/api/form-control-label/) | Yhdistää Radio/Checkbox-komponentin ja tekstin |
| `<FormLabel>` | [FormLabel](https://mui.com/material-ui/api/form-label/) | Kenttäryhmän otsikko |
| `<FormHelperText>` | [FormHelperText](https://mui.com/material-ui/api/form-helper-text/) | Aputeksti tai virheviesti kentän alla |
| `<Button>` | [Button](https://mui.com/material-ui/react-button/) | Painike, `type="submit"` lomakkeen lähetykseen |
| `<Container>` | [Container](https://mui.com/material-ui/react-container/) | Keskittävä säilökomponentti |
| `<CssBaseline>` | [CssBaseline](https://mui.com/material-ui/react-css-baseline/) | Selaimen oletustyylien nollaus |

### TypeScript-käsitteet tässä demossa

| Käsite | Syntaksi | Kuvaus |
|--------|----------|--------|
| Valinnainen kenttä | `nimi?: string` | Kenttä, joka voi puuttua objektista |
| Indeksisignatuuri | `[key: string]: any` | Sallii dynaamisen avaimen käytön objektissa |
| Interfacen perintä | `interface B extends A {}` | Uusi interface, joka sisältää perityn interfacen kentät |
| Type-only import | `import type { T } from 'x'` | Tuonti, joka poistetaan käännetystä koodista |

### Asennuskomennot

| Komento | Selitys |
|---------|---------|
| `npm create vite@latest demo07 -- --template react-ts` | Luo uuden Vite + React + TypeScript -projektin |
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

Sovellus avautuu osoitteessa `http://localhost:3007`.
