/* eslint-disable no-restricted-syntax */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { Alert, Grid, Box, TextField, Slider, Typography, MenuItem } from '@mui/material';
import { PrimaryButton } from '../../../MaterialUiConfig/styled';
import { useAddNewProductMutation } from '../../../redux/api/adminApiSlice';
import { setToast } from '../../../redux/reducers/toastSlice';

function ProductForm({ categories, brands, close }) {
  const [formError, setFormError] = useState('');
  const [text, setText] = useState('Add Product');
  const dispatch = useDispatch();
  const SUPPORTED_FORMATS = ['image/jpg', 'image/jpeg', 'image/png', 'image/webp'];
  const schema = yup.object().shape({
    name: yup
      .string()
      .required('Please provide the product name ')
      .min(3, 'Product Name must be atleast 3 character'),
    price: yup
      .number('Product Price must be a number')
      .required('Please provide price of the product ')
      .typeError('Product Price must be a number'),
    discount: yup
      .number()
      .required('Discount is required')
      .typeError('Discount must be a number')
      .max(100),
    details: yup.string().required('Please provide Product details ').min(10),
    keyFeatures: yup.string().required('Please provide Key features of the product').min(10),
    description: yup.string().required('Please Provide description of the product').min(10),
    stock: yup.number().required().typeError('Stock must be a number'),
    rating: yup.number().required().typeError('Rating must be a number'),
    images: yup
      .mixed()
      .typeError('Please select a valid image')
      .test('fileType', 'Selected file is not an image', (value) => Object.entries(value).every((img) => SUPPORTED_FORMATS.includes(img[1].type)))
      .test('required', 'Please select 4 images', (value) => value.length === 4)
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
  const onSubmitHandler = async (data) => {
    if (!isLoading) {
      const form = new FormData();
      for (const key of Object.keys(data)) {
        if (key === 'images') {
          Object.values(data.images).forEach((img) => form.append('images', img));
        } else {
          form.append(key, data[key]);
        }
      }

      try {
        setFormError('');
        setText('Adding...');
        const res = await addNewProduct(form).unwrap();
        dispatch(setToast({ data: res, open: true }));
        close();

        console.log(res);
      } catch (err) {
        setText('Add Product');
        setFormError(err.data.message);
      }
    }
  };
  return (
    <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmitHandler)}>
      {formError && (
        <Alert sx={{ mb: 5, textAlign: 'center' }} severity="error">
          {formError}!
        </Alert>
      )}
      <Grid container spacing={4}>
        <Grid item xs={6}>
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
        <Grid item xs={6}>
          <TextField
            sx={{ mb: 2 }}
            label="Brand Name"
            name="brandId"
            select
            fullWidth
            required
            value={brands[0]._id.toString()}
            type="text"
            error={!!errors.brandId}
            helperText={errors.brandId ? errors.brandId.message : ''}
            {...register('brandId')}
          >
            {brands.map((brand) => (
              <MenuItem key={brand.name} value={brand._id.toString()}>
                {brand.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <TextField
            sx={{ mb: 2 }}
            label="Category"
            select
            fullWidth
            required
            value={categories[0]._id.toString()}
            name="categoryId"
            type="text"
            error={!!errors.categoryId}
            helperText={errors.categoryId ? errors.categoryId.message : ''}
            {...register('categoryId')}
          >
            {categories.map((category) => (
              <MenuItem key={category.name} value={category._id.toString()}>
                {category.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
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

        <Grid item xs={6}>
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

        <Grid item xs={6}>
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
        <Grid item xs={6}>
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
        <Grid item xs={6}>
          <TextField
            sx={{ mb: 2 }}
            label="Product Discount Percentage"
            name="discount"
            fullWidth
            required
            type="number"
            error={!!errors.discount}
            helperText={errors.discount ? errors.discount.message : ''}
            {...register('discount')}
          />
        </Grid>
        <Grid item xs={6}>
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

        <Grid item xs={6}>
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
      </Grid>

      <TextField
        sx={{ mb: 2 }}
        inputProps={{
          multiple: true
        }}
        accept=".jpg, .jpeg, .png"
        name="images"
        fullWidth
        required
        type="file"
        error={!!errors.images}
        helperText={errors.images ? errors.images.message : ''}
        {...register('images')}
      />

      <PrimaryButton sx={{ width: '200px', mx: 'auto', p: 1, display: 'block' }} type="submit">
        {text}
      </PrimaryButton>
    </Box>
  );
}

export default ProductForm;
