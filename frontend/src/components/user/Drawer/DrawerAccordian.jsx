/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/destructuring-assignment */
import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function DrawerAccordian() {
  const [expanded, setExpanded] = useState(false);

  const [search, setSearch] = useSearchParams();
  const { categories, brands } = useSelector((state) => state.brandAndCategory);
  // handle accordian change
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleItemClick = (key, value) => (e) => {
    const queryKey = key.trim().toLowerCase();
    const queryValue = value.trim();
    let query = search.get(queryKey)?.split(',') ?? [];
    if (!e.target.checked) {
      query = query.filter((_query) => _query !== queryValue);
    } else {
      query.push(queryValue);
    }

    if (!query.length) {
      search.delete(queryKey);
    } else {
      search.set(queryKey, query.join(','));
    }

    setSearch(search);
  };
  return (
    <>
      <Accordion
        sx={{ minWidth: { xs: '40vw', md: '20vw' }, border: 0, boxShadow: 0 }}
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography variant="subtitle1">CATEGORIES</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ fontWeight: 500 }}>
            {categories.length && categories.map((category) => (
                <FormGroup key={category.name}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={search.get('category')?.includes(category.name) ?? false}
                        onChange={handleItemClick('category', category.name)}
                      />
                    }
                    sx={{
                      '&:hover': { backgroundColor: '#ddd', cursor: 'pointer' }
                    }}
                    label={category.name}
                  />
                </FormGroup>
              ))}
          </Box>
        </AccordionDetails>
      </Accordion>
      <Divider />
      <Accordion
        sx={{ minWidth: { xs: '40vw', md: '20vw' }, border: 0, boxShadow: 0 }}
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography variant="subtitle1">BRANDS</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ fontWeight: 500 }}>
            {brands.length && brands.map((brand) => (
                <FormGroup key={brand.name}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={search.get('brand')?.includes(brand.name) ?? false}
                        onChange={handleItemClick('brand', brand.name)}
                      />
                    }
                    sx={{
                      '&:hover': { backgroundColor: '#ddd', cursor: 'pointer' }
                    }}
                    label={brand.name}
                  />
                </FormGroup>
              ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export default DrawerAccordian;
