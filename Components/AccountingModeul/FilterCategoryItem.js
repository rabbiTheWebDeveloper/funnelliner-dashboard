import { Autocomplete, Checkbox, TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { baseTest } from '../../constant/constant';
import { headers } from '../../pages/api';

const FilterCategoryItem = ({ selectCatgory ,setPayment  ,handleFetch , setBalance ,balanceFetch}) => {

    const [selectedItem, setSelectedItem] = useState([]);
    const handleItemSelected = (event, value) => {
        const selectedIds = value.map((option) => option.id);
        setSelectedItem(selectedIds);
        // setSelectedItem(selectedItem);
    };
  
    const searchCategoryWise = () => {
        axios.post(baseTest + "/client/accounts/payment-search-category-wise",{
            "category_list"  : [
                ...selectedItem
            ]
        }, {
            headers: headers
        })
            .then(function (res) {
            
                setPayment(res?.data?.data?.ledgers)
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
        if(selectedItem.length >0) searchCategoryWise()
        if(selectedItem.length===0) handleFetch()
        if (selectedItem.length === 0) balanceFetch()
    }, [selectedItem])


 
    return (
        <Autocomplete
            multiple
            options={selectCatgory}
            disableCloseOnSelect
            getOptionLabel={(option) => option?.name}
            renderOption={(props, option, { selected }) => (
                <li {...props}>
                    <Checkbox
                        style={{ marginRight: 8 }}
                        checked={selected}
                    />
                    {option?.name}
                </li>
            )}
            style={{ width: 500 }}
            renderInput={(params) => (
                <TextField {...params} placeholder="Category/Ledger" />
            )}
            onInputChange={(event, value) => {
                // Perform your data filtering based on the input value
            }}
            onChange={handleItemSelected}
            value={selectedItem.name}
        />
    );
};

export default FilterCategoryItem;