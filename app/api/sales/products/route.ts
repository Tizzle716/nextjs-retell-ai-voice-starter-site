import { NextResponse } from "next/server"
import { Product } from "@/app/types/sales"

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Widget",
    description: "High-quality widget for all your needs",
    price: 99.99, // Utilisez des nombres à virgule flottante pour représenter les prix
    category: "Widgets",
    createdAt: "2023-01-15T10:00:00Z",
    updatedAt: "2023-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Super Gadget",
    description: "Next-generation gadget with advanced features",
    price: 149,
    category: "Gadgets",
    createdAt: "2023-02-20T14:30:00Z",
    updatedAt: "2023-02-20T14:30:00Z",
  },
  {
    id: "3",
    name: "Eco-Friendly Gizmo",
    description: "Environmentally conscious gizmo for the modern home",
    price: 79,
    category: "Gizmos",
    createdAt: "2023-03-10T09:15:00Z",
    updatedAt: "2023-03-10T09:15:00Z",
  },
]

export async function GET() {
  return NextResponse.json(mockProducts)
}

export async function POST(request: Request) {
  const product: Product = await request.json()
  product.id = (mockProducts.length + 1).toString()
  product.createdAt = new Date().toISOString()
  product.updatedAt = new Date().toISOString()
  mockProducts.push(product)
  return NextResponse.json(product, { status: 201 })
}
