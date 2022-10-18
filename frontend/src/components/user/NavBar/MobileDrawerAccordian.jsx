/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable react/destructuring-assignment */
import { useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Divider,
  Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function MobileDrawerAccordian({ handleDrawerToggle }) {
  const [expanded, setExpanded] = useState(false);

  const { categories, brands } = useSelector((state) => state.brandAndCategory);
  // handle accordian change
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      <Accordion
        sx={{ minWidth: '10vw', border: 0, boxShadow: 0 }}
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
        <AccordionDetails sx={{ display: 'flex', flexDirection: 'column' }}>
          {categories.length
            && categories.map((category) => (
              <Button
                key={category.name}
                component={Link}
                onClick={handleDrawerToggle}
                to={`/category/${category._id}`}
                sx={{ color: '#000' }}
              >
                {category?.name}
              </Button>
            ))}
        </AccordionDetails>
      </Accordion>
      <Divider />
      <Accordion
        sx={{ minWidth: '20vw', border: 0, boxShadow: 0 }}
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
        <AccordionDetails sx={{ display: 'flex', flexDirection: 'column' }}>
          {brands.length
            && brands.map((brand) => (
              <Button
                key={brand.name}
                component={Link}
                onClick={handleDrawerToggle}
                to={`/brand/${brand._id}`}
                sx={{ color: '#000' }}
              >
                {brand?.name}
              </Button>
            ))}
        </AccordionDetails>
      </Accordion>
    </>
  );
}

export default MobileDrawerAccordian;
