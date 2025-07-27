import React from 'react';
import { TOKEN_POST, USER_GET, TOKEN_VALIDATE_POST } from './useFetch';
import { useLocation, useNavigate } from 'react-router-dom';

export const UserContext = React.createContext();

export const UserStorage = ({ children }) => {
  const [data, setData] = React.useState(null);
  const [statusAccount, setStatusAccount] = React.useState('');
  const [login, setLogin] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [preLoading, setPreLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const userLogout = React.useCallback(
    async function () {
      setData(null);
      setError(null);
      setLoading(false);
      setPreLoading(true);
      setLogin(false);
      window.localStorage.removeItem('token');
      navigate('/login');
      setStatusAccount('');
    },
    [navigate],
  );

  async function getUser(token) {
    const { url, options } = USER_GET(token);
    const response = await fetch(url, options);
    const json = await response.json();
    setData(json);
    //setStatusAccount(json.data.status_account);
    setLogin(true);

    const authRoutes = new Set([
      '/login',
      '/criar-conta',
      '/criar-conta/codigo',
      '/recuperar-senha',
    ]);

    const currentPath = location.pathname.replace(/\/+$/, '');

    if (authRoutes.has(currentPath)) {
      return true;
    } else {
      if (json.data?.status_account === 'pending') {
        navigate('/conta-pendente');
      }
    }
  }

  async function userLogin(username, password, redirect = '/') {
    try {
      setError(null);
      setLoading(true);
      const { url, options } = TOKEN_POST({ username, password });
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`Error: ${response.statusText}`);
      const { token } = await response.json();
      window.localStorage.setItem('token', token);
      await getUser(token);
      navigate(redirect);
    } catch (err) {
      setError(err.message);
      setLogin(false);
    } finally {
      setLoading(false);
      setPreLoading(true);
    }
  }

  async function autoLogin() {
    const token = window.localStorage.getItem('token');
    if (token) {
      try {
        setError(null);
        setLoading(true);
        const { url, options } = TOKEN_VALIDATE_POST(token);
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('Token inválido');
        await getUser(token);
        setLogin(true);

        const timerPreLoading = setTimeout(() => {
          setPreLoading(false);
        }, 4800);
        return () => clearTimeout(timerPreLoading);
      } catch (err) {
        userLogout();
        setPreLoading(true);
      } finally {
        setLoading(false);
      }
    } else {
      userLogout;
    }
  }

  React.useEffect(() => {
    autoLogin();
  }, [userLogout]);

  return (
    <UserContext.Provider
      value={{
        userLogin,
        userLogout,
        data,
        error,
        loading,
        login,
        preLoading,
        setPreLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
