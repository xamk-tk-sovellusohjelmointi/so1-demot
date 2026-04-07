// React import
import { useRef } from "react";
import { Link, useNavigate } from "react-router";
// MUI import
import { Button, TextField } from "@mui/material";
// Custom import
import Otsikko from "./Otsikko";

interface Props {
  tehtavat: Tehtava[];
  setTehtavat: (tehtavat: Tehtava[]) => void;
}

function UusiTehtava({ tehtavat, setTehtavat }: Props) {
  const navigate = useNavigate();

  const uusiTehtavaRef = useRef<HTMLInputElement>(null);

  const lisaaTehtava = () => {
    const uusiTehtava: Tehtava = {
      id: crypto.randomUUID(),
      nimi: uusiTehtavaRef.current?.value || "Nimetön tehtävä",
      tehty: false,
    };

    setTehtavat([...tehtavat, uusiTehtava]);

    navigate("/");
  };

  return (
    <>
      <Otsikko tyyli="pieni">Lisää uusi tehtävä</Otsikko>

      <TextField
        label="Tehtävän nimi"
        inputRef={uusiTehtavaRef}
        variant="outlined"
        fullWidth
        sx={{ marginBottom: "10px" }}
      />

      <Button variant="contained" fullWidth onClick={lisaaTehtava}>
        Tallenna
      </Button>

      <Button fullWidth component={Link} to="/">
        Peruuta
      </Button>
    </>
  );
}

export default UusiTehtava;
