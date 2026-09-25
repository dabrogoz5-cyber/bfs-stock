import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../supabaseClient.ts";

// =========================
// TYPES
// =========================

export interface Produit {
  id: number;
  nom: string;
  reference: string;
  categorie: string;
  seuilMinimum: number;
}

export interface Categorie {
  id: number;
  nom: string;
  description: string;
}

export interface Fournisseur {
  id: number;
  nom: string;
  contact: string;
  telephone: string;
  email: string;
}

export interface Entree {
  id: number;
  produit: string;
  fournisseur: string;
  quantite: number;
  date: string;
}

export interface Sortie {
  id: number;
  produit: string;
  destination: string;
  quantite: number;
  date: string;
}

export interface Utilisateur {
  id: number;
  nom: string;
  username: string;
  authId: string;
  role: string;
  statut: string;
}

interface ResultatOperation {
  success: boolean;
  message: string;
}

interface StockContextType {
  produits: Produit[];
  ajouterProduit: (produit: Omit<Produit, "id">) => Promise<void>;
  modifierProduit: (id: number, produit: Omit<Produit, "id">) => Promise<void>;
  supprimerProduit: (id: number) => Promise<void>;

  categories: Categorie[];
  ajouterCategorie: (categorie: Omit<Categorie, "id">) => Promise<void>;
  modifierCategorie: (id: number, categorie: Omit<Categorie, "id">) => Promise<void>;
  supprimerCategorie: (id: number) => Promise<void>;

  fournisseurs: Fournisseur[];
  ajouterFournisseur: (fournisseur: Omit<Fournisseur, "id">) => Promise<void>;
  modifierFournisseur: (id: number, fournisseur: Omit<Fournisseur, "id">) => Promise<void>;
  supprimerFournisseur: (id: number) => Promise<void>;

  entrees: Entree[];
  ajouterEntree: (entree: Omit<Entree, "id">) => Promise<ResultatOperation>;

  sorties: Sortie[];
  ajouterSortie: (sortie: Omit<Sortie, "id">) => Promise<ResultatOperation>;

  utilisateurs: Utilisateur[];
  ajouterUtilisateur: (utilisateur: any) => Promise<ResultatOperation>;
  modifierUtilisateur: (id: number, utilisateur: any) => Promise<void>;
  supprimerUtilisateur: (id: number) => Promise<void>;

  calculerStock: (nomProduit: string) => number;
  chargement: boolean;
}

const StockContext = createContext<StockContextType | undefined>(undefined);

