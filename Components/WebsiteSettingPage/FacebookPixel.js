import { Button, Switch } from '@mui/material';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { headers, shopId } from '../../pages/api';

const FacebookPixel = ({ shopName }) => {
    // const [checkStatus, setCheckStatus] = useState("")
    const [websiteSettingsData, setWebsiteSettingData] = useState({});

    const label = { inputProps: { "aria-label": "Switch demo" } };

    // const [checked, setChecked] = useState("");
    const [advanceStatus, setAdvanceStatus] = useState(websiteSettingsData?.c_status)
    const switchHandlerAdvance = (event) => {

    };


    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = data => {
        data.c_status = advanceStatus
        data.shop_name = shopName
        data.shop_id = shopId
        axios.post(`${process.env.API_URL}/client/settings/pixel/update`, data, {
            headers: headers,
        })
            .then(function (response) {
                Swal.fire(
                    "Facebook Pixel Information Updated",
                )
            })
            .catch(function (error) {

                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: error.msg,
                    footer: '<a href="">Why do I have this issue?</a>',
                });
            });


    }



    useEffect(() => {
        axios
            .get(process.env.API_URL + "/client/settings/business-info", { headers: headers })
            .then(function (response) {
                // handle success
                setWebsiteSettingData(response?.data?.data);

            });
    }, [advanceStatus]);

    return (
        <div className='DashboardTabsItem FacebookPixel'>

            <div className="Header">
                <h4>Facebook Pixel Setting</h4>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="ProductTable">

                    <div className="FacebookPixel">

                        <div className="Form">

                            <div className="customInput">

                                <label>FB Pixel ID</label>
                                <input id="fb_pixel_id" type="text" {...register("fb_pixel")}
                                    defaultValue={websiteSettingsData.fb_pixel} placeholder='Example: 123456789000000' />
                                {errors.fb_pixel && <p className='error'>This field is required</p>}

                                <h6 className="padding">This code will load before head tag</h6>

                            </div>

                            <div className="customInput">
                                <p>Enable Conversion API (Add The Token Below)</p>
                                <Switch
                                    // checked={advanceStatus}
                                    onChange={(event) => setAdvanceStatus(event.target.checked)}
                                    {...label}
                                    defaultChecked={advanceStatus}
                                />

                            </div>
                            {
                                advanceStatus === true && <div className="customInput">
                                    <label>Conversion API (Recommended)</label>
                                    <textarea name="" rows="5" placeholder="" {...register("c_api")}
                                        defaultValue={websiteSettingsData?.c_api}></textarea>
                                    {errors.c_api && <span>This field is required</span>}
                                    <h6 className="padding">Send events directly from your web server to Facebook through
                                        the conversion API. This can help you capture more events. Anaccess token is
                                        required to use the server-side API.</h6>
                                </div>
                            }



                            <div className="customInput">

                                <label>Test Event Code</label>
                                <input id="fb_pixel_id" placeholder='Example: TEST12345' type="text" {...register("test_event",)}
                                    defaultValue={websiteSettingsData.test_event} />
                                <h6 className="padding">Use this if you need to test the server side event. <Link
                                    href=''>Remove it after testing</Link></h6>

                            </div>

                            <div className="duelButton">

                                <Button type='submit'>Save</Button>
                                <Button className="red">Reset</Button>

                            </div>

                        </div>


                    </div>


                </div>
            </form>


        </div>
    );
};

export default FacebookPixel;