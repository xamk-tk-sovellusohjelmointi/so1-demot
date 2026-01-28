import { useState } from "react";


interface Ostos {
  tuote: string;
  hinta: number;
  poimittu: boolean;
}

function App() {

  const [ostokset, setOstokset] = useState<Ostos[]>([
    {
      tuote: "Maitoa",
      hinta: 1.20,
      poimittu: false
    },
    {
      tuote: "Kahvia",
      hinta: 9.90,
      poimittu: false
    },
    {
      tuote: "Leipää",
      hinta: 1.50,
      poimittu: false
    }
  ]);

  return (
    <>
      <h1>Demo 3: React-komponentit</h1>
      <h2>Ostoslista</h2>

      {ostokset.map((ostos : Ostos, idx : number) => {
        return(
          <p key={idx}>{ostos.tuote}, {ostos.hinta} €</p>
        );
      })}
    </>
  )
}

export default App
