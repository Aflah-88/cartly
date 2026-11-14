import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CardActionArea from '@mui/material/CardActionArea';
import Button from '@mui/material/Button';
import { itemContext } from '../context/ItemContext';
import { useContext } from 'react';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();
    const { addToCart } = useContext(itemContext);

    useEffect(() => {
        fetch('http://localhost:5000/api/products')
            .then(res => res.json())
            .then(data => {
                setProducts(data);
            })
            .catch(err => console.error('Error fetching products:', err));
    }, []);

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
                Product List
            </Typography>
            <Grid container spacing={3}>
                {products.map((product) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                        <Card 
                            sx={{ 
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    boxShadow: 6,
                                    cursor: 'pointer'
                                }
                            }}
                        >
                            <CardActionArea onClick={() => handleProductClick(product._id)}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={product.image}
                                    alt={product.name}
                                    sx={{ objectFit: 'cover' }}
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {product.description}
                                    </Typography>
                                    <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                                        ₹{product.price}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <Box sx={{ p: 2, mt: 'auto' }}>
                                <Button 
                                    variant="contained" 
                                    fullWidth
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        addToCart(product);
                                    }}
                                >
                                    Add to Cart
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ProductList;