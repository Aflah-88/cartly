// client/src/components/ProductItem.js
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';

const ProductItem = ({ product }) => {
    // Cart logic is moved to ProductDetails page
    return (
        <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
            <Card sx={{ maxWidth: 200, m: 'auto', height: '100%' }}>
                <CardMedia
                    component="img"
                    height="120"
                    image={product.image}
                    alt={product.name}
                    sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ p: 1 }}>
                    <Typography gutterBottom variant="subtitle1" fontWeight={700} noWrap>
                        {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontWeight={300} noWrap>
                        {product.description}
                    </Typography>
                    <Typography variant="subtitle2" color="text.primary" fontWeight={500} sx={{ mt: 1 }}>
                        Price: {product.price} Rs
                    </Typography>
                </CardContent>
            </Card>
        </Link>
    );
};

export default ProductItem;