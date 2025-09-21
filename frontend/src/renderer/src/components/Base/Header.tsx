import React from "react";
import { useAuth } from "@renderer/contexts/AuthContext";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";

const AccountAvatar: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

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
  return (
    <Link to="/profile" className="flex items-center gap-3">
      <div className="avatar placeholder">
        <div className="bg-primary text-primary-content rounded-full text-sm font-medium w-8 h-8 flex items-center justify-center">
          {firstLetter}
        </div>
      </div>
    </Link>
  );
};

export const HeaderSection = ({ search, setSearch, rightChildren }: { search: string, setSearch: (search: string) => void, rightChildren: React.ReactNode }) => {

  return (
    <div className="sticky top-0 px-4 py-3 z-10 bg-base-100/70 border-b border-base-300 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-3">
        <h1 className="text-2xl font-bold">Gestionnaire de Modules</h1>
        <div className="flex gap-2">
          {rightChildren && rightChildren}
          <AccountAvatar />
        </div>
      </div>

      {!search && !setSearch && (
        <div className="flex items-center justify-between mb-2">
          <div className="relative flex-1 max-w-md">
            <div className="absolute z-10 inset-y-0 top-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 " />
            </div>
            <input
              type="text"
              placeholder="Rechercher des plugins..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-bordered w-full pl-10 pr-4 input-sm focus:outline-none focus:border-primary"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute z-10 inset-y-0 top-0 right-0 pr-3 flex items-center"
              >
                <X className="h-4 w-4 " />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}