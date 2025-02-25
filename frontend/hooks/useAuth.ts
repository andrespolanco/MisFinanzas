"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/api/finanzas/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Credenciales inválidas");
      }

      setIsAuthenticated(true); // 🔹 Establece el estado como autenticado
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.message || "Error en el login. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/finanzas/auth/validate-session", {
        credentials: "include",
      });

      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fetch("http://localhost:3000/api/finanzas/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setIsAuthenticated(false);
      router.replace("/login"); // Redirigir al login después del logout
    } catch (err: any) {
      console.error("Error al cerrar sesión", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return { login, logout, isAuthenticated, loading, error };
}