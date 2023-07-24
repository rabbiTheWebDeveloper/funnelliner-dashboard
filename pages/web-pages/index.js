import WebPages from '../../Components/WebPages/WebPages';
import withAuth from '../../hook/PrivateRoute';


const index = () => {


    return (


        <>
            <WebPages></WebPages>

        </>

    )

}

export default withAuth(index, {
    isProtectedRoute: true
});