import { Autocomplete, Checkbox, TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { baseTest } from '../../constant/constant';
import { headers } from '../../pages/api';

const FilterPaymentItem = ({ selectPayment, setPayment  ,handleFetch , setBalance ,balanceFetch}) => {

    const [selectedItem, setSelectedItem] = useState([]);
    const handleItemSelected = (event, selectedItem) => {
        setSelectedItem(selectedItem);
    };
    const searchCategoryWise = () => {
        axios.post(baseTest + "/client/accounts/payment-search-payment-wise", {
            "payment_list": [
                ...selectedItem
            ]
        }, {
            headers: headers
        })
            .then(function (res) {


                setPayment(res?.data?.data?.payments)
                setBalance(res?.data?.data)
             


            })
            .catch(function (error) {
                // Swal.fire({
                //     icon: "error",
                //     title: error?.response?.data?.msg,

                // });
            })
    }



    useEffect(() => {
        if (selectedItem.length > 0) searchCategoryWise()
        if(selectedItem.length===0) handleFetch()
        if (selectedItem.length === 0) balanceFetch()
    }, [selectedItem])
    return (
        <Autocomplete
            multiple
            options={selectPayment}
            disableCloseOnSelect
            getOptionLabel={(option) => option}
            renderOption={(props, option, { selected }) => (
                <li {...props}>
                    <Checkbox
                        style={{ marginRight: 8 }}
                        checked={selected}
                    />
                    {option}
                </li>
            )}
            style={{ width: 500 }}
            renderInput={(params) => (
                <TextField {...params} placeholder="Payment List " />
            )}
            onInputChange={(event, value) => {
                // Perform your data filtering based on the input value
            }}
            onChange={handleItemSelected}
            value={selectedItem}
        />
    );
};

export default FilterPaymentItem;