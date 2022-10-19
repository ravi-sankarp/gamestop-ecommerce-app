/* eslint-disable no-unused-expressions */
import { useCallback, useState } from 'react';
import { Box, Slider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import MuiInput from '@mui/material/Input';
import { useSearchParams } from 'react-router-dom';

const Input = styled(MuiInput)`
  width: 80px;
`;

const debounce = (func, delay) => {
  let setTimoutInstance;
  return (...args) => {
    if (setTimoutInstance) clearTimeout(setTimoutInstance);
    setTimoutInstance = setTimeout(() => func.apply('', args), delay);
  };
};

function PriceSlider() {
  const [search, setSearch] = useSearchParams();
  const [value, setValue] = useState([
    search.get('minPrice') ?? 0,
    search.get('maxPrice') ?? 50000
  ]);

  const handleUpdateParams = (minPrice, maxPrice) => {
    search.set('minPrice', minPrice);
    search.set('maxPrice', maxPrice);
    setSearch(search);
  };

  const handleOptimizedChange = useCallback(debounce(handleUpdateParams, 300), []);

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    handleOptimizedChange(newValue[0], newValue[1]);
  };

  const handleInput1Change = (event) => {
    const targetValue = event.target.value;
    targetValue !== '' || search.set('minPrice', targetValue);
    search.get('maxPrice') ?? search.set('maxPrice', 50000);
    setSearch(search);

    setValue((current) => {
      const _value = targetValue === '' ? '' : Number(targetValue);
      return [_value, current[1]];
    });
  };

  const handleInput2Change = (event) => {
    const targetValue = event.target.value;
    targetValue !== '' || search.set('maxPrice', targetValue);
    search.get('minPrice') ?? search.set('minPrice', 0);

    setSearch(search);
    setValue((current) => {
      const _value = targetValue === '' ? '' : Number(targetValue);
      return [current[1], _value];
    });
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 100) {
      setValue(100);
    }
  };

  return (
    <Box sx={{ pl: 2, pr: 2 }}>
      <Typography variant="subtitle">PRICE</Typography>

      <Slider
        getAriaLabel={() => 'Price range'}
        valueLabelDisplay="auto"
        min={0}
        max={50000}
        size="small"
        value={value}
        onChange={handleSliderChange}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Typography>Min Price</Typography>
          <Input
            value={value[0]}
            size="small"
            onChange={handleInput1Change}
            onBlur={handleBlur}
            inputProps={{
              step: 10,
              min: 0,
              max: 100,
              type: 'number',
              'aria-labelledby': 'input-slider'
            }}
          />
        </div>
        <div>
          <Typography>Max Price</Typography>

          <Input
            value={value[1]}
            size="small"
            onChange={handleInput2Change}
            onBlur={handleBlur}
            inputProps={{
              step: 10,
              min: 0,
              max: 100,
              type: 'number',
              'aria-labelledby': 'input-slider'
            }}
          />
        </div>
      </Box>
    </Box>
  );
}

export default PriceSlider;
