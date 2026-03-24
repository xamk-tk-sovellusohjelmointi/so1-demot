import { Button, Typography } from '@mui/material';
import { Link, useNavigate, useParams } from 'react-router';
import Otsikko from './Otsikko';

interface Tehtava {
  nimi: string;
  tehty: boolean;
}

interface Props {
  tehtavat: Tehtava[];
  setTehtavat: (tehtavat: Tehtava[]) => void;
}

function PoistaTehtava({ tehtavat, setTehtavat }: Props) {

  const navigate = useNavigate();
  const { indeksi } = useParams();
  const indeksiNum = Number(indeksi);

  const vahvistaPoisto = () => {
    setTehtavat(tehtavat.filter((_, idx) => idx !== indeksiNum));
    navigate('/');
  };

  return (
    <>
      <Otsikko tyyli="pieni">Poista tehtävä</Otsikko>

      <Typography sx={{ marginBottom: '20px' }}>
        Haluatko varmasti poistaa tehtävän "{tehtavat[indeksiNum]?.nimi}"?
      </Typography>

      <Button
        variant="contained"
        fullWidth
        onClick={vahvistaPoisto}
      >
        Poista tehtävä
      </Button>

      <Button fullWidth component={Link} to="/">
        Peruuta
      </Button>
    </>
  );
}

export default PoistaTehtava;
