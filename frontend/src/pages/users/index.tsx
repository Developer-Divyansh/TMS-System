import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ProtectedRoute } from '../../components/auth';
import { Button, Input, Modal } from '../../components/common';
import api from '../../services/api';
import { User, Role, Team } from '../../types';

const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roleId: '',
    phoneNumber: '',
    isActive: true,
    teamIds: [] as string[],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersResponse = await api.get('/api/users');
        setUsers(usersResponse.data.data.users || []);

        // Fetch roles
        const rolesResponse = await api.get('/api/roles');
        setRoles(rolesResponse.data.data || []);

        // Fetch teams
        const teamsResponse = await api.get('/api/teams');
        setTeams(teamsResponse.data.data || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser?.role.name === 'Admin' || currentUser?.role.name === 'Manager') {
      fetchData();
    }
  }, [currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleTeamChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      teamIds: selectedOptions,
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await api.post('/api/users', formData);
      setUsers(prev => [response.data.data, ...prev]);
      setShowCreateModal(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        roleId: '',
        phoneNumber: '',
        isActive: true,
        teamIds: [],
      });
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '',
      roleId: user.role.id,
      phoneNumber: user.phoneNumber || '',
      isActive: user.isActive,
      teamIds: user.teams?.map(team => team.id) || [],
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedUser) return;
    
    try {
      const updateData = { ...formData };
      // Don't send password if it's empty
      if (!updateData.password) {
        delete updateData.password;
      }
      
      await api.patch(`/api/users/${selectedUser.id}`, updateData);
      
      setUsers(prev => 
        prev.map(user => 
          user.id === selectedUser.id 
            ? { ...user, ...updateData }
            : user
        )
      );
      
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await api.delete(`/api/users/${userId}`);
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : 'Unknown';
  };

  const getTeamNames = (teamIds: string[]) => {
    return teamIds.map(id => {
      const team = teams.find(t => t.id === id);
      return team ? team.name : 'Unknown';
    }).join(', ');
  };

  if (isLoading) {
    return (
      <ProtectedRoute requiredRole="Admin">
        <DashboardLayout>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="Admin">
      <DashboardLayout>
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage user accounts and permissions
            </p>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            Add User
          </Button>
        </div>

        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <li key={user.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center">
                              <span className="text-white font-medium">
                                {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </p>
                              <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">{user.email}</p>
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                              <span>Role: {getRoleName(user.role.id)}</span>
                              {user.phoneNumber && (
                                <span className="ml-4">Phone: {user.phoneNumber}</span>
                              )}
                            </div>
                            {user.teams && user.teams.length > 0 && (
                              <div className="mt-1 text-sm text-gray-500">
                                Teams: {user.teams.map(team => team.name).join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(user)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(user.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-5 text-center text-gray-500">
                No users found.
              </li>
            )}
          </ul>
        </div>

        {/* Create User Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Add New User"
          size="lg"
          footer={
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreate}>
                Create User
              </Button>
            </div>
          }
        >
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Phone Number"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Role"
                name="roleId"
                type="select"
                value={formData.roleId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </Input>
              
              <div className="flex items-center mt-6">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
            </div>
            
            <Input
              label="Teams"
              name="teamIds"
              type="select"
              value={formData.teamIds}
              onChange={handleTeamChange}
              multiple
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </Input>
          </form>
        </Modal>

        {/* Edit User Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit User"
          size="lg"
          footer={
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdate}>
                Update User
              </Button>
            </div>
          }
        >
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            
            <Input
              label="Password (leave blank to keep current)"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            
            <Input
              label="Phone Number"
              name="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleInputChange}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Role"
                name="roleId"
                type="select"
                value={formData.roleId}
                onChange={handleInputChange}
                required
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </Input>
              
              <div className="flex items-center mt-6">
                <input
                  id="isActive"
                  name="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
            </div>
            
            <Input
              label="Teams"
              name="teamIds"
              type="select"
              value={formData.teamIds}
              onChange={handleTeamChange}
              multiple
            >
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </Input>
          </form>
        </Modal>
      </DashboardLayout>
    </ProtectedRoute>
  );
};

export default UsersPage;