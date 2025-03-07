import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  paymentMethod: string;
  category: {
    id: string;
    name: string;
    description: string;
  };
}

interface TransactionsProps {
  recentTransactions: Transaction[];
}

function toSentenceCase(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function RecentTransactions({ recentTransactions }: TransactionsProps) {
  return (
    <div className="space-y-6">
      {recentTransactions.map((tx) => (
        <div key={tx.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/avatars/${tx.category.id}.png`} alt="Avatar" />
            <AvatarFallback>{tx.category.name[0]}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{tx.description}</p>
            <p className="text-sm text-muted-foreground">
              {tx.category.name} - {toSentenceCase(tx.paymentMethod)} - {new Date(tx.date).toLocaleDateString()}
            </p>
          </div>
          <div
            // className={`ml-auto font-medium ${tx.category.name === "Ingresos" ? "text-green-500" : "text-red-500"}`}
            className={`ml-auto font-medium ${tx.category.name === "Ingresos" ? "text-green-500" : ""}`}
          >
            S/ {tx.category.name === "Ingresos" ? "" : "-"}{Number(tx.amount).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )
}
