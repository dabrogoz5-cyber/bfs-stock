import { useState } from "react";
import { useStock } from "../context/StockContext.jsx";
import { exporterExcel } from "../utils/exporterExcel.js";

function Sorties() {
  const { produits, sorties, ajouterSortie, calculerStock } = useStock();

  const [formulaire, setFormulaire] = useState({
    produit: "",
    destination: "",
    quantite: "",
    date: "",
  });

  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);

    if (!formulaire.produit || !formulaire.quantite) {
      setMessage({ type: "erreur", texte: "Veuillez choisir un produit et une quantité." });
      return;
    }

    const resultat = ajouterSortie(formulaire);

    if (resultat.success) {
      setMessage({ type: "succes", texte: resultat.message });
      setFormulaire({ produit: "", destination: "", quantite: "", date: "" });
    } else {
      setMessage({ type: "erreur", texte: resultat.message });
    }
  };

  const handleExporter = () => {
    const donnees = sorties.map((sortie) => ({
      Date: sortie.date,
      Produit: sortie.produit,
      Destination: sortie.destination,
      Quantité: sortie.quantite,
    }));

    exporterExcel(donnees, "Sorties_BFS_Stock");
  };

  return (
    <div className="sorties-page">
      <h1>Sorties de stock</h1>

      <div className="sortie-form">
        <h2>Nouvelle sortie</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Produit</label>
            <select name="produit" value={formulaire.produit} onChange={handleChange}>
              <option value="">-- Choisir un produit --</option>
              {produits.map((produit) => (
                <option key={produit.id} value={produit.nom}>
                  {produit.nom} (stock : {calculerStock(produit.nom)})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Destination</label>
            <input
              type="text"
              name="destination"
              value={formulaire.destination}
              onChange={handleChange}
              placeholder="Ex : Chantier Ouaga 2000"
            />
          </div>

          <div className="form-group">
            <label>Quantité</label>
            <input type="number" name="quantite" value={formulaire.quantite} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Date</label>
            <input type="date" name="date" value={formulaire.date} onChange={handleChange} />
          </div>

          {message && (
            <p className={message.type === "erreur" ? "erreur" : ""} style={message.type === "succes" ? { color: "#16a34a", marginBottom: 15 } : {}}>
              {message.type === "succes" ? "✅" : "❌"} {message.texte}
            </p>
          )}

          <button type="submit">Enregistrer la sortie</button>
        </form>
      </div>

      <div className="sortie-liste">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Historique des sorties ({sorties.length})</h2>
          <button onClick={handleExporter} style={{ background: "#16a34a" }}>
            📊 Exporter Excel
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Produit</th>
              <th>Destination</th>
              <th>Quantité</th>
            </tr>
          </thead>

          <tbody>
            {sorties.slice().reverse().map((sortie) => (
              <tr key={sortie.id}>
                <td>{sortie.date}</td>
                <td>{sortie.produit}</td>
                <td>{sortie.destination}</td>
                <td><strong>-{sortie.quantite}</strong></td>
              </tr>
            ))}

            {sorties.length === 0 && (
              <tr><td colSpan="4">Aucune sortie enregistrée.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Sorties;