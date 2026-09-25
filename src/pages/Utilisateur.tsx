import { useState, FormEvent, ChangeEvent } from "react";
import { useStock } from "../context/StockContext.tsx";
import { exporterExcel } from "../utils/exporterExcel.ts";

interface FormulaireUtilisateur {
  nom: string;
  username: string;
  motDePasse: string;
  role: string;
  statut: string;
}

function Utilisateurs() {
  const { utilisateurs, ajouterUtilisateur, modifierUtilisateur, supprimerUtilisateur } = useStock();

  const [formulaire, setFormulaire] = useState<FormulaireUtilisateur>({
    nom: "",
    username: "",
    motDePasse: "",
    role: "Utilisateur",
    statut: "Actif",
  });

  const [modeEdition, setModeEdition] = useState<boolean>(false);
  const [utilisateurEnEdition, setUtilisateurEnEdition] = useState<number | null>(null);
  const [enCours, setEnCours] = useState<boolean>(false);

  const reinitialiserFormulaire = () => {
    setFormulaire({ nom: "", username: "", motDePasse: "", role: "Utilisateur", statut: "Actif" });
    setModeEdition(false);
    setUtilisateurEnEdition(null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formulaire.nom || !formulaire.username) {
      alert("Veuillez remplir le nom et le nom d'utilisateur.");
      return;
    }

    if (!modeEdition && !formulaire.motDePasse) {
      alert("Veuillez définir un mot de passe pour ce nouvel utilisateur.");
      return;
    }

    setEnCours(true);

    if (modeEdition && utilisateurEnEdition !== null) {
      await modifierUtilisateur(utilisateurEnEdition, formulaire);
      reinitialiserFormulaire();
    } else {
      const resultat = await ajouterUtilisateur(formulaire);

      if (!resultat.success) {
        alert(resultat.message);
        setEnCours(false);
        return;
      }

      reinitialiserFormulaire();
    }

    setEnCours(false);
  };

  const handleModifier = (utilisateur: typeof utilisateurs[number]) => {
    setFormulaire({
      nom: utilisateur.nom,
      username: utilisateur.username,
      motDePasse: "",
      role: utilisateur.role,
      statut: utilisateur.statut,
    });
    setModeEdition(true);
    setUtilisateurEnEdition(utilisateur.id);
  };

  const handleSupprimer = (id: number) => {
    if (window.confirm("Supprimer cet utilisateur ?")) {
      supprimerUtilisateur(id);
    }
  };

  const handleExporter = () => {
    const donnees = utilisateurs.map((utilisateur) => ({
      Nom: utilisateur.nom,
      Utilisateur: utilisateur.username,
      Rôle: utilisateur.role,
      Statut: utilisateur.statut,
    }));

    exporterExcel(donnees, "Utilisateurs_BFS_Stock");
  };

  return (
    <div className="utilisateurs-page">
      <h1>Utilisateurs</h1>

      <div className="utilisateur-form">
        <h2>{modeEdition ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom complet</label>
            <input type="text" name="nom" value={formulaire.nom} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Nom d'utilisateur</label>
            <input type="text" name="username" value={formulaire.username} onChange={handleChange} disabled={modeEdition} />
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              name="motDePasse"
              value={formulaire.motDePasse}
              onChange={handleChange}
              placeholder={modeEdition ? "Non modifiable ici" : "Définir un mot de passe"}
              disabled={modeEdition}
            />
          </div>

          <div className="form-group">
            <label>Rôle</label>
            <select name="role" value={formulaire.role} onChange={handleChange}>
              <option value="Administrateur">Administrateur</option>
              <option value="Gestionnaire de stock">Gestionnaire de stock</option>
              <option value="Utilisateur">Utilisateur</option>
            </select>
          </div>

          <div className="form-group">
            <label>Statut</label>
            <select name="statut" value={formulaire.statut} onChange={handleChange}>
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
            </select>
          </div>

          <button type="submit" disabled={enCours}>
            {enCours ? "Enregistrement..." : modeEdition ? "Enregistrer" : "Ajouter"}
          </button>

          {modeEdition && (
            <button type="button" onClick={reinitialiserFormulaire} style={{ marginLeft: 10, background: "#6b7280" }}>
              Annuler
            </button>
          )}
        </form>
      </div>

      <div className="utilisateur-liste">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Liste des utilisateurs ({utilisateurs.length})</h2>
          <button onClick={handleExporter} style={{ background: "#16a34a" }}>
            📊 Exporter Excel
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Utilisateur</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {utilisateurs.map((utilisateur) => (
              <tr key={utilisateur.id}>
                <td>{utilisateur.nom}</td>
                <td>{utilisateur.username}</td>
                <td>{utilisateur.role}</td>
                <td>{utilisateur.statut}</td>
                <td>
                  <div className="actions-cell">
                    <button className="btn-modifier" onClick={() => handleModifier(utilisateur)}>✏️</button>
                    <button className="btn-supprimer" onClick={() => handleSupprimer(utilisateur.id)}>Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Utilisateurs;