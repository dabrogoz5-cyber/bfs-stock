import { useState } from "react";
import { useStock } from "../context/StockContext.jsx";
import { exporterExcel } from "../utils/exporterExcel.js";

function Produit() {
  const {
    produits,
    categories,
    ajouterProduit,
    modifierProduit,
    supprimerProduit,
    calculerStock,
  } = useStock();

  const [formulaire, setFormulaire] = useState({
    nom: "",
    reference: "",
    categorie: "",
    seuilMinimum: "",
  });

  const [modeEdition, setModeEdition] = useState(false);
  const [produitEnEdition, setProduitEnEdition] = useState(null);

  const reinitialiserFormulaire = () => {
    setFormulaire({ nom: "", reference: "", categorie: "", seuilMinimum: "" });
    setModeEdition(false);
    setProduitEnEdition(null);
  };

  const handleChange = (e) => {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formulaire.nom || !formulaire.reference || !formulaire.categorie || !formulaire.seuilMinimum) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    if (modeEdition) {
      modifierProduit(produitEnEdition, formulaire);
    } else {
      ajouterProduit(formulaire);
    }

    reinitialiserFormulaire();
  };

  const handleModifier = (produit) => {
    setFormulaire({
      nom: produit.nom,
      reference: produit.reference,
      categorie: produit.categorie,
      seuilMinimum: produit.seuilMinimum,
    });
    setModeEdition(true);
    setProduitEnEdition(produit.id);
  };

  const handleSupprimer = (id) => {
    if (window.confirm("Supprimer ce produit ?")) {
      supprimerProduit(id);
    }
  };

  const handleExporter = () => {
    const donnees = produits.map((produit) => ({
      Référence: produit.reference,
      Nom: produit.nom,
      Catégorie: produit.categorie,
      "Stock actuel": calculerStock(produit.nom),
      "Seuil minimum": produit.seuilMinimum,
    }));

    exporterExcel(donnees, "Produits_BFS_Stock");
  };

  return (
    <div className="produits-page">
      <h1>Produits</h1>

      <div className="produit-form">
        <h2>{modeEdition ? "Modifier le produit" : "Ajouter un produit"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom du produit</label>
            <input type="text" name="nom" value={formulaire.nom} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Référence</label>
            <input type="text" name="reference" value={formulaire.reference} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Catégorie</label>
            <select name="categorie" value={formulaire.categorie} onChange={handleChange}>
              <option value="">-- Choisir une catégorie --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.nom}>{cat.nom}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Seuil minimum</label>
            <input type="number" name="seuilMinimum" value={formulaire.seuilMinimum} onChange={handleChange} />
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
          <h2>Liste des produits ({produits.length})</h2>
          <button onClick={handleExporter} style={{ background: "#16a34a" }}>
            📊 Exporter Excel
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Référence</th>
              <th>Nom</th>
              <th>Catégorie</th>
              <th>Stock</th>
              <th>Seuil</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {produits.map((produit) => {
              const stock = calculerStock(produit.nom);
              const classeStock = stock <= produit.seuilMinimum ? "stock-faible" : "stock-normal";

              return (
                <tr key={produit.id}>
                  <td>{produit.reference}</td>
                  <td>{produit.nom}</td>
                  <td>{produit.categorie}</td>
                  <td><span className={classeStock}>{stock}</span></td>
                  <td>{produit.seuilMinimum}</td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn-modifier" onClick={() => handleModifier(produit)}>✏️</button>
                      <button className="btn-supprimer" onClick={() => handleSupprimer(produit.id)}>Supprimer</button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {produits.length === 0 && (
              <tr><td colSpan="6">Aucun produit enregistré.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Produit;