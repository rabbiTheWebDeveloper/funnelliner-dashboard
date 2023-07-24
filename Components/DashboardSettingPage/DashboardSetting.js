import { TabContext, TabList } from "@mui/lab";
import { Box, Button, Container, Grid, Tab } from "@mui/material";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../../hook/useToast";
import { headers } from "../../pages/api";
import { setActiveTab } from "../../redux/features/dropDownSlice/dropdownSlice";
import HeaderDescription from "../Common/HeaderDescription/HeaderDescription";
import BussnessInfo from "./BussnessInfo";

const DashboardSetting = ({ response }) => {
    const activeTab = useSelector((state) => state.dropDown.activeTab);
    const router = useRouter()

    //check if user come from index steap from
    const redirectFrom = router.query.redierct_from

    const showToast = useToast()
    const [user, setUser] = useState(null);
    const [ownInfo, setOwnInfo] = useState({});
    const [value, setValue] = useState("1");
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    // Filter
    const [age, setAge] = useState("");

    const handleChange = (event) => {
        setAge(event.target.value);
    };
    // Tabs


    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
    };
    // .common shop and user name
    useEffect(() => {
        const userList = Cookies.get("user");
        setUser(JSON.parse(userList));
    }, []);

    useEffect(() => {
        if (router?.query?.pass !== undefined) {
            // setValue(router?.query?.pass)
            handleChangeTab(0, router?.query?.pass)
        }
    }, [])

    // own information post
    const ownInfoSubmit = (data) => {
        axios.post(process.env.API_URL + "/client/settings/owner-info/update", data, {
            headers: headers,
        })
            .then(function (response) {
                showToast("Owner information has been successfully updated")

            })
            .catch(function (error) {
                showToast("Something went wrong!", "error")
            });
        reset();
    };
    //  own information get
    useEffect(() => {
        axios.get(process.env.API_URL + "/client/settings/owner-info", { headers: headers })
            .then(function (response) {
                // handle success
                let target = response.data.data;
                setOwnInfo(target);

            });
    }, []);

    // password reset
    const passwordSubmit = (data) => {
        axios.post(process.env.API_URL + "/client/settings/password-security/update", data, { headers: headers })
            .then(function (response) {
                showToast(response.data.msg)
            })
            .catch(function (error) {
                showToast("Something went wrong!", "error")
            });
        reset();
    };

    //
    const dispatch = useDispatch();
    const handleTabChnage = (value) => {
        dispatch(setActiveTab(value));
    };

    return (
        <>
            <section className="TopSellingProducts DashboardSetting">

                <HeaderDescription headerIcon={'flaticon-settings-2'} title={'Settings'} subTitle={'Update your shop info and other settings here'} search={false}></HeaderDescription>

                <Container maxWidth="sm">

                    {/* DashboardSettingTabs */}
                    <div className="DashboardSettingTabs boxShadow">
                        <Box>
                            <TabContext value={activeTab}>
                                <Box className="CommonTab">
                                    <TabList onChange={handleChangeTab} aria-label="lab API tabs example" >
                                        <Tab onClick={() => handleTabChnage("1")} label="Business Information" value="1" />
                                        <Tab onClick={() => handleTabChnage("2")} label="Owner Information" value="2" />
                                        <Tab onClick={() => handleTabChnage("3")} label="Password & Security" value="3" />

                                    </TabList>
                                </Box>

                                {
                                    activeTab == 1 && <div className="DashboardSettingItem">
                                        {/* <h4>Update Business Information</h4>
                                        <p>Update your shop info and other settings</p> */}
                                        <BussnessInfo redirectFrom={redirectFrom} response={response}></BussnessInfo>

                                    </div>
                                }
                                {
                                    activeTab == 2 && <div className="DashboardTabsItem">

                                        <div className="DashboardForm">

                                            <div className="DashboardFormItem">

                                                <Grid container spacing={3}>

                                                    <Grid item md={12}>
                                                        <div className="left">
                                                            <h4>Update Owner Information</h4>
                                                            <p>Update your shop info and other settings</p>
                                                        </div>
                                                    </Grid>

                                                    <Grid item md={12}>
                                                        <form onSubmit={handleSubmit(ownInfoSubmit)}>
                                                            <div className="customInput">
                                                                <label>Owner Name <span>*</span></label>
                                                                <input type="text" defaultValue={ownInfo.owner_name} {...register("owner_name")} />
                                                            </div>

                                                            <div className="customInput">
                                                                <label>Contact Number <span>*</span></label>
                                                                <input type="number" defaultValue={ownInfo.owner_number} {...register("owner_number")} />
                                                            </div>

                                                            <div className="customInput">
                                                                <label>Email Address <span>*</span></label>
                                                                <input type="text" InputProps={{ readOnly: true, }} value={ownInfo.owner_email} {...register("owner_email")} />
                                                            </div>

                                                            <div className="customInput">
                                                                <label>Address</label>
                                                                <input type="text" defaultValue={ownInfo.owner_address} {...register("owner_address")} />
                                                            </div>

                                                            <div className="customInput">
                                                                <label>Other Information</label>
                                                                <input type="text" defaultValue={ownInfo.owner_other_info} {...register("owner_other_info")} />
                                                            </div>

                                                            <div className="duelButton">
                                                                <Button type="submit">Update</Button>
                                                            </div>

                                                        </form>
                                                    </Grid>

                                                </Grid>

                                            </div>
                                        </div>
                                    </div>
                                }
                                {
                                    activeTab == 3 && <div className="DashboardTabsItem">

                                        <div className="DashboardForm">

                                            <div className="DashboardFormItem">

                                                <Grid container spacing={3}>

                                                    <Grid item md={12}>
                                                        <div className="left">
                                                            <h5>Update Password</h5>
                                                            <p>Password for your profile Login</p>
                                                        </div>
                                                    </Grid>

                                                    <Grid item md={12}>
                                                        <form onSubmit={handleSubmit(passwordSubmit)}>
                                                            <div className="customInput">
                                                                <label>Current Password</label>
                                                                <input type="text" placeholder="Current Password"
                                                                    {...register("old_password")} />
                                                                {errors.old_password && (
                                                                    <p className="error">This field is required</p>
                                                                )}
                                                            </div>

                                                            <div className="customInput">
                                                                <label>New Password</label>
                                                                <input type="password" placeholder="New Password" {...register("new_password")} />
                                                                {errors.new_password && (
                                                                    <p className="error">This field is required</p>
                                                                )}
                                                            </div>

                                                            <div className="customInput">
                                                                <label>Confirm New Password</label>
                                                                <input type="password" placeholder="Confirm New Password" {...register("password_confirmation")} />
                                                                {errors.password_confirmation && (
                                                                    <p className="error">This field is required</p>
                                                                )}
                                                            </div>

                                                            <div className="duelButton">
                                                                <Button type="submit">Update</Button>
                                                            </div>


                                                        </form>
                                                    </Grid>

                                                </Grid>

                                            </div>
                                        </div>
                                    </div>
                                }
                            </TabContext>
                        </Box>
                    </div>
                </Container>
            </section >
        </>
    );
};

export default DashboardSetting;
