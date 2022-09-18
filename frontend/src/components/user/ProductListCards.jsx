import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea, Grid, Rating } from '@mui/material';
import { Link } from 'react-router-dom';

export default function ProductListCards({ products }) {
  return (
    <Grid container rowSpacing={3} columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
      {products.map((product) => (
        <Grid key={product._id} item xs={6} sm={4} md={4} lg={3} xl={3}>
          <Link to={`/product/${product._id}`} className="text-link">
            <Card
              elevation={0}
              sx={{
                maxWidth: 300,
                height: { xs: 240, lg: 250 }
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
                  sx={{ height: { xs: 130, lg: 150 } }}
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
                  <Typography gutterBottom variant="subtitle2" component="div">
                    {product.name}
                  </Typography>

                  <Box
                    sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Typography
                      gutterBottom
                      variant="subtitle"
                      sx={{ color: '#000', opacity: 1, fontWeight: '550', fontSize: '15px' }}
                      component="div"
                    >
                      {`₹${product.discountedPrice}`}
                    </Typography>
                    <Typography
                      gutterBottom
                      sx={{ textDecoration: 'line-through', opacity: 0.5 }}
                      variant="subtitle"
                      component="div"
                    >
                      {`₹${product.price}`}
                    </Typography>
                    <Typography
                      gutterBottom
                      sx={{ color: 'green', opacity: 0.8 }}
                      variant="subtitle"
                      component="div"
                    >
                      {`(${product.discount}% off )`}
                    </Typography>
                  </Box>

                  <Rating
                    sx={{ fontSize: '18px' }}
                    name="read-only"
                    value={product.rating}
                    readOnly
                  />
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
}
