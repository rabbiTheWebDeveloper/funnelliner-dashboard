import axios from 'axios';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import DashboardSetting from '../../Components/DashboardSettingPage/DashboardSetting';
import { baseLocal } from '../../constant/constant';
import withAuth from '../../hook/PrivateRoute';
import { headers } from '../api';


const DashboardSettingPage = () => {
    const[response ,setResponse]=useState({})

    useEffect(() => {
        axios
            .get(process.env.API_URL+ "/client/settings/business-info", {headers: headers})
            .then(function (response) {
                setResponse(response)
            
            })
            .catch(function (error) {
             
                if (error.response.data.api_status == 401) {
                    Cookies.remove("token");
                    localStorage.clear("token");
                }
            });
    }, []);


    return (
        <>
   
            <DashboardSetting response={response}></DashboardSetting>

        </>

    )

}

export default withAuth(DashboardSettingPage, {
    isProtectedRoute: true
});
