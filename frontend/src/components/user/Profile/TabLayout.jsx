/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Tab from '@mui/material/Tab';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import WalletOutlinedIcon from '@mui/icons-material/WalletOutlined';
import { Box, styled } from '@mui/material';
import ProfileTab from './ProfileTab';
import AddressTab from './AddressTab';
import OrdersTab from './OrdersTab';
import WalletTab from './WalletTab';

const StyledTab = styled((props) => (
  <Tab
    disableRipple
    {...props}
  />
))(() => ({
  textTransform: 'none',
  color: 'rgba(0, 0, 0, 0.7)',
  '&.Mui-selected': {
    color: '#000',
    backgroundColor: '#f5faff'
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#f5faff'
  }
}));

export default function IconTabs() {
  const [search, setSearch] = useSearchParams();

  const [value, setValue] = useState(search.get('profile') ?? 'info');

  useEffect(() => {
    if (!search.get('profile')) {
      search.set('profile', 'info');
      setSearch(search);
    }
    if (value !== search.get('profile')) {
      setValue(search.get('profile'));
    }
    if (search.get('profile')) {
      const profile = search.get('profile');
      if (
        profile !== 'info'
        && profile !== 'address'
        && profile !== 'wallet'
        && profile !== 'orders'
      ) {
        search.set('profile', 'info');
        setSearch(search);
        setValue('info');
      }
    }
  }, [search, setSearch, value]);

  const handleChange = (event, newValue) => {
    search.set('profile', newValue);
    setSearch(search);
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        color: '#000',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100vw',
        pt: 4,
        // padding: { xs: '15px 10px', md: '30px 100px' },
        backgroundColor: '#f1f3f6',
        alignItems: 'center',
        minHeight: '70vh'
      }}
    >
      <TabContext value={value}>
        <Box
          sx={{
            width: { xs: '100vw', md: 'max-content' },
            height: 'max-content',
            backgroundColor: '#fff',
            boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px'
          }}
        >
          <TabList
            centered
            variant="fullWidth"
            orientation="horizontal"
            scrollButtons="auto"
            onChange={handleChange}
            aria-label="icon tabs example"
          >
            <StyledTab
              label="Profile Information"
              icon={<AccountCircleOutlinedIcon sx={{ display: { xs: 'none', md: 'block' } }} />}
              iconPosition="start"
              aria-label="phone"
              value="info"
              sx={{ borderRight: '2px solid rgba(0,0,0,0.8)' }}
            />
            <StyledTab
              label="Manage Addresses"
              icon={<HomeOutlinedIcon sx={{ display: { xs: 'none', md: 'block' } }} />}
              aria-label="favorite"
              iconPosition="start"
              value="address"
              sx={{ borderRight: '2px solid rgba(0,0,0,0.8)' }}
            />
            <StyledTab
              label="My Orders"
              icon={<UploadFileOutlinedIcon sx={{ display: { xs: 'none', md: 'block' } }} />}
              aria-label="person"
              iconPosition="start"
              value="orders"
              sx={{ borderRight: '2px solid rgba(0,0,0,0.8)' }}
            />
            <StyledTab
              label="Wallet"
              icon={<WalletOutlinedIcon sx={{ display: { xs: 'none', md: 'block' } }} />}
              aria-label="person"
              iconPosition="start"
              value="wallet"
            />
          </TabList>
        </Box>
        <Box
          sx={{
            minWidth: '70vw',
            flexGrow: 1
          }}
        >
          <TabPanel
            value="info"
            index={0}
            sx={{ mb: 0 }}
          >
            <ProfileTab />
          </TabPanel>
          <TabPanel
            value="address"
            index={1}
          >
            <AddressTab />
          </TabPanel>
          <TabPanel
            value="orders"
            index={2}
          >
            <OrdersTab />
          </TabPanel>
          <TabPanel
            value="wallet"
            index={3}
          >
            <WalletTab />
          </TabPanel>
        </Box>
      </TabContext>
    </Box>
  );
}
