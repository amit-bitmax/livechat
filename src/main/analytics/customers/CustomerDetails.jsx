import { Box, Grid } from '@mui/material'
import React from 'react'
import Profile from './Profile'
import OrderAnality from './OrderAnality'
import OrderList from '../orders/OrderList'

const CustomerDetails = () => {
    return (
        <>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Profile />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                    <OrderAnality />
                </Grid>
            </Grid>
            <Box sx={{ mt: 3 }}>
                <OrderList />
            </Box>

        </>
    )
}

export default CustomerDetails