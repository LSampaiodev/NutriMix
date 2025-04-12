
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/utils/auth";
import Header from "@/components/Header";
import Sidebar, { SidebarToggle } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Clock, Filter, Download, RefreshCw, AlertCircle, CheckCircle2, FileText } from "lucide-react";

// Types for audit logs
interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userId: string;
  action: string;
  details: Record<string, any>;
  level: "info" | "warning" | "error" | "critical";
}

// Sample audit logs for the demo
const SAMPLE_LOGS: AuditLog[] = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
    user: "admin",
    userId: "1",
    action: "login",
    details: {},
    level: "info"
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
    user: "admin",
    userId: "1",
    action: "xml_processed",
    details: { filename: "poultry_formula_v2.xml" },
    level: "info"
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    user: "operator",
    userId: "2",
    action: "xml_validation_success",
    details: { filename: "pig_feed_formula.xml" },
    level: "info"
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
    user: "operator",
    userId: "2",
    action: "xml_validation_failed",
    details: { 
      filename: "cattle_feed_test.xml",
      issues: ["XML contains DOCTYPE declaration, which could lead to XXE attacks"]
    },
    level: "warning"
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
    user: "operator",
    userId: "2",
    action: "login",
    details: {},
    level: "info"
  },
  {
    id: "6",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    user: "admin",
    userId: "1",
    action: "label_printed",
    details: { productName: "Premium Poultry Growth Feed" },
    level: "info"
  },
  {
    id: "7",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    user: "admin",
    userId: "1",
    action: "user_created",
    details: { username: "operator", role: "operator" },
    level: "info"
  },
  {
    id: "8",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    user: "system",
    userId: "0",
    action: "system_error",
    details: { error: "Database connection timeout" },
    level: "error"
  }
];

