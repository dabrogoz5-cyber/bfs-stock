import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

function ProtectedRoute({ rolesAutorises }) {
  const { estConnecte, utilisateur, chargementAuth } = useAuth();

  if (chargementAuth) {
    return <div style={{ textAlign: "center", marginTop: 100 }}>Chargement...</div>;
  }

  if (!estConnecte) {
    return <Navigate to="/connexion" replace />;
  }

  if (rolesAutorises && !rolesAutorises.includes(utilisateur.role)) {
    return <Navigate to="/acces-refuse" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;