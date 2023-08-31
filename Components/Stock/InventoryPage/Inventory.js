import { Box, Container, Pagination, Skeleton, Stack } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import HeaderDescription from "../../../Components/Common/HeaderDescription/HeaderDescription";
import { headers } from "../../../pages/api";

const Inventory = () => {
    // Filter

    const [isLoading, setIsLoading] = useState(true);


    // product api implement
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);


    useEffect(() => {
        axios
            .get(process.env.NEXT_PUBLIC_API_URL + "/client/stocks/inventory/list", { headers: headers })
            .then(function (response) {
                // handle success
                setProducts(response.data?.data);
                setIsLoading(false);
            });

    }, []);
   
 
    const indexOfLastProducts = currentPage * perPage;
    const indexOfFirstProducts = indexOfLastProducts - perPage;
    const currentProduct = products.slice(
        indexOfFirstProducts,
        indexOfLastProducts
    );

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(products.length / perPage); i++) {
        pageNumbers.push(i);
    }

    const paginate = (pageNumber, value) =>  setCurrentPage(value)

    const [productSearchValue, setProductSearchValue] = useState("")
    const [filterProducts, setFilterProducts] = useState([])
    const handleChangeSearchBox = () => {
        const filtered = products?.filter(item => item?.id?.toString().includes(productSearchValue) || item?.product_name?.toLowerCase().includes(productSearchValue.toLowerCase()) || item?.product_code?.toLowerCase().includes(productSearchValue.toLowerCase()));
        setFilterProducts(filtered)
    }
    useEffect(()=>{
        handleChangeSearchBox()
    }, [productSearchValue])
    return (
        <>
            <section className="TopSellingProducts DashboardSetting Order">

                {/* header */}
                <HeaderDescription setSearch={setProductSearchValue} headerIcon={'flaticon-in-stock-1'} title={'Inventory'} subTitle={'Shop Products List'} search={true} />

                <Container maxWidth="sm">

                    {/* DashboardSettingTabs */}
                    <div className="DashboardSettingTabs WebsiteSettingPage">
                        <div className="Pending">
                            <div className="MoveToComplete d_flex d_justify">
                                <div className="DropDown Download">
                                </div>
                            </div>
                            <div className="Table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>SL</th>
                                            <th>Image</th>
                                            <th>Product Name</th>
                                            <th>Product Code</th>
                                            <th>Selling Price (BDT)</th>
                                            <th>Quantity</th>
                                        </tr>
                                    </thead>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={13}>
                                                <Box sx={{ width: 40 }}>
                                                    <Skeleton width="100%" height={28} />
                                                    <Skeleton width="100%" height={28} />
                                                    <Skeleton width="100%" height={28} />
                                                    <Skeleton width="100%" height={28} />
                                                    <Skeleton width="100%" height={28} />
                                                    <Skeleton width="100%" height={28} />
                                                    <Skeleton width="100%" height={28} />
                                                    <Skeleton width="100%" height={28} />
                                                    <Skeleton width="100%" height={28} />
                                                    <Skeleton width="100%" height={28} />
                                                    <Skeleton width="100%" height={28} />
                                                    <Skeleton width="100%" height={28} />
                                                </Box>
                                            </td>
                                        </tr>
                                    ) : (
                                        currentProduct.length > 0 ? <>
                                            <tbody>
                                                {productSearchValue === "" && currentProduct?.map((product, index) => {
                                                    return (
                                                        <tr key={product?.id}>
                                                            <td>{index+1+currentPage*perPage-perPage}</td>
                                                            <td>
                                                                <img src={product?.main_image} alt="" />
                                                            </td>
                                                            <td>{product?.product_name}</td>
                                                            <td>{product?.product_code}</td>
                                                            <td>{product?.price}</td>
                                                            <td>{product?.product_qty > 0 ? product?.product_qty : <span style={{ color: 'red' }}>stock out-{ product?.product_qty}</span>}</td>
                                                        </tr>
                                                    );
                                                })}
                                                {/* filter */}
                                                {productSearchValue && filterProducts?.map((product, index) => {
                                                    return (
                                                        <tr key={product?.id}>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                <img src={product?.main_image?.name} alt="" />
                                                            </td>
                                                            <td>{product?.product_name}</td>
                                                            <td>{product?.product_code}</td>
                                                            <td>{product?.price}</td>
                                                            <td>{product?.product_qty > 0 ? product?.product_qty : <span style={{ color: 'red' }}>stock out{ product?.product_qty}</span>}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </> : <tr>
                                            <td colSpan={10}>
                                                <section className="MiddleSection">
                                                    <div className="MiddleSectionContent">
                                                        <div className="img">
                                                            <img src="/images/empty.png" alt="" />
                                                        </div>
                                                        <div className="text">
                                                            <p>Not found</p>
                                                        </div>
                                                    </div>
                                                </section>
                                            </td>

                                        </tr>
                                    )}
                                </table>
                            </div>
                            <Box style={{ display: productSearchValue === "" ? "block" : "none" }}>
                                <Stack spacing={2}>
                                    <Pagination
                                        count={pageNumbers.length}
                                        variant="outlined"
                                        page={currentPage}
                                        onChange={paginate}
                                    />
                                </Stack>
                            </Box>
                        </div>
                    </div>
                </Container>
            </section>
        </>
    );
};

export default Inventory;
