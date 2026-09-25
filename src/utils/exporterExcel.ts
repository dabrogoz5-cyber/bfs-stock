import * as XLSX from "xlsx";

export function exporterExcel(donnees: Record<string, any>[], nomFichier: string, nomFeuille: string = "Feuille1"): void {
  if (!donnees || donnees.length === 0) {
    alert("Aucune donnée à exporter.");
    return;
  }

  const feuille = XLSX.utils.json_to_sheet(donnees);
  const classeur = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(classeur, feuille, nomFeuille);

  const date = new Date().toLocaleDateString("fr-FR").replace(/\//g, "-");

  XLSX.writeFile(classeur, `${nomFichier}_${date}.xlsx`);
}