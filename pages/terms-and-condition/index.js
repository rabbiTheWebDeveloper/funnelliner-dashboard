import { useEffect, useState } from 'react';

import withAuth from '../../hook/PrivateRoute';
import { getWebsiteSettings } from '../api';
import TermsAndCondition from '../../Components/MyPage/TermsAndCondition/TermsAndCondition';


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
           <TermsAndCondition websiteSettingData={websiteSettingData}/>
        </>
    )
}
export default withAuth(index, {
    isProtectedRoute: true
});