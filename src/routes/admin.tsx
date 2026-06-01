import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { AdminDashboard } from '../components/admin/AdminDashboard'
import { ReportReview } from '../components/admin/ReportReview'
import { TopBar } from '../components/dashboard/TopBar'
import { useNavigate } from '@tanstack/react-router'

function AdminPage() {
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is authenticated and is admin
    const authToken = localStorage.getItem('authToken')
    const userRole = localStorage.getItem('userRole')
    if (!authToken || userRole !== 'SuperAdmin') {
      navigate({ to: '/login' })
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('employeeId')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    navigate({ to: '/login' })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 md:px-6 h-16">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <div className="text-sm font-bold text-primary">WV</div>
            </div>
            <h1 className="text-xl font-bold hidden md:block">Workforce Vision - Admin</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
          <p className="text-muted-foreground">Monitor employees and manage work reports</p>
        </div>

        <Tabs defaultValue="monitoring" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="monitoring">Real-Time Monitoring</TabsTrigger>
            <TabsTrigger value="reports">Report Review</TabsTrigger>
          </TabsList>

          <TabsContent value="monitoring" className="space-y-6">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <ReportReview />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})
