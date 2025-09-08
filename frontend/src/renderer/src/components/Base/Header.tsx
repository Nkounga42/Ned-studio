import React from "react";
import { useAuth } from "@renderer/contexts/AuthContext";
import { LogOut, Settings, User } from "lucide-react";

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!user) return null;

  // Gestion sécurisée de displayName
  const displayName = (() => {
    if (!user.username) return "Utilisateur";
    if (typeof user.username === "string") return user.username;
    if (typeof user.username === "object") {
      const first = user.username.first ?? "";
      const last = user.username.last ?? "";
      const fullName = `${first} ${last}`.trim();
      return fullName || "Utilisateur";
    }
    return "Utilisateur";
  })();

  const firstLetter = displayName.charAt(0).toUpperCase();

  // Gestion sécurisée de l'email
  const email = typeof user.email === "string" ? user.email : "";

  return (
    <header className="bg-base-100 border-b border-base-300 px-4 py-1 sticky top-0 left-0 right-0 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold text-base-content">NED Studio</h1>
        </div>

        <div className="flex items-center gap-4"> 
          <div className="flex items-center gap-3">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-8 h-8 flex items-center justify-center">
                <span className="text-sm font-medium">{firstLetter}</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-base-content">{displayName}</p>
              {email && <p className="text-xs text-base-content/70">{email}</p>}
            </div>
          </div>


          <div className="flex items-center gap-2">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-sm"
              >
                <Settings className="w-4 h-4" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <a className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Profil
                  </a>
                </li>
                <li>
                  <a className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Paramètres
                  </a>
                </li> 
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-error hover:bg-error/10"
                  >
                    <LogOut className="w-4 h-4" />
                    Déconnexion
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
