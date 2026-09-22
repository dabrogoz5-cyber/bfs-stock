import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router-dom";

import { useState } from "react";

import { useAuth } from "../context/AuthContext.jsx";
import { useStock } from "../context/StockContext.jsx";


function Layout() {

  const navigate = useNavigate();

  const {
    utilisateur,
    deconnexion,
  } = useAuth();

  const {
    produits,
    calculerStock,
  } = useStock();

  const [alertesOuvertes, setAlertesOuvertes] = useState(false);


  // =====================================================
  // DECONNEXION
  // =====================================================

  const handleDeconnexion = () => {

    deconnexion();

    navigate("/connexion");

  };


  // =====================================================
  // CALCUL DES PRODUITS EN ALERTE
  // =====================================================

  const produitsEnAlerte = produits
    .map((produit) => ({
      ...produit,
      stock: calculerStock(produit.nom),
    }))
    .filter((produit) => produit.stock <= produit.seuilMinimum);

  const produitsEnRupture = produitsEnAlerte.filter((p) => p.stock <= 0);
  const produitsEnStockFaible = produitsEnAlerte.filter((p) => p.stock > 0);


  return (

    <div className="app-layout">


      {/* =================================================
          MENU LATERAL
      ================================================= */}

      <aside className="sidebar">


        {/* LOGO */}

        <div className="sidebar-logo">

          <h1>
            BFS STOCK
          </h1>

          <p>
            Gestion de stock
          </p>

        </div>


        {/* =================================================
            MENU
        ================================================= */}

        <nav className="sidebar-menu">


          {/* TABLEAU DE BORD */}

          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? "menu-link active"
                : "menu-link"
            }
          >

            <span className="menu-icon">
              🏠
            </span>

            <span>
              Tableau de bord
            </span>

          </NavLink>


          {/* PRODUITS */}

          <NavLink
            to="/produits"
            className={({ isActive }) =>
              isActive
                ? "menu-link active"
                : "menu-link"
            }
          >

            <span className="menu-icon">
              📦
            </span>

            <span>
              Produits
            </span>

          </NavLink>


          {/* CATEGORIES */}

          <NavLink
            to="/categories"
            className={({ isActive }) =>
              isActive
                ? "menu-link active"
                : "menu-link"
            }
          >

            <span className="menu-icon">
              📁
            </span>

            <span>
              Catégories
            </span>

          </NavLink>


          {/* FOURNISSEURS */}

          <NavLink
            to="/fournisseurs"
            className={({ isActive }) =>
              isActive
                ? "menu-link active"
                : "menu-link"
            }
          >

            <span className="menu-icon">
              🚚
            </span>

            <span>
              Fournisseurs
            </span>

          </NavLink>


          {/* ENTREES */}

          <NavLink
            to="/entrees"
            className={({ isActive }) =>
              isActive
                ? "menu-link active"
                : "menu-link"
            }
          >

            <span className="menu-icon">
              📥
            </span>

            <span>
              Entrées
            </span>

          </NavLink>


          {/* SORTIES */}

          <NavLink
            to="/sorties"
            className={({ isActive }) =>
              isActive
                ? "menu-link active"
                : "menu-link"
            }
          >

            <span className="menu-icon">
              📤
            </span>

            <span>
              Sorties
            </span>

          </NavLink>


          {/* =================================================
              UTILISATEURS
              ADMINISTRATEUR UNIQUEMENT
          ================================================= */}

          {utilisateur?.role === "Administrateur" && (

            <NavLink
              to="/utilisateurs"
              className={({ isActive }) =>
                isActive
                  ? "menu-link active"
                  : "menu-link"
              }
            >

              <span className="menu-icon">
                👤
              </span>

              <span>
                Utilisateurs
              </span>

            </NavLink>

          )}

        </nav>


        {/* =================================================
            INFORMATIONS UTILISATEUR
        ================================================= */}

        <div className="sidebar-user">


          <div className="sidebar-user-avatar">

            {utilisateur?.nom
              ? utilisateur.nom.charAt(0).toUpperCase()
              : "U"}

          </div>


          <div className="sidebar-user-info">

            <strong>
              {utilisateur?.nom || "Utilisateur"}
            </strong>

            <span>
              {utilisateur?.role || "Utilisateur"}
            </span>

          </div>

        </div>


        {/* =================================================
            BOUTON DECONNEXION
        ================================================= */}

        <div className="sidebar-logout">

          <button
            onClick={handleDeconnexion}
          >

            🚪

            <span>
              Déconnexion
            </span>

          </button>

        </div>


      </aside>


      {/* =================================================
          ZONE PRINCIPALE
      ================================================= */}

      <div className="main-area">


        {/* =================================================
            BARRE SUPERIEURE
        ================================================= */}

        <header className="top-header">


          <div className="header-title">

            <h2>
              BFS Stock
            </h2>

          </div>


          <div className="header-user">


            {/* =================================================
                CLOCHE D'ALERTES
            ================================================= */}

            <div className="alertes-container">

              <button
                className="alertes-bouton"
                onClick={() => setAlertesOuvertes(!alertesOuvertes)}
              >

                🔔

                {produitsEnAlerte.length > 0 && (
                  <span className="alertes-badge">
                    {produitsEnAlerte.length}
                  </span>
                )}

              </button>


              {alertesOuvertes && (

                <div className="alertes-dropdown">

                  <div className="alertes-dropdown-titre">
                    Alertes de stock
                  </div>


                  {produitsEnAlerte.length === 0 && (

                    <p className="alertes-vide">
                      Aucune alerte pour le moment.
                    </p>

                  )}


                  {produitsEnRupture.map((produit) => (

                    <div className="alertes-item" key={`rupture-${produit.id}`}>

                      <span className="alertes-icone rupture">
                        ⛔
                      </span>

                      <div>

                        <strong>
                          {produit.nom}
                        </strong>

                        <p>
                          Rupture de stock
                        </p>

                      </div>

                    </div>

                  ))}


                  {produitsEnStockFaible.map((produit) => (

                    <div className="alertes-item" key={`faible-${produit.id}`}>

                      <span className="alertes-icone faible">
                        ⚠️
                      </span>

                      <div>

                        <strong>
                          {produit.nom}
                        </strong>

                        <p>
                          Stock faible : {produit.stock} / seuil {produit.seuilMinimum}
                        </p>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>


            <span>
              {utilisateur?.nom || "Administrateur"}
            </span>


            <div className="user-avatar">

              {utilisateur?.nom
                ? utilisateur.nom.charAt(0).toUpperCase()
                : "A"}

            </div>


          </div>

        </header>


        {/* =================================================
            CONTENU DES PAGES
        ================================================= */}

        <main className="page-content">

          <Outlet />

        </main>


      </div>

    </div>

  );

}


export default Layout;