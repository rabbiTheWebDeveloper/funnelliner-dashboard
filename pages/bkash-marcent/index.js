import { Container, Grid } from '@mui/material';
import React from 'react';
import { BsPlug } from 'react-icons/bs';
import SignIn from '../../Components/BkashMarcent/SignIn';
import withAuth from '../../hook/PrivateRoute';


const Plugin = () => {

    


    // const label = {inputProps: {'aria-label': 'Switch demo'}};

    return (

        <>

            <section className='TopSellingProducts DashboardSetting'>

                <Container maxWidth="sm">

                    {/* <Grid Container spacing={3}>

                        <Grid item xs={12}>

                            <div className="Header d_flex d_justify">

                                <div className="Left d_flex">

                                    <div className="svg">
                                        <BsPlug />
                                    </div>

                                    <div className="text">
                                        <h4>Addons</h4>
                                        <p>Add plugins for extra advantages</p>
                                    </div>

                                </div>

                            </div>

                        </Grid>

                    </Grid> */}

                    {/* CourierContent */}
                    <div className="AddonsContent">

                        <Grid container spacing={3}>

                            <Grid item md={12}>

                               <SignIn></SignIn>

                            </Grid>

                        </Grid>

                    </div>

                </Container>

            </section>

        </>

    )

}

export default withAuth(Plugin, {
    isProtectedRoute: true
});