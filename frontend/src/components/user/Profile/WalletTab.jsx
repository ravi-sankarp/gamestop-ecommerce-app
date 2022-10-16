import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';
import useApiErrorHandler from '../../../hooks/useApiErrorHandler';
import { PrimaryButton } from '../../../MaterialUiConfig/styled';

import {
  useAddToWalletMutation,
  useGetUseWalletDetailsQuery
} from '../../../redux/api/userApiSlice';

import HelmetMeta from '../../HelmetMeta';
import RazorPayPayment from '../Payments/RazorPayPayment';

function WalletTab() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(false);
  const [razorpayOrderDetails, setRazorpayOrderDetails] = useState(false);
  const [btnText, setBtnText] = useState('Add to wallet');
  const [formError, setFormError] = useState('');
  const { data, isFetching, isLoading, isSuccess, isError, error } = useGetUseWalletDetailsQuery();
  const [addToWallet, { isLoadingAddToWallet }] = useAddToWalletMutation();
  const errorToast = useApiErrorHandler();

  useEffect(() => {
    if (isError) {
      errorToast(error);
    }
  }, [isError, error, errorToast]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleAlertShow = () => {
    setOpen((current) => !current);
  };

  const handleAddtoWallet = async () => {
    if (!amount) {
      setFormError('Please enter an amount first');
      return;
    }
    if (Number.isNaN(amount)) {
      setFormError('Please enter a valid number');
      return;
    }
    if (amount <= 100) {
      setFormError('Please enter an amount greater than 100');
      return;
    }
    setFormError('');
    try {
      if (!isLoadingAddToWallet) {
        setBtnText('Loading ...');
        const res = await addToWallet({ amount }).unwrap();
        // handleAlertShow();
        setRazorpayOrderDetails(res.data);
        setBtnText('Add to wallet');
      }
    } catch (err) {
      setBtnText('Add to wallet');
      setFormError(err?.data?.message ?? 'Something went wrong');
    }
  };
  let content;
  if (isLoading || (isFetching && !isSuccess)) {
    content = (
      <Box
        sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,0%)',
          overflowY: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
      >
        <CircularProgress
          sx={{ overflow: 'hidden' }}
          color="primary"
        />
      </Box>
    );
  }
  const copyToClipboard = () => {
    navigator.clipboard.writeText(data?.data?.referral?.id);
  };

  return (
    <>
      <HelmetMeta title="User Wallet | Gamestop" />
      <Box sx={{ overflowX: 'hidden', pt: 4 }}>
        {content}
        {data?.data && (
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                mb: 2
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  width: 'max-content',
                  mx: 'auto',
                  backgroundColor: '#fff',
                  p: 5,
                  mb: 2,
                  boxShadow: '0 1px 5px 1px #dbdbdb',
                  border: '1px solid #dbdbdb',
                  borderRadius: '2px',
                  '&:hover': {
                    boxShadow: '0 1px 12px 2px #dbdbdb',
                    transition: 'box-shadow 100ms linear'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6">Wallet Balance</Typography>
                  <AccountBalanceIcon />
                </Box>
                <Typography>
                  {`₹ ${data?.data?.wallet?.balance.toLocaleString('en-us')}`}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <PrimaryButton onClick={handleAlertShow}>Add Money to Wallet</PrimaryButton>
                </Box>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 'max-content',
                  mx: 'auto',
                  backgroundColor: '#fff',
                  px: 5,
                  py: 2,
                  mb: 2,
                  boxShadow: '0 1px 5px 1px #dbdbdb',
                  border: '1px solid #dbdbdb',
                  borderRadius: '2px',
                  '&:hover': {
                    boxShadow: '0 1px 12px 2px #dbdbdb',
                    transition: 'box-shadow 100ms linear'
                  }
                }}
              >
                <Box
                  sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}
                >
                  <Typography variant="h6">Refer and Earn</Typography>
                  <GroupAddOutlinedIcon />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    mt: 2,
                    justifyContent: 'center',
                    gap: 2,
                    alignItems: 'center'
                  }}
                >
                  <Typography>Referred :</Typography>

                  <Typography>{data?.data?.referral?.count}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    mt: 2,
                    justifyContent: 'center',
                    gap: 2,
                    alignItems: 'center'
                  }}
                >
                  <Typography>Amount Earned :</Typography>

                  <Typography>{data?.data?.referral?.amount}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    mt: 2,
                    justifyContent: 'center',
                    gap: 2,
                    alignItems: 'center'
                  }}
                >
                  <Typography>Referral Code</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography sx={{ backgroundColor: '#adb5bd', p: 1 }}>
                      {data?.data?.referral?.id}
                    </Typography>
                    <ContentCopyIcon
                      onClick={copyToClipboard}
                      sx={{ border: '1px solid #101010', p: 0.8, cursor: 'pointer' }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
            {!!data?.data?.wallet?.transactions && (
              <>
                <Typography textAlign="center">WALLET TRANSACTIONS</Typography>
                <Paper sx={{ mb: 5, mt: 2, width: 'max-content', mx: 'auto' }}>
                  <TableContainer>
                    <Table
                      aria-label="simple table"
                      sx={{ maxWidth: { xs: '70vw', md: '50vw' } }}
                    >
                      <TableHead sx={{ backgroundColor: '#2987de7a' }}>
                        <TableRow>
                          <TableCell align="center">Date</TableCell>
                          <TableCell align="center">Details</TableCell>
                          <TableCell align="center">Amount</TableCell>
                          <TableCell align="center">Operation</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {data?.data?.wallet?.transactions
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .map((transaction) => (
                            <TableRow
                              key={transaction.paymentId}
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
                                data-label="Date"
                                align="center"
                              >
                                {new Date(transaction.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </TableCell>
                              <TableCell
                                data-label="Detail"
                                align="center"
                              >
                                {transaction.operation}
                              </TableCell>
                              <TableCell
                                data-label="Amount"
                                align="center"
                              >
                                {`₹ ${transaction.amount.toLocaleString('en-us')}`}
                              </TableCell>
                              <TableCell
                                data-label="Operation"
                                align="center"
                                sx={
                                  transaction.mode === 'credit'
                                    ? { color: 'green' }
                                    : { color: 'red' }
                                }
                              >
                                {transaction.mode.toUpperCase()}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 20]}
                    component="div"
                    count={data?.data?.wallet?.transactions?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
              </>
            )}
          </>
        )}
      </Box>
      <Dialog
        open={open}
        onClose={handleAlertShow}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          minWidth: '60vw'
        }}
      >
        <DialogTitle>
          <div style={{ display: 'flex' }}>
            <Typography
              variant="h6"
              component="div"
              style={{ flexGrow: 1 }}
            >
              Add Amount To Wallet
            </Typography>
            <Button
              color="primary"
              variant="outlined"
              onClick={handleAlertShow}
            >
              <CloseOutlinedIcon />
            </Button>
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            noValidate
            autoComplete="off"
          >
            <TextField
              sx={{ mb: 2 }}
              label="Enter Amount"
              fullWidth
              required
              value={amount}
              type="number"
              onChange={(e) => setAmount(e.target.value)}
            />
            {formError && (
              <Alert
                sx={{ mb: 5, textAlign: 'center' }}
                severity="error"
              >
                {`${formError}!`}
              </Alert>
            )}
            <PrimaryButton
              sx={{ mx: 'auto' }}
              onClick={handleAddtoWallet}
            >
              {btnText}
            </PrimaryButton>
          </Box>
        </DialogContent>
      </Dialog>
      {razorpayOrderDetails && (
        <RazorPayPayment
          setSuccessModal={handleAlertShow}
          setMessage={setFormError}
          data={razorpayOrderDetails}
        />
      )}
    </>
  );
}

export default WalletTab;
