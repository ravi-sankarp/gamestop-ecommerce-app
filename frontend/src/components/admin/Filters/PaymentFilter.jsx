/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Box, Typography } from '@mui/material';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function PaymentFilter() {
  const [search, setSearch] = useSearchParams();
  const [sortText, setSortText] = useState('All');
  useEffect(() => {
    const status = search.get('mode');
    if (status) {
      setSortText(status);
    }
  }, []);

  const handleSort = (e) => {
    search.set('mode', e.target.textContent);
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
        mt: 4,
        mr: { xs: 1, md: 10 },
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
        <Typography variant="subtitle">Credit</Typography>
        <Typography variant="subtitle">Debit</Typography>
      </div>
    </Box>
  );
}

export default PaymentFilter;