export function StockProvider({ children }: { children: ReactNode }) {

  const [produits, setProduits] = useState<Produit[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [entrees, setEntrees] = useState<Entree[]>([]);
  const [sorties, setSorties] = useState<Sortie[]>([]);
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [chargement, setChargement] = useState<boolean>(true);

  const convertirProduit = (p: any): Produit => ({
    id: p.id,
    nom: p.nom,
    reference: p.reference,
    categorie: p.categorie,
    seuilMinimum: p.seuil_minimum,
  });

  const convertirUtilisateur = (u: any): Utilisateur => ({
    id: u.id,
    nom: u.nom,
    username: u.username,
    authId: u.auth_id,
    role: u.role,
    statut: u.statut,
  });

  const chargerToutesLesDonnees = async () => {
    setChargement(true);

    const [
      { data: produitsData },
      { data: categoriesData },
      { data: fournisseursData },
      { data: entreesData },
      { data: sortiesData },
      { data: utilisateursData },
    ] = await Promise.all([
      supabase.from("produits").select("*").order("id"),
      supabase.from("categories").select("*").order("id"),
      supabase.from("fournisseurs").select("*").order("id"),
      supabase.from("entrees").select("*").order("id"),
      supabase.from("sorties").select("*").order("id"),
      supabase.from("utilisateurs").select("*").order("id"),
    ]);

    setProduits((produitsData || []).map(convertirProduit));
    setCategories(categoriesData || []);
    setFournisseurs(fournisseursData || []);
    setEntrees(entreesData || []);
    setSorties(sortiesData || []);
    setUtilisateurs((utilisateursData || []).map(convertirUtilisateur));

    setChargement(false);
  };

  useEffect(() => {
    chargerToutesLesDonnees();
  }, []);

  const calculerStock = (nomProduit: string): number => {
    const totalEntrees = entrees
      .filter((e) => e.produit === nomProduit)
      .reduce((total, e) => total + Number(e.quantite), 0);

    const totalSorties = sorties
      .filter((s) => s.produit === nomProduit)
      .reduce((total, s) => total + Number(s.quantite), 0);

    return totalEntrees - totalSorties;
  };

  const ajouterProduit = async (produit: Omit<Produit, "id">) => {
    const { data, error } = await supabase
      .from("produits")
      .insert({
        nom: produit.nom,
        reference: produit.reference,
        categorie: produit.categorie,
        seuil_minimum: Number(produit.seuilMinimum),
      })
      .select()
      .single();

    if (!error && data) {
      setProduits((anciens) => [...anciens, convertirProduit(data)]);
    }
  };

  const modifierProduit = async (id: number, produitModifie: Omit<Produit, "id">) => {
    const { data, error } = await supabase
      .from("produits")
      .update({
        nom: produitModifie.nom,
        reference: produitModifie.reference,
        categorie: produitModifie.categorie,
        seuil_minimum: Number(produitModifie.seuilMinimum),
      })
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      setProduits((anciens) => anciens.map((p) => (p.id === id ? convertirProduit(data) : p)));
    }
  };

  const supprimerProduit = async (id: number) => {
    const { error } = await supabase.from("produits").delete().eq("id", id);

    if (!error) {
      setProduits((anciens) => anciens.filter((p) => p.id !== id));
    }
  };

  const ajouterCategorie = async (categorie: Omit<Categorie, "id">) => {
    const { data, error } = await supabase.from("categories").insert(categorie).select().single();

    if (!error && data) {
      setCategories((anciennes) => [...anciennes, data]);
    }
  };

  const modifierCategorie = async (id: number, categorieModifiee: Omit<Categorie, "id">) => {
    const { data, error } = await supabase
      .from("categories")
      .update(categorieModifiee)
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      setCategories((anciennes) => anciennes.map((c) => (c.id === id ? data : c)));
    }
  };

  const supprimerCategorie = async (id: number) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (!error) {
      setCategories((anciennes) => anciennes.filter((c) => c.id !== id));
    }
  };

  const ajouterFournisseur = async (fournisseur: Omit<Fournisseur, "id">) => {
    const { data, error } = await supabase.from("fournisseurs").insert(fournisseur).select().single();

    if (!error && data) {
      setFournisseurs((anciens) => [...anciens, data]);
    }
  };

  const modifierFournisseur = async (id: number, fournisseurModifie: Omit<Fournisseur, "id">) => {
    const { data, error } = await supabase
      .from("fournisseurs")
      .update(fournisseurModifie)
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      setFournisseurs((anciens) => anciens.map((f) => (f.id === id ? data : f)));
    }
  };

  const supprimerFournisseur = async (id: number) => {
    const { error } = await supabase.from("fournisseurs").delete().eq("id", id);

    if (!error) {
      setFournisseurs((anciens) => anciens.filter((f) => f.id !== id));
    }
  };

  const ajouterEntree = async (entree: Omit<Entree, "id">): Promise<ResultatOperation> => {
    const nouvelleEntree = {
      produit: entree.produit,
      fournisseur: entree.fournisseur,
      quantite: Number(entree.quantite),
      date: entree.date || new Date().toLocaleDateString("fr-FR"),
    };

    const { data, error } = await supabase.from("entrees").insert(nouvelleEntree).select().single();

    if (error || !data) {
      return { success: false, message: "Erreur lors de l'enregistrement." };
    }

    setEntrees((anciennes) => [...anciennes, data]);

    return { success: true, message: "Entrée enregistrée avec succès." };
  };

  const ajouterSortie = async (sortie: Omit<Sortie, "id">): Promise<ResultatOperation> => {
    const stockDisponible = calculerStock(sortie.produit);

    if (Number(sortie.quantite) > stockDisponible) {
      return {
        success: false,
        message: `Stock insuffisant. Stock disponible : ${stockDisponible}`,
      };
    }

    const nouvelleSortie = {
      produit: sortie.produit,
      destination: sortie.destination,
      quantite: Number(sortie.quantite),
      date: sortie.date || new Date().toLocaleDateString("fr-FR"),
    };

    const { data, error } = await supabase.from("sorties").insert(nouvelleSortie).select().single();

    if (error || !data) {
      return { success: false, message: "Erreur lors de l'enregistrement." };
    }

    setSorties((anciennes) => [...anciennes, data]);

    return { success: true, message: "Sortie enregistrée avec succès." };
  };

  const ajouterUtilisateur = async (utilisateur: any): Promise<ResultatOperation> => {
    const { data, error } = await supabase.functions.invoke("create-user", {
      body: {
        nom: utilisateur.nom,
        username: utilisateur.username,
        motDePasse: utilisateur.motDePasse,
        role: utilisateur.role,
        statut: utilisateur.statut,
      },
    });

    if (error || data?.error) {
      return { success: false, message: data?.error || "Erreur lors de la création." };
    }

    setUtilisateurs((anciens) => [...anciens, convertirUtilisateur(data.utilisateur)]);

    return { success: true, message: "Utilisateur créé avec succès." };
  };

  const modifierUtilisateur = async (id: number, utilisateurModifie: any) => {
    const { data, error } = await supabase
      .from("utilisateurs")
      .update({
        nom: utilisateurModifie.nom,
        username: utilisateurModifie.username,
        role: utilisateurModifie.role,
        statut: utilisateurModifie.statut,
      })
      .eq("id", id)
      .select()
      .single();

    if (!error && data) {
      setUtilisateurs((anciens) => anciens.map((u) => (u.id === id ? convertirUtilisateur(data) : u)));
    }
  };

  const supprimerUtilisateur = async (id: number) => {
    const { error } = await supabase.from("utilisateurs").delete().eq("id", id);

    if (!error) {
      setUtilisateurs((anciens) => anciens.filter((u) => u.id !== id));
    }
  };

  return (
    <StockContext.Provider
      value={{
        chargement,
        produits, ajouterProduit, modifierProduit, supprimerProduit,
        categories, ajouterCategorie, modifierCategorie, supprimerCategorie,
        fournisseurs, ajouterFournisseur, modifierFournisseur, supprimerFournisseur,
        entrees, ajouterEntree,
        sorties, ajouterSortie,
        utilisateurs, ajouterUtilisateur, modifierUtilisateur, supprimerUtilisateur,
        calculerStock,
      }}
    >
      {children}
    </StockContext.Provider>
  );
}

export function useStock(): StockContextType {
  const context = useContext(StockContext);
  if (!context) {
    throw new Error("useStock doit être utilisé à l'intérieur d'un StockProvider");
  }
  return context;
}