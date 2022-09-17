import { Button, styled } from '@mui/material';

export const PrimaryButton = styled(Button)({
  boxShadow: 'none',
  textTransform: 'none',
  fontSize: 16,
  margin: '20px',
  padding: '6px 12px',
  lineHeight: 1.5,
  borderRadius: '3px',
  backgroundColor: '#000',
  color: '#fff',
  zIndex: 1,
  '&:hover': {
    backgroundColor: '#000',
    color: '#000',
    borderRadius: '0',
    boxShadow: ' 0px 0px 0px 1px rgba(0,0,0,0.75)',
    transition: 'all 300ms ease-in-out'
  },
  '&:active': {
    top: '2px',
    transition: 'top 300ms ease-in-out'
  },
  '&:focus': {
    boxShadow: '0.2 0.2 0.2 0.2rem #000'
  },
  '&:before': {
    position: 'absolute',
    content: '""',
    width: '100%',
    height: '100%',
    top: '0',
    right: '0',
    zIndex: '-1',
    background: '#fff',
    transition: 'transform 300ms ease-in-out',
    transform: 'scaleX(0)',
    transformOrigin: 'left'
  },
  '&:hover:before': {
    transform: 'scaleX(1)'
  }
});
export const SecondaryButton = styled(Button)({
  textTransform: 'none',
  fontSize: 16,
  margin: '20px',
  borderRadius: '2px',
  padding: '6px 12px',
  lineHeight: 1.5,
  boxShadow: ' 0px 0px 0px 1px rgba(0,0,0,0.75)',
  backgroundColor: 'transparent',
  color: '#000',
  zIndex: 1,
  '&:hover': {
    backgroundColor: '#000',
    color: '#fff',
    borderRadius: '0',
    transition: 'all 300ms ease-in-out'
  },
  '&:active': {
    top: '2px',
    transition: 'top 300ms ease-in-out'
  },
  '&:focus': {
    boxShadow: '0 0 0 0.2px #000'
  },
  '&:before': {
    position: 'absolute',
    content: '""',
    width: '100%',
    height: '100%',
    top: '0',
    right: '0',
    zIndex: '-1',
    background: '#000',
    transition: 'transform 300ms ease-in-out',
    transform: 'scaleX(0)',
    transformOrigin: 'left'
  },
  '&:hover:before': {
    transform: 'scaleX(1)'
  }
});
