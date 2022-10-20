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

export default function PaymentTableList({ data }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ mb: 5, mt: 6, mx: { md: 25 } }}>
      <TableContainer>
        <Table aria-label="simple table">
          <TableHead sx={{ backgroundColor: '#2987de7a' }}>
            <TableRow>
              <TableCell align="center">Date</TableCell>
              <TableCell align="center">Operation</TableCell>
              <TableCell align="center">Payment Method</TableCell>
              <TableCell align="center">Mode</TableCell>
              <TableCell align="center">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((payment) => (
              <TableRow
                key={payment._id}
                sx={{
                  p: 0,
                  '& td': {
                    p: { md: 2 }
                  },
                  '&:last-child td, &:last-child th': { border: 0 },
                  '&:nth-of-type(even) ': { backgroundColor: '#f4f8fd' }
                }}
              >
                <TableCell
                  data-label="Date"
                  align="center"
                >
                  {new Date(payment.createdOn)
                  .toJSON()
                  .slice(0, 10)
                  .split('-')
                  .reverse()
                  .join('/')}
                </TableCell>
                <TableCell
                  data-label="Operation"
                  align="center"
                >
                  {payment.operation}
                </TableCell>
                <TableCell
                  data-label="Payment Gateway"
                  align="center"
                >
                  {payment.gateway ?? 'Online'}
                </TableCell>
                <TableCell
                  data-label="Mode"
                  align="center"
                  sx={
                    payment.mode === 'debit'
                      ? { color: 'red', textTransform: 'uppercase' }
                      : { color: 'green', textTransform: 'uppercase' }
                  }
                >
                  {payment.mode}
                </TableCell>
                <TableCell
                  data-label="Amount"
                  align="center"
                >
                  {`₹${payment.amount.toLocaleString('en-us')}`}
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
