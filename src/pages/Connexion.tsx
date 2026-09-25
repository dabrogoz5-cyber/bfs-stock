import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.tsx";
import { useStock } from "../context/StockContext.tsx";

function Connexion() {
  const navigate = useNavigate();
  const { connexion } = useAuth();
  const { chargement } = useStock();

  const [username, setUsername] = useState<string>("");
  const [motDePasse, setMotDePasse] = useState<string>("");
  const [erreur, setErreur] = useState<string>("");
  const [enCours, setEnCours] = useState<boolean>(false);

  const handleConnexion = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErreur("");
    setEnCours(true);

    const resultat = await connexion(username, motDePasse);

    setEnCours(false);

    if (resultat.success) {
      navigate("/");
    } else {
      setErreur(resultat.message);
    }
  };

  if (chargement) {
    return <div style={{ textAlign: "center", marginTop: 100 }}>Chargement...</div>;
  }

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <h1>BFS STOCK</h1>
          <p>Gestion de stock</p>
        </div>

        <h2>Connexion</h2>
        <p>Connectez-vous à votre espace de gestion</p>

        <form onSubmit={handleConnexion}>

          <div className="form-group">
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              placeholder="Entrez votre nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              placeholder="Entrez votre mot de passe"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
            />
          </div>

          {erreur && (
            <p className="login-error">❌ {erreur}</p>
          )}

          <button type="submit" className="login-button" disabled={enCours}>
            {enCours ? "Connexion..." : "Se connecter"}
          </button>

        </form>

        <div className="login-info">
          <p><strong>Compte administrateur</strong></p>
          <p>Utilisateur : admin</p>
          <p>Mot de passe : BFS@2026</p>
        </div>

      </div>
    </div>
  );
}

export default Connexion;