import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import { CssBaseline } from '@mui/material';
import { UserStorage } from './hooks/userContext';
import { AlertProvider } from './hooks/alertContext';
import GlobalSnackbar from './components/snackbar/globalSnackbar';
import ProtectedRouters from './helper/protectedRouters';
import Theme from './theme/theme';
import './main.min.css';
import PageLogin from './pages/login/PageLogin';
import PageHome from './pages/home/PageHome';
import PageSearch from './pages/search/pageSearch';
import { SearchProvider } from './hooks/searchContext';
import SinglePage from './pages/singlePage/singlePage';
import IconLocalStorageManager from './hooks/LocalStorageManager';
import EditAsset from './pages/edit/editAsset';
import PostAsset from './pages/post/postAsset';

const App = () => {
  return (
    <BrowserRouter basename="/">
      <UserStorage>
        <SearchProvider>
          <IconLocalStorageManager>
            <AlertProvider>
              <ThemeProvider theme={Theme} defaultMode="dark">
                <InitColorSchemeScript attribute="class" />
                <CssBaseline />
                <Routes>
                  <Route
                    path="/"
                    element={
                      <ProtectedRouters>
                        <PageHome />
                      </ProtectedRouters>
                    }
                  />
                  <Route
                    path="/pesquisar"
                    element={
                      <ProtectedRouters>
                        <PageSearch />
                      </ProtectedRouters>
                    }
                  />
                  <Route
                    path="/ativo/:slug"
                    element={
                      <ProtectedRouters>
                        <SinglePage />
                      </ProtectedRouters>
                    }
                  />
                  <Route
                    path="/novo/ativo"
                    element={
                      <ProtectedRouters>
                        <PostAsset />
                      </ProtectedRouters>
                    }
                  />
                  <Route
                    path="/editar/:slug"
                    element={
                      <ProtectedRouters>
                        <EditAsset />
                      </ProtectedRouters>
                    }
                  />
                  <Route
                    path="/contribute/ativo/:slug"
                    element={
                      <ProtectedRouters>
                        contribuir com o ativo
                      </ProtectedRouters>
                    }
                  />

                  <Route path="/login/" element={<PageLogin />} />
                  <Route path="/recuperar-senha/" element={<PageLogin />} />
                  <Route path="/resetar-senha/" element={<PageLogin />} />
                  <Route path="/criar-conta/*" element={<PageLogin />} />
                </Routes>
                <GlobalSnackbar />
              </ThemeProvider>
            </AlertProvider>
          </IconLocalStorageManager>
        </SearchProvider>
      </UserStorage>
    </BrowserRouter>
  );
};

export default App;
