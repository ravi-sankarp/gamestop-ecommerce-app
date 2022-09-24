import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import { useSelector } from 'react-redux';
import { SecondaryButton } from '../../../MaterialUiConfig/styled';
import DrawerAccordian from './DrawerAccordian';

export default function FilterDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { categories, brands } = useSelector((state) => state.brandAndCategory);

  useEffect(() => {
    if (categories.length > 1) {
      setIsSuccess(true);
    }
  }, [categories]);

  if (!isSuccess) {
    return null;
  }

  const toggleDrawer = () => {
    setIsOpen((current) => !current);
  };

  const drawer = (
    <Box
      sx={{
        textAlign: 'center',
        color: '#000',
        '&::-webkit-scrollbar': {
          display: 'none !important'
        }
      }}
    >
      <Box
        sx={{
          textAlign: 'right',
          mr: 1
        }}
      >
        <CloseOutlinedIcon
          sx={{
            '&:hover': { cursor: 'pointer', backgroundColor: '#e6e6e6' },
            borderRadius: '50%',
            p: 0.5
          }}
          onClick={toggleDrawer}
        />
      </Box>
      <Typography
        component="div"
        variant="h6"
        sx={{
          my: 2,
          color: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1
        }}
      >
        Filter
        <TuneOutlinedIcon />
      </Typography>
      <Divider />

      <Box>
        <DrawerAccordian title="category" checkbox>
          {categories.map((category) => (
            <Typography key={category.name}>{category.name}</Typography>
          ))}
        </DrawerAccordian>
      </Box>
      <Divider />

      <Box>
        <DrawerAccordian title="brand" checkbox>
          {brands.map((brand) => (
            <Typography key={brand.name}>{brand.name}</Typography>
          ))}
        </DrawerAccordian>
      </Box>
      <Divider />
    </Box>
  );
  return (
    <Box
      sx={{
        display: { xs: 'flex', md: 'flex' },
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <SecondaryButton sx={{ lineHeight: 2 }} endIcon={<TuneOutlinedIcon />} onClick={toggleDrawer}>
        Filter
      </SecondaryButton>
      <Drawer variant="temporary" open={isOpen} onClose={toggleDrawer}>
        {drawer}
      </Drawer>
    </Box>
  );
}
