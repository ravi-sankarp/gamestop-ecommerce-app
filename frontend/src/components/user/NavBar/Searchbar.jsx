import { useState, useCallback } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ClosedOutlined from '@mui/icons-material/CloseOutlined';
import {
  Box,
  CircularProgress,
  Divider,
  IconButton,
  InputBase,
  Paper,
  Typography
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSearchProductQuery } from '../../../redux/api/viewsApiSlice';

const debounce = (func, delay) => {
  let setTimoutInstance;
  return (...args) => {
    if (setTimoutInstance) clearTimeout(setTimoutInstance);
    setTimoutInstance = setTimeout(() => func.apply('', args), delay);
  };
};

export default function SearchBar() {
  const [open, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { data, isLoading, isFetching, isError, error, isSuccess } = useSearchProductQuery(
    { query },
    { skip: !open }
  );

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleOptimizedChange = useCallback(debounce(handleInputChange, 200), []);

  let content;

  if (isSuccess) {
    content = data?.data;
  }

  if (isLoading || isFetching) {
    content = (
      <Box sx={{ display: 'flex', justifyContent: 'content' }}>
        <CircularProgress
          sx={{ overflow: 'hidden' }}
          color="primary"
        />
      </Box>
    );
  }

  if (isError) {
    content = <Typography color="red">{error?.data?.message}</Typography>;
  }

  const handleClick = () => {
    setIsOpen((current) => !current);
  };

  const handleClose = () => {
    setQuery('');
    setIsOpen((current) => !current);
  };

  const handleProductClick = (id) => {
    handleClick();
    setQuery('');
    navigate(`/product/${id}`);
  };

  const handleSearchClick = () => {
    navigate(`/products?search=${query}&sort=recommended`);
    handleClick();
  };

  return (
    <>
      {open && (
        <Paper
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: { xs: '90vw', sm: 400 },
            position: 'fixed',
            mx: { xs: '8px', sm: 0 },
            top: 58,
            right: { xs: 0, sm: 140 },
            boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
            height: 40,
            transformOrigin: 'top center',
            transition: 'opacity 200ms ease-in-out, transform 200ms ease-in-out',
            ...(open
              ? { opacity: 1, pointerEvents: 'auto', zIndex: 100, transform: 'translateY(0px)' }
              : { opacity: 0, pointerEvents: 'none', zIndex: 0, transform: 'translateY(-20px)' })
          }}
        >
          <InputBase
            onKeyDown={(e) => e.key === 'Enter' && handleSearchClick()}
            inputRef={(input) => input && input.focus()}
            onChange={handleOptimizedChange}
            sx={{ ml: 1, flex: 1 }}
            placeholder="Type to search"
            inputProps={{ 'aria-label': 'search products' }}
          />
          <Divider
            sx={{ height: '100%', m: 0.5 }}
            orientation="vertical"
          />
          <IconButton
            onClick={handleSearchClick}
            type="button"
            sx={{ p: '10px' }}
            aria-label="search"
          >
            <SearchIcon />
          </IconButton>
          <Divider
            sx={{ height: '100%', m: 0.5 }}
            orientation="vertical"
          />
          <IconButton
            onClick={handleClose}
            type="button"
            sx={{ p: '10px' }}
            aria-label="close"
          >
            <ClosedOutlined />
          </IconButton>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#fff',
              position: 'absolute',
              top: '45px',
              width: '100%',
              boxShadow:
                'rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
              maxWidth: { xs: '90vw', sm: 400 },
              justifyContent: 'center'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                '&>div': {
                  cursor: 'pointer',
                  py: 1
                },
                '&>div:hover': {
                  backgroundColor: '#f1f7fd'
                }
              }}
            >
              {(isLoading || isFetching) && content}
              {!!(isSuccess && content.length < 1 && !isFetching) && (
                <Typography sx={{ py: 2 }}>No results found</Typography>
              )}
              {isSuccess
                && content?.length > 0
                && content?.map((item) => (
                  <Box
                    key={item._id}
                    onClick={() => handleProductClick(item._id)}
                    sx={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-around'
                    }}
                    className="text-link"
                  >
                    <img
                      width="30px"
                      height="30px"
                      src={item.image}
                      alt={item.name}
                    />
                    <Typography>{item.name}</Typography>
                  </Box>
                ))}
            </Box>
          </Box>
        </Paper>
      )}

      <SearchOutlinedIcon
        onClick={handleClick}
        sx={{ lineHeight: 2 }}
      />
    </>
  );
}
