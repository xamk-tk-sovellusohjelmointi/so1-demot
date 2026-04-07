// React import
import { Link } from "react-router";
// MUI imports
import {
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import DeleteIcon from "@mui/icons-material/Delete";
// Custom imports
import Otsikko from "./Otsikko";

interface Props {
  tehtavat: Tehtava[];
  setTehtavat: (tehtavat: Tehtava[]) => void;
}

function Tehtavalista({ tehtavat, setTehtavat }: Props) {
  const merkitseTehdyksi = (id: string) => {
    let indeksi: number = tehtavat.findIndex((tehtava: Tehtava) => {
      return tehtava.id === id;
    });

    let tehtavatApu: Tehtava[] = [...tehtavat];

    tehtavatApu[indeksi].tehty = !tehtavatApu[indeksi].tehty;

    setTehtavat(tehtavatApu);
  };

  return (
    <>
      <Otsikko tyyli="pieni">Tehtävälista</Otsikko>

      <Button variant="contained" fullWidth component={Link} to="/uusi">
        Lisää uusi tehtävä
      </Button>

      <List>
        {tehtavat.map((tehtava: Tehtava, idx: number) => (
          <ListItem key={idx}>
            <ListItemIcon>
              <IconButton onClick={() => merkitseTehdyksi(tehtava.id)}>
                {tehtava.tehty ? (
                  <CheckBoxIcon color="secondary" />
                ) : (
                  <CheckBoxOutlineBlankIcon />
                )}
              </IconButton>
            </ListItemIcon>

            <ListItemText primary={tehtava.nimi} />

            <ListItemIcon>
              <IconButton component={Link} to={`/poista/${tehtava.id}`} edge="end">
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
