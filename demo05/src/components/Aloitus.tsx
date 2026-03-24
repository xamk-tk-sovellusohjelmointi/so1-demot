import { Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router';

function Aloitus() {
  return (
    <Container>

      <Typography
        variant="h6"
        sx={{ marginTop: '10px' }}
      >
        Aloitusnäkymä
      </Typography>

      <Typography
        variant="body1"
        sx={{ marginTop: '10px' }}
      >
        Tämä on demo Reactin reitityksestä. Nyt olemme aloitusnäkymässä.
      </Typography>

      <Button
        component={Link}
        to="/info"
      >
        Siirry info-näkymään
      </Button>

    </Container>
  );
}

export default Aloitus;
