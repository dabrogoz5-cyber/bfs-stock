import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";

function AccesRefuse() {
  const { utilisateur } = useAuth();

  return (
    <div className="access-denied">
      <div className="access-denied-card">
        <div className="access-denied-icon">🚫</div>
        <h1>Accès refusé</h1>
        <p>Vous n'avez pas les autorisations nécessaires pour accéder à cette page.</p>
        <p className="access-denied-role">Votre rôle : {utilisateur?.role}</p>
        <Link to="/">Retour au tableau de bord</Link>
      </div>
    </div>
  );
}

export default AccesRefuse;