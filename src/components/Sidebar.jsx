import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <h2>BFS STOCK</h2>
        <p>Gestion de stock</p>
      </div>

      <nav className="sidebar-menu">

        <Link to="/">
          🏠 Tableau de bord
        </Link>

        <Link to="/produits">
          📦 Produits
        </Link>

        <Link to="/categories">
          🗂️ Catégories
        </Link>

        <Link to="/fournisseurs">
          🚚 Fournisseurs
        </Link>

        <Link to="/entrees">
          📥 Entrées
        </Link>

        <Link to="/sorties">
          📤 Sorties
        </Link>

        <Link to="/utilisateurs">
          👤 Utilisateurs
        </Link>

      </nav>

    </aside>
  );
}

export default Sidebar;