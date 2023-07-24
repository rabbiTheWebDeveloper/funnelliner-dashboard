import { Container, Grid } from '@mui/material'
import React from 'react'

const Footer = () => {

    return (

        <>

            <footer className='Footer boxShadow'>

                <Container>

                    <Grid container spacing={2}>

                        <Grid item xs={12}>

                            <p> FunnelLiner - V1.0 | Copyright © 2023 <img src="/images/light-logo.png" alt="" /> All rights reserved </p>

                        </Grid>

                    </Grid>

                </Container>

            </footer>

        </>

    )
}

export default Footer
