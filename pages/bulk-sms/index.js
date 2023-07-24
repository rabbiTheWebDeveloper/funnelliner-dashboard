
import BulkSms from '../../Components/BulkSmsPage/BulkSms';
import withAuth from '../../hook/PrivateRoute';


const index = () => {
    return (
        <>
            <BulkSms></BulkSms>

        </>

    )

}

export default withAuth(index, {
    isProtectedRoute: true
});