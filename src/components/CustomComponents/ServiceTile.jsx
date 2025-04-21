import { Box, Card, Typography } from '@mui/material';
import { useWidth } from '@/contexts/WidthContext';
import { useNavigate } from 'react-router-dom';
const ServiceTile = ({ service }) => {
  const { width } = useWidth();
  const navigate = useNavigate();
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: width*0.15,
        height: width*0.15,
        minWidth: 150,
        minHeight: 150,
        borderRadius: 4,
        boxShadow: 3,
        p: 2,
        textAlign: 'center',
        transition: '0.3s',
        '&:hover': {
          boxShadow: 6,
          transform: 'scale(1.05)',
        },
      }}
      onClick={()=>navigate(service?.to.replace('/*',''))}
    >
      <Box sx={{ fontSize: Math.max(width*0.05, 50), color: 'primary.main' }}><service.icon /></Box>
      <Typography sx={{ mt: 1, fontSize: Math.max(width*0.012, 13) }}>
        {service?.title}
      </Typography>
    </Card>
  );
};

export default ServiceTile;