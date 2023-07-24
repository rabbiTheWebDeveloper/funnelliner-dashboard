import HomeSlider from '../../Components/MyPage/HomeSlider/HomeSlider';
import withAuth from '../../hook/PrivateRoute';



const index = () => {


    return (


        <>
            <HomeSlider></HomeSlider>

        </>

    )

}
// export default index;

export default withAuth(index, {
    isProtectedRoute: true
});