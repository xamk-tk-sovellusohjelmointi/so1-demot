import { useState } from 'react';
import Otsikko from './components/Otsikko';
import Yhteenveto from './components/Yhteenveto';
import Laskurinappi from './components/Laskurinappi';
import Sivu from './components/Sivu';

const kulkuneuvot : string[] = [
  "Henkilöauto",
  "Pakettiauto",
  "Linja-auto",
  "Kuorma-auto tai rekka",
  "Polkupyörä",
  "Moottoripyörä",
  "Sähköpotkulauta",
  "Muu kulkuneuvo"
];

export default function App() {

  const [yhteensa, setYhteensa] = useState<number>(0);

  const lisaaYksi = () => {
    setYhteensa(yhteensa + 1);
  }

  return (
    <Sivu>
      <Otsikko taso="iso">Demo 3: React-komponentit</Otsikko>
      <Otsikko taso="keski">Liikennelaskuri</Otsikko>

      <Yhteenveto yhteensa={yhteensa} />
      
      
      {kulkuneuvot.map((kulkuneuvo: string, idx: number) => {
        return (
          <Laskurinappi paivitaSumma={lisaaYksi} key={idx}>{kulkuneuvo}</Laskurinappi>
        );
      })}

    </Sivu>
  )
}
