"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://192.168.1.5:3000/api/finanzas";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Credenciales inválidas");
      }

      setIsAuthenticated(true);
      router.replace("/dashboard"); // 🔹 Permite regresar atrás
    } catch (err: any) {
      setError(err.message || "Error en el login. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const checkSession = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/validate-session`, {
        credentials: "include",
      });

      setIsAuthenticated(res.ok);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      setIsAuthenticated(false);
      router.push("/login");
    } catch (err: any) {
      console.error("Error al cerrar sesión", err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentMonthExpenses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/current-month/expenses`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error al obtener las transacciones");

      const data = await response.json();
      console.log("Gastos del mes actual:", data);
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const getLastWeekExpenses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/last-week/expenses`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error al obtener las transacciones");

      const data = await response.json();
      console.log("Gastos del mes actual:", data);
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const getPreviousMonthExpenses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/previous-month/expenses`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error al obtener las transacciones");

      const data = await response.json();
      console.log("Gastos del mes actual:", data);
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const getRecentTransactions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions?page=1&limit=7`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error al obtener las transacciones");

      const data = await response.json();
      console.log("Gastos del mes actual:", data);
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const getTransactionsByMonth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/transactions/transactions-by-month/expenses`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Error al obtener las transacciones");

      const data = await response.json();
      console.log("Gastos del mes actual:", data);
      return data;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return { login, logout, isAuthenticated, loading, error, getCurrentMonthExpenses, getLastWeekExpenses, getPreviousMonthExpenses , getRecentTransactions, getTransactionsByMonth};
}