import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import EastIcon from '@mui/icons-material/East';
import { CardActionArea, Grid } from '@mui/material';
import { Link } from 'react-router-dom';

export default function HomeListCards({ data, type }) {
  return (
    <Grid
      container
      rowSpacing={4}
      columnSpacing={{ xs: 1, sm: 2, md: 3, lg: 4 }}
      sx={{ alignItems: 'center', justifyContent: 'center', px: { md: 8 } }}
    >
      {data
        .filter((item, i) => i !== 4)
        .map((item) => (
          <Grid
            key={item._id}
            item
            xs={6}
            sm={6}
            md={6}
            lg={type === 'brand' ? 3 : 3}
            xl={type === 'brand' ? 3 : 3}
            align="center"
          >
            <Link
              to={`/${type}/${item._id}`}
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
                    position: 'relative',
                    height: '100%',
                    '&:hover': {
                      transform: 'scale(1.04)',
                      transition: 'all 300ms ease-in-out'
                    },
                    '&:hover  .right-arrow': {
                      opacity: '1',
                      transform: 'translateX(0)',
                      transition: 'all 300ms ease-in-out'
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="130"
                    sx={{ height: 180, objectFit: 'cover' }}
                    image={`${item?.bannerImg?.imgUrl}`}
                    alt={item.name}
                  />
                  <CardContent
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#fff',
                      textTransform: 'uppercase',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: '#000',
                      p: 0,
                      pl: 2
                    }}
                  >
                    <Typography
                      gutterBottom
                      variant="subtitle1"
                      component="span"
                      sx={{
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1
                      }}
                    >
                      {item.name}
                      <EastIcon
                        className="right-arrow"
                        sx={{
                          opacity: '0',
                          pr: 1,
                          transform: 'translateX(-50%)'
                        }}
                      />
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Link>
          </Grid>
        ))}
    </Grid>
  );
}
