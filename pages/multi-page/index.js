

import MultiWebsite from '../../Components/Templates/MultiWebsitePage/MultiWebsite';
import withAuth from '../../hook/PrivateRoute';


const index = () => {


    return (


        <>
            <MultiWebsite></MultiWebsite>

        </>

    )

}

export default withAuth(index, {
    isProtectedRoute: true
});