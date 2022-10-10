/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-restricted-syntax */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { Alert, Grid, Box, TextField, Slider, Typography, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { PrimaryButton } from '../../../../MaterialUiConfig/styled';
import { useAddNewProductMutation } from '../../../../redux/api/adminApiSlice';
import { setToast } from '../../../../redux/reducers/toastSlice';
import CropImage from '../../Crop/CropImage';

function ProductForm({ categories, brands }) {
  const [formError, setFormError] = useState('');
  const [imageError, setImageError] = useState('');
  const [images, setImages] = useState();
  const [openCrop, setOpenCrop] = useState(false);
  const [photoURL, setPhotoURL] = useState({});
  const [text, setText] = useState('Add Product');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];

  const schema = yup.object().shape({
    name: yup
      .string()
      .required('Please enter the product name ')
      .min(3, 'Product Name must be atleast 3 character'),
    price: yup
      .number('Product Price must be a number')
      .required('Please enter price of the product ')
      .min(100, 'Product price must be atleast 100')
      .typeError('Product Price must be a number'),
    details: yup
      .string()
      .required('Please enter product details ')
      .min(10, 'Product details must be atleast 10 characters'),
    categoryId: yup.string().required('Please select a Category '),
    brandId: yup.string().required('Please select a Brand '),
    keyFeatures: yup
      .string()
      .required('Please enter Key features of the product')
      .min(10, 'Product key features must be atleast 10 characters'),
    description: yup
      .string()
      .required('Please enter description of the product')
      .min(10, 'Product discription must be atleast 10 characters'),
    stock: yup
      .number()
      .required()
      .typeError('Stock must be a number')
      .positive('Stock must be a positive value'),
    rating: yup.number().required().typeError('Rating must be a number')
  });
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });
  const [addNewProduct, { isLoading }] = useAddNewProductMutation();

  const handleToggleCrop = () => {
    setOpenCrop((_current) => !_current);
  };

  const handleCropImage = (url, index, name, type) => {
    setPhotoURL({ url, index, name, type });
    handleToggleCrop();
  };

  const checkValidImage = (files) => {
    if (!files) {
      setImageError('Please select 4 images');
      return false;
    }
    const result = Object.values(files).every((img) => SUPPORTED_FORMATS.includes(img.type));
    if (!result) {
      setImageError('Please select a valid image');
      return false;
    }
    if (Object.values(files).length !== 4) {
      setImageError('Please select 4 images');
      return false;
    }
    setImageError('');
    return true;
  };

  const handleImageChange = (e) => {
    const { files } = e.target;
    checkValidImage(files);
    setImages(e.target.files);
  };

  const onSubmitHandler = async (data) => {
    if (!checkValidImage(images)) {
      return;
    }
    if (!isLoading) {
      const form = new FormData();
      for (const key of Object.keys(data)) {
        form.append(key, data[key]);
      }
      Object.values(images).forEach((img) => form.append('images', img));
      try {
        setFormError('');
        setText('Adding...');
        const res = await addNewProduct(form).unwrap();
        dispatch(setToast({ data: res, open: true }));
        navigate('/admin/products');
        setText('Add Product');
      } catch (err) {
        setText('Add Product');
        setFormError(err.data.message);
      }
    }
  };
  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(onSubmitHandler)}
    >
      <Typography
        variant="h5"
        textAlign="center"
        sx={{ mb: 5 }}
      >
        Add New Product
      </Typography>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          xs={6}
        >
          <TextField
            sx={{ mb: 2 }}
            label="Product Name"
            fullWidth
            required
            type="text"
            error={!!errors.name}
            helperText={errors.name ? errors.name.message : ''}
            {...register('name')}
          />
        </Grid>
        <Grid
          item
          xs={6}
        >
          <TextField
            sx={{ mb: 2 }}
            label="Select Brand Name"
            name="brandId"
            select
            fullWidth
            required
            defaultValue={brands[0]._id.toString()}
            type="text"
            error={!!errors.brandId}
            helperText={errors.brandId ? errors.brandId.message : ''}
            {...register('brandId')}
          >
            {brands?.map((brand) => (
              <MenuItem
                key={brand.name}
                value={`${brand._id}`}
              >
                {brand.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid
          item
          xs={6}
        >
          <TextField
            sx={{ mb: 2 }}
            label="Select Category"
            select
            fullWidth
            defaultValue={categories[0]._id.toString()}
            required
            name="categoryId"
            type="text"
            error={!!errors.categoryId}
            helperText={errors.categoryId ? errors.categoryId.message : ''}
            {...register('categoryId')}
          >
            {categories.map((category) => (
              <MenuItem
                selected
                key={category.name}
                value={category._id.toString()}
              >
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid
          item
          xs={6}
        >
          <TextField
            sx={{ mb: 2 }}
            label="Product Details"
            fullWidth
            required
            multiline
            maxRows={4}
            name="details"
            type="text"
            error={!!errors.details}
            helperText={errors.details ? errors.details.message : ''}
            {...register('details')}
          />
        </Grid>

        <Grid
          item
          xs={6}
        >
          <TextField
            sx={{ mb: 2 }}
            label="Key Features"
            name="keyFeatures"
            fullWidth
            multiline
            maxRows={4}
            required
            type="text"
            error={!!errors.keyFeatures}
            helperText={errors.keyFeatures ? errors.keyFeatures.message : ''}
            {...register('keyFeatures')}
          />
        </Grid>

        <Grid
          item
          xs={6}
        >
          <TextField
            sx={{ mb: 2 }}
            label="Product Description"
            fullWidth
            multiline
            maxRows={4}
            required
            name="description"
            type="text"
            error={!!errors.description}
            helperText={errors.description ? errors.description.message : ''}
            {...register('description')}
          />
        </Grid>
        <Grid
          item
          xs={6}
        >
          <TextField
            sx={{ mb: 2 }}
            label="Price"
            fullWidth
            required
            name="price"
            type="number"
            error={!!errors.price}
            helperText={errors.price ? errors.price.message : ''}
            {...register('price')}
          />
        </Grid>
        <Grid
          item
          xs={6}
        >
          <TextField
            sx={{ mb: 2 }}
            label="Product Stock"
            name="stock"
            fullWidth
            required
            type="number"
            error={!!errors.stock}
            helperText={errors.stock ? errors.stock.message : ''}
            {...register('stock')}
          />
        </Grid>

        <Grid
          item
          xs={6}
        >
          <Typography variant="subtitle1">Rating</Typography>
          <Slider
            sx={{ width: '50%' }}
            aria-label="Always visible"
            defaultValue={3}
            min={1}
            max={5}
            name="rating"
            valueLabelDisplay="auto"
            {...register('rating')}
          />
        </Grid>
        <Grid
          item
          xs={6}
        >
          <TextField
            sx={{ mb: 2 }}
            inputProps={{
              multiple: true,
              accept: '.jpg, .jpeg, .png'
            }}
            name="images"
            fullWidth
            required
            type="file"
            files={images}
            error={!!imageError}
            helperText={imageError ?? ''}
            onChange={handleImageChange}
          />
        </Grid>
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        {images
          && Object.entries(images ?? {}).map(([i, file]) => (
            <Box
              key={file.name}
              component="img"
              width="100px"
              height="100px"
              src={URL.createObjectURL(file)}
              alt="name"
              onClick={() => handleCropImage(URL.createObjectURL(file), i, file.name, file.type)}
              sx={{
                cursor: 'pointer'
              }}
            />
          ))}
      </Box>
      {images && (
        <Typography
          textAlign="center"
          variant="subtitle2"
          sx={{ opacity: '0.2', mt: 2 }}
        >
          Click on the image to crop the image
        </Typography>
      )}
      {formError && (
        <Alert
          sx={{ mb: 5, textAlign: 'center' }}
          severity="error"
        >
          {formError}!
        </Alert>
      )}
      <PrimaryButton
        sx={{ width: '200px', mx: 'auto', p: 1, display: 'block' }}
        type="submit"
      >
        {text}
      </PrimaryButton>
      {openCrop && (
        <CropImage
          {...{
            photoURL: photoURL.url,
            index: photoURL.index,
            fileName: photoURL.name,
            type: photoURL.type,
            handleToggleCrop,
            setImages,
            openCrop
          }}
        />
      )}
    </Box>
  );
}

export default ProductForm;
