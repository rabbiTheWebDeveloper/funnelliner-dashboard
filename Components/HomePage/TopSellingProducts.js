import { Container, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { topSellingProducts } from "../../pages/api";
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import HeaderDescription from "../Common/HeaderDescription/HeaderDescription";

const TopSellingProducts = () => {
    const [TopSellingProducts, setTopSellingProduct] = useState([]);
    useEffect(() => {
        topSellingProducts().then((result) => {
            setTopSellingProduct(result?.data?.data);
        });
    }, []);

    // Dropdown
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
 

    return (

        <>

            {/* <section className='TopSellingProducts'>

                <HeaderDescription headerIcon={'flaticon-order-1'} title={`Top Selling Products ${TopSellingProducts?.length}`} subTitle={'Your Best Selling Products Of Your Shop'} search={false}></HeaderDescription>

                <Container maxWidth='sm'>

                    <div className='TopSellingContent'>
                        <Grid container spacing={3}>
                            {TopSellingProducts?.map((item, index) => {
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={index}>
                                        <div className='TopSellingItem boxShadow'>
                                            <h5>{item?.product_name}</h5>


                                            <div className='Product d_flex'>
                                                <div className='img'>
                                                    <img src={item?.product_main_image ?? '/images/placeholder.png'} alt='' />
                                                </div>

                                                <div className='text'>
                                                    <ul>
                                                        <li>
                                                            Total Sold: <span className='bg'>{item?.total}</span>
                                                        </li>
                                                        <li>
                                                            Available Stock: <span>{item?.product_qty < 0 ? <span style={{ color: 'red' }}>stock out</span>: item?.product_qty}</span>
                                                        </li>
                                                    
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </div>
                </Container>
            </section> */}

            <div className="TopSelling boxShadow">

                {/* header */}
                <div className="Header d_flex d_justify">

                    <div className="left">
                        <h4>Top Selling Products </h4>
                    </div>

                </div>

                <div className="TopSellingBox">

                    {TopSellingProducts?.map((item, index) => {
                        return (
                            <div className="TopSellingContent">

                                {/* item */}
                                <div className="item">

                                    <div className="img d_flex">
                                        <img src={item?.product_main_image ?? '/images/placeholder.png'} alt="" />
                                        <p>{item?.product_name}</p>
                                    </div>

                                </div>

                                {/* item */}
                                {/* <div className="item">
                                    <h4> <i className="flaticon-taka"></i> 34,35465.00</h4>
                                </div> */}

                                {/* item */}
                                <div className="item">
                                    <h6>Total Sold</h6>
                                    <span>{item?.total}</span>
                                </div>

                                {/* item */}
                                <div className="item">
                                    <h6>Available Stock</h6>
                                    <span>{item?.product_qty < 0 ? <span style={{ color: 'red' }}>stock out</span>: item?.product_qty}</span>
                                </div>

                            </div>

                        )
                    })}

                


               

                </div>

            </div>

        </>
    );
};

export default TopSellingProducts;
