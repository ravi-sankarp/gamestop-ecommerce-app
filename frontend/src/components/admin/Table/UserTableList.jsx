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
import BlockIcon from '@mui/icons-material/Block';
import ConfirmDialog from '../../ConfirmDialog';
import { SecondaryButton } from '../../../MaterialUiConfig/styled';

export default function UserTableList({ data }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userData, setUserData] = useState({});
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleBlock = (user) => {
    setUserData(user);
    setDialogOpen(true);
  };
  return (
    <>
      <Paper sx={{ mb: 5 }}>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead sx={{ backgroundColor: '#2987de7a' }}>
              <TableRow>
                <TableCell align="center">Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Phone Number</TableCell>
                <TableCell align="center">Blocked</TableCell>
                <TableCell align="center">Admin</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                <TableRow
                  key={user.email}
                  sx={{
                    p: 0,
                    '& td': {
                      p: { md: 0 }
                    },
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:nth-of-type(even) ': { backgroundColor: '#f4f8fd' }
                  }}
                >
                  <TableCell data-label="Name" align="center">
                    {`${user.firstName} ${user.lastName}`}
                  </TableCell>
                  <TableCell data-label="Email" align="center">
                    {user.email}
                  </TableCell>
                  <TableCell data-label="Phone Number" align="center">
                    {user.phoneNumber}
                  </TableCell>
                  <TableCell data-label="Blocked" align="center">
                    {`${user.isBlocked.toString().toUpperCase()}`}
                  </TableCell>
                  <TableCell data-label="Admin" align="center">
                    {`${user.isAdmin.toString().toUpperCase()}`}
                  </TableCell>
                  <TableCell data-label="Action" align="center">
                    <SecondaryButton
                      onClick={() => handleBlock(user)}
                      endIcon={!user.isBlocked ? <BlockIcon /> : ''}
                    >
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </SecondaryButton>
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
      {dialogOpen && <ConfirmDialog data={userData} open={dialogOpen} setOpen={setDialogOpen} />}
    </>
  );
}
