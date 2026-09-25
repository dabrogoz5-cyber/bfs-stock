import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext.tsx";
import { StockProvider } from "./context/StockContext.tsx";

import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Layout from "./components/Layout.tsx";

import Connexion from "./pages/Connexion.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Produit from "./pages/Produit.tsx";
import Categories from "./pages/Categories.tsx";
import Fournisseur from "./pages/Fournisseur.tsx";
import Entree from "./pages/Entree.tsx";
import Sorties from "./pages/Sorties.tsx";
import Utilisateurs from "./pages/Utilisateur.tsx";
import AccesRefuse from "./pages/AccesRefuse.tsx";

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
                <Route path="/entrees" element={<Entree />} />
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