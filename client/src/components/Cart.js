import React, { useContext, useState } from 'react';
import { itemContext } from '../context/ItemContext';
import { 
    Box, 
    Button, 
    Typography, 
    Paper, 
    Grid, 
    IconButton, 
    Snackbar, 
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText
} from '@mui/material';
import { Add, Remove, Delete } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cart, totalPrice, addToCart, decreaseQuantity, removeFromCart, clearCart } = useContext(itemContext);
    const navigate = useNavigate();
    const [successOpen, setSuccessOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    const handleBuyNowClick = () => {
        if (cart.length === 0) {
            setErrorMessage('Your cart is empty!');
            setErrorOpen(true);
            return;
        }
        setConfirmDialogOpen(true);
    };

    const handleConfirmPurchase = () => {
        try {
            // Clear the cart
            clearCart();
            
            // Close dialog and show success message
            setConfirmDialogOpen(false);
            setSuccessOpen(true);

            // Navigate to home page after 2 seconds
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (error) {
            console.error('Error during purchase:', error);
            setErrorMessage('Failed to complete purchase. Please try again.');
            setErrorOpen(true);
        }
    };

    const handleCloseDialog = () => {
        setConfirmDialogOpen(false);
    };

    const handleCloseSuccess = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSuccessOpen(false);
    };

    const handleCloseError = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setErrorOpen(false);
    };

    if (cart.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h4">Your cart is empty</Typography>
                <Button component={Link} to="/" variant="contained" sx={{ mt: 2 }}>
                    Continue Shopping
                </Button>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" align="center" gutterBottom>Your Cart</Typography>
            <Grid container spacing={2}>
                {cart.map(item => (
                    <Grid item xs={12} key={item._id}>
                        <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <img 
                                src={item.image} 
                                alt={item.name} 
                                style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                            />
                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="h6">{item.name}</Typography>
                                <Typography>Price: ₹{item.price}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton onClick={() => decreaseQuantity(item)}><Remove /></IconButton>
                                <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                                <IconButton onClick={() => addToCart(item)}><Add /></IconButton>
                            </Box>
                            <Typography variant="h6">Total: ₹{item.price * item.quantity}</Typography>
                            <IconButton color="error" onClick={() => removeFromCart(item)}><Delete /></IconButton>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ mt: 3, textAlign: 'right' }}>
                <Typography variant="h5" gutterBottom>Grand Total: ₹{totalPrice}</Typography>
                <Button 
                    variant="contained" 
                    color="success" 
                    onClick={handleBuyNowClick}
                    sx={{ minWidth: 200 }}
                >
                    Buy Now
                </Button>
            </Box>

            {/* Confirmation Dialog */}
            <Dialog
                open={confirmDialogOpen}
                onClose={handleCloseDialog}
                aria-labelledby="confirm-purchase-dialog"
            >
                <DialogTitle id="confirm-purchase-dialog">
                    Confirm Purchase
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to complete this purchase for ₹{totalPrice}?
                    </DialogContentText>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                            Order Summary:
                        </Typography>
                        {cart.map(item => (
                            <Typography key={item._id} variant="body2" color="text.secondary">
                                {item.name} x {item.quantity} - ₹{item.price * item.quantity}
                            </Typography>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmPurchase} color="success" variant="contained">
                        Confirm Purchase
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success Snackbar */}
            <Snackbar 
                open={successOpen} 
                autoHideDuration={2000} 
                onClose={handleCloseSuccess}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                    Purchase successful! Thank you for shopping.
                </Alert>
            </Snackbar>

            {/* Error Snackbar */}
            <Snackbar 
                open={errorOpen} 
                autoHideDuration={4000} 
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
                    {errorMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Cart; 