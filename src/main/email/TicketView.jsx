import React from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, IconButton, Grid, Stack, Card, CardMedia, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
const IMG_BASE_URL = "https://shoppee-api.onrender.com/uploads/product";

const TicketView = ({ open, onClose, product }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Product Details<IconButton aria-label="close" onClick={onClose}
                sx={{
                    position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            </DialogTitle>
            <Divider />
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Card elevation={0} sx={{ height: '350px', p: 2, width: '100%' }}>
                            <CardMedia
                                component="img"
                                src={`${IMG_BASE_URL}/${product?.productImage}`}
                                alt="Blog Image"
                                sx={{ width: '100%', height: '100%', objectFit: 'contain', }}
                            />
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Stack spacing={2}>
                            <Typography variant="body1" fontWeight={'bold'}><Typography component={'span'} color="primary.main" variant='h6' fontWeight={'bold'}>Name : </Typography> {product?.name}</Typography>
                            <Typography variant="body1" fontWeight={'bold'}><Typography component={'span'} color="primary.main" variant='h6' fontWeight={'bold'}>Brand : </Typography> {product?.brand}</Typography>
                            <Typography variant="body1" fontWeight={'bold'}><Typography component={'span'} color="primary.main" variant='h6' fontWeight={'bold'}>Modal : </Typography> {product?.model}</Typography>
                            <Typography variant="body1" fontWeight={'bold'}><Typography component={'span'} color="primary.main" variant='h6' fontWeight={'bold'}>Size : </Typography> {product?.size}</Typography>
                            <Typography variant="body1" fontWeight={'bold'}><Typography component={'span'} color="primary.main" variant='h6' fontWeight={'bold'}>Color : </Typography> {product?.color}</Typography>
                            <Typography variant="body1" fontWeight={'bold'}><Typography component={'span'} color="primary.main" variant='h6' fontWeight={'bold'}>Rating : </Typography> {product?.rating}</Typography>
                            <Typography variant="body1" fontWeight={'bold'}><Typography component={'span'} color="primary.main" variant='h6' fontWeight={'bold'}>Reviews : </Typography> {product?.reviews}</Typography>
                        </Stack>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default TicketView;