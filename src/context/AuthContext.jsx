import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargementAuth, setChargementAuth] = useState(true);

  // =========================
  // CHARGER LE PROFIL DEPUIS LA TABLE utilisateurs
  // =========================

  const chargerProfil = async (authId) => {
    const { data, error } = await supabase
      .from("utilisateurs")
      .select("*")
      .eq("auth_id", authId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      nom: data.nom,
      username: data.username,
      role: data.role,
      statut: data.statut,
    };
  };

  // =========================
  // VERIFIER LA SESSION AU DEMARRAGE
  // =========================

  useEffect(() => {
    const verifierSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const profil = await chargerProfil(session.user.id);
        setUtilisateur(profil);
      }

      setChargementAuth(false);
    };

    verifierSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profil = await chargerProfil(session.user.id);
        setUtilisateur(profil);
      } else {
        setUtilisateur(null);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // =========================
  // CONNEXION
  // =========================

  const connexion = async (username, motDePasse) => {
    const email = `${username.trim().toLowerCase()}@bfsstock.local`;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: motDePasse,
    });

    if (error) {
      return { success: false, message: "Nom d'utilisateur ou mot de passe incorrect." };
    }

    const profil = await chargerProfil(data.user.id);

    if (!profil) {
      return { success: false, message: "Profil utilisateur introuvable." };
    }

    if (profil.statut !== "Actif") {
      await supabase.auth.signOut();
      return { success: false, message: "Ce compte est désactivé." };
    }

    setUtilisateur(profil);

    return { success: true, message: "Connexion réussie." };
  };

  // =========================
  // DECONNEXION
  // =========================

  const deconnexion = async () => {
    await supabase.auth.signOut();
    setUtilisateur(null);
  };

  return (
    <AuthContext.Provider
      value={{
         utilisateur,
        connexion,
        deconnexion,
        estConnecte: !!utilisateur,
        chargementAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}