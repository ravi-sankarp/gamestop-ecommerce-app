import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#191b13'
    },
    secondary: {
      main: '#ffffff'
    }
  },
  typography: {
    allVariants: {
      fontFamily: ['Whitney', 'sans-serif'].join(',')
    }
  }
});
export default theme;
