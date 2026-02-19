# Demo 3: React-komponentit ja propsit

## Tiedoksi

Olen lisännyt jokaisen demon lähdekoodeihin kansion [src/kommentoidut_koodit](./src/kommentoidut_koodit/), jossa demon koodit löytyvät täysin kommentoituina logiikan osalta. Tein tämän erikseen, jotta sovelluksen käyttämät koodit pysyisivät paremmin luettavina. Kommenttien tarkoitus on tukea oppimista ja selittää tarkemmin sovelluksen teknistä toimintaa, mitä videoilla pystyy käymään läpi.

## Komponentin luominen

Jokainen React-komponentti on rakenteeltaan JavaScript/TypeScript -funktio, joka voi ottaa vastaan ominaisuuden (ei pakollista) ja palauttaa JSX-merkkausta. Komponentti pitää määrittää vietäväksi (export), jos sitä halutaan kutsua toisessa tiedostossa. Jokaisessa komponenttitiedostossa on vähintään yksi komponentti, joka määritellään oletusvienniksi (export default). Jos samassa tiedostossa on useampi komponentti, joka halutaan viedä, niin oletus vienti määritetään tavallisesti ja muihin komponentteihin lisätään perusvienti (export).

### Yksinkertainen komponentti

Yksinkertaisimmillaan React-funktiokomponentti voi näyttää tältä. Tärkeintä on varmistaa, että vähintään seuraavat asiat löytyvät

1. Vienti joko funktion esittelyssä tai erikseen sen alla `export default FunktionNimi`
2. Funktio palauttaa JSX-rakenteen `return(<>...</>);`

```tsx
function App() {
  return (
    <>
      <h1>Heippa maailma!</h1>
    </>
  );
}

export default App;
```

### Kaksi komponenttia samassa tiedostossa

Komponentteja voidaan kirjoittaa useita samaan tiedostoon. Tämä on hyödyllistä silloin, jos halutaan koota tietyn käyttötarkoituksen komponentteja yhteen paikkaan.

```tsx
function Nappi() {
  return (
    <button>Paina</button>
  );
}

function App() {
  return (
    <>
      <h1>Heippa maailma!</h1>

      <Nappi />
    </>
  );
}
```

### Kaksi komponenttia eri tiedostoissa (+ ominaisuudet)

Komponentit voidaan myös eriyttää omiin tiedostoihinsa, kuten demossa on tehty. Komponentit voidaan ottaa käyttöön muissa tiedostoissa import ja export -komennoilla.

Komponenteissa voidaan välittää myös ominaisuuksia. TypeScriptillä ohjelmoidessa täytyy määrittää komponentin ominaisuuksille oma interface, jonka voi nimetä vapaasti. Usein nimeksi annetaan vain yksinkertaisesti 'Props'. Tämän lisäksi komponentin esittelyssä pitää kertoa, mitä parametreja funktio ottaa vastaan. Parametri on yksittäinen tieto (alla Props-objekti), johon pitää kirjata kaikki samat tiedot, mitä interfacessa määriteltiin. Tämän jälkeen niihin voidaan viitata komponentin sisällä.

**Nappi.tsx**
```tsx
// Tässä määritetään, minkä muotoinen ominaisuus komponentilla on
// Tämä ominaisuus on nimeltään 'Props', se on objekti ja sisältää tiedot 'children' (joku merkkijono) ja valitettyFunktio (ottaa vastaan jonkin funktion emokomponentilta)
interface Props {
  children: string;
  valitettyFunktio: () => void;
}

export default function Nappi(props: Props) {
  return (
    <button
      onClick={() => {
        console.log("Nappia painettu!");
        props.valitettyFunktio();
      }}
    >{props.children}</button>
  );
}
```

**Nappi.tsx (propsit purettu)**
```tsx
// Tässä määritetään, minkä muotoinen ominaisuus komponentilla on
// Tämä ominaisuus on nimeltään 'Props', se on objekti ja sisältää tiedot 'children' (joku merkkijono) ja valitettyFunktio (ottaa vastaan jonkin funktion emokomponentilta)
interface Props {
  children: string;
  valitettyFunktio: () => void;
}

export default function Nappi({ children, valitettyFunktio }: Props) {
  return (
    <button
      onClick={() => {
        console.log("Nappia painettu!");
        valitettyFunktio();
      }}
    >{children}</button>
  );
}
```

**App.tsx**
```tsx
import Nappi from '/path/to/Nappi';

export default function App() {

  const tulostaViesti = () => {
    console.log("Tulostusta kutsuttu!");
  }

  return (
    <>
      <h1>Nappidemo</h1>

      <Nappi valitettyFunktio={tulostaViesti}>Paina nappia ja tulosta viesti</Nappi>
    </>
  );
}
```
