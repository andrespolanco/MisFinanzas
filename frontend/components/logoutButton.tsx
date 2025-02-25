import { useAuth } from "@/hooks/useAuth";
import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

export function LogoutButton() { // 👈 Nombre cambiado aquí
    const { logout } = useAuth();
  
    return (
        <DropdownMenuItem onClick={logout} className="flex items-center gap-2">
        <LogOut className="h-4 w-4" />
        Cerrar Sesión
      </DropdownMenuItem>
    );
  }