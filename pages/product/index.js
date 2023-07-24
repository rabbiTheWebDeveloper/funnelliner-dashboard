import axios from 'axios';
import { useEffect, useState } from 'react';
// import Product from '../../Components/ProductPage/Product';
import Product from '../../Components/Products/ProductPage/Product';
import withAuth from '../../hook/PrivateRoute';
import { headers } from '../api';


const index = () => {
    const [category, setCategory] = useState([])
    const hanldeFetchCategories = () => {
        axios
            .get(process.env.API_URL + "/client/categories", { headers: headers })
            .then(function (response) {
                let categories = response.data.data;
                setCategory(categories);
            })
            .catch(function (error) {
            });
    }

    useEffect(() => {
        hanldeFetchCategories()
    }, []);
    return (
        <>
            <Product category={category}></Product>

        </>

    )

}

export default withAuth(index, {
    isProtectedRoute: true
});