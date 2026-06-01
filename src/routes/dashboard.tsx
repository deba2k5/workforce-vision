import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { LogOut, Menu, X } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { WorkTracking } from '../components/dashboard/WorkTracking'
import { MultimediaUpload } from '../components/dashboard/MultimediaUpload'
import { DailyWorkReport } from '../components/dashboard/DailyWorkReport'
import { EmployeeProfile } from '../components/employee/EmployeeProfile'
import { TopBar } from '../components/dashboard/TopBar'
import { useNavigate } from '@tanstack/react-router'

function DashboardPage() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken')
    if (!authToken) {
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
            <h1 className="text-xl font-bold hidden md:block">Workforce Vision</h1>
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
        <TopBar />

        <Tabs defaultValue="work" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="work">Work Tracking</TabsTrigger>
            <TabsTrigger value="multimedia">Multimedia</TabsTrigger>
            <TabsTrigger value="report">Daily Report</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="work" className="space-y-6">
            <WorkTracking />
          </TabsContent>

          <TabsContent value="multimedia" className="space-y-6">
            <MultimediaUpload />
          </TabsContent>

          <TabsContent value="report" className="space-y-6">
            <DailyWorkReport />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <EmployeeProfile />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})
