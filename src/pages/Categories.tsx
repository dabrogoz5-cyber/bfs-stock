import { useState, FormEvent, ChangeEvent } from "react";
import { useStock } from "../context/StockContext.tsx";
import { exporterExcel } from "../utils/exporterExcel.ts";

interface FormulaireCategorie {
  nom: string;
  description: string;
}

function Categories() {
  const { categories, ajouterCategorie, modifierCategorie, supprimerCategorie } = useStock();

  const [formulaire, setFormulaire] = useState<FormulaireCategorie>({ nom: "", description: "" });
  const [modeEdition, setModeEdition] = useState<boolean>(false);
  const [categorieEnEdition, setCategorieEnEdition] = useState<number | null>(null);

  const reinitialiserFormulaire = () => {
    setFormulaire({ nom: "", description: "" });
    setModeEdition(false);
    setCategorieEnEdition(null);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formulaire.nom) {
      alert("Le nom de la catégorie est obligatoire.");
      return;
    }

    if (modeEdition && categorieEnEdition !== null) {
      await modifierCategorie(categorieEnEdition, formulaire);
    } else {
      await ajouterCategorie(formulaire);
    }

    reinitialiserFormulaire();
  };

  const handleModifier = (categorie: typeof categories[number]) => {
    setFormulaire({ nom: categorie.nom, description: categorie.description });
    setModeEdition(true);
    setCategorieEnEdition(categorie.id);
  };

  const handleSupprimer = (id: number) => {
    if (window.confirm("Supprimer cette catégorie ?")) {
      supprimerCategorie(id);
    }
  };

  const handleExporter = () => {
    const donnees = categories.map((categorie) => ({
      Nom: categorie.nom,
      Description: categorie.description,
    }));

    exporterExcel(donnees, "Categories_BFS_Stock");
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Liste des catégories ({categories.length})</h2>
          <button onClick={handleExporter} style={{ background: "#16a34a" }}>
            📊 Exporter Excel
          </button>
        </div>

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
                  <div className="actions-cell">
                    <button className="btn-modifier" onClick={() => handleModifier(categorie)}>✏️</button>
                    <button className="btn-supprimer" onClick={() => handleSupprimer(categorie.id)}>Supprimer</button>
                  </div>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr><td colSpan={3}>Aucune catégorie enregistrée.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Categories;