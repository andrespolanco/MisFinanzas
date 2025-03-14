"use client";
import { LoginForm } from "@/components/login-form";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace("/dashboard2");
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return <p className="text-center mt-10">Cargando...</p>;
  }

  if (isAuthenticated) {
    return null; // 🔹 Si está autenticado, evita renderizar el login
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
      {/* <--Modo oscuro--> */}
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      {/* <--Modo oscuro--> */}
    </div>
  );
}