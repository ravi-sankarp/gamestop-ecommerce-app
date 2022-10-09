/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Tab from '@mui/material/Tab';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import { Box, styled } from '@mui/material';
import ProfileTab from './ProfileTab';
import AddressTab from './AddressTab';
import OrdersTab from './OrdersTab';

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
  if (!search.get('profile')) {
    console.log(search.get('profile'));
    search.set('profile', 'info');
    setSearch(search);
  }
  const [value, setValue] = useState(search.get('profile') ?? 'info');

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
        maxWidth: '95vw',
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
            width: 'max-content',
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
              icon={<AccountCircleOutlinedIcon />}
              iconPosition="start"
              aria-label="phone"
              value="info"
            />
            <StyledTab
              label="Manage Addresses"
              icon={<HomeOutlinedIcon />}
              aria-label="favorite"
              iconPosition="start"
              value="address"
            />
            <StyledTab
              label="My Orders  "
              icon={<UploadFileOutlinedIcon />}
              aria-label="person"
              iconPosition="start"
              value="orders"
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
        </Box>
      </TabContext>
    </Box>
  );
}