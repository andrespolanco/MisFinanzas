"use client"

import * as React from "react"
import { Minus, Plus } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer } from "recharts"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { PaymentRegisterMethod } from "./payment-register"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const data = [
  {
    goal: 400,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 239,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 349,
  },
]

export function DrawRegister() {
  const [goal, setGoal] = React.useState(350)

  function onClick(adjustment: number) {
    setGoal(Math.max(200, Math.min(400, goal + adjustment)))
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Registrar</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
        {/* <VisuallyHidden> */}
          <DrawerHeader>
            <DrawerTitle>Registra tu movimiento</DrawerTitle>
            <DrawerDescription>Lleva un control de tus gastos</DrawerDescription>
          </DrawerHeader>
          {/* </VisuallyHidden> */}

          <div className="pr-2 pl-2">
            <PaymentRegisterMethod />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
