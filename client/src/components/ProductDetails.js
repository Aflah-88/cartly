import React, {
    useEffect,
    useState,
    useContext
} from 'react';
import {
    useParams,
    useNavigate
} from 'react-router-dom';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    RadioGroup,
    FormControlLabel,
    Radio,
    Snackbar,
    Alert,
    Rating,
    TextField,
    List,
    ListItem,
    ListItemText,
    Divider,
    Grid,
    FormControl
} from '@mui/material';
import {
    itemContext
} from '../context/ItemContext';

const ProductDetails = () => {
    const {
        id
    } = useParams();
    const navigate = useNavigate();
    const {
        addToCart
    } = useContext(itemContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [successOpen, setSuccessOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('upi');
    
    // States for review form
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState(false);

    const fetchProduct = () => {
        setLoading(true);
        fetch(`http://localhost:5000/api/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching product:', err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const handleBuyNow = () => {
        setPaymentOpen(true);
    };

    const handleClosePayment = () => {
        setPaymentOpen(false);
    };

    const handleContinueTransaction = () => {
        setPaymentOpen(false);
        setSuccessOpen(true);
    };

    const handleCloseSuccess = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSuccessOpen(false);
        navigate('/'); // Navigate back to home
    };

    const submitReviewHandler = (e) => {
        e.preventDefault();
        setReviewLoading(true);
        setReviewError('');
        
        fetch(`http://localhost:5000/api/products/${id}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rating, comment }),
        })
        .then(res => {
            if (!res.ok) {
                return res.json().then(data => { throw new Error(data.message || 'Failed to submit review') });
            }
            return res.json();
        })
        .then(() => {
            setReviewSuccess(true);
            setReviewLoading(false);
            setRating(0);
            setComment('');
            fetchProduct(); 
        })
        .catch(err => {
            setReviewError(err.message);
            setReviewLoading(false);
        });
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    if (!product) {
        return <Typography variant="h5" align="center" sx={{ mt: 4 }}>Product not found</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Card sx={{ display: 'flex', maxWidth: 900, mx: 'auto', mt: 3 }}>
                <CardMedia
                    component="img"
                    sx={{ width: 400 }}
                    image={product.image}
                    alt={product.name}
                />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flex: '1 0 auto' }}>
                        <Typography component="div" variant="h4" gutterBottom>
                            {product.name}
                        </Typography>
                         <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Rating value={product.rating} readOnly precision={0.5} />
                            <Typography sx={{ ml: 1 }}>({product.numReviews} reviews)</Typography>
                        </Box>
                        <Typography variant="subtitle1" color="text.secondary" component="div" gutterBottom>
                            {product.description}
                        </Typography>
                        <Typography variant="h5" color="primary" sx={{ my: 2 }}>
                            Price: {product.price} Rs
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                            <Button variant="contained" color="primary" onClick={() => addToCart(product)}>
                                Add to Cart
                            </Button>
                            <Button variant="contained" color="success" onClick={handleBuyNow}>
                                Buy Now
                            </Button>
                        </Box>
                    </CardContent>
                </Box>
            </Card>

            {/* Reviews Section */}
            <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
                <Typography variant="h5" gutterBottom>Reviews</Typography>
                <Grid container spacing={2}>
                    <Grid item md={6}>
                        {product.reviews?.length === 0 && <Alert severity="info">No Reviews</Alert>}
                        <List>
                            {product.reviews?.map((review) => (
                                <ListItem key={review._id} alignItems="flex-start">
                                    <ListItemText
                                        primary={review.name}
                                        secondary={
                                            <>
                                                <Rating value={review.rating} readOnly size="small" />
                                                <Typography component="p">{review.comment}</Typography>
                                                <Typography variant="caption">{new Date(review.createdAt).toLocaleDateString()}</Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Grid item md={6}>
                        <Typography variant="h6" gutterBottom>Write a Customer Review</Typography>
                        {reviewSuccess && <Alert severity="success" onClose={() => setReviewSuccess(false)}>Review submitted successfully!</Alert>}
                        {reviewError && <Alert severity="error" onClose={() => setReviewError('')}>{reviewError}</Alert>}
                        <Box component="form" onSubmit={submitReviewHandler} noValidate>
                            <FormControl fullWidth sx={{ my: 1 }}>
                                <Typography component="legend">Rating</Typography>
                                <Rating
                                    value={rating}
                                    onChange={(event, newValue) => {
                                        setRating(newValue);
                                    }}
                                />
                            </FormControl>
                            <TextField
                                label="Comment"
                                multiline
                                rows={4}
                                fullWidth
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                sx={{ my: 1 }}
                            />
                            <Button type="submit" variant="contained" disabled={reviewLoading}>
                                {reviewLoading ? <CircularProgress size={24} /> : 'Submit'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* Payment Dialog */}
            <Dialog open={paymentOpen} onClose={handleClosePayment}>
                <DialogTitle>Choose Payment Method</DialogTitle>
                <DialogContent>
                    <RadioGroup
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                        <FormControlLabel value="upi" control={<Radio />} label="UPI" />
                        <FormControlLabel value="card" control={<Radio />} label="Credit/Debit Card" />
                        <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
                    </RadioGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClosePayment}>Cancel Transaction</Button>
                    <Button onClick={handleContinueTransaction} variant="contained">
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Success Snackbar */}
            <Snackbar open={successOpen} autoHideDuration={4000} onClose={handleCloseSuccess}>
                <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
                    Transaction Successful! Redirecting to home...
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProductDetails; 