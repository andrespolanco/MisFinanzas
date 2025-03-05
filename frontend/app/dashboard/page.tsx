import { AppSidebar } from "@/components/app-sidebar"
import { Chart01 } from "@/components/chart-1"
import { DrawRegister } from "@/components/draw-register"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* <--Cuerpo--> */}
        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div> */}


          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Ingresos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">S/. 45,231.89</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ahorros</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">S/. 12,234</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gastos en el último mes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">S/. 12,234</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Gastos en las últimas 24h</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">S/. 12,234</p>
              </CardContent>
            </Card>
          </div>

          <Chart01 />
        </div>
        {/* <--Cuerpo--> */}

      </SidebarInset>     

      {/* <--Modo oscuro--> */}
      <div className="fixed top-4 right-4 z-50">
        <ModeToggle />
      </div>
      {/* <--Modo oscuro--> */}
      
      {/* <--Boton de agregar transaccion--> */}
      <div className="fixed bottom-4 right-4 z-50">
        <DrawRegister />
      </div>
      {/* <--Boton de agregar transaccion--> */}
    </SidebarProvider>
  )
}
