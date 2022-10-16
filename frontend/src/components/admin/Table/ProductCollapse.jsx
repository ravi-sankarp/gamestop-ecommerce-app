/* eslint-disable no-nested-ternary */
/* eslint-disable operator-linebreak */
import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useState } from 'react';

function ProductCollapse({ product }) {
  const [open, setOpen] = useState(false);
  console.log(product);
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto', mr: 4 }}>
        <Typography>{open ? 'Hide Details' : 'Show Details'}</Typography>
        <IconButton
          aria-label="expand row"
          size="small"
          onClick={() => setOpen(!open)}
          sx={{ color: '#000' }}
        >
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </Box>
      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
      >
        <Box sx={{ margin: 1 }}>
          <Typography
            variant="h6"
            gutterBottom
            component="div"
          >
            Product Details
          </Typography>
          <Table
            size="small"
            aria-label="purchases"
          >
            <TableHead>
              <TableRow>
                <TableCell align="center">#</TableCell>
                <TableCell align="center">Product Name</TableCell>
                <TableCell align="center">Price</TableCell>
                <TableCell align="center">Discounted Price</TableCell>
                <TableCell align="center">Brand</TableCell>
                <TableCell align="center">Category</TableCell>
                <TableCell align="center">Rating</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {product && (
                <TableRow>
                  <TableCell
                    data-label="#"
                    align="center"
                  >
                    <img
                      src={product.images[0].imgUrl}
                      alt={product.name}
                      width="50px"
                    />
                  </TableCell>
                  <TableCell
                    data-label="Product Name"
                    align="center"
                  >
                    {product.name}
                  </TableCell>
                  <TableCell
                    data-label="Price"
                    align="center"
                  >
                    {`₹ ${product.price?.toLocaleString()}`}
                  </TableCell>
                  <TableCell
                    data-label="Discounted Price"
                    align="center"
                  >
                    {`₹ ${product.discountedPrice?.toLocaleString()}`}
                  </TableCell>
                  <TableCell
                    data-label="Brand"
                    align="center"
                  >
                    {product.brand[0]?.name}
                  </TableCell>
                  <TableCell
                    data-label="Category"
                    align="center"
                  >
                    {product.category[0]?.name}
                  </TableCell>
                  <TableCell
                    data-label="Ratinh"
                    align="center"
                  >
                    {product.rating}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Collapse>
    </>
  );
}

export default ProductCollapse;