const Logs = () => {
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState("all");
  const [filterUser, setFilterUser] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  useEffect(() => {
    // In a real app, this would fetch from an API
    // We'll use localStorage + sample data for the demo
    const storedLogs = localStorage.getItem("audit_logs");
    let parsedLogs: any[] = [];
    
    if (storedLogs) {
      try {
        parsedLogs = JSON.parse(storedLogs);
        // Convert to the AuditLog format and add ids and levels if needed
        parsedLogs = parsedLogs.map((log, index) => ({
          id: log.id || `stored-${index}`,
          timestamp: log.timestamp,
          user: log.user,
          userId: log.userId,
          action: log.action,
          details: log.details || {},
          level: getLogLevel(log.action)
        }));
      } catch (e) {
        console.error("Error parsing audit logs:", e);
      }
    }
    
    // Combine with sample logs and sort by timestamp (newest first)
    const combinedLogs = [...parsedLogs, ...SAMPLE_LOGS]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    setLogs(combinedLogs);
  }, []);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Helper function to determine log level based on action
  function getLogLevel(action: string): "info" | "warning" | "error" | "critical" {
    if (action.includes("error") || action.includes("failed") || action === "login_failed") {
      return "error";
    } else if (action.includes("warning") || action.includes("validation_failed")) {
      return "warning";
    } else if (action.includes("critical")) {
      return "critical";
    } else {
      return "info";
    }
  }
  
  // Get unique actions for filtering
  const uniqueActions = ["all", ...new Set(logs.map(log => log.action))];
  
  // Get unique users for filtering
  const uniqueUsers = ["all", ...new Set(logs.map(log => log.user))];
  
  // Filter logs based on search term and filters
  const filteredLogs = logs.filter(log => {
    // Filter by search term
    const matchesSearchTerm = 
      searchTerm === "" ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(log.details).toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by action
    const matchesAction = filterAction === "all" || log.action === filterAction;
    
    // Filter by user
    const matchesUser = filterUser === "all" || log.user === filterUser;
    
    // Filter by level
    const matchesLevel = filterLevel === "all" || log.level === filterLevel;
    
    return matchesSearchTerm && matchesAction && matchesUser && matchesLevel;
  });
  
  // Helper to get an appropriate badge color for a log level
  const getLevelBadgeClass = (level: string) => {
    switch (level) {
      case "info":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "warning":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case "error":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "critical":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };
  
  // Helper to get an icon for a log action
  const getActionIcon = (action: string) => {
    if (action.includes("login")) {
      return <CheckCircle2 className="h-4 w-4" />;
    } else if (action.includes("error") || action.includes("failed")) {
      return <AlertCircle className="h-4 w-4" />;
    } else if (action.includes("xml")) {
      return <FileText className="h-4 w-4" />;
    } else {
      return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Audit Logs</h1>
              <p className="text-muted-foreground">
                Track and monitor system activity and security events
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <SidebarToggle toggleSidebar={toggleSidebar} />
              <Button variant="outline" onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <CardTitle>System Activity</CardTitle>
                      <CardDescription>
                        Comprehensive audit trail of system events and user actions
                      </CardDescription>
                    </div>
                    
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search logs..."
                        className="pl-9 w-full md:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-4">
                    <div className="flex items-center space-x-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Filters:</span>
                    </div>
                    
                    <Select value={filterAction} onValueChange={setFilterAction}>
                      <SelectTrigger className="h-8 w-auto">
                        <SelectValue placeholder="Action Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueActions.map(action => (
                          <SelectItem key={action} value={action}>
                            {action === "all" ? "All Actions" : action.replace(/_/g, ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={filterUser} onValueChange={setFilterUser}>
                      <SelectTrigger className="h-8 w-auto">
                        <SelectValue placeholder="User" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueUsers.map(user => (
                          <SelectItem key={user} value={user}>
                            {user === "all" ? "All Users" : user}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Select value={filterLevel} onValueChange={setFilterLevel}>
                      <SelectTrigger className="h-8 w-auto">
                        <SelectValue placeholder="Level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="error">Error</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="ghost" size="sm" onClick={() => {
                      setSearchTerm("");
                      setFilterAction("all");
                      setFilterUser("all");
                      setFilterLevel("all");
                    }}>
                      Clear Filters
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Level</TableHead>
                        <TableHead>Details</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs.length > 0 ? (
                        filteredLogs.map((log) => (
                          <TableRow 
                            key={log.id} 
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => setSelectedLog(log)}
                          >
                            <TableCell className="whitespace-nowrap">
                              {new Date(log.timestamp).toLocaleString()}
                            </TableCell>
                            <TableCell>{log.user}</TableCell>
                            <TableCell className="flex items-center">
                              <span className="mr-2">
                                {getActionIcon(log.action)}
                              </span>
                              {log.action.replace(/_/g, ' ')}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline" 
                                className={getLevelBadgeClass(log.level)}
                              >
                                {log.level}
                              </Badge>
                            </TableCell>
                            <TableCell className="truncate max-w-[150px]">
                              {log.details && Object.keys(log.details).length > 0 
                                ? JSON.stringify(log.details).substring(0, 30) + "..." 
                                : "No details"}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                            {logs.length === 0 
                              ? "No audit logs available."
                              : "No matching logs found."}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            
            <div className="col-span-1">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Log Details</CardTitle>
                  <CardDescription>
                    {selectedLog 
                      ? `Details for log #${selectedLog.id}` 
                      : "Select a log to view details"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedLog ? (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Timestamp</h3>
                        <p>{new Date(selectedLog.timestamp).toLocaleString()}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">User</h3>
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">
                            ID: {selectedLog.userId}
                          </Badge>
                          <span>{selectedLog.user}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Action</h3>
                        <div className="flex items-center">
                          {getActionIcon(selectedLog.action)}
                          <span className="ml-2">{selectedLog.action.replace(/_/g, ' ')}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Level</h3>
                        <Badge 
                          variant="outline" 
                          className={getLevelBadgeClass(selectedLog.level)}
                        >
                          {selectedLog.level}
                        </Badge>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Details</h3>
                        <ScrollArea className="h-[240px] border rounded-md p-4">
                          <pre className="text-xs whitespace-pre-wrap">
                            {JSON.stringify(selectedLog.details, null, 2)}
                          </pre>
                        </ScrollArea>
                      </div>
                      
                      <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                      <Clock className="h-12 w-12 mb-4 opacity-50" />
                      <p>Select a log entry to view details</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Logs;
