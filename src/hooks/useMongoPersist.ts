import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for persisting data to MongoDB
 * Handles auto-saving to database when data changes
 */
export function useMongoPersist<T extends { id?: string }>(
  collectionName: string,
  initialData: T[],
  employeeId: string
) {
  const [data, setData] = useState<T[]>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save single item to MongoDB
  const saveItem = useCallback(
    async (item: T) => {
      try {
        setLoading(true);
        const response = await fetch('/api/mongodb/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            collection: collectionName,
            employeeId,
            data: item,
          }),
        });

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || 'Failed to save');
        }
        setError(null);
        return result.id;
      } catch (err: any) {
        setError(err.message);
        console.error(`Error saving to ${collectionName}:`, err);
      } finally {
        setLoading(false);
      }
    },
    [collectionName, employeeId]
  );

  // Update item in MongoDB
  const updateItem = useCallback(
    async (itemId: string, updates: Partial<T>) => {
      try {
        setLoading(true);
        const response = await fetch('/api/mongodb/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            collection: collectionName,
            employeeId,
            itemId,
            updates,
          }),
        });

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || 'Failed to update');
        }
        setError(null);
      } catch (err: any) {
        setError(err.message);
        console.error(`Error updating in ${collectionName}:`, err);
      } finally {
        setLoading(false);
      }
    },
    [collectionName, employeeId]
  );

  // Delete item from MongoDB
  const deleteItem = useCallback(
    async (itemId: string) => {
      try {
        setLoading(true);
        const response = await fetch('/api/mongodb/delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            collection: collectionName,
            itemId,
          }),
        });

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || 'Failed to delete');
        }
        setError(null);
      } catch (err: any) {
        setError(err.message);
        console.error(`Error deleting from ${collectionName}:`, err);
      } finally {
        setLoading(false);
      }
    },
    [collectionName]
  );

  // Fetch data from MongoDB
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/mongodb/query?collection=${collectionName}&employeeId=${employeeId}`
      );
      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error(`Error fetching from ${collectionName}:`, err);
    } finally {
      setLoading(false);
    }
  }, [collectionName, employeeId]);

  return {
    data,
    setData,
    saveItem,
    updateItem,
    deleteItem,
    fetchData,
    loading,
    error,
  };
}

/**
 * Hook for tracking employee activity in real-time
 */
export function useActivityTracking(employeeId: string, employeeName: string, email: string) {
  const [sessionStartTime] = useState(new Date());
  const [currentActivity, setCurrentActivity] = useState({
    status: 'active' as const,
    tasksCompleted: 0,
    productivity: 0,
  });

  // Track activity change
  const trackActivity = useCallback(
    async (data: any) => {
      try {
        const response = await fetch('/api/mongodb/track-activity', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            employeeId,
            employeeName,
            email,
            date: new Date().toISOString().split('T')[0],
            timestamp: new Date().toISOString(),
            ...data,
          }),
        });

        const result = await response.json();
        if (result.success) {
          setCurrentActivity(data);
        }
      } catch (err) {
        console.error('Error tracking activity:', err);
      }
    },
    [employeeId, employeeName, email]
  );

  return {
    currentActivity,
    trackActivity,
    sessionStartTime,
  };
}

/**
 * Hook for login/logout tracking
 */
export function useLoginTracking(employeeId: string, employeeName: string) {
  const [loginTime, setLoginTime] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const recordLogin = useCallback(async (location?: any) => {
    try {
      const response = await fetch('/api/mongodb/record-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId,
          employeeName,
          date: new Date().toISOString().split('T')[0],
          loginTime: new Date().toLocaleTimeString(),
          location,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setLoginTime(new Date().toLocaleTimeString());
        setSessionId(result.sessionId);
      }
    } catch (err) {
      console.error('Error recording login:', err);
    }
  }, [employeeId, employeeName]);

  const recordLogout = useCallback(async () => {
    try {
      if (!sessionId) return;

      const response = await fetch('/api/mongodb/record-logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          logoutTime: new Date().toLocaleTimeString(),
          duration: loginTime ? (new Date().getTime() - new Date(loginTime).getTime()) / 1000 / 60 : 0,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setLoginTime(null);
        setSessionId(null);
      }
    } catch (err) {
      console.error('Error recording logout:', err);
    }
  }, [sessionId, loginTime]);

  return {
    loginTime,
    sessionId,
    recordLogin,
    recordLogout,
  };
}
