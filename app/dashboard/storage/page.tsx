import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, FileText, Users } from "lucide-react"
import Link from "next/link"

const categories = [
  { title: "Documents", icon: FileText, count: 10, url: "/dashboard/storage/documents" },
  { title: "Products", icon: Package, count: 30, url: "/dashboard/products" },
  { title: "Contacts-Data", icon: Users, count: 50, url: "/dashboard/storage/contacts-data" },
]

export default function StorageOverview() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Storage Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link href={category.url} key={category.title}>
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {category.title}
                </CardTitle>
                <category.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{category.count}</div>
                <p className="text-xs text-muted-foreground">
                  files in directory
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

