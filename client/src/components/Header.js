import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping } from '@fortawesome/free-solid-svg-icons';
import { itemContext } from '../context/ItemContext';
import { AppBar, Toolbar, Typography, Badge, IconButton, Box } from '@mui/material';

const Navbar = () => {
    const { itemsInCart, totalPrice } = useContext(itemContext);

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h3" component={Link} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
                𝘊𝘈𝘙𝘛𝘓𝘠
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="h6">
                        Total: {totalPrice} Rs
                    </Typography>
                    <IconButton component={Link} to="/cart" color="inherit">
                        <Badge badgeContent={itemsInCart} color="error">
                            <FontAwesomeIcon icon={faCartShopping} />
                        </Badge>
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;