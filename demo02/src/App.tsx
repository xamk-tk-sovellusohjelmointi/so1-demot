
import { useRef, useState, type RefObject } from 'react';
import './App.css';

interface Tehtava {
  nimi : string;
  tehty : boolean;
}

function App() {

  const uusiTehtava : RefObject<any> = useRef<HTMLInputElement>(null);

  const [tehtavat, setTehtavat] = useState<Tehtava[]>([
    {
      nimi : "Käy kaupassa",
      tehty : false
    },
    {
      nimi : "Siivoa",
      tehty : true
    },
    {
      nimi : "Kastele kukat",
      tehty : false
    }
  ]);

  const lisaaTehtava = (nimi : string) : void => {

    let uusiTehtava : Tehtava = {
      nimi,
      tehty : false
    }

    setTehtavat([...tehtavat, uusiTehtava]);
  }

  const merkitseTehdyksi = (idx : number) : void => {

    let tehtavatApu : Tehtava[] = [...tehtavat];

    tehtavatApu[idx].tehty = !tehtavatApu[idx].tehty

    setTehtavat(tehtavatApu);
  }

  return (
    <>
      <h1>Demo 2: React-perusteita</h1>
      <h2>Tehtävälista</h2>

      <input
        ref={uusiTehtava}
        type="text"
        placeholder="Kirjoita tehtävä ja paina enter..."
        onKeyDown={(e : any) => {
          console.log(e.key);
          if (e.key === "Enter") {
            lisaaTehtava(e.target.value);
            e.target.value = null;
          }
        }}
      />

      <button
        onClick={ () => {
          lisaaTehtava(uusiTehtava.current.value);
          uusiTehtava
        }}
      >Lisää tehtävä</button>

      {Boolean(tehtavat.length > 0) &&
      <ul>
        {tehtavat.map((tehtava : Tehtava, idx : number) => {
          return (
           <li key={idx} onClick={ () => { merkitseTehdyksi(idx); }}>
            {(tehtava.tehty === true)
            ? <del>{tehtava.nimi}</del>
            : tehtava.nimi
            }
           </li> 
          );
        })}
      </ul>
      }
    </>
  );
}

export default App;
