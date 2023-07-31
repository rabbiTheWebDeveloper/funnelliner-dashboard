import { Box, Button, Container, Pagination, Stack } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment/moment";
import Link from "next/link";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { useToast } from "../../../hook/useToast";
import { headers } from "../../../pages/api";
import { useGetCategoryQuery } from "../../../redux/features/category/categoryApi";
import HeaderDescription from "../../Common/HeaderDescription/HeaderDescription";
import ShowCategory from "./ShowCategory";
import UpdateCategory from "./UpdateCategory";
import SmallLoader from "../../SmallLoader/SmallLoader";


const SubProduct = () => {
    const showToast = useToast()
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);



    // handleClick Move To Completed
    const [anchorEl, setAnchorEl] = useState(null);



    const hanldeFetchCategories = () => {
        axios.get(process.env.API_URL + "/client/categories", { headers: headers })
            .then(function (response) {
                let allProduct = response.data.data;
                setProducts(allProduct);
                setIsLoading(false);

            })
            .catch(function (error) {
                if (error.response.data.api_status === "401") {
                    window.location.href = "/login"
                    Cookies.remove("token");
                    localStorage.clear("token");
                    Cookies.remove("user");
                    localStorage.clear("user");

                    window.location.href = "/login"
                }
            });
    }

    useEffect(() => {
        hanldeFetchCategories()
    }, []);

    const [isPageLoader, setIsPageLoader] = useState(false)
    const deleteProduct = (id) => {
        Swal.fire({
            text: "Are you sure you want to delete?",
            iconHtml: '<img src="/images/delete.png">',
            customClass: {
                icon: 'no-border',
            },
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#894bca",
            confirmButtonText: "Yes, delete",
        }).then((result) => {
            if (result.isConfirmed) {
                setIsPageLoader(true)
                axios
                    .delete(process.env.API_URL + "/client/categories/" + id, { headers: headers })
                    .then(function (result) {
                        // handle success
                        if (result) {
                            setProducts((pd) => {
                                const filter = products.filter((prod) => {
                                    return prod.id !== id;
                                });
                                showToast("Category has been deleted.")
                                return [...filter];
                                
                            });
                        }
                        setIsPageLoader(false)
                    }).catch((err) => {
                        setIsPageLoader(false)

                    });
            }
        });
    };

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

    const paginate = (pageNumber, value) => {
        setCurrentPage(value)
    };

    return (
        <>
            <section className="TopSellingProducts DashboardSetting Order">

                {
                    isPageLoader && <SmallLoader />
                }

                {/* header */}
                <HeaderDescription headerIcon={'flaticon-order-delivery'} title={'Category'} subTitle={'Shop Category List'} search={false}></HeaderDescription>

                <Container maxWidth="sm">

                    {/* DashboardSettingTabs */}
                    <div className="DashboardSettingTabs WebsiteSettingPage">
                        <div className="Pending">
                            <div className="MoveToComplete d_flex d_justify">
                                <div className="DropDown"></div>

                                <Link href="/add-category" className="CreateNewBtn">
                                    <i className="flaticon-plus"></i> Add Category
                                </Link>
                            </div>

                            <div className="Table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>
                                                SL
                                            </th>
                                            <th>Image</th>
                                            <th>Category Name</th>
                                            <th>Added On</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={13}>
                                                <Box sx={{ width: 40 }}>
                                                    <Skeleton width={1570} height={28} />
                                                    <Skeleton width={1570} height={28} />
                                                    <Skeleton width={1570} height={28} />
                                                    <Skeleton width={1570} height={28} />
                                                    <Skeleton width={1570} height={28} />
                                                    <Skeleton width={1570} height={28} />
                                                    <Skeleton width={1570} height={28} />
                                                    <Skeleton width={1570} height={28} />
                                                    <Skeleton width={1570} height={28} />
                                                    <Skeleton width={1570} height={28} />
                                                    <Skeleton width={1570} height={28} />
                                                    <Skeleton width={1570} height={28} />
                                                </Box>
                                            </td>
                                        </tr>
                                    ) : (
                                        currentProduct.length > 0 ?
                                            <tbody>
                                                {currentProduct?.map((product, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                {index + 1 + currentPage * perPage - perPage}
                                                            </td>
                                                            <td>
                                                                <img src={product?.category_image?.name} alt="" />
                                                            </td>
                                                            <td>{product?.name}</td>

                                                            {/* <td>0123456</td>
                                                    <td>7529</td>
                                                    <td>300</td>  */}
                                                            <td>

                                                                {moment(product?.created_at).format('LL')}

                                                            </td>

                                                            <td>

                                                                <div className="action">

                                                                    <ShowCategory id={product.id}></ShowCategory>
                                                                    {/* <Button className='viewActionBtn'>
                                                                        <ShowCategory id={product.id}></ShowCategory>
                                                                    </Button> */}
                                                                    <UpdateCategory id={product.id}></UpdateCategory>
                                                                    {/* <Button className='updateActionBtn'>
                                                                        <UpdateCategory id={product.id}></UpdateCategory>
                                                                    </Button> */}

                                                                    <Button className='deleteActionBtn' onClick={() => deleteProduct(product.id)}>
                                                                        <i className="flaticon-trash"></i>
                                                                    </Button>

                                                                </div>

                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                            :
                                            <tr>
                                                <td colSpan={10}>
                                                    <section className="MiddleSection">
                                                        <div className="MiddleSectionContent">
                                                            <div className="img">
                                                                <img src="/images/empty.png" alt="" />
                                                            </div>

                                                            <div className="text">
                                                                <p>Not Found</p>

                                                                <Link
                                                                    href='/add-category'>Add
                                                                    Category</Link>

                                                                {/* <p>OR</p> */}

                                                                {/* <Link href='https://dashboard.funnelliner.com/landing-page'>Add New Page</Link> */}
                                                            </div>
                                                        </div>
                                                    </section>
                                                </td>
                                            </tr>
                                    )}
                                </table>
                            </div>

                            <Box
                                sx={{
                                    margin: "auto",
                                    width: "fit-content",
                                    alignItems: "center",
                                }}
                            >
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

export default SubProduct;
