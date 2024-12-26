import { Box } from '@mui/material';
import { Link } from 'react-router-dom';

const HeaderNavItem = ({ item }) => {
    return (
        <Link to={item.to}>
            <Box
                key={item.id}
                className="relative text-base text-gray-600 hover:text-black"
                sx={{
                    '&:hover::after': {
                        width: '100%',
                    },
                    '&::after': {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        bottom: -2,
                        width: 0,
                        height: '2px',
                        backgroundColor: '#000000',
                        transition: 'width 0.3s ease-in-out',
                    },
                }}
            >
                {item.label}
            </Box>
        </Link>
    );
};

export default HeaderNavItem;
