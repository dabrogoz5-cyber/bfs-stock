import { useState } from "react";
import { useStock } from "../context/StockContext.jsx";

function Categories() {
  const { categories, ajouterCategorie, modifierCategorie, supprimerCategorie } = useStock();

  const [formulaire, setFormulaire] = useState({ nom: "", description: "" });
  const [modeEdition, setModeEdition] = useState(false);
  const [categorieEnEdition, setCategorieEnEdition] = useState(null);

  const reinitialiserFormulaire = () => {
    setFormulaire({ nom: "", description: "" });
    setModeEdition(false);
    setCategorieEnEdition(null);
  };

  const handleChange = (e) => {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formulaire.nom) {
      alert("Le nom de la catégorie est obligatoire.");
      return;
    }

    if (modeEdition) {
      modifierCategorie(categorieEnEdition, formulaire);
    } else {
      ajouterCategorie(formulaire);
    }

    reinitialiserFormulaire();
  };

  const handleModifier = (categorie) => {
    setFormulaire({ nom: categorie.nom, description: categorie.description });
    setModeEdition(true);
    setCategorieEnEdition(categorie.id);
  };

  const handleSupprimer = (id) => {
    if (window.confirm("Supprimer cette catégorie ?")) {
      supprimerCategorie(id);
    }
  };

  return (
    <div className="categories-page">
      <h1>Catégories</h1>

      <div className="categorie-form">
        <h2>{modeEdition ? "Modifier la catégorie" : "Ajouter une catégorie"}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom</label>
            <input type="text" name="nom" value={formulaire.nom} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Description</label>
            <input type="text" name="description" value={formulaire.description} onChange={handleChange} />
          </div>

          <button type="submit">{modeEdition ? "Enregistrer" : "Ajouter"}</button>
        </form>

        {modeEdition && (
          <button type="button" onClick={reinitialiserFormulaire} style={{ marginTop: 10, background: "#6b7280" }}>
            Annuler
          </button>
        )}
      </div>

      <div className="categorie-liste">
        <h2>Liste des catégories ({categories.length})</h2>

        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((categorie) => (
              <tr key={categorie.id}>
                <td>{categorie.nom}</td>
                <td>{categorie.description}</td>
                <td>
                  <button onClick={() => handleModifier(categorie)} style={{ marginRight: 8 }}>✏️</button>
                  <button className="btn-supprimer" onClick={() => handleSupprimer(categorie.id)}>Supprimer</button>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr><td colSpan="3">Aucune catégorie enregistrée.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Categories;