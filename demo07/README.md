# Demo 7: Lomakkeiden käsittely

Tässä demossa rakennetaan yksinkertainen uutiskirjeen tilauslomake. Lomakkeella on tekstikenttiä, valintanappeja ja valintaruutu. Lomakkeen lähetyksessä tarkistetaan syötteet ja näytetään virheilmoitukset.

Demossa käytettäviä keskeisiä käsitteitä:

- HTML `<form>`-elementti ja `onSubmit`-tapahtumankäsittelijä
- `e.preventDefault()` — estetään sivun uudelleenlataus
- `useRef` — lomakkeen syötteiden tallentaminen ilman tilamuuttujia
- `onChange`-käsittelijä — syötteiden lukeminen kentän nimen perusteella
- `useState` — virheilmoitusten hallinta
- MUI:n `TextField`, `RadioGroup`, `Checkbox`, `FormControl`, `FormHelperText`

## Vaihe 1: Asennukset

Lisää projektin riippuvuudet `package.json`-tiedostoon ja aja `npm install`.

**package.json** (dependencies-osio):

```json
"dependencies": {
  "@emotion/react": "^11.14.0",
  "@emotion/styled": "^11.14.0",
  "@fontsource/roboto": "^5.2.5",
  "@mui/icons-material": "^7.0.1",
  "@mui/material": "^7.0.1",
  "react": "^19.2.4",
  "react-dom": "^19.2.4"
}
```

Päivitä **main.tsx** lisäämällä Roboto-fontit ja `CssBaseline`:

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

## Vaihe 2: Sovelluksen runko

Aloitetaan tyhjällä App-komponentilla, joka näyttää otsikon ja tekstin. Lisätään `CssBaseline` poistamaan selaimen oletustyylit ja `Container` rajaamaan sisällön leveys.

**App.tsx**:

```tsx
import { Container, CssBaseline, Typography } from '@mui/material';

function App() {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm">

        <Typography variant="h5">Demo 7: Lomakkeiden käsittely</Typography>

        <Typography sx={{ marginTop: '10px', marginBottom: '10px' }}>
          Uutiskirjeen tilaus v2.0
        </Typography>

      </Container>
    </>
  );
}

export default App;
```

`CssBaseline` on MUI:n komponentti, joka normalisoi selaimen oletustyylit (esim. poistaa marginaalit body-elementistä). `Container maxWidth="sm"` rajoittaa sisällön leveyttä niin, että lomake ei veny koko näytön leveydelle.

## Vaihe 3: Lomakkeen rakenne ja lähetystapahtuma

Lisätään `<form>`-elementti ja sen `onSubmit`-käsittelijä. Tärkeää: Reactissa `<form>`-elementin lähetys aiheuttaa oletuksena sivun uudelleenlatauksen, mikä nollaa React-sovelluksen tilan. Tämä estetään `e.preventDefault()`-kutsulla.

```tsx
import { Button, Container, CssBaseline, Typography } from '@mui/material';
import { FormEvent } from 'react';

function App() {

  const lomakeKasittelija = (e: FormEvent): void => {
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

`FormEvent` tuodaan suoraan `'react'`-paketista. Funktio on tyypitetty `void`-palautusarvolla, koska se ei palauta mitään. `type="submit"` tekee napista lomakkeen lähetysnapin — klikkaus laukaisee `onSubmit`-tapahtuman `<form>`-elementissä.

## Vaihe 4: useRef lomakkeen tiedoille

Lomakkeen syötteet voidaan hallita kahdella tavalla Reactissa: tilamuuttujilla (`useState`) tai viitteillä (`useRef`). Tilamuuttuja uudelleenrenderöi komponentin joka kerta kun arvo muuttuu. Lomakkeissa tämä tarkoittaisi uudelleenrenderöintiä jokaisen kirjoitetun merkin kohdalla, mikä on tarpeetonta.

`useRef` sopii hyvin lomakkeisiin: tieto tallennetaan viitteen `.current`-ominaisuuteen ilman uudelleenrenderöintejä. Tiedot luetaan vasta lomakkeen lähetyksessä.

Määritellään ensin tietorakenteet ja lisätään `useRef`:

```tsx
import { Button, Container, CssBaseline, Typography } from '@mui/material';
import { FormEvent, useRef } from 'react';

interface Lomaketiedot {
  [key: string]: any;
  nimi?: string;
  sahkoposti?: string;
  kayttoehdot?: boolean | string;
}

interface Virheet extends Lomaketiedot {}

function App() {

  const lomaketiedot = useRef<Lomaketiedot>({});

  const lomakeKasittelija = (e: FormEvent): void => {
    e.preventDefault();
    console.log(lomaketiedot.current);
  };

  // ...
}
```

`Lomaketiedot`-rajapinta kuvaa lomakkeen kenttiä. `[key: string]: any` on indeksisignatuuri, joka sallii minkä tahansa merkkijoniavaimen käytön dynaamisesti — tämä tarvitaan, koska tallennamme kentät nimen perusteella. `Virheet` perii `Lomaketiedot`-rajapinnan, koska virheilmoituksilla on sama rakenne (kenttänimi → viesti).

`useRef<Lomaketiedot>({})` luo viitteen, jonka alkuarvo on tyhjä objekti `{}`. Tyyppiparametri `<Lomaketiedot>` kertoo TypeScriptille, minkä muotoista tietoa `.current`-ominaisuus sisältää.

## Vaihe 5: onChange-käsittelijä ja TextField-kentät

Lisätään yhteinen `onChange`-käsittelijä kaikille kentille. Käsittelijä lukee kentän nimen (`e.target.name`) ja tallentaa arvon viitteeseen. Valintaruuduille (`checkbox`) tallennetaan boolean-arvo, muille kentille tekstiarvo.

```tsx
import {
  Button,
  Container,
  CssBaseline,
  TextField,
  Typography,
} from '@mui/material';
import { SystemStyleObject } from '@mui/system';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';

