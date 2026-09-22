function Header() {
  return (
    <header className="header">
      <div className="header-user">

  <span>
    {utilisateur?.nom || "Utilisateur"}
  </span>

  <div className="user-avatar">
    {utilisateur?.nom?.charAt(0) || "U"}
  </div>

  <button
    onClick={handleDeconnexion}
    className="logout-button"
  >
    Déconnexion
  </button>

</div>

      <div>
        <h1>Tableau de bord</h1>
      </div>

      <div className="header-user">
        <span>Administrateur</span>

        <div className="user-avatar">
          A
        </div>
      </div>

    </header>
  );
}

export default Header;