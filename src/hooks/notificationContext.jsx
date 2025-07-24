import React from 'react';
import { NOTIFICATIONS_GET } from './useFetch';

export const NotificationContext = React.createContext();

export const NotificationStorage = ({ children }) => {
  const [dataNotifications, setDataNotifications] = React.useState(null);
  const [loadingNotifications, setLoadingNotifications] = React.useState(false);
  const [errorNotifications, setErrorNotifications] = React.useState(null);
  const token = window.localStorage.setItem('token', token);

  React.useEffect(() => {
    async function getNotifications() {
      try {
        const { url, options } = NOTIFICATIONS_GET(token);
        const response = await fetch(url, options);
        const json = await response.json();
        setDataNotifications(json.data);
        setLoadingNotifications(true);
      } catch (err) {
        setErrorNotifications(err.message);
        setLoadingNotifications(false);
      } finally {
        setLoadingNotifications(false);
      }
    }
    getNotifications();
  }, []);

  return (
    <UserContext.Provider
      value={{
        dataNotifications,
        errorNotifications,
        loadingNotifications,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
