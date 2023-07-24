
import SupportTicket from '../../Components/SupportTicketPage/SupportTicket';
import withAuth from '../../hook/PrivateRoute';


const index = () => {

    return (
        <>
            <SupportTicket></SupportTicket>
        </>

    )

}

export default withAuth(index, {
    isProtectedRoute: true
});