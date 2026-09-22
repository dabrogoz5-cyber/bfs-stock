import { useState } from "react";
import { useStock } from "../context/StockContext.jsx";
import { exporterExcel } from "../utils/exporterExcel.js";

function Fournisseur() {
  const { fournisseurs, ajouterFournisseur, modifierFournisseur, supprimerFournisseur } = useStock();

  const [formulaire, setFormulaire] = useState({
    nom: "",
    contact: "",
    telephone: "",
    email: "",
  });

  const [modeEdition, setModeEdition] = useState(false);
  const [fournisseurEnEdition, setFournisseurEnEdition] = useState(null);

  const reinitialiserFormulaire = () => {
    setFormulaire({ nom: "", contact: "", telephone: "", email: "" });
    setModeEdition(false);
    setFournisseurEnEdition(null);
  };

  const handleChange = (e) => {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formulaire.nom) {
      alert("Le nom du fournisseur est obligatoire.");
      return;
    }

    if (modeEdition) {
      modifierFournisseur(fournisseurEnEdition, formulaire);
    } else {
      ajouterFournisseur(formulaire);
    }

    reinitialiserFormulaire();
  };

  const handleModifier = (fournisseur) => {
    setFormulaire({
      nom: fournisseur.nom,
      contact: fournisseur.contact,
      telephone: fournisseur.telephone,
      email: fournisseur.email,
    });
    setModeEdition(true);
    setFournisseurEnEdition(fournisseur.id);
  };

  const handleSupprimer = (id) => {
    if (window.confirm("Supprimer ce fournisseur ?")) {
      supprimerFournisseur(id);
    }
  };

  const handleExporter = () => {
    const donnees = fournisseurs.map((fournisseur) => ({
      Nom: fournisseur.nom,
      Contact: fournisseur.contact,
      Téléphone: fournisseur.telephone,
      Email: fournisseur.email,
    }));

    exporterExcel(donnees, "Fournisseurs_BFS_Stock");
  };

  return (
    <div className="produits-page">
      <h1>Fournisseurs</h1>

      <div className="produit-form">
        <h2>{modeEdition ? "Modifier le fournisseur" : "Ajouter un fournisseur"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom</label>
            <input type="text" name="nom" value={formulaire.nom} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Contact</label>
            <input type="text" name="contact" value={formulaire.contact} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            <input type="text" name="telephone" value={formulaire.telephone} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={formulaire.email} onChange={handleChange} />
          </div>

          <button type="submit">{modeEdition ? "Enregistrer" : "Ajouter"}</button>

          {modeEdition && (
            <button type="button" onClick={reinitialiserFormulaire} style={{ marginLeft: 10, background: "#6b7280" }}>
              Annuler
            </button>
          )}
        </form>
      </div>

      <div className="produit-liste">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Liste des fournisseurs ({fournisseurs.length})</h2>
          <button onClick={handleExporter} style={{ background: "#16a34a" }}>
            📊 Exporter Excel
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Contact</th>
              <th>Téléphone</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {fournisseurs.map((fournisseur) => (
              <tr key={fournisseur.id}>
                <td>{fournisseur.nom}</td>
                <td>{fournisseur.contact}</td>
                <td>{fournisseur.telephone}</td>
                <td>{fournisseur.email}</td>
                <td>
                  <div className="actions-cell">
                    <button className="btn-modifier" onClick={() => handleModifier(fournisseur)}>✏️</button>
                    <button className="btn-supprimer" onClick={() => handleSupprimer(fournisseur.id)}>Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}

            {fournisseurs.length === 0 && (
              <tr><td colSpan="5">Aucun fournisseur enregistré.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Fournisseur;