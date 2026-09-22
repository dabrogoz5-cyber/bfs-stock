import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.jsx";
import { StockProvider } from "./context/StockContext.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";

import Connexion from "./pages/Connexion.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Produit from "./pages/Produit.jsx";
import Categories from "./pages/Categories.jsx";
import Fournisseur from "./pages/Fournisseur.jsx";
import Entrées from "./pages/Entrées.jsx";
import Sorties from "./pages/Sorties.jsx";
import Utilisateurs from "./pages/Utilisateurs.jsx";
import AccesRefuse from "./pages/AccesRefuse.jsx";

function App() {
  return (
    <StockProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            <Route path="/connexion" element={<Connexion />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/produits" element={<Produit />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/fournisseurs" element={<Fournisseur />} />
                <Route path="/entrees" element={<Entrées />} />
                <Route path="/sorties" element={<Sorties />} />
                <Route path="/acces-refuse" element={<AccesRefuse />} />

                <Route element={<ProtectedRoute rolesAutorises={["Administrateur"]} />}>
                  <Route path="/utilisateurs" element={<Utilisateurs />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/connexion" replace />} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </StockProvider>
  );
}

export default App;