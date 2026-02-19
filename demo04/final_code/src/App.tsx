import { Button, Checkbox, Container, FormControlLabel, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface Lomaketiedot {
  nimi: string;
  email: string;
  ehdot: boolean;
}

function App() {

  const [lomaketiedot, setLomaketiedot] = useState<Lomaketiedot>({
    nimi: "",
    email: "",
    ehdot: false
  });

  const [tiedotOk, setTiedotOk] = useState<boolean>(false);

  useEffect(() : void => {

    setTiedotOk(Boolean(lomaketiedot.nimi && lomaketiedot.email && lomaketiedot.ehdot) ? true : false)
    
  }, [lomaketiedot]);

  return (
      <Container maxWidth="sm">

        <Typography variant="h4">Demo 4: MUI-komponentit</Typography>
        <Typography variant="h5" sx={{
          marginTop: "10px",
          marginBottom: "10px"
        }}>Uutiskirjeen tilaus</Typography>

        <TextField
          sx={{
            marginBottom: "10px"
          }}
          label="Nimi"
          fullWidth
          helperText="Anna etunimesi ja sukunimesi"
          onChange={(e) => {
            setLomaketiedot({ ...lomaketiedot, nimi: e.target.value })
          }} />

        <TextField
          sx={{
            marginBottom: "10px"
          }}
          label="Sähköpostiosoite"
          fullWidth
          helperText="Anna sähköpostiosoitteesti"
          onChange={(e) => {
            setLomaketiedot({ ...lomaketiedot, email: e.target.value })
          }} />

        <FormControlLabel control={<Checkbox
          onChange={(e) => {
            setLomaketiedot({ ...lomaketiedot, ehdot: e.target.checked })
          }} />} label="Hyväksyn käyttöehdot" />

        <Button
          variant="contained"
          fullWidth
          size="large"
          disabled={!tiedotOk}
          onClick={() => {
            alert(`Olet tilannut uutiskirjeemme, kiitos!
                  Nimi: ${lomaketiedot.nimi}
                  Sähköposti: ${lomaketiedot.email}
                  Ehdot: ${lomaketiedot.ehdot ? "Hyväksytty" : "Ei hyväksytty"}`)
          }}>
            Tilaa uutiskirje
        </Button>

      </Container>
  );
}

export default App;
