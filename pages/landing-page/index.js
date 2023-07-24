
import LandingWebsite from '../../Components/Templates/LandingPage/LandingWebsite';
import withAuth from '../../hook/PrivateRoute';


const index = () => {


    return (


        <>

          
            <LandingWebsite></LandingWebsite>

        </>

    )

}

export default withAuth(index, {
    isProtectedRoute: true
});