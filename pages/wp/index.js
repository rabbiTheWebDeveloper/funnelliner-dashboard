
import Woocommerce from '../../Components/WoocommercePage/Woocommerce';
import withAuth from '../../hook/PrivateRoute';


const index = () => {

    return (
        <>
            <Woocommerce/>
        </>

    )

}

export default withAuth(index, {
    isProtectedRoute: true
});