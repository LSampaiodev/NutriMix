import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, hasRole, logAuditEvent } from "@/infrastructure/api/auth";
import Header from "@/presentation/components/components/Header";
import Sidebar, { SidebarToggle } from "@/presentation/components/components/Sidebar";
import { Button } from "@/presentation/components/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/presentation/components/components/ui/card";
import { Input } from "@/presentation/components/components/ui/input";
import { Label } from "@/presentation/components/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/presentation/components/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/presentation/components/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/presentation/components/components/ui/dialog";
import { Alert, AlertDescription } from "@/presentation/components/components/ui/alert";
import { Badge } from "@/presentation/components/components/ui/badge";
import { Plus, Search, UserPlus, AlertCircle, User as UserIcon, Mail, Key, Shield } from "lucide-react";
import { toast } from "sonner";
import { userSchema, validateData } from "@/core/services/validation";

// Mock initial users for the demo
const INITIAL_USERS = [
  {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    role: "admin",
    status: "active",
    lastLogin: "2023-05-15T08:30:00Z"
  },
  {
    id: "2",
    username: "operator",
    email: "operator@example.com",
    role: "operator",
    status: "active",
    lastLogin: "2023-05-14T10:15:00Z"
  }
];

const Users = () => {
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [users, setUsers] = useState(INITIAL_USERS);
  
  // Form state
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "operator"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Check if user is authenticated and has admin role
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (!hasRole("admin")) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRoleChange = (value: string) => {
    setNewUser(prev => ({ ...prev, role: value }));
  };
  
  const handleAddUser = () => {
    // Validate form data
    const validation = validateData(userSchema, newUser);
    
    if (!validation.success) {
      setErrors(validation.errors || {});
      return;
    }
    
    // Clear any previous errors
    setErrors({});
    
    // Generate a new user ID
    const newUserId = (users.length + 1).toString();
    
    // Create new user object
    const userToAdd = {
      id: newUserId,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role as "admin" | "operator",
      status: "active",
      lastLogin: "Never"
    };
    
    // Add user to the list (in a real app, this would be an API call)
    setUsers(prevUsers => [...prevUsers, userToAdd]);
    
    // Log the action
    logAuditEvent("user_created", {
      username: newUser.username,
      role: newUser.role
    });
    
    // Show success toast
    toast.success(`User ${newUser.username} created successfully`);
    
    // Reset form and close dialog
    setNewUser({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "operator"
    });
    setIsAddUserOpen(false);
  };
  
  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">User Management</h1>
              <p className="text-muted-foreground">
                Manage system users and their permissions
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <SidebarToggle toggleSidebar={toggleSidebar} />
              
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center">
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Add User</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Create a new user account with the appropriate role and permissions.
                    </DialogDescription>
                  </DialogHeader>
                  
                  {errors._form && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{errors._form}</AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-4 py-2">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="username"
                          name="username"
                          placeholder="Enter username"
                          className="pl-9"
                          value={newUser.username}
                          onChange={handleInputChange}
                        />
                      </div>
                      {errors.username && (
                        <p className="text-sm text-destructive">{errors.username}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter email address"
                          className="pl-9"
                          value={newUser.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Enter password"
                          className="pl-9"
                          value={newUser.password}
                          onChange={handleInputChange}
                        />
                      </div>
                      {errors.password && (
                        <p className="text-sm text-destructive">{errors.password}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Key className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirm password"
                          className="pl-9"
                          value={newUser.confirmPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                        <Select
                          value={newUser.role}
                          onValueChange={handleRoleChange}
                        >
                          <SelectTrigger id="role" className="pl-9">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Administrator</SelectItem>
                            <SelectItem value="operator">Operator</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddUser}>
                      Create User
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>System Users</CardTitle>
                  <CardDescription>
                    Manage user accounts and their access roles
                  </CardDescription>
                </div>
                
                <div className="relative max-w-xs">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                            {user.role === "admin" ? "Administrator" : "Operator"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === "active" ? "outline" : "destructive"} className="bg-green-100 text-green-800 hover:bg-green-100">
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.lastLogin === "Never" 
                            ? "Never" 
                            : new Date(user.lastLogin).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-ration-danger"
                              disabled={user.username === "admin"} // Prevent deleting the main admin
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        {users.length === 0 
                          ? "No users found. Add some users to get started."
                          : "No matching users found."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredUsers.length} of {users.length} users
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Users;
