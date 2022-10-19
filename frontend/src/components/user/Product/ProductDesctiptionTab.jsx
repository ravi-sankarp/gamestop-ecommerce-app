/* eslint-disable react/jsx-props-no-spreading */
import { useState } from 'react';
import Tab from '@mui/material/Tab';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Divider, List, ListItem, styled } from '@mui/material';

const StyledTab = styled((props) => (
  <Tab
    disableRipple
    {...props}
  />
))(() => ({
  textTransform: 'none',
  fontSize: 16,
  whiteSpace: 'nowrap',
  color: 'rgba(0, 0, 0, 0.7)',
  '&.Mui-selected': {
    color: '#000'
  },
  '&.Mui-focusVisible': {
    backgroundColor: '#f5faff'
  }
}));

export default function ProductDescriptionTab({ description }) {
  const [value, setValue] = useState('description');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box
      sx={{
        color: '#000',
        display: 'flex',
        flexDirection: 'column',
        pt: 4,
        // padding: { xs: '15px 10px', md: '30px 100px' },
        alignItems: 'center',
        minHeight: 400
      }}
    >
      <TabContext value={value}>
        <Box
          sx={{
            minWidth: '40vw',
            height: 'max-content'
          }}
        >
          <TabList
            centered
            variant="fullWidth"
            orientation="horizontal"
            scrollButtons="auto"
            onChange={handleChange}
            aria-label="icon tabs product"
          >
            <StyledTab
              label="Description"
              aria-label="product description"
              value="description"
            />
            <StyledTab
              label="Delivery And Returns"
              aria-label="Delivery and returns"
              value="other"
            />
          </TabList>
        </Box>
        <Box
          sx={{
            width: { xs: '90vw', md: '50vw' },
            px: 3,
            flexGrow: 1
          }}
        >
          <Divider />
          <TabPanel
            value="description"
            index={2}
          >
            <List
              sx={{
                listStyleType: 'disc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                '& .MuiListItem-root': {
                  display: 'list-item',
                  mb: 3
                }
              }}
            >
              {description.split(':')?.map((item) => (
                <ListItem
                  disablePadding
                  key={item}
                >
                  {item}
                </ListItem>
              ))}
            </List>
          </TabPanel>
          <TabPanel
            value="other"
            index={3}
          >
            <List
              sx={{
                listStyleType: 'disc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                '& .MuiListItem-root': {
                  display: 'list-item',
                  mb: 3,
                  whiteSpace: { xs: 'normal', md: 'nowrap' }
                }
              }}
            >
              <ListItem disablePadding>Delivery within 7 days of order</ListItem>
              <ListItem disablePadding>Cash on delivery available</ListItem>
              <ListItem disablePadding>
                Online payment via Card, UPI or NetBanking is also accepted
              </ListItem>
              <ListItem disablePadding>
                7 day seller replacement policy/brand assistance for device issues
              </ListItem>
              <ListItem disablePadding>GST invoice available</ListItem>
            </List>
          </TabPanel>
        </Box>
      </TabContext>
    </Box>
  );
}
