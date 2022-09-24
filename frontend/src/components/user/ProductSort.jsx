/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Box, Typography } from '@mui/material';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

function ProductSort() {
  const [search, setSearch] = useSearchParams();
  const [sortText, setSortText] = useState('Recommended');
  const sort = search.get('sort');
  useEffect(() => {
    switch (sort) {
      case 'recommended':
        setSortText('Recommended');
        break;
      case 'priceAsc':
        setSortText('Price(Low - High)');
        break;
      case 'priceDesc':
        setSortText('Price(Low - High)');
        break;
      case 'newest':
        setSortText('Newest Arrivals');
        break;
      default:
        setSortText('Recommended');
    }
  }, [sort]);

  const handleSort = (e) => {
    switch (e.target.textContent) {
      case 'Recommended':
        search.set('sort', 'recommended');
        break;
      case 'Price(Low - High)':
        search.set('sort', 'priceAsc');
        break;
      case 'Price(High-Low)':
        search.set('sort', 'priceDesc');
        break;
      case 'Newest Arrivals':
        search.set('sort', 'newest');
        break;
      default:
        search.set('sort', 'recommended');
    }
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
        gap: 1,
        minWidth: '200px',
        borderRadius: '2px',
        boxShadow: '0 0 0 1px #999999',
        margin: '20px',
        padding: '6px 12px',
        '&:hover': {
          boxShadow: '0 0 0 1px #000000',
          transition: 'all 200ms ease-in'
        }
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          cursor: 'pointer'
        }}
      >
        Sort
      </Typography>
      <Typography
        variant="subtitle1"
        sx={{
          cursor: 'pointer'
        }}
      >
        {sortText}
      </Typography>
      <ExpandMoreOutlinedIcon className="dropdown-icon" />

      <div onClick={handleSort} className="navbar-dropdown sort-dropdown">
        <Typography variant="subtitle">Recommended</Typography>
        <Typography variant="subtitle">Price(Low - High)</Typography>
        <Typography variant="subtitle">Price(High-Low)</Typography>
        <Typography variant="subtitle">Newest Arrivals</Typography>
      </div>
    </Box>
  );
}

export default ProductSort;
