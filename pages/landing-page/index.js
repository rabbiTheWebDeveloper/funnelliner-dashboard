
import LandingWebsite from '../../Components/Templates/LandingPage/LandingWebsite';
import withAuth from '../../hook/PrivateRoute';


const index = ({busInfo}) => {


    return (


        <>

          
            <LandingWebsite busInfo={busInfo}></LandingWebsite>

        </>

    )

}

export default withAuth(index, {
    isProtectedRoute: true
});