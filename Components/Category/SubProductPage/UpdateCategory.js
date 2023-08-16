import { Box, Button, Modal } from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { headers } from "../../../pages/api";

import style from "./style.module.css";
import { useToast } from "../../../hook/useToast";
import { API_ENDPOINTS } from "../../../config/ApiEndpoints";

const UpdateCategory = ({ id, isOpen, closePopup, hanldeFetchCategories }) => {
  const showToast = useToast();
  const [products, setProducts] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
    },
  });

  const onCategorySubmit = (data) => {
    const formData = new FormData();
    if (selectedImage?.size > 1024 * 1024) {
      showToast("Image size is too big!", 'error')
      return;
  }
    if (selectedImage) {
      formData.append("category_image", selectedImage);
    }
    formData.append("name", data.name);
    formData.append("_method", "patch");
    axios
      .post(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CATEGORY.UPDATE_CATEGORY}/` +
        id,
        formData,
        {
          headers: headers,
        }
      )
      .then(function (response) {
        showToast("Category Update Successfully");
        hanldeFetchCategories();
        closePopup();
      })
      .catch(function (error) {
        showToast("Something went wrong!", "error");
        closePopup();
      });

    reset();
  };

  const fetchSingleCategory = useCallback(async () => {
    await axios
      .get(`${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.CATEGORY.GET_CATEGORY}/` + id, {
        headers: headers,
      })
      .then(function (response) {
        let allProduct = response.data.data;
        setValue("name", response?.data?.data?.name)
        setProducts(allProduct);
      });
  }, [id]);

  useEffect(() => {
    fetchSingleCategory()
  }, [fetchSingleCategory]);

  useEffect(() => {
    if (selectedImage) {
      setImageUrl(URL.createObjectURL(selectedImage));
    }
  }, [selectedImage]);

  return (
    <div>

      <Modal
        open={isOpen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="updateModal"
      >
        <Box className="modalBox">
          <div className="modalContent">
            <div className="header">
              <div className="left">
                <i className="flaticon-edit"></i>
                <h4>Update Your Category</h4>
              </div>

              <div className="right" onClick={closePopup}>
                <i className="flaticon-cancel"></i>
              </div>
            </div>

            <form onSubmit={handleSubmit(onCategorySubmit)}>
              <div className="updateModalForm">
                <div className="customInput">
                  <label>
                    Category Name <span>*</span>
                  </label>
                  <input
                    type="text"
                    {...register("name", { required: true })}
                    placeholder="Category Name"
                  />
                </div>

                <div className="customInput">
                  <label>
                    Category Image (Max size 1 MB)
                  </label>
                  {/* <p className={style.ImageUploadSize}><span>Image Type:</span> png, jpg, jpeg <span>Image Size:</span>Width: 500px, Height: 500px</p> */}

                  <div className={style.imgUploader}>
                    <input
                      accept="image/*"
                      type="file"
                      id="select-image"
                      style={{ display: "none" }}
                      onChange={(e) => setSelectedImage(e.target.files[0])}
                    />
                    <label htmlFor="select-image">
                      <Button
                        className={style.SelectImgButton}
                        variant="contained"
                        color="primary"
                        component="span"
                      >
                        Upload Image
                      </Button>
                    </label>

                    {imageUrl && selectedImage && (
                      <Box mt={2} textAlign="center">
                        <h6>Image Preview:</h6>
                        <img
                          src={imageUrl}
                          alt={selectedImage.name}
                          height="100px"
                        />
                      </Box>
                    )}

                    {imageUrl && selectedImage ? (
                      ""
                    ) : (
                      <Box mt={2} textAlign="center">
                        <h6>Image Preview:</h6>
                        <img
                          src={products?.category_image}
                          alt={products?.category_image}
                          height="100px"
                        />
                      </Box>
                    )}
                  </div>
                </div>
              </div>

              <div className="duelButton">
                <Button type="submit">Update</Button>
                {/* <Button type="reset" className="red">Reset</Button> */}
              </div>
            </form>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default UpdateCategory;
