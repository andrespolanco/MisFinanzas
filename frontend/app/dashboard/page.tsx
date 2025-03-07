"use client";

import { Metadata } from "next"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { CalendarDateRangePicker } from "@/app/dashboard/components/date-range-picker"
import { MainNav } from "@/app/dashboard/components/main-nav"
import { Overview } from "@/app/dashboard/components/overview"
import { RecentTransactions } from "@/app/dashboard/components/recent-transactions"
import { Search } from "@/app/dashboard/components/search"
import TeamSwitcher from "@/app/dashboard/components/team-switcher"
import { UserNav } from "@/app/dashboard/components/user-nav"
import { useAuth } from "@/hooks/useAuth"; // Asegúrate de que la ruta sea correcta
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { DrawRegister } from "@/components/draw-register";

export default function DashboardPage() {

  const {
    getCurrentMonthExpenses,
    getLastWeekExpenses,
    getPreviousMonthExpenses,
    getRecentTransactions, // Agregado
    getTransactionsByMonth,
  } = useAuth();
  // Estados
  const [currentMonthExpenses, setCurrentMonthExpenses] = useState<number>(0);
  const [currentMonthIncome, setCurrentMonthIncome] = useState<number>(0);
  const [previousExpenses, setPreviousExpenses] = useState<number>(0);
  const [weeklyExpenses, setWeeklyExpenses] = useState<number>(0);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]); // Transacciones recientes
  const [transactionByMonth, setTransactionByMonth] = useState<{ name: string; total: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [currentMonth, previousMonth, currentWeek, recentTransactions, transactionByMonth] = await Promise.all([
          getCurrentMonthExpenses(),
          getPreviousMonthExpenses(),
          getLastWeekExpenses(),
          getRecentTransactions(),
          getTransactionsByMonth(),
        ]);
        console.log("Datos recibidos para el gráfico:", transactionByMonth); // Verifica si llegan datos

        if (currentMonth) {
          setCurrentMonthExpenses(currentMonth.totalExpenses || 0);
          setCurrentMonthIncome(currentMonth.totalIncomes || 0);
        }
        if (previousMonth) {
          setPreviousExpenses(previousMonth.totalExpenses || 0);
        }
        if (currentWeek) {
          setWeeklyExpenses(currentWeek.totalExpenses || 0);
        }
        if (recentTransactions) {
          setRecentTransactions(recentTransactions.data || []); // Guardamos las últimas 7 transacciones
        }
        if (transactionByMonth) {
          setTransactionByMonth(transactionByMonth || []); // Guardamos las transacciones por mes
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <ModeToggle />
              <UserNav />
            </div>
          </div>
        </div>
        
        <div className="flex-1 space-y-4 p-8 pt-6">
          {/* <--Boton de agregar transaccion--> */}
          <div className="fixed bottom-4 right-4 z-50">
            <DrawRegister />
          </div>
          {/* <--Boton de agregar transaccion--> */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
              <CalendarDateRangePicker />
              <Button className="w-full sm:w-auto">Download</Button>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics" disabled>
                Analytics
              </TabsTrigger>
              <TabsTrigger value="reports" disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Ingresos del mes
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">S/. {currentMonthIncome}</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Gastos del mes
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">S/. {currentMonthExpenses}</div>
                    <p className="text-xs text-muted-foreground">
                      +180.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Gastos de de la semana</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">S/. {weeklyExpenses}</div>
                    <p className="text-xs text-muted-foreground">
                      +19% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Gasto del mes anterior
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">S/. {previousExpenses}</div>
                    <p className="text-xs text-muted-foreground">
                      +201 since last hour
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <Overview transactionByMonth={transactionByMonth} />
                  </CardContent>
                </Card>
                <Card className="col-span-4 md:col-span-3">
                  <CardHeader>
                    <CardTitle>Ultimas transacciones</CardTitle>
                    <CardDescription>
                      Has realizado 265 transacciones este mes.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecentTransactions recentTransactions={recentTransactions}/>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
