import { useState, useEffect } from "react";
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Box,
  Alert,
  Tabs,
  Tab,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Card,
  CardContent,
  Divider
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Sync,
  ShoppingCart,
  Category,
  Store
} from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import HeaderDescription from "../Common/HeaderDescription/HeaderDescription";
import SmallLoader from "../SmallLoader/SmallLoader";
import { headers } from "../../pages/api";
import { API_ENDPOINTS } from "../../config/ApiEndpoints";

const Woocommerce = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [openWoo, setOpenWoo] = useState(false);
  const [showSecrets, setShowSecrets] = useState({
    storeUrl: false,
    consumerKey: false,
    consumerSecret: false
  });
  const [syncStatus, setSyncStatus] = useState({
    products: { loading: false, success: false, error: "" },
    categories: { loading: false, success: false, error: "" },
    orders: { loading: false, success: false, error: "" }
  });
  const [tabValue, setTabValue] = useState(0);
  const [message, setMessage] = useState({ text: "", type: "" });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Merchant ID from cookies
  const data = Cookies.get();
  const mainData = data?.user;
  let parseData;
  if (mainData != null) {
    parseData = JSON.parse(mainData);
  }
  const merchantId = parseData?.id;

  const wooGetAPI = `${API_ENDPOINTS.BASE_URL}/shop/woocommerce/credentials`;
  const wooPostAPI = `${API_ENDPOINTS.BASE_URL}/shop/woocommerce`;
  const wooConnectAPI = `${API_ENDPOINTS.BASE_URL}/shop/connect/woocommerce`;
  const wooProductFetchAndSyncAPI = `${API_ENDPOINTS.BASE_URL}/woocommerce/products`;
  const wooCategoryFetchAndSyncAPI = `${API_ENDPOINTS.BASE_URL}/woocommerce/category`;
  const wooOrderFetchAndSyncAPI = `${API_ENDPOINTS.BASE_URL}/woocommerce/orders`;

  // Fetch WooCommerce details
  useEffect(() => {
    let isMounted = true;
    const fetchWooData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(wooGetAPI, { headers });
        if (isMounted && res?.status && res.data.data) {
          const config = res.data.data;
          setValue("WOOCOMMERCE_STORE_URL", config.WOOCOMMERCE_STORE_URL || "");
          setValue(
            "WOOCOMMERCE_CONSUMER_KEY",
            config.WOOCOMMERCE_CONSUMER_KEY || ""
          );
          setValue(
            "WOOCOMMERCE_CONSUMER_SECRET",
            config.WOOCOMMERCE_CONSUMER_SECRET || ""
          );
          setOpenWoo(true);
        }
      } catch (error) {
        if (isMounted) console.error("Failed to fetch WooCommerce data", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    fetchWooData();
    return () => {
      isMounted = false;
    };
  }, [merchantId, headers, wooGetAPI]);

  // Submit WooCommerce details
  const handleWooSubmit = async (formData) => {
    setIsSaving(true);
    setMessage({ text: "", type: "" });
    try {
      const configData = {
        WOOCOMMERCE_STORE_URL: formData.WOOCOMMERCE_STORE_URL,
        WOOCOMMERCE_CONSUMER_KEY: formData.WOOCOMMERCE_CONSUMER_KEY,
        WOOCOMMERCE_CONSUMER_SECRET: formData.WOOCOMMERCE_CONSUMER_SECRET,
      };

      const res = await axios.post(wooPostAPI, configData, { headers });
      if (res.status === 200 || res.status === 201) {
        setMessage({ text: "WooCommerce details saved successfully!", type: "success" });
        
        // Test connection after saving
        try {
          const connectRes = await axios.get(wooConnectAPI, { headers });
          if (connectRes.status === 200) {
            setMessage({ 
              text: "WooCommerce connection tested successfully!", 
              type: "success" 
            });
          }
        } catch (connectError) {
          setMessage({ 
            text: "Credentials saved but connection test failed. Please check your details.", 
            type: "warning" 
          });
        }
      }
    } catch (error) {
      console.error("Failed to save WooCommerce details", error);
      setMessage({ 
        text: "Error saving WooCommerce details. Please try again.", 
        type: "error" 
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle sync operations
  const handleSync = async (type) => {
    setSyncStatus(prev => ({
      ...prev,
      [type]: { loading: true, success: false, error: "" }
    }));
    
    let apiUrl;
    switch (type) {
      case "products":
        apiUrl = wooProductFetchAndSyncAPI;
        break;
      case "categories":
        apiUrl = wooCategoryFetchAndSyncAPI;
        break;
      case "orders":
        apiUrl = wooOrderFetchAndSyncAPI;
        break;
      default:
        return;
    }
    
    try {
      const res = await axios.get(apiUrl, { headers });
      if (res.status === 200 || res.status === 201) {
        setSyncStatus(prev => ({
          ...prev,
          [type]: { loading: false, success: true, error: "" }
        }));
        setMessage({ 
          text: `${type.charAt(0).toUpperCase() + type.slice(1)} synchronized successfully!`, 
          type: "success" 
        });
      }
    } catch (error) {
      console.error(`Failed to sync ${type}`, error);
      setSyncStatus(prev => ({
        ...prev,
        [type]: { 
          loading: false, 
          success: false, 
          error: error.response?.data?.message || `Failed to sync ${type}` 
        }
      }));
      setMessage({ 
        text: `Error syncing ${type}. Please check your connection.`, 
        type: "error" 
      });
    }
  };

  const handleClickShowSecret = (field) => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <>
      <section style={{ padding: "20px" }}>
        {isLoading && <SmallLoader />}
        
        <HeaderDescription
          headerIcon={"flaticon-wordpress"}
          title={"WooCommerce Integration"}
          subTitle={"Connect and sync your WooCommerce store"}
          search={false}
          order={false}
        />

        <Container maxWidth="md">
          {message.text && (
            <Alert severity={message.type} sx={{ mb: 3 }}>
              {message.text}
            </Alert>
          )}

          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">
                WooCommerce Connection
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={openWoo}
                    onChange={(e) => setOpenWoo(e.target.checked)}
                    color="primary"
                  />
                }
                label={openWoo ? "Connected" : "Connect"}
              />
            </Box>

            {openWoo && (
              <form onSubmit={handleSubmit(handleWooSubmit)}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Store URL"
                      {...register("WOOCOMMERCE_STORE_URL", { required: true })}
                      type={showSecrets.storeUrl ? "text" : "password"}
                      error={!!errors.WOOCOMMERCE_STORE_URL}
                      helperText={errors.WOOCOMMERCE_STORE_URL ? "Store URL is required" : ""}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => handleClickShowSecret("storeUrl")}
                              edge="end"
                            >
                              {showSecrets.storeUrl ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Consumer Key"
                      {...register("WOOCOMMERCE_CONSUMER_KEY", { required: true })}
                      type={showSecrets.consumerKey ? "text" : "password"}
                      error={!!errors.WOOCOMMERCE_CONSUMER_KEY}
                      helperText={errors.WOOCOMMERCE_CONSUMER_KEY ? "Consumer Key is required" : ""}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => handleClickShowSecret("consumerKey")}
                              edge="end"
                            >
                              {showSecrets.consumerKey ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Consumer Secret"
                      {...register("WOOCOMMERCE_CONSUMER_SECRET", { required: true })}
                      type={showSecrets.consumerSecret ? "text" : "password"}
                      error={!!errors.WOOCOMMERCE_CONSUMER_SECRET}
                      helperText={errors.WOOCOMMERCE_CONSUMER_SECRET ? "Consumer Secret is required" : ""}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => handleClickShowSecret("consumerSecret")}
                              edge="end"
                            >
                              {showSecrets.consumerSecret ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSaving}
                      fullWidth
                      size="large"
                    >
                      {isSaving ? <CircularProgress size={24} /> : "Save Configuration"}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </Paper>

          {openWoo && (
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Synchronization
              </Typography>
              <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab icon={<Sync />} label="Sync Actions" />
                <Tab icon={<Store />} label="Connection Info" />
              </Tabs>

              {tabValue === 0 && (
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: "center" }}>
                        <Category sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
                        <Typography variant="h6" gutterBottom>
                          Categories
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Sync product categories from WooCommerce
                        </Typography>
                        <Button
                          variant="outlined"
                          onClick={() => handleSync("categories")}
                          disabled={syncStatus.categories.loading}
                          startIcon={syncStatus.categories.loading ? <CircularProgress size={16} /> : <Sync />}
                        >
                          {syncStatus.categories.loading ? "Syncing..." : "Sync Categories"}
                        </Button>
                        {syncStatus.categories.error && (
                          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                            {syncStatus.categories.error}
                          </Typography>
                        )}
                        {syncStatus.categories.success && (
                          <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                            Sync completed successfully!
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: "center" }}>
                        <ShoppingCart sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
                        <Typography variant="h6" gutterBottom>
                          Products
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Sync products from WooCommerce
                        </Typography>
                        <Button
                          variant="outlined"
                          onClick={() => handleSync("products")}
                          disabled={syncStatus.products.loading}
                          startIcon={syncStatus.products.loading ? <CircularProgress size={16} /> : <Sync />}
                        >
                          {syncStatus.products.loading ? "Syncing..." : "Sync Products"}
                        </Button>
                        {syncStatus.products.error && (
                          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                            {syncStatus.products.error}
                          </Typography>
                        )}
                        {syncStatus.products.success && (
                          <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                            Sync completed successfully!
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: "center" }}>
                        <ShoppingCart sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
                        <Typography variant="h6" gutterBottom>
                          Orders
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          Sync orders from WooCommerce
                        </Typography>
                        <Button
                          variant="outlined"
                          onClick={() => handleSync("orders")}
                          disabled={syncStatus.orders.loading}
                          startIcon={syncStatus.orders.loading ? <CircularProgress size={16} /> : <Sync />}
                        >
                          {syncStatus.orders.loading ? "Syncing..." : "Sync Orders"}
                        </Button>
                        {syncStatus.orders.error && (
                          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                            {syncStatus.orders.error}
                          </Typography>
                        )}
                        {syncStatus.orders.success && (
                          <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                            Sync completed successfully!
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {tabValue === 1 && (
                <Box>
                  <Typography variant="body1" paragraph>
                    Your WooCommerce store is successfully connected. You can now sync your products, categories, and orders.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last sync: {new Date().toLocaleString()}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      handleSync("categories");
                      handleSync("products");
                      handleSync("orders");
                    }}
                    disabled={
                      syncStatus.categories.loading ||
                      syncStatus.products.loading ||
                      syncStatus.orders.loading
                    }
                    startIcon={<Sync />}
                  >
                    Sync All
                  </Button>
                </Box>
              )}
            </Paper>
          )}
        </Container>
      </section>
    </>
  );
};

export default Woocommerce;