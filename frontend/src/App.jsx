import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
// import { useSelector } from 'react-redux';
import AdminRoutes from './routes/Admin/AdminRoutes';
import theme from './MaterialUiConfig/themes';

import DisplayMessage from './components/DisplayMessage';
import './App.css';

function App() {
  // const { open } = useSelector((state) => state.toast.data.open);
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AdminRoutes />
        <DisplayMessage />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
