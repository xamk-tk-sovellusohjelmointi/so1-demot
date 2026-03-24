import { Button, TextField } from '@mui/material';
import { useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import Otsikko from './Otsikko';

interface Tehtava {
  nimi: string;
  tehty: boolean;
}

interface Props {
  tehtavat: Tehtava[];
  setTehtavat: (tehtavat: Tehtava[]) => void;
}

function UusiTehtava({ tehtavat, setTehtavat }: Props) {

  const navigate = useNavigate();
  const uusiTehtavaRef = useRef<HTMLInputElement>(null);

  const lisaaTehtava = () => {
    const uusiTehtava: Tehtava = {
      nimi: uusiTehtavaRef.current?.value || 'Nimetön tehtävä',
      tehty: false,
    };

    setTehtavat([...tehtavat, uusiTehtava]);
    navigate('/');
  };

  return (
    <>
      <Otsikko tyyli="pieni">Lisää uusi tehtävä</Otsikko>

      <TextField
        inputRef={uusiTehtavaRef}
        variant="outlined"
        fullWidth
        placeholder="Kirjoita tehtävä..."
        sx={{ marginBottom: '10px' }}
      />

      <Button
        variant="contained"
        fullWidth
        onClick={lisaaTehtava}
      >
        Tallenna
      </Button>

      <Button fullWidth component={Link} to="/">
        Peruuta
      </Button>
    </>
  );
}

export default UusiTehtava;
