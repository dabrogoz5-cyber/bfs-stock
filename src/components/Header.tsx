import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";

function Header() {
  const navigate = useNavigate();
  const { utilisateur, deconnexion } = useAuth();

  const handleDeconnexion = async () => {
    await deconnexion();
    navigate("/connexion");
  };

  return (
    <header className="header">

      <div>
        <h1>Tableau de bord</h1>
      </div>

      <div className="header-user">

        <span>{utilisateur?.nom || "Utilisateur"}</span>

        <div className="user-avatar">
          {utilisateur?.nom?.charAt(0).toUpperCase() || "U"}
        </div>

        <button onClick={handleDeconnexion} className="logout-button">
          Déconnexion
        </button>

      </div>

    </header>
  );
}

export default Header;