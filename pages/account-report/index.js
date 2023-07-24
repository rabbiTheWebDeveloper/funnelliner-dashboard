import { Container, Grid } from '@mui/material'
import React from 'react'
import AccountReport from '../../Components/AccountingModeul/AccountReport'

const index = ({ myAddonsList, isApiResponse }) => {

    if (myAddonsList[0]?.addons_id === 16 && myAddonsList[0]?.status === 1) {

        return (

            <>

                <section>

                    <Container maxWidth="sm">

                        <Grid Container spacing={3}>

                            <Grid item xs={12}>

                                <AccountReport />

                            </Grid>

                        </Grid>

                    </Container>

                </section>

            </>

        )
    }
    else if (isApiResponse) {
        return (
            <>

                <section>

                    <Container maxWidth="sm">

                        <Grid Container spacing={3}>

                            <Grid item xs={12} >
                                <div className="NoPayment boxShadow commonCart cart-1">

                                    <h3>Access Denied. Please make a payment or activate to access.</h3>

                                </div>
                            </Grid>

                        </Grid>

                    </Container>

                </section>

            </>)



    }

}

export default index
