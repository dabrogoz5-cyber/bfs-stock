import { useState, FormEvent, ChangeEvent } from "react";
import { useStock } from "../context/StockContext.tsx";
import { exporterExcel } from "../utils/exporterExcel.ts";

interface FormulaireEntree {
  produit: string;
  fournisseur: string;
  quantite: string;
  date: string;
}

interface Message {
  type: "succes" | "erreur";
  texte: string;
}

function Entrees() {
  const { produits, fournisseurs, entrees, ajouterEntree, calculerStock } = useStock();

  const [formulaire, setFormulaire] = useState<FormulaireEntree>({
    produit: "",
    fournisseur: "",
    quantite: "",
    date: "",
  });

  const [message, setMessage] = useState<Message | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormulaire({ ...formulaire, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    if (!formulaire.produit || !formulaire.quantite) {
      setMessage({ type: "erreur", texte: "Veuillez choisir un produit et une quantité." });
      return;
    }

    const resultat = await ajouterEntree({
      produit: formulaire.produit,
      fournisseur: formulaire.fournisseur,
      quantite: Number(formulaire.quantite),
      date: formulaire.date,
    });

    if (resultat.success) {
      setMessage({ type: "succes", texte: resultat.message });
      setFormulaire({ produit: "", fournisseur: "", quantite: "", date: "" });
    } else {
      setMessage({ type: "erreur", texte: resultat.message });
    }
  };

  const handleExporter = () => {
    const donnees = entrees.map((entree) => ({
      Date: entree.date,
      Produit: entree.produit,
      Fournisseur: entree.fournisseur,
      Quantité: entree.quantite,
    }));

    exporterExcel(donnees, "Entrees_BFS_Stock");
  };

  return (
    <div className="entrees-page">
      <h1>Entrées de stock</h1>

      <div className="entree-form">
        <h2>Nouvelle entrée</h2>

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
            <label>Fournisseur</label>
            <select name="fournisseur" value={formulaire.fournisseur} onChange={handleChange}>
              <option value="">-- Choisir un fournisseur --</option>
              {fournisseurs.map((fournisseur) => (
                <option key={fournisseur.id} value={fournisseur.nom}>{fournisseur.nom}</option>
              ))}
            </select>
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

          <button type="submit">Enregistrer l'entrée</button>
        </form>
      </div>

      <div className="entree-liste">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Historique des entrées ({entrees.length})</h2>
          <button onClick={handleExporter} style={{ background: "#16a34a" }}>
            📊 Exporter Excel
          </button>
        </div>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Produit</th>
              <th>Fournisseur</th>
              <th>Quantité</th>
            </tr>
          </thead>

          <tbody>
            {entrees.slice().reverse().map((entree) => (
              <tr key={entree.id}>
                <td>{entree.date}</td>
                <td>{entree.produit}</td>
                <td>{entree.fournisseur}</td>
                <td><strong>+{entree.quantite}</strong></td>
              </tr>
            ))}

            {entrees.length === 0 && (
              <tr>
                <td colSpan={4}>Aucune entrée enregistrée.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Entrees;