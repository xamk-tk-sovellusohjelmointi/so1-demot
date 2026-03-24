import { Typography } from '@mui/material';

interface Props {
  children: React.ReactNode;
  tyyli?: 'pieni';
}

function Otsikko({ children, tyyli }: Props) {
  return (
    <Typography
      sx={{
        fontSize: tyyli === 'pieni' ? 18 : 22,
        marginTop: '10px',
        marginBottom: '10px',
      }}
    >
      {children}
    </Typography>
  );
}

export default Otsikko;
