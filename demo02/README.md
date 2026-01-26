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

### 3. Toiseen elementtiin viittaaminen

React-sovelluksia ohjelmoidessa tulee monesti tarve viitata johonkin toiseen elementtiin. 