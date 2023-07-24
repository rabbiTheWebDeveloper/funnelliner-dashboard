import { Box, Button, Container, Grid, Pagination, Stack } from "@mui/material";
import Modal from "@mui/material/Modal";
import Clipboard from "clipboard";
import Cookies from 'js-cookie';
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { AiOutlineLink } from "react-icons/ai";
import Select from 'react-select';
import Swal from "sweetalert2";
import { themeUrl } from "../../../constant/constant";
import useLoading from "../../../hook/useLoading";
import { useToast } from "../../../hook/useToast";
import { allThemeList, domain, getWebsiteSettings, headers, importLandingPage, importTheme } from "../../../pages/api";
import HeaderDescription from "../../Common/HeaderDescription/HeaderDescription";
import Spinner from "../../commonSection/Spinner/Spinner";
const axios = require("axios");

const LandingWebsite = () => {
    const [isLoading, startLoading, stopLoading] = useLoading();
    const showToast = useToast()
    const router = useRouter();
    const domain_request = Cookies.get('domain_request')
    // ViewPreviewModel
    const [products, setProducts] = useState([]);

    const [product_id, setProductID] = useState()

    const handleChangeItem = (e) => {
        setProductID(e.value)
    }

    const [openPreview, setOpenPreview] = useState(false);
    const [landingId, setLandingId] = useState(null);

    const handlePreview = () => setOpenPreview(true);
    const previewClose = () => setOpenPreview(false);

    // OpenSales Modal
    const [openSales, setOpenSales] = useState(false);
    const handleOpenSales = (e) => {
        setLandingId(e.target.id);
        setOpenSales(true);
    };
    const handleCloseSales = () => setOpenSales(false);
    const [landingPageTemplate, setLandingPageTemplate] = useState([]);
    const [websiteSettingData, setWebsiteSettingData] = useState({});

    //This id add for custom 
    const idsToSkip = Array.from({ length: 200 }, (_, i) => (i + 206).toString());
    useEffect(() => {
        allThemeList("landing").then((result) => {
            const filteredItems = result?.data?.data.filter(item => !idsToSkip.includes(item.name));
            setLandingPageTemplate(filteredItems);
        });
        getWebsiteSettings().then((res) => {
            setWebsiteSettingData(res?.data?.data);
        });
    }, []);

    const [pageTittle, setPageTittle] = useState();
    const [videoLink, setVideoLink] = useState("");


    const handlePageTitleChange = (e) => {
        const pageName = e.target.value;
        const page = pageName.replace(/\s/g, "-");
        setPageTittle(page.toLowerCase());
    };

    const handleVideoLink = (e) => {
        const videoLink = e.target.value;
        setVideoLink(videoLink)
    }

    const handleImportTheme = (event) => {

        if (pageTittle === undefined) {
            showToast("Page title required", "error")
            return;
        }
        else if (product_id === undefined) {
            showToast("Product required", "error")
            return;
        }
        startLoading()
        importLandingPage(pageTittle, landingId, 1, product_id, videoLink).then((res) => {
            setOpenSales(false);
            if (res.status === 200) {
                showToast('The page has been created successfully')
                importTheme("landing", landingId).then((res) => {
                    if (router.query.redierct_from) {
                        router.push("/")
                    }
                    router.push('/myLandingPage')

                });
                stopLoading()
            } else {
                stopLoading()
                Swal.fire({
                    title: "Sorry",
                    html: "The page title is already taken,<br/> Change page title and try again",
                    icon: "error",
                    confirmButtonText: "ok",
                });
            }
        });
    };
    const [mas, setMas] = useState("");

    const textToCopy = domain_request !== null ? `${themeUrl}/${domain}/p/` : `https://funnelliner.com/${domain}/p/${pageTittle}`;

    const handleCopyToClick = () => {
        const clipboard = new Clipboard(".SocialLink", {
            text: () => textToCopy,
        });

        clipboard.on("success", (e) => {
            setMas("Copied to Link!");
            e.clearSelection();
        });
        clipboard.on("error", (e) => {
        });
    };

    //product fetching and add with theme
    useEffect(() => {
        axios
            .get(process.env.API_URL + "/client/products", { headers: headers })
            .then(function (response) {
                if (response?.status === 200) {
                    setProducts(response.data.data);
                }
            })
            .catch(error => {

            })
    }, []);

    let options = products.length === 0 ? [] : products?.map(function (item) {
        return { value: item.id, label: item.product_name, };
    })

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(6);
    const indexOfLastProducts = currentPage * perPage;
    const indexOfFirstProducts = indexOfLastProducts - perPage;
    const currentProduct = landingPageTemplate?.slice(
        indexOfFirstProducts,
        indexOfLastProducts
    );

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(landingPageTemplate.length / perPage); i++) {
        pageNumbers.push(i);
    }

    const paginate = (pageNumber, value) => setCurrentPage(value);

    const handlePaginationClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <section className="LandingWebsite">

                {/* header */}
                <HeaderDescription headerIcon={'flaticon-web-design'} title={'Landing Page Template'} subTitle={'choose your theme here and customize as you want'} search={false}></HeaderDescription>

                <Container maxWidth="sm">

                    <Grid Container spacing={3}>

                        {/* LandingWebsite */}
                        <div className="LandingWebsiteContent">

                            <Grid container spacing={3}>
                                {/* item */}
                                {currentProduct?.map((item, index) => {
                                    return (
                                        <Grid item xs={12} sm={6} md={4} key={index}>
                                            <div className="LandingWebsiteItem boxShadow">
                                                <div className="img">
                                                    <img src={item?.media?.name} alt="" />
                                                    <h4>{item?.theme_name + "-" + item.name}</h4>
                                                </div>

                                                <div className="DuelButton d_flex d_justify">

                                                    <div className='left'>
                                                        <Link href={item?.url} target="_blank">
                                                            <Button>
                                                                Preview
                                                                {/* <a target="_blank" href={item?.url}
                                                                    rel="noopener noreferrer"> Preview</a> */}
                                                            </Button>
                                                        </Link>


                                                        <Modal
                                                            open={openPreview}
                                                            onClose={previewClose}
                                                            aria-labelledby='modal-modal-title'
                                                            aria-describedby='modal-modal-description'
                                                        >
                                                            <Box>
                                                                <div className='InvoiceModal'>
                                                                    <img src={item?.media?.name} alt='' />
                                                                </div>
                                                            </Box>
                                                        </Modal>
                                                    </div>

                                                    <div className="right">
                                                        <Button
                                                            id={item.id}
                                                            className="ModalBtn"
                                                            onClick={handleOpenSales}
                                                        >
                                                            Import
                                                        </Button>

                                                        {/* modal */}
                                                        {
                                                            landingId == item.id && <Modal
                                                                open={openSales}
                                                                onClose={handleCloseSales}
                                                                aria-labelledby="modal-modal-title"
                                                                aria-describedby="modal-modal-description"
                                                                className='viewModal'
                                                            >
                                                                <Box className='modalBox'>
                                                                    <div className='modalContent'>

                                                                        <div className='header'>
                                                                            <div className='left'>
                                                                                <i className="flaticon-view"></i>
                                                                                <h4>Add Page</h4>
                                                                                {/* <p>Add pages for your website</p> */}
                                                                            </div>

                                                                            <div className='right' onClick={handleCloseSales}>
                                                                                <i className="flaticon-cancel"></i>
                                                                            </div>

                                                                        </div>


                                                                        <div className="Form">
                                                                            <div className="customInput">
                                                                                <label>Page Title</label>
                                                                                <input type="text" onChange={handlePageTitleChange} />
                                                                            </div>

                                                                            <div className="customInput">
                                                                                <p className="PageLink">
                                                                                    Page Link:{" "}
                                                                                    <Link
                                                                                        href=""

                                                                                        className="SocialLink"
                                                                                        alt="Copy to clipboard"
                                                                                    >
                                                                                        {textToCopy}

                                                                                        {pageTittle}
                                                                                        <AiOutlineLink
                                                                                            onClick={handleCopyToClick}
                                                                                        />{" "}
                                                                                    </Link>
                                                                                    <p>{mas}</p>
                                                                                </p>
                                                                                <div className="customInput">
                                                                                    <label>
                                                                                        Product Name <span>*</span>
                                                                                    </label>
                                                                                    <div className="Dropdown">
                                                                                        {

                                                                                            products.length > 0 ?

                                                                                                <Select
                                                                                                    options={options}
                                                                                                    onChange={handleChangeItem} /> :
                                                                                                <div className="text">
                                                                                                    <Button>
                                                                                                        <Link
                                                                                                            href='/add-product'>Add
                                                                                                            Products</Link>
                                                                                                    </Button>
                                                                                                </div>
                                                                                        }
                                                                                    </div>
                                                                                </div>

                                                                                <div className="duelButton">
                                                                                    {
                                                                                        isLoading ? <><Button type="submit" className="One" disabled id={item.id}><Spinner />Publish</Button></> : <Button onClick={handleImportTheme}
                                                                                            id={item.id} type="submit" className="One">
                                                                                            Publish</Button>
                                                                                    }
                                                                                    {/* <Button disabled={isLoading} onClick={handleImportTheme}
                                                                                    id={item.id} type="submit">
                                                                                    {isLoading && <Spinner />}Publish</Button> */}
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Box>
                                                            </Modal>
                                                        }

                                                    </div>

                                                </div>

                                            </div>

                                        </Grid>
                                    );
                                })}
                            </Grid>

                            <div>
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
                                            onClick={handlePaginationClick}
                                        />
                                    </Stack>
                                </Box>
                            </div>
                        </div>

                    </Grid>

                </Container>
            </section>
        </>
    );
};

export default LandingWebsite;
