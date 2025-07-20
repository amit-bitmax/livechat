import React from 'react';
import { Avatar, Card, CardContent, Divider, Grid, Paper, Stack, Typography } from '@mui/material';
import { Cancel, MonetizationOn, ShoppingCartOutlined, ThumbUpOutlined } from '@mui/icons-material';

const OrderAnality = () => {

    return (
        <Paper elevation={0} sx={{ p: 2 }}>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ border: '1px solid #eee' }} elevation={0}>
                        <CardContent>
                            {/* Header Section */}
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: 'primary.main', width: 30, height: 30 }}>
                                    <MonetizationOn fontSize="large" color="#fff" />
                                </Avatar>
                                <Stack spacing={1}>
                                    <Typography variant="h6" color="text.secondary">
                                        Total Cast
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold">
                                        $ 12,200k
                                        <Typography component="span" color="text.secondary">
                                            New 365 Days
                                        </Typography>
                                    </Typography>
                                </Stack>
                            </Stack>

                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ border: '1px solid #eeeeee' }} elevation={0}>
                        <CardContent>
                            {/* Header Section */}
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: 'primary.main', width: 30, height: 30 }}>
                                    <ShoppingCartOutlined fontSize="large" color="#fff" />
                                </Avatar>
                                <Stack spacing={1}>
                                    <Typography variant="h6" color="text.secondary">
                                        Total Order
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold">
                                        190
                                        <Typography component="span" color="text.secondary">
                                            Order 365 Days
                                        </Typography>
                                    </Typography>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ border: '1px solid #eee' }} elevation={0}>
                        <CardContent>
                            {/* Header Section */}
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: 'primary.main', width: 30, height: 30 }}>
                                    <ThumbUpOutlined fontSize="large" color="#2f0" />
                                </Avatar>
                                <Stack spacing={1}>
                                    <Typography variant="h6" color="text.secondary">
                                        Completed
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold">
                                        165 Comp.
                                        <Typography component="span" color="text.secondary">
                                            Order 365 Days
                                        </Typography>
                                    </Typography>
                                </Stack>
                            </Stack>

                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ border: '1px solid #eeeeee' }} elevation={0}>
                        <CardContent>
                            {/* Header Section */}
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: 'primary.main', width: 30, height: 30 }}>
                                    <Cancel fontSize="large" color="#d00" />
                                </Avatar>
                                <Stack spacing={1}>
                                    <Typography variant="h6" color="text.secondary">
                                        Canceled
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold">
                                        25 Canc.
                                        <Typography component="span" color="text.secondary">
                                            Order 365 Days
                                        </Typography>
                                    </Typography>
                                </Stack>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default OrderAnality;
