import React from 'react';
import { Avatar, Card, CardContent, Divider, Stack, Typography } from '@mui/material';

const StatisticWidget = ({ title, status, icon, change, variant = "text.primary", description }) => {
    const Icon = icon
    return (
        <Card elevation={0}>
            <CardContent>
                {/* Header Section */}
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                    <Stack>
                        <Typography variant="h6" color="text.secondary">
                            {title}
                        </Typography>
                        <Typography variant="h5" fontWeight="bold">
                            {status}
                        </Typography>
                    </Stack>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                        {Icon && <Icon fontSize="large" color="#fff" />}
                    </Avatar>
                </Stack>

                <Divider sx={{ my: 1.5, borderStyle: "dashed" }} />

                {/* Footer Section */}
                <Typography color={variant} alignItems="center">
                    {change}% &nbsp;
                    <Typography component="span" color="text.secondary">
                        {description}
                    </Typography>
                </Typography>
            </CardContent>
        </Card>
    );
};

export default StatisticWidget;
