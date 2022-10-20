import Card from '@mui/material/Card';
import StarIcon from '@mui/icons-material/Star';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, Button, CardActionArea, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

export default function ProductListCards({ products }) {
  return (
    <Grid
      container
      rowSpacing={4}
      columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4 }}
      sx={{ alignItems: 'center', justifyContent: 'center' }}
    >
      {products.map((product) => (
        <Grid
          key={product._id}
          item
          xs={6}
          sm={6}
          md={6}
          lg={3}
          xl={3}
          align="center"
        >
          <Link
            to={`/product/${product._id}`}
            className="text-link"
          >
            <Card
              elevation={0}
              sx={{
                maxWidth: { xs: 300, lg: 300 },
                minHeight: { xs: 150, lg: 240 }
              }}
            >
              <CardActionArea
                component="div"
                sx={{
                  '&:hover': {
                    transform: 'scale(1.04)',
                    transition: 'all 200ms ease-in-out'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="130"
                  sx={{ height: { xs: 150, lg: 150 }, objectFit: 'contain' }}
                  image={`${product.images[0].imgUrl}`}
                  alt={product.name}
                />
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Typography
                    gutterBottom
                    variant="subtitle1"
                    component="span"
                    sx={{
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {product.name}
                  </Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ pointerEvents: 'none', minWidth: '40px', p: 0, m: 0, px: 1, mb: 1 }}
                    endIcon={<StarIcon sx={{ width: 15, m: 0 }} />}
                  >
                    {product.rating}
                  </Button>
                  <Box
                    sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Typography
                      gutterBottom
                      variant="h6"
                      sx={{ color: '#000', fontSize: '1.01rem' }}
                    >
                      {`₹${product.discountedPrice.toLocaleString()}`}
                    </Typography>
                    {product?.discountedPrice < product?.price && (
                      <>
                        <Typography
                          gutterBottom
                          sx={{ textDecoration: 'line-through', opacity: 0.5, fontSize: 13 }}
                          variant="subtitle"
                        >
                          {`₹${product.price.toLocaleString()}`}
                        </Typography>
                        <Typography
                          gutterBottom
                          sx={{
                            color: 'green',
                            opacity: 0.8,
                            display: { xs: 'none', md: 'block' }
                          }}
                          variant="caption"
                        >
                          {`(${product.discount}% off )`}
                        </Typography>
                      </>
                    )}
                  </Box>

                  {/* <Rating
                    sx={{ fontSize: '18px', color: '#000' }}
                    name="read-only"
                    value={product.rating}
                    readOnly
                  /> */}
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
}
