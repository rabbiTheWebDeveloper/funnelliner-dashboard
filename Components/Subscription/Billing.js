import { Button, Container } from "@mui/material";
import axios from "axios";
import moment from 'moment';
import { useEffect, useState } from "react";
import 'react-nice-dates/build/style.css';
import { headers } from "../../pages/api";
import HeaderDescription from "../Common/HeaderDescription/HeaderDescription";

// import { headers } from "../api";

// import HeaderDescription from "../../Components/Common/HeaderDescription/HeaderDescription";



const Billing = ({ orderUpdate }) => {
    const [billingList, setBillingList] = useState([]);
    const handleFetchBillingList = async () => {
        try {
            let data = await axios({
                method: "get",
                url: `${process.env.API_URL}/client/transaction/list`,
                headers: headers,
            });
            setBillingList(data?.data?.data);
        } catch (err) {

        }
    };

    useEffect(() => {
        handleFetchBillingList();
    }, [])


    const today = new Date().toISOString().slice(0, 10);



    const downloadInvoice = async (id) => {
        try {
            const response = await SuperFetch.get(`/client/transaction/pdf/download/${id}`, { headers: headers, responseType: 'blob' });
            const blob = response.data;
            const objectURL = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = objectURL;
            downloadLink.download = 'output.pdf';
            downloadLink.click();
            URL.revokeObjectURL(objectURL);
        } catch (error) {
            console.error('Error downloading invoice:', error);
        }
    }

    return (

        <div>
            <section className="DashboardSetting Order">

                {/* header */}
                <HeaderDescription headerIcon={'flaticon-clipboard'} title={'Billing'} subTitle={'Billing List'} search={false}></HeaderDescription>

                <Container maxWidth="sm">





                    <div className="Table">

                        <table>

                            <thead>
                                <tr>
                                    <th>SL</th>

                                    <th>Bill Date</th>
                                    <th>Transaction No</th>
                                    <th>Gateway</th>
                                    <th>Sub Gateway</th>
                                    <th>Type</th>
                                    <th>Amount</th>
                                    <th>Download Invoice</th>
                                </tr>
                            </thead>

                            <tbody>
                                {billingList.length > 0 ? billingList.map((order, index) => {
                                    return (
                                        <tr key={index + 1}>
                                            <td>{index + 1}</td>

                                            <td>
                                                {order?.created_at?.slice(0, 10) >=
                                                    today
                                                    ? moment(
                                                        order?.created_at
                                                    ).fromNow()
                                                    : moment(order?.created_at).format(
                                                        "DD-MM-YYYY"
                                                    )}
                                            </td>

                                            <td>
                                                {order.trxid}
                                            </td>


                                            <td>{order?.gateway}</td>
                                            <td>{order?.sub_gateway}</td>
                                            <td>{order?.type}</td>
                                            <td>{order?.amount}</td>
                                            <td>
                                                <Button onClick={() => downloadInvoice(order?.id)} >

                                                    Download Invoice
                                                    {/* <i className="flaticon-printer-2" /> */}

                                                </Button>
                                            </td>
                                        </tr>
                                    )
                                })
                                    :
                                    (
                                        <tr>
                                            <td colSpan={14}>
                                                <section className="MiddleSection">
                                                    <div className="MiddleSectionContent">
                                                        <div className="img">
                                                            <img src="/images/empty.png" alt="" />
                                                        </div>

                                                        <div className="text">
                                                            <p>Not Found</p>
                                                        </div>
                                                    </div>


                                                </section>
                                            </td>
                                        </tr>


                                    )

                                }

                            </tbody>

                        </table>

                    </div>
                    {/* <Paginator count={totalPage} page={currentPage} onChange={handleChange} showFirstButton
                        showLastButton variant="outlined" /> */}

                </Container>

            </section>

        </div>

    )

}
// export default index;
export default Billing;