import { Call, Email } from '@mui/icons-material'
import { Box, Card, CardContent, CardMedia, Stack, Typography } from '@mui/material'
import React from 'react'
import ProfileImg from '../../../assets/photo-1748199625281-bde664abf23f.avif';
const Profile = () => {
    return (
        <Card elevation={0} sx={{ p: 3 }}>
            <Stack spacing={5} direction={'row'} alignItems={'center'}>
                <CardMedia
                    component="img"
                    src={ProfileImg}
                    alt="Image"
                    sx={{ width: '120px', height: '120px', borderRadius: '50%' }}>
                </CardMedia>
                <Box>
                    <Typography variant='h4'>Amit Kumar</Typography>
                    <Typography variant='caption'>@amit</Typography>
                </Box>
            </Stack>
            <CardContent>
                <Stack>
                    <Typography sx={{ display: 'flex', gap: 1, alignItems: 'center' }}><Typography component={'span'}><Email /></Typography> : amit@gmail.com</Typography>
                    <Typography sx={{ display: 'flex', gap: 1, alignItems: 'center' }}><Typography component={'span'}><Call /></Typography> : 6393351817</Typography>
                </Stack>
            </CardContent>

        </Card >
    )
}

export default Profile