import { useStock, Produit } from "../context/StockContext.tsx";

interface ProduitAvecStock extends Produit {
  stock: number;
}

function Dashboard() {

  const {
    produits,
    entrees,
    sorties,
    fournisseurs,
    categories,
    utilisateurs,
    calculerStock,
  } = useStock();

  const stockTotal: number = produits.reduce(
    (total, produit) => total + calculerStock(produit.nom),
    0
  );

  const produitsStock: ProduitAvecStock[] = produits.map((produit) => ({
    ...produit,
    stock: calculerStock(produit.nom),
  }));

  return (

    <div className="dashboard">

      <div className="dashboard-title">
        <div>
          <h1>Tableau de bord</h1>
          <p>Bienvenue sur BFS Stock</p>
        </div>
      </div>

      <div className="stats-grid">

        <div className="stat-card card-blue">
          <div className="stat-icon">📦</div>
          <div>
            <p>Produits</p>
            <h2>{produits.length}</h2>
          </div>
        </div>

        <div className="stat-card card-green">
          <div className="stat-icon">📁</div>
          <div>
            <p>Catégories</p>
            <h2>{categories.length}</h2>
          </div>
        </div>

        <div className="stat-card card-orange">
          <div className="stat-icon">🚚</div>
          <div>
            <p>Fournisseurs</p>
            <h2>{fournisseurs.length}</h2>
          </div>
        </div>

        <div className="stat-card card-purple">
          <div className="stat-icon">📥</div>
          <div>
            <p>Entrées</p>
            <h2>{entrees.length}</h2>
          </div>
        </div>

        <div className="stat-card card-red">
          <div className="stat-icon">📤</div>
          <div>
            <p>Sorties</p>
            <h2>{sorties.length}</h2>
          </div>
        </div>

        <div className="stat-card card-cyan">
          <div className="stat-icon">👤</div>
          <div>
            <p>Utilisateurs</p>
            <h2>{utilisateurs.length}</h2>
          </div>
        </div>

      </div>

      <div className="dashboard-columns">

        <section className="dashboard-panel">
          <div className="panel-title">
            <h2>📊 État du stock</h2>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Catégorie</th>
                  <th>Stock actuel</th>
                  <th>État</th>
                </tr>
              </thead>

              <tbody>
                {produitsStock.map((produit) => {
                  let etat: string = "Normal";
                  let classe: string = "badge-normal";

                  if (produit.stock <= 0) {
                    etat = "Rupture";
                    classe = "badge-danger";
                  } else if (produit.stock <= produit.seuilMinimum) {
                    etat = "Stock faible";
                    classe = "badge-warning";
                  }

                  return (
                    <tr key={produit.id}>
                      <td><strong>{produit.nom}</strong></td>
                      <td>{produit.categorie}</td>
                      <td>{produit.stock}</td>
                      <td><span className={classe}>{etat}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dashboard-panel">
          <div className="panel-title">
            <h2>🕐 Activité récente</h2>
          </div>

          <div className="activity-list">

            {entrees.slice(-3).reverse().map((entree) => (
              <div className="activity-item" key={`entree-${entree.id}`}>
                <div className="activity-icon entry">↑</div>
                <div className="activity-info">
                  <strong>Entrée de {entree.quantite} {entree.produit}</strong>
                  <span>Fournisseur : {entree.fournisseur}</span>
                </div>
                <div className="activity-date">{entree.date}</div>
              </div>
            ))}

            {sorties.slice(-3).reverse().map((sortie) => (
              <div className="activity-item" key={`sortie-${sortie.id}`}>
                <div className="activity-icon exit">↓</div>
                <div className="activity-info">
                  <strong>Sortie de {sortie.quantite} {sortie.produit}</strong>
                  <span>Destination : {sortie.destination}</span>
                </div>
                <div className="activity-date">{sortie.date}</div>
              </div>
            ))}

            {entrees.length === 0 && sorties.length === 0 && (
              <p className="empty-message">Aucune activité récente.</p>
            )}

          </div>
        </section>

      </div>

      <div className="stock-summary">
        <div>
          <span>Stock total</span>
          <strong>{stockTotal}</strong>
          <small>unités disponibles</small>
        </div>
      </div>

    </div>

  );

}

export default Dashboard;