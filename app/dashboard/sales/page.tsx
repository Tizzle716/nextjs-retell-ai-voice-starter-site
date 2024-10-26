import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import ProductsPage from "./products/page"
import ProposalPage from "./proposal/page"
import AnalysisPage from "./analysis/page"

export default function SalesPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Sales Dashboard</h1>
      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="proposal">Proposal</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Manage your product catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductsPage />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="proposal">
          <Card>
            <CardHeader>
              <CardTitle>Proposal</CardTitle>
              <CardDescription>Create and manage proposals</CardDescription>
            </CardHeader>
            <CardContent>
              <ProposalPage />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>Analysis</CardTitle>
              <CardDescription>Analyze your sales performance</CardDescription>
            </CardHeader>
            <CardContent>
              <AnalysisPage />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
