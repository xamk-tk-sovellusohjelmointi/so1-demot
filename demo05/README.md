# Demo 5: React-reititys (React Router)

## Oppimistavoitteet

Tämän demon jälkeen opiskelija:
- ymmärtää eron React-sovelluksen näkymien reitityksen ja perinteisten HTML-sivujen lataamisen välillä,
- osaa asentaa React Router -kirjaston Vite-projektiin ja ottaa `BrowserRouter`-komponentin käyttöön,
- osaa määritellä reitit `Routes`- ja `Route`-komponenteilla,
- osaa navigoida näkymien välillä `Link`-komponentilla ja `useNavigate`-hookilla, ja
- osaa rakentaa navigaatiovalikon MUI:n `AppBar`- ja `Drawer`-komponenteilla.

---

## 1. React-reititys

### Mitä reititys on?

Perinteisissä verkkosivustoissa jokainen sivu on erillinen HTML-tiedosto palvelimella. Kun käyttäjä klikkaa linkkiä, selain lataa kokonaan uuden sivun palvelimelta.

Tähän asti rakennetut React-sovellukset ovat olleet  **yksisivuisia sovelluksia** (Single Page Application, SPA). Selain lataa sovelluksen kerran, ja sen jälkeen kaikki näkymien vaihdot tapahtuvat pelkästään vaihtamalla näkyvää React-komponenttia selaimeen ladatussa HTML-kehyksessä (`index.html`). Sivua ei ladata uudelleen, vaan vain sisältö vaihtuu. URL-osoite kuitenkin muuttuu selaimen osoiterivillä, jotta käyttäjä näkee aina missä näkymässä ollaan ja voi jakaa linkin tiettyyn näkymään.

Tätä URL-osoitteiden ja näkymäkomponenttien välistä yhdistämistä kutsutaan Reactissa **reititykseksi** ja sitä toteutetaan React Router -komponenttikirjastolla.

| Ominaisuus | Perinteinen sivusto | SPA-reititys (React) |
|------------|--------------------|-----------------------|
| Sivun lataus | Koko sivu latautuu uudelleen | Vain sisältö vaihtuu |
| URL-osoite | Jokainen sivu on oma HTML-tiedostonsa, jolla on oma resurssin URL-osoite | URL muuttuu, mutta sivu ei lataudu uudelleen |
| Tila (state) | Häviää sivunlatauksen yhteydessä. Perinteiset latauspyynnöt ovat tilattomia. | Voi säilyä näkymien välillä |

### React Router

