import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { LogOut } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { WorkTracking } from '../components/dashboard/WorkTracking'
import { EmployeeProfile } from '../components/employee/EmployeeProfile'
import { TopBar } from '../components/dashboard/TopBar'
import { TaskManager } from '../components/dashboard/TaskManager'
import { LoginCalendar } from '../components/dashboard/LoginCalendar'
import { WorkingHourHeatmap } from '../components/dashboard/WorkingHourHeatmap'
import { ActivityReport } from '../components/dashboard/ActivityReport'
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
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:grid-cols-6 overflow-auto">
            <TabsTrigger value="work">Work Tracking</TabsTrigger>
            <TabsTrigger value="activity">Activity Report</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="calendar">Login Calendar</TabsTrigger>
            <TabsTrigger value="heatmap">Performance</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="work" className="space-y-6">
            <WorkTracking />
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <ActivityReport />
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <TaskManager />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <LoginCalendar />
          </TabsContent>

          <TabsContent value="heatmap" className="space-y-6">
            <WorkingHourHeatmap />
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
