import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import { Box } from '@mui/material';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import { PrimaryButton, SecondaryButton } from '../../../MaterialUiConfig/styled';
import DrawerAccordian from './DrawerAccordian';
import PriceSlider from './PriceSlider';

export default function MenuDrawer() {
  const [anchorEl, setAnchorEl] = useState(null);

  const [search, setSearch] = useSearchParams();
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClear = () => {
    search.delete('category');
    search.delete('brand');
    search.delete('maxPrice');
    search.delete('minPrice');
    setSearch(search);
    handleClose();
  };

  return (
    <div>
      <SecondaryButton
        id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ lineHeight: 2 }}
        endIcon={<TuneOutlinedIcon />}
      >
        Filter
      </SecondaryButton>

      <Menu
        id="fade-menu"
        MenuListProps={{
          'aria-labelledby': 'fade-button'
        }}
        PaperProps={{
          style: {
            minWidth: 'max-content'
          }
        }}
        sx={{ width: '30vw' }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Box sx={{ display: 'flex', maxHeight: '2.5rem', p: 0, justifyContent: 'space-around' }}>
          <PrimaryButton sx={{ p: '1rem', mt: 0 }} onClick={handleClear}>
            Clear All
          </PrimaryButton>
          <PrimaryButton sx={{ p: '1rem', mt: 0 }} onClick={handleClose}>
            Apply
          </PrimaryButton>
        </Box>
        <DrawerAccordian />
        <PriceSlider />
      </Menu>
    </div>
  );
}
