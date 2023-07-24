import { Container, Grid } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AccountDashboard from '../../Components/AccountingModeul/AccountDashboard';
import { headers } from '../api';

const index = ({ myAddonsList ,isApiResponse }) => {
    const [fetchApi, setFetch] = useState(false)
    const [payment, setPayment] = useState([]);
    const handleFetch = () => {
        setFetch(true);
    }
    const handleFetchEditInfo = async () => {

        try {
            let data = await axios({
                method: "get",
                url: `${process.env.API_URL}/client/accounts/payment-list`,
                headers: headers,
            });
            setPayment(data?.data?.data);

        } catch (err) {

        }
    };

    useEffect(() => {
        handleFetchEditInfo();
        setFetch(false)
    }, [fetchApi]);

    // payment list 

    const [paymentList, setPaymentList] = useState([])

    const handleFetchPaymentList = async () => {
        try {
            let data = await axios({
                method: "get",
                url: `${process.env.API_URL}/client/accounts/payment-method-show`,
                headers: headers,
            });
            setPaymentList(data?.data?.data)


        } catch (err) {

        }
    };
    useEffect(() => {
        handleFetchPaymentList()
    }, [])




   


    if (  myAddonsList[0]?.addons_id === 16 && myAddonsList[0]?.status === 1) {
        return (
            <>

                <section>

                    <Container maxWidth="sm">

                        <Grid Container spacing={3}>

                            <Grid item xs={12}>

                                <AccountDashboard payment={payment} setPayment={setPayment} handleFetch={handleFetch}></AccountDashboard>

                            </Grid>

                        </Grid>

                    </Container>

                </section>

            </>

        )
    } else if(isApiResponse ) {
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
