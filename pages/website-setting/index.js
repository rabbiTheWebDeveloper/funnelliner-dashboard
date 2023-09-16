import axios from "axios";
import { useEffect, useState } from "react";
import WebsiteSettingPage from '../../Components/WebsiteSettingPage/WebsiteSettingPage';
import withAuth from '../../hook/PrivateRoute';
import { headers } from "../api";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";
const WebsiteSettingPage_2 = ({ busInfo }) => {
    return (
        <WebsiteSettingPage response={busInfo} />
    )

}

export default withAuth(WebsiteSettingPage_2, {
    isProtectedRoute: true
});