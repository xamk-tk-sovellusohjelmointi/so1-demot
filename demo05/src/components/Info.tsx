import { Button, Container, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router';

function Info() {

  const navigate = useNavigate();

  const vahvistaPaluu = () => {
    if (window.confirm('Haluatko varmasti palata aloitukseen?')) {
      navigate('/');
    }
  };

  return (
    <Container>

      <Typography
        variant="h6"
        sx={{ marginTop: '10px' }}
      >
        Infonäkymä
      </Typography>

      <Typography
        variant="body1"
        sx={{ marginTop: '10px' }}
      >
        Nyt olemme infonäkymässä.
      </Typography>

      <Button
        component={Link}
        to="/"
      >
        Palaa aloitusnäkymään
      </Button>

      <Button
        onClick={vahvistaPaluu}
      >
        Palaa aloitusnäkymään (vahvistuksella)
      </Button>

    </Container>
  );
}

export default Info;
