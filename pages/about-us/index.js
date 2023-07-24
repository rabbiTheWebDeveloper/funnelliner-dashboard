
import { useEffect, useState } from 'react';
import AboutUs from '../../Components/MyPage/AboutUs/AboutUs';
import withAuth from '../../hook/PrivateRoute';
import { getWebsiteSettings } from '../api';


const index = () => {
    const [websiteSettingData, setWebsiteSettingData]=useState({})
    useEffect(() => {
        getWebsiteSettings()
            .then((result) => {
                setWebsiteSettingData(result?.data?.data);
            })
            .catch(function (error) {
                return;
            });
    }, []);
    return (
        <>
           <AboutUs websiteSettingData={websiteSettingData}/>
        </>
    )
}
export default withAuth(index, {
    isProtectedRoute: true
});