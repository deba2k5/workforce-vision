import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ActivityReport from '@/components/dashboard/ActivityReport'
import TaskManager from '@/components/dashboard/TaskManager'
import LoginCalendar from '@/components/dashboard/LoginCalendar'
import WorkingHourHeatmap from '@/components/dashboard/WorkingHourHeatmap'
import WorkTracking from '@/components/dashboard/WorkTracking'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { TopBar } from '@/components/dashboard/TopBar'

export default function Dashboard() {
  const navigate = useNavigate()
  const [employeeId, setEmployeeId] = useState<string>('')

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const empId = localStorage.getItem('employeeId')

    if (!token) {
      navigate('/login')
      return
    }

    if (empId) {
      setEmployeeId(empId)
    }
  }, [navigate])

  if (!employeeId) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="flex-1 overflow-auto p-6">
          <Tabs defaultValue="work" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:grid-cols-6 overflow-auto">
              <TabsTrigger value="work">Work</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="tasks">Tasks</TabsTrigger>
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
              <TabsTrigger value="tracking">Tracking</TabsTrigger>
            </TabsList>

            <TabsContent value="work" className="mt-6">
              <ActivityReport employeeId={employeeId} />
            </TabsContent>

            <TabsContent value="activity" className="mt-6">
              <ActivityReport employeeId={employeeId} />
            </TabsContent>

            <TabsContent value="tasks" className="mt-6">
              <TaskManager employeeId={employeeId} />
            </TabsContent>

            <TabsContent value="calendar" className="mt-6">
              <LoginCalendar employeeId={employeeId} />
            </TabsContent>

            <TabsContent value="heatmap" className="mt-6">
              <WorkingHourHeatmap employeeId={employeeId} />
            </TabsContent>

            <TabsContent value="tracking" className="mt-6">
              <WorkTracking employeeId={employeeId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
