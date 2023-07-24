
import MyLandingPage from "../../Components/MyPage/MyLandingPage/MyLandingPage";
import withAuth from "../../hook/PrivateRoute";




const index = () => {
    return (
        <>
           
            <MyLandingPage></MyLandingPage>

        </>
    );
};

export default withAuth(index, {
    isProtectedRoute: true,
    show: false,
});