import { Box, Button, Container, Grid } from "@mui/material";
import Modal from "@mui/material/Modal";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import HeaderDescription from "../../../Components/Common/HeaderDescription/HeaderDescription";
import { allThemeList, importTheme } from "../../../pages/api";
import { useToast } from "../../../hook/useToast";
import SmallLoader from "../../SmallLoader/SmallLoader";

const MultiWebsite = () => {
    const showToast = useToast()
    const router = useRouter()
    // ViewPreviewModel
    const [openPreview, setOpenPreview] = useState(false);
    const handlePreview = () => setOpenPreview(true);
    const previewClose = () => setOpenPreview(false);

    const [multiPageTemplate, setMultiPageTemplate] = useState([]);
    useEffect(() => {
        allThemeList("multiple").then((result) => {
            setMultiPageTemplate(result?.data?.data);
        });
    }, []);

    const handleActiveTheme = (e) => {
        Swal.fire({
            iconHtml: '<img src="/images/import_icon.png">',
            customClass: {
                icon: 'no-border',
                border: '0'
            },
            text: 'Are you sure you want to activate this theme?',
            icon: "info",
            showCancelButton: true,
            confirmButtonColor: '#894BCA',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Okey'
        }).then((result) => {
            if (result.isConfirmed) {
                const themeId = e.target.id;
                importTheme("multiple", themeId).then((res) => {
                    if (res.status === 200) {
                        showToast("Theme activate successfully")
                        if (router.query.redirect_from === "panel3") {
                            router.push("/?current_steap=panel4")
                        }
                    } else {
                        showToast("Something went wrong", "error")
                    }
                });

            }
        })
    };

    return (
        <>
            <section className='LandingWebsite'>
                {multiPageTemplate.length === 0 && <SmallLoader />}
                {/* header */}
                <HeaderDescription headerIcon={'flaticon-website-design'} title={'Multiple Page Template'} subTitle={'choose your theme here and customize as you want'} search={false} />

                <Container maxWidth='sm'>

                    <Grid Container spacing={3}>

                        {/* LandingWebsite */}
                        <div className='LandingWebsiteContent'>

                            <Grid container spacing={3}>
                                {multiPageTemplate?.map((item, index) => {
                                    return (
                                        <Grid item key={index} xs={12} sm={6} md={4}>
                                            <div className='LandingWebsiteItem boxShadow'>
                                                <div className='img'>
                                                    <img src={item?.media} alt='' />
                                                    <h4>Multi Page</h4>
                                                </div>

                                                <div className='DuelButton d_flex d_justify'>
                                                    <div className='left'>

                                                        <a target="_blank" href={item?.url}
                                                            rel="noopener noreferrer">
                                                            <Button >Preview</Button>
                                                        </a>

                                                        <Modal
                                                            open={openPreview}
                                                            onClose={previewClose}
                                                            aria-labelledby='modal-modal-title'
                                                            aria-describedby='modal-modal-description'
                                                        >
                                                            <Box>
                                                                <div className='InvoiceModal'>
                                                                    <img src={item?.media} alt='' />
                                                                </div>
                                                            </Box>
                                                        </Modal>
                                                    </div>

                                                    <div className='right'>
                                                        <Button onClick={handleActiveTheme} Id={item.id}>
                                                            Import
                                                        </Button>
                                                    </div>
                                                </div>

                                            </div>
                                        </Grid>
                                    );
                                })}
                            </Grid>

                        </div>
                    </Grid>
                </Container>
            </section>
        </>
    );
};

export default MultiWebsite;
