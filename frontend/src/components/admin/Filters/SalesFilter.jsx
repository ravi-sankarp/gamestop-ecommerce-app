/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography
} from '@mui/material';
import * as yup from 'yup';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

function SalesFilter() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useSearchParams();
  const [sortText, setSortText] = useState('All');

  const schema = yup.object().shape({
    minDate: yup
      .date()
      .required()
      .typeError('Please select a date')
      .max(yup.ref('maxDate'), 'Please select a date before End date'),
    maxDate: yup
      .date()
      .required()
      .typeError('Please select a date')
      .min(yup.ref('minDate'), 'Please select a date before Start Date')
      .max(
        new Date(),
        `Please select a date before ${new Date().toLocaleDateString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })}`
      )
  });
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  useEffect(() => {
    const filter = search.get('filter');
    if (filter) {
      setSortText(filter);
    }
  }, []);

  const toggleDrawer = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleCustomFilter = (data) => {
    search.set('maxDate', data.maxDate);
    search.set('minDate', data.minDate);
    search.delete('filter');
    setSearch(search);
  };

  const handleSort = (e) => {
    if (e.target.textContent === 'Custom') {
      toggleDrawer();
      return;
    }
    search.delete('minDate');
    search.delete('maxDate');
    search.set('filter', e.target.textContent);
    setSearch(search);
  };
  return (
    <>
      <Box
        className="navbar-list"
        sx={{
          display: 'flex',
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
          gap: 1,
          mr: 'auto',
          ml: { xs: 2, md: 15 },
          my: 2,
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
          <Typography variant="subtitle">Yesterday</Typography>
          <Typography variant="subtitle">Last week</Typography>
          <Typography variant="subtitle">Last Month</Typography>
          <Typography variant="subtitle">Custom</Typography>
        </div>
      </Box>
      <Dialog
        open={open}
        onClose={toggleDrawer}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Custom Filter </DialogTitle>
        <DialogContent>
          <DialogContentText
            component="div"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              color: '#000'
            }}
            id="alert-dialog-description"
          >
            <Box
              component="form"
              noValidate
              autoComplete="off"
              sx={{
                my: 3
              }}
            >
              <TextField
                sx={{ mb: 2 }}
                fullWidth
                required
                label="Select Start Date"
                inputProps={{
                  max: getValues('maxDate')
                    ? new Date(
                        new Date(getValues('maxDate')) - 1 * 24 * 3600 * 1000
                      ).toLocaleDateString('en-ca')
                    : new Date(new Date() - 1 * 24 * 3600 * 1000).toLocaleDateString('en-ca')
                }}
                name="minDate"
                type="date"
                defaultValue={
                  getValues('maxDate')
                    ? new Date(getValues('maxDate')).toLocaleDateString('en-ca')
                    : new Date(new Date() - 1 * 24 * 3600 * 1000).toLocaleDateString('en-ca')
                }
                error={!!errors.minDate}
                helperText={errors.minDate ? errors.minDate.message : ''}
                {...register('minDate')}
              />
              <TextField
                sx={{ mb: 2 }}
                fullWidth
                required
                label="Select End Date"
                inputProps={{
                  min:
                    watch('minDate') && getValues('minDate')
                      ? new Date(
                          new Date(getValues('minDate')) + 2 * 24 * 3600 * 1000
                        ).toLocaleDateString('en-ca')
                      : new Date().toLocaleDateString('en-ca'),
                  max: new Date().toLocaleDateString('en-ca')
                }}
                name="maxDate"
                type="date"
                defaultValue={new Date().toLocaleDateString('en-ca')}
                error={!!errors.maxDate}
                helperText={errors.maxDate ? errors.maxDate.message : ''}
                {...register('maxDate')}
              />
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            sx={{ backgroundColor: '#339af0', '&:hover': { backgroundColor: '#1c7ed6' } }}
            onClick={toggleDrawer}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#fa5252',
              '&:hover': { backgroundColor: '#e03131' }
            }}
            onClick={handleSubmit(handleCustomFilter)}
          >
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SalesFilter;
