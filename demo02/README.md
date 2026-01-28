# Demo 2 - React-perusteita

Alla on tiivistettyjä esimerkkejä demossa käytetyistä tekniikoista

### 1. Taulukkojen (array) ja objektien (object) esittely

Jos halutaan käyttää sovelluksessa itse määriteltyä objektia tiedon käsittelyyn, voidaan luoda sille oma tyyppi käyttäen TypeScriptin interfacea.

```tsx
interface Tuote {
  nimi : string;
  hinta : number;
  varastossa : boolean;
}

function App() {

  const [tuote, setTuote] = useState<Tuote>({}); // Tuote voidaan luoda tyhjänä
  const [toinenTuote, setToinenTuote] = useState<Tuote>({ // Tai se voidaan alustaa tiedoilla
    nimi : "T-Paita",
    hinta : 24.99
    varastossa : true
  });
}
```

Usein on tarve käsitellä useita samaa tyyppiä olevia objekteja. Yksittäisten tilamuuttujien sijaan kannattaa luoda objektien taulukko (array) helpompaa käsittelyä varten. Huomaa, että tyypin kirjoitustapa muuttuu käsitellessä taulukoita. Alla olevassa esimerkissä tuotteet-tyyppi on Tuote-objekteja sisältävä taulukko.

```tsx
const [tuotteet, setTuotteet] = useState<Tuote[]>([
  {
    nimi : "T-paita",
    hinta : 24.99,
    varastossa : true
  },
  {
    nimi : "Kauluspaita premium",
    hinta : 79.90,
    varastossa : false
  },
  {
    nimi : "Farkut",
    hinta : 69.90,
    varastossa : true
  }
]);
```

### 2. Taulukon objektien tulostaminen toistorakenteella `array.map()`

Taulukon sisältämiä alkioita voidaan käsitellä JavaScriptissä ja TypeScriptissä monilla hyödyllisillä funktioilla.

Jos halutaan esim. tulostaa kaikki taulukon objektit samanlaisilla muotoiluilla React-komponenttiin, voidaan tähän hyödyntää toistorakennetta. JS/TS sisältää taulukon iteroimiseen funktion `map()`, jonka avulla voidaan suorittaa jokaiselle alkiolle sama toimenpide, esimerkiksi muotoilu ja tulostus osana React-komponenttia.

```tsx
return (

  <ul>
    {tuotteet.map((tuote : Tuote, idx : number) => {
      <li key={idx}>
        {tuote.nimi}
      </li>
    })}
  </ul>
);
```

### 3. Toisen elementin arvoon viittaaminen

React-sovelluksia ohjelmoidessa tulee monesti tarve viitata johonkin toiseen elementtiin. Tähän on eri tapoja riippuen käyttötarpeesta. Jos esimerkiksi halutaan tallentaa käyttäjän kirjoittamaa syötettä tilaan, kuten demossa 1, se voidaan tehdä seuraavasti:

```tsx
const [nimi, setNimi] = useState<string>("");
const [viesti, setViesti] = useState<string>("")

return (
  <>
    <input
      type="text"
      onChange={(e) => {
        setNimi(e.target.value);
        console.log(e.target.value);
      }}
    />

    <button
      onClick={ () => { setViesti(`Heippa, ${nimi}!`) } }
    >Sano hei</button>

    <p>Kirjoitat: {nimi}</p>

    {Boolean(viesti) && <p>{viesti}</p>}
  </>
);
```

Yllä oleva tapa renderöi komponentin uudelleen jokaisella syötteen päivittymisellä, koska tilaa muutetaan. Tämä on muun muassa suorituksellisesti raskaampaa, mutta voi olla tarpeen tilanteissa, joissa käyttöliittymän näkymää halutaan päivitettävän jokaisella elementin muutoksella.

Toisinaan taas halutaan vain seurata jonkin elementin arvon muutosta ilman, että tarvitaan uudelleenrenderöintiä käyttöliittymässä. Näin on demon 2 esimerkissä, jossa halutaan lisätä käyttäjän kirjoittama tehtävä listaan vasta napin painamisen yhteydessä. Tällöin ei ole tarvetta päivittää tilaa `input`-kentän arvon muuttuessa.

Voidaan siis käyttää Reactin `ref`-ominaisuutta viittaamaan suoraan toisen elementin tietoon.Nyt elementin arvon muuttuminen ei aiheuta komponentin päivittymistä, toisin kuin tilamuuttujaan tietoa päivittäessä.

```tsx
import { useRef, useState } from 'react';

function App() {

  const nimi : RefObject<any> = useRef<HTMLInputElement>(null);

  const [viesti, setViesti] = useState<string>();

  return (
    <>
      <input
      ref={nimi}
      type="text"
      />

      <button
        onClick={ () => {
          setViesti(`Heippa, ${nimi.current.value}!`);
        }}
      >Sano hei</button>

      {Boolean(viesti) && <p>{viesti}</p>}
    </>
  );
}
```