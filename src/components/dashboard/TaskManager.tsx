import { useState } from 'react';
import { Trash2, Plus, CheckCircle2, Circle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
  completedDate?: string;
}

const COLORS = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#10b981',
  completed: '#8b5cf6',
  pending: '#6b7280',
  'in-progress': '#3b82f6'
};

export function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Complete quarterly report',
      description: 'Finish Q1 2025 performance review',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2025-03-15'
    },
    {
      id: '2',
      title: 'Team meeting preparation',
      description: 'Prepare slides for team sync',
      priority: 'medium',
      status: 'pending',
      dueDate: '2025-03-10'
    },
    {
      id: '3',
      title: 'Client presentation',
      description: 'Deliver product demo to client',
      priority: 'high',
      status: 'completed',
      dueDate: '2025-03-05',
      completedDate: '2025-03-04'
    },
    {
      id: '4',
      title: 'Documentation update',
      description: 'Update API documentation',
      priority: 'low',
      status: 'pending',
      dueDate: '2025-03-20'
    },
    {
      id: '5',
      title: 'Code review',
      description: 'Review pull requests',
      priority: 'medium',
      status: 'in-progress',
      dueDate: '2025-03-08'
    }
  ]);

  const [newTask, setNewTask] = useState({ title: '', priority: 'medium' as const });

  const addTask = () => {
    if (newTask.title.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: '',
        priority: newTask.priority,
        status: 'pending',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      };
      setTasks([...tasks, task]);
      setNewTask({ title: '', priority: 'medium' });
    }
  };

  const updateTaskStatus = (id: string, status: Task['status']) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? { ...task, status, completedDate: status === 'completed' ? new Date().toISOString().split('T')[0] : undefined }
        : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // Analytics data
  const taskStats = {
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
  };

  const completionRate = Math.round((taskStats.completed / tasks.length) * 100) || 0;

  const priorityData = [
    { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: COLORS.high },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: COLORS.medium },
    { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: COLORS.low }
  ];

  const weeklyProgress = [
    { week: 'Week 1', completed: 3, pending: 2 },
    { week: 'Week 2', completed: 5, pending: 1 },
    { week: 'Week 3', completed: 4, pending: 3 },
    { week: 'Week 4', completed: 6, pending: 2 }
  ];

  const productivityTrend = [
    { day: 'Mon', tasks: 3 },
    { day: 'Tue', tasks: 5 },
    { day: 'Wed', tasks: 4 },
    { day: 'Thu', tasks: 6 },
    { day: 'Fri', tasks: 7 },
    { day: 'Sat', tasks: 2 },
    { day: 'Sun', tasks: 1 }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{tasks.length}</div>
              <div className="text-xs text-muted-foreground mt-2">Total Tasks</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{taskStats.completed}</div>
              <div className="text-xs text-muted-foreground mt-2">Completed</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{taskStats.inProgress}</div>
              <div className="text-xs text-muted-foreground mt-2">In Progress</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{completionRate}%</div>
              <div className="text-xs text-muted-foreground mt-2">Completion Rate</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Task Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Completed', value: taskStats.completed, color: COLORS.completed },
                    { name: 'In Progress', value: taskStats.inProgress, color: COLORS['in-progress'] },
                    { name: 'Pending', value: taskStats.pending, color: COLORS.pending }
                  ]}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  <Cell fill={COLORS.completed} />
                  <Cell fill={COLORS['in-progress']} />
                  <Cell fill={COLORS.pending} />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">By Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6">
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" />
                <Bar dataKey="pending" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Productivity Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Weekly Productivity Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productivityTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="tasks"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Add Task */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Task
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="Task title..."
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && addTask()}
            />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
              className="px-3 py-2 border border-border rounded-md bg-background"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <Button onClick={addTask} className="gap-2">
              <Plus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <Card>
        <CardHeader>
          <CardTitle>Tasks ({tasks.length})</CardTitle>
          <CardDescription>Manage and track your tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-start gap-3 p-3 border border-border rounded-lg hover:bg-muted/50">
                <button
                  onClick={() => updateTaskStatus(
                    task.id,
                    task.status === 'completed' ? 'pending' : 'completed'
                  )}
                  className="mt-1"
                >
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </h4>
                    <Badge
                      variant="outline"
                      style={{
                        borderColor: COLORS[task.priority],
                        color: COLORS[task.priority]
                      }}
                    >
                      {task.priority}
                    </Badge>
                    <Badge variant="secondary">
                      {task.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTask(task.id)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
