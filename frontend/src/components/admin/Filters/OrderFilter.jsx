/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Box, Typography } from '@mui/material';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function OrderFilter() {
  const [search, setSearch] = useSearchParams();
  const [sortText, setSortText] = useState('All');
  useEffect(() => {
    const status = search.get('status');
    if (status) {
      setSortText(status);
    }
  }, []);

  const handleSort = (e) => {
    search.set('status', e.target.textContent);
    setSearch(search);
  };
  return (
    <Box
      className="navbar-list"
      sx={{
        display: 'flex',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        gap: 1,
        ml: 'auto',
        mr: 10,
        maxWidth: '200px',
        borderRadius: '2px',
        boxShadow: '0 0 0 1px #999999',
        padding: '6px 12px',
        '&:hover': {
          boxShadow: '0 0 0 1px #000000',
          transition: 'all 200ms ease-in'
        },
        zIndex: 1000
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          cursor: 'pointer'
        }}
      >
        Filter
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          cursor: 'pointer',
          whiteSpace: 'nowrap'
        }}
      >
        {sortText}
      </Typography>
      <ExpandMoreOutlinedIcon className="dropdown-icon" />

      <div
        onClick={handleSort}
        className="navbar-dropdown sort-dropdown"
      >
        <Typography variant="subtitle">All</Typography>
        <Typography variant="subtitle">Order Placed</Typography>
        <Typography variant="subtitle">Order Dispatched</Typography>
        <Typography variant="subtitle">Out For Delivery</Typography>
        <Typography variant="subtitle">Cancelled By Admin</Typography>
        <Typography variant="subtitle">Cancelled By User</Typography>
        <Typography variant="subtitle">Returned</Typography>
      </div>
    </Box>
  );
}

export default OrderFilter;
