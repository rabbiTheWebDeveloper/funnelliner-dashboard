import { Box, Button, Modal } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { default as AsyncSelect } from "react-select";
import Swal from 'sweetalert2';
import { baseTest } from '../../constant/constant';
import { headers } from '../../pages/api';



const AccountEdit = ({ id, payment, handleFetch, balanceFetch, paymentList, categoryList, reciverList }) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [info, setInfo] = useState({});
    const [update, setUpdate] = useState(false)
    const [inputValue, setInputValue] = useState(info?.ledger_id || "");
    const [inputValue1, setInputValue1] = useState(info?.payor_id || "");

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const router = useRouter()

    const handleFetchEditInfo = async () => {
        try {
            let data = await axios({
                method: "get",
                url: `${process.env.API_URL}/client/accounts/payment-edit/${id}`,
                headers: headers,
            });
            setInfo(data?.data?.data);
            setInputValue1(data?.data?.data?.payor_id);
            setInputValue(data?.data?.data?.ledger_id);
        } catch (err) {

        }
    };

    useEffect(() => {
        handleFetchEditInfo();
        setUpdate(false)

    }, [id, update]);

    let options = categoryList?.length === 0 ? [] : categoryList?.map(function (item) {
        return { value: item.id, label: item.name };
    })
    let options1 = reciverList?.length === 0 ? [] : reciverList?.map(function (item) {
        return { value: item.id, label: item.name };
    })

    const handleInputChange = (inputValue, action) => {
        if (action.action !== "input-blur" && action.action !== "menu-close") {
            setInputValue(inputValue);
        }
    };
    const handleSelectChange = (selectedOption) => {
        setInputValue(selectedOption.value);
    };
    const handleInputChange1 = (inputValue, action) => {
        if (action.action !== "input-blur" && action.action !== "menu-close") {
            setInputValue1(inputValue);
        }
    };
    const handleSelectChange1 = (selectedOption) => {
        setInputValue1(selectedOption.value);
    };



    const cashForm = (data) => {
        data.payor_id = inputValue1;
        data.ledger_id = inputValue;
        data.status = info.status

      

        axios.post(baseTest + "/client/accounts/payment-update/" + id, data, {
            headers: headers
        })
            .then(function (response) {
                Swal.fire("Information update  Add!", response.data.msg, "success");
                setUpdate(true)
            })
            .catch(function (error) {
                Swal.fire({
                    icon: "error",
                    title: error?.response?.data?.msg,

                });
            });
        reset()
        handleClose()
        handleFetch()
        balanceFetch()

    }


    return (

        <>

            <div className="AccountCashIn AccountEdit">

                <div onClick={handleOpen}> <i className="flaticon-edit"></i> </div>

                <Modal
                    open={open}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                    className='updateModal'
                >
                    <Box className='modalBox'>

                        <div className='modalContent'>

                            <div className='header'>
                                <div className='left'>
                                    <i className="flaticon-edit"></i>
                                    <h4>Edit Entry</h4>
                                </div>

                                <div className='right' onClick={handleClose}>
                                    <i className="flaticon-cancel"></i>
                                </div>

                            </div>

                            <form onSubmit={handleSubmit(cashForm)}>

                                <div className='updateModalForm'>

                                    <div className='customInput'>
                                        <label>Amount <span>*</span></label>
                                        <input defaultValue={info?.amount} type="type"   {...register("amount", { required: true, maxLength: 20 })} />
                                        {errors.amount && <p className='error'>This field is required</p>}
                                    </div>

                                    <div className='customInput'>
                                        <label>Payable/Payor </label>
                                        {
                                            options1?.length > 0 && info && <AsyncSelect
                                                defaultValue={options1.find((item) => item.value === inputValue1)}
                                                placeholder="Select an option..."
                                                options={options1}
                                                onChange={handleSelectChange1}

                                            />
                                        }

                                        {/* <Select defaultValue={info?.payor_id}  options={options1} onChange={handleSelectChange1} /> */}
                                    </div>

                                    <div className="customInput">
                                        <label>Category/Ledger</label>
                                        {
                                            options.length > 0 && info && <AsyncSelect
                                                defaultValue={options.find((item) => item.value === inputValue)}
                                                placeholder="Select an option..."
                                                options={options}
                                                onChange={handleSelectChange}

                                            />
                                        }


                                        {/* <Select options={options} onChange={handleSelectChange} /> */}
                                    </div>

                                    <div className="customInput">
                                        <label>Payment Method </label>
                                        <select name="" {...register("payment_type")} defaultValue={info?.payment_type}>
                                            {Array.isArray(paymentList) ?
                                                paymentList.map((payment, index) => {
                                                    return (
                                                        <option key={index} value={payment.name}>{payment.name}</option>

                                                    )
                                                })
                                                : null}
                                        </select>
                                        {errors.payment_type && <span>This field is required</span>}
                                    </div>

                                    <div className="customInput">
                                        <label>Description</label>
                                        <input defaultValue={info?.description} type="text" {...register("description", { required: true })} />
                                        {errors.description && <span>This field is required</span>}
                                    </div>

                                </div>

                                <div className="duelButton">

                                    <Button type='submit'>Update</Button>
                                    {/* <Button className="red">Reset</Button> */}

                                </div>

                            </form>

                            {/* <form onSubmit={handleSubmit(cashForm)}>

                                <div className="FormPart">


                                    <div className="CustomeInput Amount">
                                        <label>Amount <span>*</span></label>
                                        <input defaultValue={info?.amount} type="number"   {...register("amount", { required: true, maxLength: 20 })} />
                                        {errors.amount && <span>This field is required</span>}
                                    </div>

                                    <div className="CustomeInput">
                                        <label>Payable/Payor </label>

                                        <Select
                                            inputValue={inputValue1}
                                            options={options1}
                                            onInputChange={handleInputChange1}
                                            onChange={handleSelectChange1}
                                        />
                                    </div>

                                    <div className="CustomeInput">
                                        <label>Category/Ledger</label>

                                        <Select
                                            inputValue={inputValue}
                                            options={options}
                                            onInputChange={handleInputChange}
                                            onChange={handleSelectChange}
                                        />
                                    </div>

                                    <div className="CustomeInput">
                                        <label>Payment Method </label>
                                        <select name="" {...register("payment_type")} defaultValue={info?.payment_type}>
                                            <option value="cash">Cash</option>
                                            <option value="online_payment">Online Payment</option>
                                            <option value="bank_payment">Bank Payment</option>
                                        </select>
                                        {errors.payment_type && <span>This field is required</span>}
                                    </div>

                                    <div className="CustomeInput Description">
                                        <label>Description</label>
                                        <input defaultValue={info?.description} type="text" {...register("description", { required: true })} />
                                        {errors.description && <span>This field is required</span>}
                                    </div>

                                    <div className="CustomeInput Button">

                                        <div className="DuelButton d_flex">
                                            <Button type='submit'>Update </Button>
                                        </div>

                                    </div>



                                </div>
                            </form> */}

                        </div>

                    </Box>

                </Modal>

            </div>

        </>

    )


}

export default AccountEdit
