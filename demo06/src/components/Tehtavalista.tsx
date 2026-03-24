import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router';
import Otsikko from './Otsikko';

interface Tehtava {
  nimi: string;
  tehty: boolean;
}

interface Props {
  tehtavat: Tehtava[];
  setTehtavat: (tehtavat: Tehtava[]) => void;
}

function Tehtavalista({ tehtavat, setTehtavat }: Props) {

  const merkitseTehdyksi = (indeksi: number) => {
    setTehtavat(
      tehtavat.map((tehtava, i) =>
        i === indeksi ? { ...tehtava, tehty: !tehtava.tehty } : tehtava
      )
    );
  };

  return (
    <>
      <Otsikko tyyli="pieni">Tehtävälista</Otsikko>

      <Button variant="contained" fullWidth component={Link} to="/uusi">
        Lisää uusi tehtävä
      </Button>

      <List>
        {tehtavat.map((tehtava, idx) => (
          <ListItem key={idx}>

            <ListItemIcon>
              <IconButton onClick={() => merkitseTehdyksi(idx)}>
                {tehtava.tehty
                  ? <CheckBoxIcon color="secondary" />
                  : <CheckBoxOutlineBlankIcon />
                }
              </IconButton>
            </ListItemIcon>

            <ListItemText primary={tehtava.nimi} />

            <ListItemIcon>
              <IconButton component={Link} to={`/poista/${idx}`} edge="end">
                <DeleteIcon />
              </IconButton>
            </ListItemIcon>

          </ListItem>
        ))}
      </List>
    </>
  );
}

export default Tehtavalista;
