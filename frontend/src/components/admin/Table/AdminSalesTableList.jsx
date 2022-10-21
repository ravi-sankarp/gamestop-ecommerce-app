/* eslint-disable react/jsx-one-expression-per-line */
import { useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TablePagination } from '@mui/material';

export default function AdminSalesTableList({ data }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  console.log(data);
  return (
    <Paper sx={{ mb: 5, mt: 5, mx: { md: 25 } }}>
      <TableContainer>
        <Table
          aria-label="simple table"
          id="salesreportable"
        >
          <TableHead sx={{ backgroundColor: '#2987de7a' }}>
            <TableRow>
              <TableCell align="center">Order Id</TableCell>
              <TableCell align="center">Order Amount</TableCell>
              <TableCell align="center">Payment Method</TableCell>
              <TableCell align="center">Delivered Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
              <TableRow
                key={order.orderId}
                sx={{
                  p: 0,
                  '& td': {
                    p: { md: 1 }
                  },
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:nth-of-type(even) ': { backgroundColor: '#f4f8fd' }
                }}
              >
                <TableCell
                  data-label="Order id"
                  align="center"
                >
                  {order?.orderId}
                </TableCell>
                <TableCell
                  data-label="Order Amount"
                  align="center"
                >
                  {order.totalAmountDiscounted}
                </TableCell>
                <TableCell
                  data-label="Payment Method"
                  align="center"
                >
                  {order.paymentMethod}
                </TableCell>
                <TableCell
                  data-label="Delivery Date"
                  align="center"
                >
                  {new Date(order.orderStatusUpdatedOn).toLocaleDateString('en-us')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
