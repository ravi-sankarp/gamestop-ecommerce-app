import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Box, CardActionArea, Grid, Rating } from '@mui/material';
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
        <Grid key={product._id} item xs={6} sm={4} md={4} lg={3} xl={3}>
          <Link to={`/product/${product._id}`} className="text-link">
            <Card
              elevation={0}
              sx={{
                maxWidth: { xs: '100%', md: 300 },
                minHeight: 240
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
                  <Typography gutterBottom variant="subtitle1" component="div">
                    {product.name}
                  </Typography>

                  <Box
                    sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}
                  >
                    <Typography
                      gutterBottom
                      variant="h6"
                      sx={{ color: '#000', fontSize: '1.01rem' }}
                    >
                      {`₹${product.discountedPrice}`}
                    </Typography>
                    <Typography
                      gutterBottom
                      sx={{ textDecoration: 'line-through', opacity: 0.5, fontSize: 13 }}
                      variant="subtitle"
                    >
                      {`₹${product.price}`}
                    </Typography>
                    <Typography
                      gutterBottom
                      sx={{ color: 'green', opacity: 0.8 }}
                      variant="caption"
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