const tekstikenttaTyyli: SystemStyleObject = {
  marginTop: '10px',
  marginBottom: '5px',
};

// ... (interfacet kuten aiemmin)

function App() {

  const [virheilmoitukset, setVirheilmoitukset] = useState<Virheet>({});
  const lomaketiedot = useRef<Lomaketiedot>({});

  const lomakeKasittelija = (e: FormEvent): void => {
    e.preventDefault();
    console.log(lomaketiedot.current);
  };

  const syoteKasittelija = (e: ChangeEvent<HTMLInputElement>): void => {
    lomaketiedot.current[e.target.name] =
      e.target.type === 'checkbox' ? Boolean(e.target.checked) : e.target.value;
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

          <Button type="submit" variant="contained" fullWidth={true} size="large">
            Tilaa uutiskirje
          </Button>

        </form>

      </Container>
    </>
  );
}
```

`syoteKasittelija` on yleiskäyttöinen käsittelijä, jota käytetään kaikissa kentissä. `e.target.name` on kentän `name`-propsi, jonka avulla tieto tallennetaan oikeaan avaimen alle `lomaketiedot.current`-objektissa. Valintaruuduille käytetään `e.target.checked`-arvoa, koska niille ei ole `value`-kenttää samalla tavalla.

`SystemStyleObject` on MUI:n tyyppi tyyliobjekteille, jolla voidaan määritellä uudelleenkäytettäviä tyylejä muuttujaan. `tekstikenttaTyyli`-muuttuja vähentää toistoa, kun sama tyyli on useammalla kentällä.

`error` ja `helperText` ovat MUI:n `TextField`-komponentin propsit virheiden näyttämiseen. `Boolean(virheilmoitukset.nimi)` muuntaa mahdollisen undefined-arvon falseksi — `error`-propsi odottaa boolean-arvoa.

## Vaihe 6: RadioGroup — tilausjakson valinta

Lisätään `RadioGroup` tilausjakson valintaa varten. `FormControl` kokoaa yhteen otsikon (`FormLabel`), valintanapit (`RadioGroup` + `Radio`) ja virheilmoituksen (`FormHelperText`).

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

// lomakkeen sisällä, TextField-kenttien jälkeen:

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

`FormControlLabel` yhdistää valintanapin (`control`-propsi) ja tekstiotsikon (`label`-propsi). `value`-propsi on arvo, joka välittyy kun nappi valitaan, mutta koska käytämme omaa `onChange`-käsittelijää, arvo luetaan `e.target.value`:sta suoraan. Kaikilla `Radio`-napeilla on sama `name="jakso"`, jolloin tieto tallentuu oikeaan kohtaan `lomaketiedot.current`-objektissa.

`FormHelperText` näyttää virheilmoituksen kentän alla. `error`-propsi värjää tekstin punaiseksi.

## Vaihe 7: Checkbox — käyttöehtojen hyväksyntä

Lisätään valintaruutu käyttöehtojen hyväksymiseen. `FormControl` ja `FormHelperText` toimivat kuten radionapieillakin.

```tsx
// lomakkeen sisällä, RadioGroup-osion jälkeen:

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

Lisää `Checkbox` import-listaan. `Checkbox`-komponentille annetaan `name="kayttoehdot"`, jolloin `syoteKasittelija` tallentaa oikeaan paikkaan. Koska tyyppi on `checkbox`, käsittelijässä tallennetaan `Boolean(e.target.checked)`.

## Vaihe 8: Lomakkeen validointi

Viimeisessä vaiheessa toteutetaan `lomakeKasittelija`-funktion täydellinen validointi. Tarkistetaan jokainen kenttä ja kerätään virheet objektiin. Jos virheitä löytyy, päivitetään `virheilmoitukset`-tila. Jos kaikki on kunnossa, näytetään onnistumisviesti.

```tsx
const lomakeKasittelija = (e: FormEvent): void => {

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

Virheet kerätään ensin paikalliseen `virheet`-muuttujaan. Jokainen kenttä tarkistetaan erikseen. Sähköpostiosoitteelle tehdään kaksiportainen tarkistus: ensin tarkistetaan onko kenttä täytetty, sitten tarkistetaan muoto `.search('@')`-metodilla. Lopuksi `Object.entries(virheet).length > 0` tarkistaa löytyikö yhtään virhettä — jos löytyi, päivitetään tila näyttämään ne. Jos ei virheitä, tyhjennetään virheilmoitukset ja näytetään onnistumisviesti.

Valmis **App.tsx** kokonaisuudessaan:

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
import { SystemStyleObject } from '@mui/system';
import { ChangeEvent, FormEvent, useRef, useState } from 'react';

const tekstikenttaTyyli: SystemStyleObject = {
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

  const lomakeKasittelija = (e: FormEvent): void => {

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

  const syoteKasittelija = (e: ChangeEvent<HTMLInputElement>): void => {
    lomaketiedot.current[e.target.name] =
      e.target.type === 'checkbox' ? Boolean(e.target.checked) : e.target.value;
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

          <FormControl>
            <FormControlLabel
              control={<Checkbox name="kayttoehdot" onChange={syoteKasittelija} />}
              label="Hyväksyn käyttöehdot"
            />
            <FormHelperText error={Boolean(virheilmoitukset.kayttoehdot)}>
              {virheilmoitukset.kayttoehdot}
            </FormHelperText>
          </FormControl>

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
