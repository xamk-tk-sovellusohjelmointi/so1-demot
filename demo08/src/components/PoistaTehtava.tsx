// React import
import { Link, useNavigate, useParams } from "react-router";
// MUI import
import { Button, Typography } from "@mui/material";
// Custom import
import Otsikko from "./Otsikko";

interface Props {
  tehtavat: Tehtava[];
  setTehtavat: (tehtavat: Tehtava[]) => void;
}

function PoistaTehtava({ tehtavat, setTehtavat }: Props) {
  const navigate = useNavigate();

  const { id } = useParams();

  const poistettavaTehtava: Tehtava | undefined = tehtavat.find(
    (tehtava: Tehtava) => {
      return tehtava.id === id;
    },
  );

  const vahvistaPoisto = () => {
    setTehtavat(tehtavat.filter((tehtava: Tehtava) => tehtava.id !== id));

    navigate("/");
  };

  return (
    <>
      <Otsikko tyyli="pieni">Poista tehtävä</Otsikko>

      <Typography sx={{ marginBottom: "20px" }}>
        Haluatko varmasti poistaa tehtävän "{poistettavaTehtava!.nimi}"?
      </Typography>

      <Button variant="contained" fullWidth onClick={vahvistaPoisto}>
        Poista tehtävä
      </Button>

      <Button fullWidth component={Link} to="/">
        Peruuta
      </Button>
    </>
  );
}

export default PoistaTehtava;
