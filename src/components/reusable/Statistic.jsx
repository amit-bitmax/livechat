import React from 'react'
import { Grid } from '@mui/material'
import StatisticWidget from './StatisticWidget'
import { statisticsData } from './data'

const Statistic = () => {
    return (
        <Grid container spacing={3}>
            {statisticsData.map((stat, index) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                    <StatisticWidget
                        title={stat.title}
                        status={stat.status}
                        icon={stat.icon}
                        change={stat.change}
                        variant={stat.variant === "success" ? "success.main" : "error.main"}
                        description={stat.description}
                    />
                </Grid>
            ))}
        </Grid>
    )
}

export default Statistic