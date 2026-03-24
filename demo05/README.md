# Demo 5: React-reititys (React Router)

Demossa 5 opetellaan uusi keskeinen konsepti React-sovelluskehityksessä: **näkymien välinen reititys**. Reitityksellä tarkoitetaan sitä, että selaimessa näkyvä URL-osoite vastaa tiettyä sovelluksen näkymää — samaan tapaan kuin perinteisissä verkkosivuissa eri sivuilla on eri osoitteet. React-sovelluksessa sivua ei kuitenkaan ladata uudelleen, vaan pelkästään näkyvä komponentti vaihtuu.

Reititykseen käytetään suosittua [React Router](https://reactrouter.com/) -kirjastoa.

Lopullinen sovellus koostuu kahdesta näkymästä (**Aloitus** ja **Info**), joiden välillä voidaan navigoida kahdella eri tavalla:

1. **`Link`-komponentilla** — suora linkki toiseen reittiin
2. **`useNavigate`-hookilla** — ohjelmallinen navigointi osana toiminnallisuutta (esim. vahvistuksen jälkeen)

Näkymien yläreunassa on myös yhteinen navigaatiovalikko, joka pysyy näkyvillä reitistä riippumatta. Se on toteutettu MUI:n `AppBar`- ja `Drawer`-komponenteilla.

Tärkeimmät linkit opiskeluun:

- [React Router — asennus ja käyttöönotto](https://reactrouter.com/start/library/installation)
- [MUI AppBar](https://mui.com/material-ui/react-app-bar/)
- [MUI Drawer](https://mui.com/material-ui/react-drawer/)
- [MUI:n integraatio reitittimiin](https://mui.com/material-ui/integrations/routing/)

## 1. Asennukset

### 1.1 Asennetaan React Router

React Router on erillinen kirjasto, joka täytyy asentaa projektiin. Kirjasto tarjoaa kaikki tarvittavat komponentit ja hookit reitityksen toteuttamiseen React-sovelluksessa.

```bash
npm install react-router
```

### 1.2 Asennetaan MUI, MUI:n ikonit ja Roboto-fontti

Tässä demossa rakennetaan navigaatiovalikko MUI:n komponenteilla. MUI asennettiin ja esiteltiin Demo 4:ssä — tässä se asennetaan uudelleen samalla tavalla. Mukaan tulee nyt myös MUI:n ikonikkokoelma, josta saadaan valmiit kuvakkeet valikkolinkeille.

**Asennetaan MUI ja sen tarvitsemat kirjastot**
```bash
npm install @mui/material @emotion/react @emotion/styled
```

**Asennetaan MUI:n ikonit**
```bash
npm install @mui/icons-material
```

**Asennetaan Roboto-fontti**
```bash
npm install @fontsource/roboto
```

## 2. BrowserRouter otetaan käyttöön

Jotta React Router voi toimia, koko sovellus täytyy kääriä reitittäjäkomponentin sisään. Selainympäristöissä käytetään `BrowserRouter`-komponenttia, joka hyödyntää selaimen History API:a URL-osoitteiden hallintaan.

Koska reititystä halutaan käyttää kaikkialla sovelluksessa, `BrowserRouter` lisätään sovelluksen juureen `main.tsx`-tiedostoon. Samalla otetaan käyttöön Roboto-fontit, aivan kuten Demo 4:ssä.

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

`BrowserRouter` kääritään `App`-komponentin ympärille. Kaikki `BrowserRouter`in sisällä olevat komponentit voivat nyt käyttää React Routerin reititysominaisuuksia. Tässä `BrowserRouter` lisätään `StrictMode`-komponentin sisälle, jotta React:n tarkistusmoodin tarjoamat varoitukset pysyvät voimassa.

## 3. Näkymäkomponentit ja reittien määrittely

Sovelluksen varsinaiset näkymät toteutetaan omina React-komponentteinaan. Aloitetaan luomalla kaksi tyhjää placeholder-komponenttia, joihin lisätään sisältö myöhemmin. Tämä antaa mahdollisuuden testata reitityksen toimintaa ennen kuin rakentaa täydellisiä näkymiä.

### 3.1 Luodaan Aloitus-komponentti

Luodaan uusi tiedosto `src/components/Aloitus.tsx`. Tässä vaiheessa sisältö on tarkoituksella minimaalinen — pelkkä otsikko, josta tunnistaa missä näkymässä ollaan:

```tsx
import { Container, Typography } from '@mui/material';

function Aloitus() {
  return (
    <Container>
      <Typography variant="h6" sx={{ marginTop: '10px' }}>
        Aloitusnäkymä
      </Typography>
    </Container>
  );
}

export default Aloitus;
```

### 3.2 Luodaan Info-komponentti

Luodaan toinen tiedosto `src/components/Info.tsx` samalla tavalla:

```tsx
import { Container, Typography } from '@mui/material';

function Info() {
  return (
    <Container>
      <Typography variant="h6" sx={{ marginTop: '10px' }}>
        Infonäkymä
      </Typography>
    </Container>
  );
}

export default Info;
```

### 3.3 Määritellään reitit App.tsx-tiedostossa

Varsinainen reittien määrittely tehdään `App.tsx`-tiedostossa. Korvataan Viten oletussisältö reititysrakenteella. Jokainen mahdollinen näkymä on oma `Route`-komponenttinsa, ja kaikki reitit ympäröidään `Routes`-komponentilla:

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

Nyt sovelluksen voi avata selaimessa ja testata reititystä manuaalisesti kirjoittamalla osoiteriville `http://localhost:5173/` ja `http://localhost:5173/info`. Kummassakin osoitteessa pitäisi näkyä oikea näkymä — ilman sivunlatausta!

## 4. Navigointi näkymien välillä Link-komponentilla

Nyt näkymät ovat olemassa ja reitit toimivat, mutta käyttäjällä ei ole mitään tapaa siirtyä näkymien välillä käyttöliittymässä. Lisätään navigointilinkit.

React Router tarjoaa `Link`-komponentin linkkien rakentamiseen. `Link` toimii kuten tavallinen HTML-ankkuritunniste `<a>`, mutta estää sivun uudelleenlatauksen ja vaihtaa näkymän React Routerin kautta.

**Tärkeää:** MUI sisältää myös oman `Link`-komponenttinsa. Huolehdi siis, että tuot oikean `Link`-komponentin nimenomaan `react-router`-kirjastosta, ei MUI:sta!

### 4.1 Lisätään navigointipainike Aloitus-komponenttiin

`Link`-komponenttia voidaan käyttää MUI:n `Button`-komponentin kanssa hyödyntämällä MUI:n polymorfista `component`-ominaisuutta. Tämä tarkoittaa, että `Button` renderöityy `Link`-komponenttina ja saa sen reititysominaisuudet, mutta näyttää visuaalisesti MUI:n nappina.

Päivitetään `Aloitus.tsx`:

```tsx
import { Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router';

function Aloitus() {
  return (
    <Container>

      <Typography variant="h6" sx={{ marginTop: '10px' }}>
        Aloitusnäkymä
      </Typography>

      <Typography variant="body1" sx={{ marginTop: '10px' }}>
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

- `component={Link}`: Kertoo MUI:lle, että nappi renderöidään `Link`-komponenttina. Tämä on MUI:n polymorfinen ominaisuus.
- `to="/info"`: Reitti, johon nappia painamalla siirrytään. Tämä on React Routerin `Link`-komponentille kuuluva ominaisuus.

### 4.2 Lisätään navigointipainike Info-komponenttiin

Päivitetään `Info.tsx` vastaavasti paluupainikkeella:

```tsx
import { Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router';

function Info() {
  return (
    <Container>

      <Typography variant="h6" sx={{ marginTop: '10px' }}>
        Infonäkymä
      </Typography>

      <Typography variant="body1" sx={{ marginTop: '10px' }}>
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

Nyt sovelluksessa voidaan navigoida näkymien välillä painikkeilla. Kokeile painaa nappia ja huomaa, miten URL-osoite muuttuu selaimen osoiterivillä, mutta sivu ei lataudu uudelleen.

## 5. Ohjelmallinen navigointi useNavigate-hookilla

`Link`-komponentti sopii hyvin suoriin navigointilinkkeihin, mutta joskus reitti halutaan vaihtaa osana jotain toiminnallisuutta — esimerkiksi vasta lomakkeen lähettämisen jälkeen tai vahvistuksen pyytämisen jälkeen. Tähän käytetään `useNavigate`-hookia.

`useNavigate` on React-hook, joka palauttaa `navigate`-funktion. Funktiota kutsumalla voidaan siirtyä mihin tahansa reittiin ohjelmallisesti suoritettavan koodin sisällä.

Lisätään `Info`-komponenttiin toinen paluupainike, joka pyytää ensin vahvistuksen:

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

      <Typography variant="h6" sx={{ marginTop: '10px' }}>
        Infonäkymä
      </Typography>

      <Typography variant="body1" sx={{ marginTop: '10px' }}>
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

Koodissa `useNavigate`-hook otetaan käyttöön komponentin sisällä muuttujana `navigate`. TypeScript osaa päätellä sen tyypin automaattisesti, joten erillistä tyyppiä ei tarvitse määritellä.

`vahvistaPaluu`-funktio kysyy käyttäjältä vahvistuksen selaimen sisäisellä vahvistusikkunalla (`window.confirm()`). `confirm()` palauttaa `true`, jos käyttäjä painaa "OK", ja `false`, jos hän painaa "Peruuta". Vahvistus toimii siis `if`-lauseen ehtona: navigointi tehdään vain, jos käyttäjä vahvistaa sen.

Toinen paluupainike käyttää `onClick`-tapahtumaa ja kutsuu `vahvistaPaluu`-funktiota — se ei enää tarvitse `Link`-komponenttia, koska navigointi hoidetaan funktion sisällä.

## 6. Navigaatiovalikko (Valikko-komponentti)

Molemmat näkymät toimivat nyt itsenäisesti. Seuraavaksi rakennetaan yhteinen navigaatiovalikko, joka näkyy molemmissa näkymissä. Se toteutetaan erilliseen `Valikko`-komponenttiin ja lisätään `App.tsx`-tiedostoon reittien ulkopuolelle — näin se on aina näkyvillä.

### 6.1 Luodaan Valikko-komponentti AppBarilla

Luodaan uusi tiedosto `src/components/Valikko.tsx`. Aloitetaan MUI:n `AppBar`-komponentista, joka on tuttu sininen yläpalkki monista verkkosovelluksista. `Toolbar` on `AppBar`in sisäinen komponentti, joka asettelee sen sisällön vaakatasoon.

```tsx
import { AppBar, Toolbar, Typography } from '@mui/material';

function Valikko() {
  return (
    <AppBar position="static">
      <Toolbar>

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

`Typography`-komponentille on asetettu `flexGrow: 1`, joka venyttää tekstin täyttämään kaiken vapaan tilan vasemmalta. Tämä on yleinen tapa asettaa navigaatiopalkin otsikko MUI:ssa — myöhemmin lisättävät painikkeet asettuvat automaattisesti oikealle puolelle.

### 6.2 Lisätään Drawer-vetovalikko

Nyt `AppBar` näyttää otsikon, mutta ei tarjoa vielä navigointia. Lisätään menu-painike, joka avaa sivusta liukuvan `Drawer`-valikon. `Drawer` on erittäin yleinen navigaatioratkaisu React-sovelluksissa.

Drawer-valikon näkyvyyttä ohjataan boolean-tilamuuttujalla `valikkoAuki`. Kun menu-nappia painetaan, tilamuuttuja asetetaan `true`-arvoon ja `Drawer` avautuu. Kun valikko suljetaan, tilamuuttuja asetetaan takaisin `false`-arvoon.

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

Käydään läpi uudet komponentit:

- **`IconButton`**: MUI:n painike, joka on tarkoitettu ikonien käyttöön. `color="inherit"` perii värin yläpalkista (valkoinen), `edge="start"` sijoittaa painikkeen `Toolbar`in vasempaan reunaan.
- **`MenuIcon`**: Kolmen viivan "hampurilainen"-ikoni MUI:n ikonipakkauksesta. Ikonit tuodaan omina komponentteinaan `@mui/icons-material`-paketista.
- **`Drawer`**: Sivusta liukuva vetolaatikko. `open`-ominaisuus määrittää boolean-arvolla, onko valikko näkyvissä. `onClose`-tapahtuma suoritetaan, kun valikko suljetaan — esimerkiksi Esc-näppäimellä tai klikkaamalla valikon ulkopuolelle.
- **`List`** ja **`ListItemButton`**: MUI:n lista ja sen painikemaiset listaelementit. `ListItemButton`-komponentille on asetettu `component={Link} to="..."` aivan samoin kuin aiemmissa näkymissä — painike navigoi kyseiseen reittiin.
- **`ListItemIcon`** ja **`ListItemText`**: Listaelementissä näytettävä ikoni ja teksti.

`List`-komponentille on asetettu `onClick`-tapahtumakäsittelijä, joka sulkee valikon kun mitä tahansa listavalinnoista painetaan. Näin valikko sulkeutuu automaattisesti heti navigoinnin yhteydessä.

### 6.3 Lisätään Valikko ja CssBaseline App.tsx-tiedostoon

Lisätään `Valikko` osaksi `App`-komponenttia. Valikko asetetaan `Routes`-komponentin ulkopuolelle — näin se renderöidään aina, riippumatta siitä, mikä reitti on aktiivisena.

Samalla otetaan käyttöön MUI:n `CssBaseline`-komponentti. Se nollaa selaimen oletustyylit (padding, margin, box-sizing jne.) yhtenäisiksi eri selaimissa — tämä on hyvä käytäntö aina MUI-sovellusta rakentaessa. `CssBaseline` lisätään itsenäisenä komponenttina (ei kääri muita komponentteja ympärilleen).

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

`App`-komponentissa on nyt kolme osaa React Fragment -tunnisteiden sisällä:

1. `<CssBaseline />` — nollaa selaimen oletustyylit
2. `<Valikko />` — aina näkyvä navigaatiopalkki
3. `<Routes>...</Routes>` — reitistä riippuva näkymä

Kun sovelluksen nyt avaa selaimessa, sininen yläpalkki näkyy kummassakin näkymässä. Valikosta voi klikata hamburger-ikonia, jolloin liukuvalikko aukeaa sivusta. Liukuvalikosta voidaan navigoida näkymien välillä linkkipainikkeiden avulla.

## 7. Lopuksi

Tässä demossa toteutettiin React-sovellukseen reititys React Router -kirjastolla. Opittiin:

- **`BrowserRouter`**: Reitittäjäkomponentti, joka kääritään koko sovelluksen ympärille `main.tsx`-tiedostossa.
- **`Routes` ja `Route`**: Reittien määrittely — jokainen polku vastaa tiettyä näkymäkomponenttia.
- **`Link`**: Navigointi näkymien välillä `Button`- tai muun MUI-komponentin `component`-ominaisuuden kautta.
- **`useNavigate`**: Ohjelmallinen navigointi toiminnallisuuden sisällä — esimerkiksi vahvistuksen jälkeen.
- **`AppBar` + `Drawer`**: MUI:n komponenteilla toteutettu navigaatiovalikko, joka pysyy näkyvillä reitistä riippumatta.
