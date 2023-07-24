import Inventory from '../../Components/Stock/InventoryPage/Inventory';
import withAuth from '../../hook/PrivateRoute';


const index = () => {


    return (


        <>

            {/* <Sidebar active='stock'></Sidebar>
            <Menubar active='stock'></Menubar>
            <div className="TopGaps"></div> */}
            <Inventory></Inventory>

        </>

    )

}

export default withAuth(index, {
    isProtectedRoute: true
});