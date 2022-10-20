import { Button, styled } from '@mui/material';

export const PrimaryButton = styled(Button)({
  textTransform: 'none',
  fontSize: 16,
  margin: '20px',
  padding: '6px 16px',
  lineHeight: 1.6,
  borderRadius: '3px',
  backgroundColor: '#000',
  color: '#fff',
  zIndex: 1,
  '&:hover': {
    backgroundColor: '#000',
    color: '#b3b3b3',
    transition: 'all 300ms '
  },
  '&:active': {
    top: '2px',
    transition: 'top 200ms ease-in'
  },
  '&:focus': {
    boxShadow: '0.2 0.2 0.2 0.2rem #000'
  },
  '&:disabled': {
    backgroundColor: 'rgba(0,0,0,0.2) ',
     color: '#000 ',
    pointerEvents: 'auto ',
    cursor: 'not-allowed '
  }
});
export const SecondaryButton = styled(Button)({
  textTransform: 'none',
  fontSize: 16,
  margin: '20px',
  borderRadius: '2px',
  boxShadow: '0 0 0 1px #999999',
  padding: '6px 12px',
  lineHeight: 1.6,
  backgroundColor: 'transparent',
  color: '#000',
  zIndex: 1,
  '&:hover': {
    boxShadow: '0 0 0 1px #000000',
    backgroundColor: '#fff',
    color: '#000',
    transition: 'all 200ms ease-in'
  },
  '&:active': {
    top: '2px',
    transition: 'top 100ms '
  },
  '&:focus': {
    boxShadow: '0 0 0 0.2px #000'
  }
});
