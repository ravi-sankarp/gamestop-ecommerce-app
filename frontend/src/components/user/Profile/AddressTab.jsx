import { useEffect, useState } from 'react';
import { Box, CircularProgress, IconButton, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useApiErrorHandler from '../../../hooks/useApiErrorHandler';
import useSuccessHandler from '../../../hooks/useSuccessHandler';
import { PrimaryButton } from '../../../MaterialUiConfig/styled';
import { useDeleteAddressMutation, useGetAddressesQuery } from '../../../redux/api/userApiSlice';

import HelmetMeta from '../../HelmetMeta';
import UserAddressForm from '../Forms/UserAddressForm';
import UserAddressEditForm from '../Forms/UserAddressEditForm';

function AddressTab() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [addressData, setAddressData] = useState();
  const { data, isFetching, isLoading, isSuccess, isError, error } = useGetAddressesQuery();
  const [deleteAddress, { isLoading: isLoadingDeleteAddress }] = useDeleteAddressMutation();
  const successToast = useSuccessHandler();
  const errorToast = useApiErrorHandler();

  useEffect(() => {
    if (isError) {
      errorToast(error);
    }
  }, [isError, error, errorToast]);

  const toggleForm = () => {
    setOpen((current) => !current);
  };

  const toggleEditForm = (address) => {
    setAddressData(address);
    setEditOpen((current) => !current);
  };

  const handleDelete = async (id) => {
    try {
      if (!isLoadingDeleteAddress) {
        const res = await deleteAddress({ id }).unwrap();
        successToast(res);
      }
    } catch (err) {
      errorToast(err);
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

  return (
    <>
      <HelmetMeta title="User Addresses | Gamestop" />
      <Box sx={{ overflowX: 'hidden', pt: 4 }}>
        {content}
        {data?.message && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              width: '100%',
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              '& img': {
                width: '300px'
              }
            }}
          >
            <Typography variant="h6">{data.message}</Typography>
            <Typography sx={{ color: '#333333' }}>Click here to add One</Typography>
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <PrimaryButton onClick={toggleForm}>Add Address</PrimaryButton>
        </Box>
        {data?.data && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              p: 2,
              width: '90vw',
              alignItems: 'center'
            }}
          >
            {data.data.map((address) => (
              <Box
                key={address.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1,
                  background: '#fff',
                  p: 2,
                  width: { xs: '80vw', md: '40vw' },
                  boxShadow: 'rgba(0, 0, 0, 0.15) 0px 0px 0px 0px',
                  position: 'relative',
                  border: '1px solid #dbdbdb',
                  borderRadius: '2px',
                  '&:hover': {
                    boxShadow: '0 1px 12px 2px #dbdbdb',
                    transition: 'box-shadow 100ms linear'
                  }
                }}
              >
                <Box sx={{ position: 'absolute', right: 2 }}>
                  <IconButton
                    sx={{ width: 'max-content', ml: 'auto', mr: { xs: 5, md: 1 } }}
                    className="navbar-list"
                  >
                    <MoreVertIcon />
                    <Box className="navbar-dropdown address-dropdown">
                      <Typography onClick={() => toggleEditForm(address)}>Edit</Typography>
                      <Typography onClick={() => handleDelete(address.id)}>Delete</Typography>
                    </Box>
                  </IconButton>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Typography>{address.name}</Typography>
                  <Typography>{address.phoneNumber}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    flexDirection: { xs: 'column', md: 'row' },
                    whiteSpace: { xs: 'break-spaces', md: 'nowrap' }
                  }}
                >
                  <Typography>{`${address.houseName},`}</Typography>
                  <Typography>{`${address.streetName},`}</Typography>
                  <Typography>{`${address.city},`}</Typography>
                  <Typography>{`${address.district},`}</Typography>
                  <Typography>{`${address.state} -`}</Typography>
                </Box>
                <Typography>{address.pincode}</Typography>
              </Box>
            ))}
          </Box>
        )}

        {open && (
          <UserAddressForm
            open={open}
            toggleForm={toggleForm}
          />
        )}
        {editOpen && (
          <UserAddressEditForm
            open={editOpen}
            toggleForm={toggleEditForm}
            addressData={addressData}
          />
        )}
      </Box>
    </>
  );
}

export default AddressTab;