[React Router](https://reactrouter.com/) on suosituin reitityskirjasto React-sovelluksille. Se tarjoaa komponentit ja hookit, joilla reitit määritellään ja navigointi toteutetaan.

React Router asennetaan npm-paketinhallinnalla. Versio 7 tuodaan suoraan `react-router`-paketista:

```bash
npm install react-router
```

Keskeisimmät React Router -käsitteet:

| Käsite | Kuvaus |
|--------|--------|
| `BrowserRouter` | Reitittäjäkomponentti, joka kääritään koko sovelluksen ympärille |
| `Routes` | Säilökomponentti, jonka sisään kaikki yksittäiset reitit määritellään |
| `Route` | Yksittäinen reitti: yhdistää URL-polun tiettyyn komponenttiin |
| `Link` | Navigointikomponentti, joka vaihtaa näkymän ilman sivunlatausta |
| `useNavigate` | Hook ohjelmalliseen navigointiin funktion sisällä |

### BrowserRouter

`BrowserRouter` on reitittäjäkomponentti, joka hyödyntää selaimen History API:a URL-osoitteiden hallintaan. Se kääritään koko sovelluksen ympärille `main.tsx`-tiedostossa, jotta reititysominaisuudet ovat käytettävissä kaikkialla sovelluksessa.

### Link ja useNavigate

React Router tarjoaa kaksi tapaa navigoida näkymien välillä:

**`Link`-komponentti** on suora navigointilinkki. Se toimii kuten HTML:n `<a>`-tunniste, mutta estää sivun uudelleenlatauksen ja vaihtaa näkymän React Routerin kautta. `Link`-komponenttia voidaan käyttää MUI:n `Button`-komponentin kanssa hyödyntämällä MUI:n polymorfista `component`-ominaisuutta:

```tsx
import { Button } from '@mui/material';
import { Link } from 'react-router';

<Button component={Link} to="/info">
  Siirry info-näkymään
</Button>
```

`component={Link}` kertoo MUI:lle, että painike renderöidään `Link`-komponenttina. `to="/info"` on reitti, johon painike navigoi.

> **Huomio:** MUI sisältää myös oman `Link`-komponenttinsa. `Link` tuodaan nimenomaan `react-router`-kirjastosta, ei MUI:sta.

**`useNavigate`-hook** on tarkoitettu ohjelmalliseen navigointiin. Sillä voidaan vaihtaa reittiä osana toiminnallisuutta, esimerkiksi lomakkeen lähettämisen tai vahvistuksen jälkeen:

```tsx
import { useNavigate } from 'react-router';

const navigate = useNavigate();

const laheta = () => {
    // ... toiminnallisuus
    navigate('/');  // navigoidaan takaisin aloitusnäkymään
};
```

### MUI-navigaatiokomponentit

Tässä demossa navigaatiovalikko toteutetaan MUI-komponenteilla. MUI asennettiin ja esiteltiin demo 4:ssä. Valikon toteutuksessa käytetään seuraavia komponentteja:

| Komponentti | Käyttötarkoitus |
|-------------|-----------------|
| [`AppBar`](https://mui.com/material-ui/react-app-bar/) | Sovelluksen yläpalkki |
| [`Toolbar`](https://mui.com/material-ui/react-app-bar/) | `AppBar`in sisäinen komponentti, joka asettelee sisällön vaakatasoon |
| [`Drawer`](https://mui.com/material-ui/react-drawer/) | Sivusta liukuva vetovalikko |
| [`IconButton`](https://mui.com/material-ui/api/icon-button/) | Ikonipainike (esim. hampurilaisvalikko) |
| [`List`](https://mui.com/material-ui/react-list/) | Lista ja `ListItemButton` painikemaisten linkkien rakentamiseen |
| [`CssBaseline`](https://mui.com/material-ui/react-css-baseline/) | Nollaa selaimen oletustyylit yhtenäisiksi |

MUI:n ikonit tuodaan `@mui/icons-material`-paketista omina komponentteinaan:

```tsx
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
```

### Demosovellus

Tässä demossa rakennetaan React-sovellus, jossa on kaksi näkymää (**Aloitus** ja **Info**) sekä yhteinen navigaatiovalikko. Näkymien välillä navigoidaan kahdella eri tavalla: `Link`-komponentilla ja `useNavigate`-hookilla. Navigaatiovalikko pysyy näkyvillä reitistä riippumatta.

Demo 4:stä poiketen tämä demo ottaa käyttöön React Router -kirjaston reititystä varten ja MUI:n `AppBar`- sekä `Drawer`-komponentit navigaatiovalikon rakentamiseen. MUI:n perusasennus (Material UI, Emotion, Roboto-fontti) on sama kuin demo 4:ssä.

---

## 2. Demosovelluksen rakentuminen vaihe vaiheelta

### Vaihe 1: Projektin luominen

Luodaan uusi Vite + React + TypeScript -projekti, kuten aiemmissa demoissa:

```bash
npm create vite@latest demo05 -- --template react-ts
```

Siirrytään projektikansioon:

```bash
cd demo05
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
      <h1>Demo 5</h1>
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
    port: 3005
  }
})
```

`server.port` asettaa kehityspalvelimen käynnistymään portissa 3005. Porttinumero seuraa demojen numerointia (demo 3 → 3003, demo 4 → 3004, demo 5 → 3005).

Käynnistetään kehityspalvelin ja tarkistetaan, että oletussivu avautuu selaimessa:

```bash
npm run dev
```

Sovellus avautuu osoitteessa `http://localhost:3005`.

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

MUI, Emotion ja Roboto-fontti asennettiin ja esiteltiin demo 4:ssä. `@mui/icons-material` on MUI:n ikonipakkaus, joka sisältää Material Design -ikonit React-komponentteina.

Käynnistetään kehityspalvelin asennusten jälkeen uudelleen:

```bash
npm run dev
```

### Vaihe 3: BrowserRouter ja Roboto-fontit (main.tsx)

Otetaan käyttöön `BrowserRouter` ja Roboto-fontit `main.tsx`-tiedostossa. `BrowserRouter` kääritään `App`-komponentin ympärille `StrictMode`-komponentin sisään:

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

Roboto-fontit tuodaan neljänä eri painoarvona, kuten demo 4:ssä. `BrowserRouter` lisätään `StrictMode`-komponentin sisälle, jotta Reactin tarkistusmoodin varoitukset pysyvät voimassa. Kaikki `BrowserRouter`in sisällä olevat komponentit voivat nyt käyttää React Routerin reititysominaisuuksia.

### Vaihe 4: Näkymäkomponentit (Aloitus ja Info)

Luodaan `src/components/`-kansio näkymäkomponenteille:

```bash
mkdir src/components
```

Luodaan tiedosto `src/components/Aloitus.tsx`. Sisältö on tarkoituksella minimaalinen, jotta reitityksen toimintaa voidaan testata ensin:

```tsx
import { Container, Typography } from '@mui/material';

function Aloitus() {
  return (
    <Container>
      <Typography
        variant="h6"
        sx={{ marginTop: '10px' }}
      >
        Aloitusnäkymä
      </Typography>
    </Container>
  );
}

export default Aloitus;
```

`Container` on MUI:n säilökomponentti, joka keskittää sisällön ja lisää vaakasuuntaiset välit. `Typography` on MUI:n tekstikomponentti, jossa `variant="h6"` asettaa tekstin otsikkotyyliksi.

Luodaan toinen tiedosto `src/components/Info.tsx` samalla tavalla:

```tsx
import { Container, Typography } from '@mui/material';

function Info() {
  return (
    <Container>
      <Typography
        variant="h6"
        sx={{ marginTop: '10px' }}
      >
        Infonäkymä
      </Typography>
    </Container>
  );
}

export default Info;
```

### Vaihe 5: Reittien määrittely (App.tsx)

Korvataan `App.tsx`:n sisältö reititysrakenteella. Jokainen näkymä on oma `Route`-komponenttinsa, ja kaikki reitit ympäröidään `Routes`-komponentilla:

```tsx
import { Route, Routes } from 'react-router';
import Aloitus from './components/Aloitus';
import Info from './components/Info';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Aloitus />} />
      <Route path="/info" element={<Info />} />
    </Routes>
  );
}

export default App;
```

`Route`-komponentilla on kaksi keskeistä ominaisuutta:

- `path`: URL-polku, jota reitti vastaa. `/` on sovelluksen juuri eli aloitusnäkymä ja `/info` on toinen näkymä.
- `element`: Komponentti, joka renderöidään kyseisellä polulla.

Tallennetaan tiedosto ja testataan reititystä kirjoittamalla selaimen osoiteriville `http://localhost:3005/` ja `http://localhost:3005/info`. Kummassakin osoitteessa pitäisi näkyä oikea näkymä.

### Vaihe 6: Navigointi Link-komponentilla

Reitit toimivat, mutta käyttäjällä ei ole vielä tapaa siirtyä näkymien välillä käyttöliittymässä. Lisätään navigointipainikkeet `Link`-komponentilla.

**Aloitus-komponentti**

Päivitetään `src/components/Aloitus.tsx` lisäämällä `Button`- ja `Link`-tuonnit sekä navigointipainike:

```tsx
import { Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router';

function Aloitus() {
  return (
    <Container>

      <Typography
        variant="h6"
        sx={{ marginTop: '10px' }}
      >
        Aloitusnäkymä
      </Typography>

      <Typography
        variant="body1"
        sx={{ marginTop: '10px' }}
      >
        Tämä on demo Reactin reitityksestä. Nyt olemme aloitusnäkymässä.
      </Typography>

      <Button
        component={Link}
        to="/info"
      >
        Siirry info-näkymään
      </Button>

    </Container>
  );
}

export default Aloitus;
```

`Button`-komponentille on asetettu kaksi uutta ominaisuutta:

- `component={Link}`: Kertoo MUI:lle, että painike renderöidään `Link`-komponenttina. Tämä on MUI:n **polymorfinen** `component`-ominaisuus, joka muuttaa painikkeen sisäisen HTML-elementin toiseksi komponentiksi.
- `to="/info"`: React Routerin `Link`-komponentille kuuluva ominaisuus. Reitti, johon painike navigoi.

**Info-komponentti**

Päivitetään `src/components/Info.tsx` vastaavasti paluupainikkeella:

```tsx
import { Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router';

function Info() {
  return (
    <Container>

      <Typography
        variant="h6"
        sx={{ marginTop: '10px' }}
      >
        Infonäkymä
      </Typography>

      <Typography
        variant="body1"
        sx={{ marginTop: '10px' }}
      >
        Nyt olemme infonäkymässä.
      </Typography>

      <Button
        component={Link}
        to="/"
      >
        Palaa aloitusnäkymään
      </Button>

    </Container>
  );
}

export default Info;
```

Tallennetaan molemmat tiedostot ja testataan navigointia selaimessa. URL-osoite muuttuu, mutta sivu ei lataudu uudelleen.

### Vaihe 7: Ohjelmallinen navigointi useNavigate-hookilla

Lisätään `Info`-komponenttiin toinen paluupainike, joka pyytää vahvistuksen ennen navigointia. Tähän käytetään `useNavigate`-hookia.

Päivitetään `src/components/Info.tsx`:

```tsx
import { Button, Container, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router';

function Info() {

  const navigate = useNavigate();

  const vahvistaPaluu = () => {
    if (window.confirm('Haluatko varmasti palata aloitukseen?')) {
      navigate('/');
    }
  };

  return (
    <Container>

      <Typography
        variant="h6"
        sx={{ marginTop: '10px' }}
      >
        Infonäkymä
      </Typography>

      <Typography
        variant="body1"
        sx={{ marginTop: '10px' }}
      >
        Nyt olemme infonäkymässä.
      </Typography>

      <Button
        component={Link}
        to="/"
      >
        Palaa aloitusnäkymään
      </Button>

      <Button
        onClick={vahvistaPaluu}
      >
        Palaa aloitusnäkymään (vahvistuksella)
      </Button>

    </Container>
  );
}

export default Info;
```

`useNavigate`-hook otetaan käyttöön komponentin sisällä muuttujana `navigate`. TypeScript päättelee tyypin automaattisesti.

`vahvistaPaluu`-funktio kysyy käyttäjältä vahvistuksen selaimen `window.confirm()`-ikkunalla. `confirm()` palauttaa `true`, jos käyttäjä painaa "OK", ja `false`, jos painaa "Peruuta". Navigointi tehdään vain vahvistuksen jälkeen.

Toinen paluupainike käyttää `onClick`-tapahtumaa eikä tarvitse `Link`-komponenttia, koska navigointi hoidetaan funktion sisällä `navigate('/')`-kutsulla.

### Vaihe 8: Navigaatiovalikko AppBar- ja Drawer-komponenteilla

Rakennetaan yhteinen navigaatiovalikko, joka näkyy molemmissa näkymissä. Valikko koostuu yläpalkista (`AppBar`) ja sivusta liukuvasta vetovalikosta (`Drawer`).

Luodaan tiedosto `src/components/Valikko.tsx`:

```tsx
import {
  AppBar,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import { useState } from 'react';
import { Link } from 'react-router';

function Valikko() {

  const [valikkoAuki, setValikkoAuki] = useState<boolean>(false);

  return (
    <AppBar position="static">
      <Toolbar>

        <IconButton
          color="inherit"
          edge="start"
          onClick={() => setValikkoAuki(true)}
        >
          <MenuIcon />
        </IconButton>

        <Drawer
          open={valikkoAuki}
          onClose={() => setValikkoAuki(false)}
        >
          <List
            sx={{ width: '220px', marginTop: '50px' }}
            onClick={() => setValikkoAuki(false)}
          >

            <ListItemButton
              component={Link}
              to="/"
            >
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Aloitus" />
            </ListItemButton>

            <ListItemButton
              component={Link}
              to="/info"
            >
              <ListItemIcon>
                <InfoIcon />
              </ListItemIcon>
              <ListItemText primary="Info" />
            </ListItemButton>

          </List>
        </Drawer>

        <Typography
          component="div"
          sx={{ fontSize: '16pt', flexGrow: 1 }}
        >
          Demo 5: Reititys (React Router)
        </Typography>

      </Toolbar>
    </AppBar>
  );
}

export default Valikko;
```

Käydään läpi komponentin keskeiset osat:

`valikkoAuki`-tilamuuttuja ohjaa `Drawer`-valikon näkyvyyttä boolean-arvolla. Kun menu-painiketta painetaan, tila asetetaan `true`-arvoon ja valikko avautuu. Sulkeminen asettaa tilan takaisin `false`-arvoon.

**`AppBar`** on MUI:n yläpalkki. `position="static"` tarkoittaa, että palkki pysyy normaalissa dokumenttivirrassa eikä kellu näytön yläreunaan.

**`Toolbar`** on `AppBar`in sisäinen komponentti, joka asettelee sisällön vaakatasoon.

**`IconButton`** on ikonipainike. `color="inherit"` perii värin yläpalkista (valkoinen), `edge="start"` sijoittaa painikkeen `Toolbar`in vasempaan reunaan.

**`MenuIcon`** on kolmen viivan "hampurilainen"-ikoni `@mui/icons-material`-paketista.

**`Drawer`** on sivusta liukuva vetolaatikko. `open`-ominaisuus määrittää boolean-arvolla, onko valikko näkyvissä. `onClose`-tapahtuma suoritetaan, kun valikko suljetaan (Esc-näppäimellä tai klikkaamalla valikon ulkopuolelle).

**`ListItemButton`** käyttää samaa `component={Link} to="..."`-rakennetta kuin aiemmissa näkymissä. Painikkeet navigoivat halutuille reiteille. `ListItemIcon` näyttää ikonin ja `ListItemText` tekstin.

**`List`**-komponentille on asetettu `onClick`-tapahtumakäsittelijä, joka sulkee valikon aina, kun jotain listavalinnoista painetaan.

**`Typography`**-komponentille on asetettu `flexGrow: 1`, joka venyttää tekstin täyttämään kaiken vapaan tilan valikkoikonin oikealta puolelta.

### Vaihe 9: CssBaseline ja Valikko-komponentti App.tsx:ään

Lisätään `Valikko` ja `CssBaseline` osaksi `App`-komponenttia. `Valikko` asetetaan `Routes`-komponentin ulkopuolelle, jotta se renderöidään aina riippumatta siitä, mikä reitti on aktiivisena. `CssBaseline` nollaa selaimen oletustyylit (padding, margin, box-sizing) yhtenäisiksi eri selaimissa.

Päivitetään `src/App.tsx`:

```tsx
import { CssBaseline } from '@mui/material';
import { Route, Routes } from 'react-router';
import Aloitus from './components/Aloitus';
import Info from './components/Info';
import Valikko from './components/Valikko';

function App() {
  return (
    <>
      <CssBaseline />
      <Valikko />
      <Routes>
        <Route path="/" element={<Aloitus />} />
        <Route path="/info" element={<Info />} />
      </Routes>
    </>
  );
}

export default App;
```

`App`-komponentissa on nyt kolme osaa React Fragment -tunnisteiden (`<>...</>`) sisällä:

1. `<CssBaseline />` nollaa selaimen oletustyylit.
2. `<Valikko />` on aina näkyvä navigaatiopalkki.
3. `<Routes>...</Routes>` sisältää reitistä riippuvan näkymän.

Tallennetaan tiedosto. Sininen yläpalkki näkyy nyt kummassakin näkymässä. Hampurilaisikonia painamalla liukuvalikko aukeaa sivusta ja siitä voidaan navigoida näkymien välillä.

### Projektin lopullinen rakenne

```
demo05/
├── node_modules/                    # Asennetut riippuvuudet (ei versionhallintaan)
├── public/                          # Staattiset tiedostot
├── src/
│   ├── components/
│   │   ├── Aloitus.tsx              # Aloitusnäkymä (Link-navigointi)
│   │   ├── Info.tsx                 # Infonäkymä (useNavigate-navigointi)
│   │   └── Valikko.tsx              # Navigaatiovalikko (AppBar + Drawer)
│   ├── App.tsx                      # Reittien määrittely ja sovelluksen runko
│   ├── main.tsx                     # Sovelluksen aloituspiste (BrowserRouter)
│   └── vite-env.d.ts                # Viten TypeScript-ympäristötyypit
├── eslint.config.js                 # ESLint-konfiguraatio
├── index.html                       # HTML-pohja
├── package.json                     # Riippuvuudet ja käynnistyskomennot
├── tsconfig.json                    # TypeScript-konfiguraatio
├── tsconfig.app.json                # TypeScript-konfiguraatio sovelluskoodille
├── tsconfig.node.json               # TypeScript-konfiguraatio Vite-konfiguraatiolle
└── vite.config.ts                   # Vite-konfiguraatio (portti 3005)
```

---

## 3. Muistilista

### React Router -komponentit ja hookit

| Komponentti / Hook | Tuonti | Käyttötarkoitus |
|---------------------|--------|-----------------|
| `BrowserRouter` | `react-router` | Reitittäjäkomponentti, kääritään sovelluksen ympärille `main.tsx`:ssä |
| `Routes` | `react-router` | Säilökomponentti, jonka sisään reitit määritellään |
| `Route` | `react-router` | Yksittäinen reitti: `path` määrittää URL-polun, `element` renderöitävän komponentin |
| `Link` | `react-router` | Navigointikomponentti, vaihtaa näkymän ilman sivunlatausta |
| `useNavigate` | `react-router` | Hook ohjelmalliseen navigointiin funktion sisällä |

### MUI-navigaatiokomponentit

| Komponentti | Dokumentaatio | Käyttötarkoitus |
|-------------|---------------|-----------------|
| `<AppBar>` | [AppBar](https://mui.com/material-ui/react-app-bar/) | Sovelluksen yläpalkki |
| `<Toolbar>` | [AppBar](https://mui.com/material-ui/react-app-bar/) | `AppBar`in sisäinen asettelukomponentti |
| `<Drawer>` | [Drawer](https://mui.com/material-ui/react-drawer/) | Sivusta liukuva vetovalikko |
| `<IconButton>` | [IconButton](https://mui.com/material-ui/api/icon-button/) | Ikonipainike |
| `<List>` | [List](https://mui.com/material-ui/react-list/) | Listasäilö |
| `<ListItemButton>` | [List](https://mui.com/material-ui/react-list/) | Painikemainen listaelementti |
| `<ListItemIcon>` | [List](https://mui.com/material-ui/react-list/) | Ikoni listaelementin vasemmalla puolella |
| `<ListItemText>` | [List](https://mui.com/material-ui/react-list/) | Teksti listaelementissä |
| `<CssBaseline>` | [CssBaseline](https://mui.com/material-ui/react-css-baseline/) | Nollaa selaimen oletustyylit yhtenäisiksi |
| `<Container>` | [Container](https://mui.com/material-ui/react-container/) | Keskittävä säilökomponentti |
| `<Typography>` | [Typography](https://mui.com/material-ui/react-typography/) | Tekstikomponentti |
| `<Button>` | [Button](https://mui.com/material-ui/react-button/) | Painike, tukee polymorfista `component`-ominaisuutta |

### MUI:n polymorfinen component-ominaisuus

MUI:n `Button`- ja `ListItemButton`-komponentit tukevat `component`-ominaisuutta, jolla komponentin sisäinen HTML-elementti vaihdetaan toiseksi komponentiksi. React Routerin `Link` yhdistetään MUI-komponenttiin seuraavasti:

```tsx
<Button component={Link} to="/reitti">Teksti</Button>
<ListItemButton component={Link} to="/reitti">...</ListItemButton>
```

### Asennuskomennot

| Komento | Selitys |
|---------|---------|
| `npm create vite@latest demo05 -- --template react-ts` | Luo uuden Vite + React + TypeScript -projektin |
| `npm install react-router` | Asentaa React Router -kirjaston |
| `npm install @mui/material @emotion/react @emotion/styled` | Asentaa MUI:n ja sen tarvitsemat Emotion-kirjastot |
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

Sovellus avautuu osoitteessa `http://localhost:3005`.
