import { Navigate, Outlet } from 'react-router-dom';

// props: allowedRoles = ['admin'] o ['usuario']
const PrivateRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol'); // vamos a guardar el rol al hacer login

  if (!token) {
    // Si no hay token, redirigir al login
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(rol)) {
    // Si el rol no coincide, redirigir a su dashboard correspondiente
    return <Navigate to={rol === 'admin' ? '/admin' : '/user'} />;
  }

  // Si todo ok, renderizamos la ruta
  return <Outlet />;
};

export default PrivateRoute;
