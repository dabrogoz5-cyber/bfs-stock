import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../supabaseClient.ts";
import { useStock, Utilisateur } from "./StockContext.tsx";

interface ProfilConnecte {
  id: number;
  nom: string;
  username: string;
  role: string;
  statut: string;
}

interface ResultatConnexion {
  success: boolean;
  message: string;
}

interface AuthContextType {
  utilisateur: ProfilConnecte | null;
  connexion: (username: string, motDePasse: string) => Promise<ResultatConnexion>;
  deconnexion: () => Promise<void>;
  estConnecte: boolean;
  chargementAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [utilisateur, setUtilisateur] = useState<ProfilConnecte | null>(null);
  const [chargementAuth, setChargementAuth] = useState<boolean>(true);

  const chargerProfil = async (authId: string): Promise<ProfilConnecte | null> => {
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

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
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

  const connexion = async (username: string, motDePasse: string): Promise<ResultatConnexion> => {
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

  const deconnexion = async () => {
    await supabase.auth.signOut();
    setUtilisateur(null);
  };

  return (
    <AuthContext.Provider
      value={{ utilisateur, connexion, deconnexion, estConnecte: !!utilisateur, chargementAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider");
  }
  return context;
}