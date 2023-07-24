
import AddProduct from '../../Components/Products/AddProduct/AddProduct';
import withAuth from '../../hook/PrivateRoute';
const index = () => {
    return (
        <>
            <AddProduct/>

        </>
    )
}

export default withAuth(index, {
    isProtectedRoute: true
});