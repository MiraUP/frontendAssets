import React from 'react';
import { UserContext } from '../hooks/userContext';
import { Navigate, useLocation } from 'react-router-dom';
import { ProgressCircular } from '../components/progressScroll/progress';

const ProtectedRouters = ({ children }) => {
  const { login } = React.useContext(UserContext);
  const { pathname } = useLocation();
  var backdrop = document.querySelectorAll(
    '.modal-backdrop, .offcanvas-backdrop',
  );
  var bodyModalOpen = document.querySelectorAll('body');

  React.useEffect(() => {
    [].forEach.call(backdrop, function (el) {
      el.remove();
    });

    [].forEach.call(bodyModalOpen, function (el) {
      el.removeAttribute('style');
      el.classList.remove('modal-open');
      el.classList.remove('nav-fixed');
    });
  }, [pathname]);

  if (login === true) {
    return children;
  } else if (login === false) {
    return <Navigate to="/login" state={{ from: pathname }} replace />;
  } else {
    return (
      <>
        <ProgressCircular />
      </>
    );
  }
};

export default ProtectedRouters;
