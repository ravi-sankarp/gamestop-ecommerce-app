import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import AdminRoutes from './routes/Admin/AdminRoutes';
import UserRoutes from './routes/User/UserRoutes';
import theme from './MaterialUiConfig/themes';

import DisplayMessage from './components/DisplayMessage';
import './App.css';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <ScrollToTop />
        <Routes>
          <Route
            path="/admin/*"
            element={<AdminRoutes />}
          />
          <Route
            path="/*"
            element={<UserRoutes />}
          />
        </Routes>
        <DisplayMessage />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
