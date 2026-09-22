import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient.js";

const StockContext = createContext();

export function StockProvider({ children }) {

  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);
  const [entrees, setEntrees] = useState([]);
  const [sorties, setSorties] = useState([]);
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [chargement, setChargement] = useState(true);

  // =========================
  // CONVERSION DB -> APP (snake_case vers camelCase)
  // =========================

  const convertirProduit = (p) => ({
    id: p.id,
    nom: p.nom,
    reference: p.reference,
    categorie: p.categorie,
    seuilMinimum: p.seuil_minimum,
  });

  const convertirUtilisateur = (u) => ({
  id: u.id,
  nom: u.nom,
  username: u.username,
  authId: u.auth_id,
  role: u.role,
  statut: u.statut,
});
  // =========================
  // CHARGEMENT INITIAL DE TOUTES LES DONNEES
  // =========================

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

  // =========================
  // CALCUL DU STOCK D'UN PRODUIT
  // =========================

  const calculerStock = (nomProduit) => {
    const totalEntrees = entrees
      .filter((e) => e.produit === nomProduit)
      .reduce((total, e) => total + Number(e.quantite), 0);

    const totalSorties = sorties
      .filter((s) => s.produit === nomProduit)
      .reduce((total, s) => total + Number(s.quantite), 0);

    return totalEntrees - totalSorties;
  };

  // =========================
  // PRODUITS - CRUD
  // =========================

  const ajouterProduit = async (produit) => {
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

  const modifierProduit = async (id, produitModifie) => {
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

  const supprimerProduit = async (id) => {
    const { error } = await supabase.from("produits").delete().eq("id", id);

    if (!error) {
      setProduits((anciens) => anciens.filter((p) => p.id !== id));
    }
  };

  // =========================
  // CATEGORIES - CRUD
  // =========================

  const ajouterCategorie = async (categorie) => {
    const { data, error } = await supabase.from("categories").insert(categorie).select().single();

    if (!error && data) {
      setCategories((anciennes) => [...anciennes, data]);
    }
  };

  const modifierCategorie = async (id, categorieModifiee) => {
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

  const supprimerCategorie = async (id) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (!error) {
      setCategories((anciennes) => anciennes.filter((c) => c.id !== id));
    }
  };

  // =========================
  // FOURNISSEURS - CRUD
  // =========================

  const ajouterFournisseur = async (fournisseur) => {
    const { data, error } = await supabase.from("fournisseurs").insert(fournisseur).select().single();

    if (!error && data) {
      setFournisseurs((anciens) => [...anciens, data]);
    }
  };

  const modifierFournisseur = async (id, fournisseurModifie) => {
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

  const supprimerFournisseur = async (id) => {
    const { error } = await supabase.from("fournisseurs").delete().eq("id", id);

    if (!error) {
      setFournisseurs((anciens) => anciens.filter((f) => f.id !== id));
    }
  };

  // =========================
  // AJOUTER UNE ENTREE
  // =========================

  const ajouterEntree = async (entree) => {
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

  // =========================
  // AJOUTER UNE SORTIE
  // =========================

  const ajouterSortie = async (sortie) => {
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

  // =========================
  // UTILISATEURS - CRUD
  // =========================

 const ajouterUtilisateur = async (utilisateur) => {
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

 const modifierUtilisateur = async (id, utilisateurModifie) => {
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
    

  const supprimerUtilisateur = async (id) => {
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

export function useStock() {
  return useContext(StockContext);
}