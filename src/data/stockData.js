// =====================================================
// PRODUITS
// =====================================================

export const produitsInitials = [
  {
    id: 1,
    nom: "Câble",
    categorie: "Câble",
    description:
      "Câbles utilisés pour les installations réseau et fibre optique",
    prix: 5000,
    quantite: 100,
    seuilMinimum: 20,
  },

  {
    id: 2,
    nom: "ODF",
    categorie: "ODF",
    description:
      "Optical Distribution Frame pour la distribution de la fibre optique",
    prix: 150000,
    quantite: 15,
    seuilMinimum: 5,
  },

  {
    id: 3,
    nom: "PEHD",
    categorie: "PEHD",
    description:
      "Fourreaux PEHD pour la protection et le passage des câbles",
    prix: 2500,
    quantite: 200,
    seuilMinimum: 50,
  },

  {
    id: 4,
    nom: "BPE",
    categorie: "BPE",
    description:
      "Boîtiers de protection des épissures de fibre optique",
    prix: 75000,
    quantite: 20,
    seuilMinimum: 5,
  },
];


// =====================================================
// ENTREES
// =====================================================

export const entreesInitiales = [
  {
    id: 1,
    produit: "Câble",
    quantite: 50,
    fournisseur: "Huawei Technologies",
    date: "02/09/2026",
  },

  {
    id: 2,
    produit: "ODF",
    quantite: 10,
    fournisseur: "ZTE Corporation",
    date: "01/09/2026",
  },
];


// =====================================================
// SORTIES
// =====================================================

export const sortiesInitiales = [
  {
    id: 1,
    produit: "Câble",
    quantite: 20,
    destination: "Chantier fibre optique",
    responsable: "Équipe déploiement",
    date: "02/09/2026",
  },

  {
    id: 2,
    produit: "ODF",
    quantite: 2,
    destination: "Site Ouaga 2000",
    responsable: "Équipe maintenance",
    date: "01/09/2026",
  },
];


// =====================================================
// FOURNISSEURS
// =====================================================

export const fournisseursInitials = [
  {
    id: 1,
    nom: "Huawei Technologies",
    telephone: "+226 70 00 00 01",
    email: "contact@huawei.com",
    adresse: "Ouagadougou",
  },

  {
    id: 2,
    nom: "ZTE Corporation",
    telephone: "+226 70 00 00 02",
    email: "contact@zte.com",
    adresse: "Ouagadougou",
  },

  {
    id: 3,
    nom: "Fournisseur Fibre Burkina",
    telephone: "+226 70 00 00 03",
    email: "contact@fibreburkina.com",
    adresse: "Ouagadougou",
  },
];


// =====================================================
// CATEGORIES
// =====================================================

export const categoriesInitiales = [
  {
    id: 1,
    nom: "Câble",
    description:
      "Câbles utilisés pour les installations réseau et fibre optique",
  },

  {
    id: 2,
    nom: "ODF",
    description:
      "Optical Distribution Frame pour la distribution de la fibre optique",
  },

  {
    id: 3,
    nom: "PEHD",
    description:
      "Fourreaux PEHD pour la protection et le passage des câbles",
  },

  {
    id: 4,
    nom: "BPE",
    description:
      "Boîtiers de protection des épissures de fibre optique",
  },
];


// =====================================================
// UTILISATEURS
// =====================================================

export const utilisateursInitials = [
  {
    id: 1,
    nom: "Administrateur",
    email: "admin@bfs.com",
    telephone: "+226 70 00 00 00",
    role: "Administrateur",
    statut: "Actif",
  },

  {
    id: 2,
    nom: "Gestionnaire Stock",
    email: "stock@bfs.com",
    telephone: "+226 70 00 00 01",
    role: "Gestionnaire de stock",
    statut: "Actif",
  },

  {
    id: 3,
    nom: "Utilisateur",
    email: "user@bfs.com",
    telephone: "+226 70 00 00 02",
    role: "Utilisateur",
    statut: "Actif",
  },
];