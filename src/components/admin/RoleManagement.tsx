'use client';

import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { 
  Card,
  CardHeader,
  CardContent,
  CardTitle
} from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { Input } from '@/shared/components/Input';
import Alert from '@/shared/components/Alert';
import { Select } from '@/shared/components/Select';
import Checkbox from '@/shared/components/Checkbox';
import { 
  UserGroupIcon,
  ShieldCheckIcon,
  KeyIcon,
  ExclamationCircleIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/react/outline';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  createdAt: string;
  updatedAt?: string;
}

interface Permission {
  id: string;
  name: string;
  description: string;
  resource: string;
}

interface UserRole {
  userId: string;
  roleName: string;
  assignedAt: string;
  expiresAt?: string;
}

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      const [rolesRes, permissionsRes, userRolesRes] = await Promise.all([
        fetch('/api/admin/roles'),
        fetch('/api/admin/permissions'),
        fetch('/api/admin/user-roles')
      ]);

      const roles = await rolesRes.json();
      const permissions = await permissionsRes.json();
      const userRoles = await userRolesRes.json();

      setRoles(roles);
      setPermissions(permissions);
      setUserRoles(userRoles);
    } catch (error: any) {
      setError(error.message || 'Failed to load roles data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setIsEditing(false);
  };

  const handleCreateRole = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/admin/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newRole)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setRoles([...roles, data]);
      setNewRole({
        name: '',
        description: '',
        permissions: []
      });
    } catch (error: any) {
      setError(error.message || 'Failed to create role');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedRole) return;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/roles/${selectedRole.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selectedRole)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setRoles(roles.map(role => 
        role.id === selectedRole.id ? data : role
      ));
      setIsEditing(false);
    } catch (error: any) {
      setError(error.message || 'Failed to update role');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/admin/roles/${roleId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message);
      }

      setRoles(roles.filter(role => role.id !== roleId));
      if (selectedRole?.id === roleId) {
        setSelectedRole(null);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to delete role');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    if (!selectedRole) return;

    const updatedPermissions = selectedRole.permissions.some(p => p.id === permissionId)
      ? selectedRole.permissions.filter(p => p.id !== permissionId)
      : [...selectedRole.permissions, permissions.find(p => p.id === permissionId)!];

    setSelectedRole({
      ...selectedRole,
      permissions: updatedPermissions
    });
  };

  const groupPermissionsByResource = (perms: Permission[]) => {
    return perms.reduce((groups, permission) => {
      const resource = permission.resource;
      if (!groups[resource]) {
        groups[resource] = [];
      }
      groups[resource].push(permission);
      return groups;
    }, {} as Record<string, Permission[]>);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
        <Button
          onClick={() => setIsEditing(false)}
          variant="outline"
          className="flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Role
        </Button>
      </div>

      {error && (
        <Alert variant="error" className="mb-6">
          <ExclamationCircleIcon className="h-5 w-5" />
          <p>{error}</p>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-2" />
              Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {roles.map(role => (
                <button
                  key={role.id}
                  onClick={() => handleRoleSelect(role)}
                  className={`w-full text-left p-3 rounded-lg flex items-center justify-between ${
                    selectedRole?.id === role.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{role.name}</h3>
                    <p className="text-sm text-gray-500">{role.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {role.permissions.length} permissions
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Role Details/Edit */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShieldCheckIcon className="h-5 w-5 mr-2" />
              {isEditing ? 'Edit Role' : selectedRole ? 'Role Details' : 'Create Role'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedRole && !isEditing ? (
              <div className="text-center py-8">
                <ShieldCheckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">
                  Select a role to view or edit its details
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <Input
                    label="Role Name"
                    value={isEditing ? selectedRole?.name : newRole.name}
                    onChange={(e) => isEditing
                      ? setSelectedRole({ ...selectedRole!, name: e.target.value })
                      : setNewRole({ ...newRole, name: e.target.value })
                    }
                    disabled={!isEditing && !!selectedRole}
                  />
                  <Input
                    label="Description"
                    value={isEditing ? selectedRole?.description : newRole.description}
                    onChange={(e) => isEditing
                      ? setSelectedRole({ ...selectedRole!, description: e.target.value })
                      : setNewRole({ ...newRole, description: e.target.value })
                    }
                    disabled={!isEditing && !!selectedRole}
                  />
                </div>

                {/* Permissions */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Permissions
                  </h3>
                  <div className="space-y-6">
                    {Object.entries(groupPermissionsByResource(permissions)).map(([resource, perms]) => (
                      <div key={resource} className="space-y-2">
                        <h4 className="font-medium text-gray-700 capitalize">
                          {resource}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {perms.map(permission => (
                            <div
                              key={permission.id}
                              className="flex items-start space-x-3"
                            >
                              <Checkbox
                                checked={isEditing
                                  ? selectedRole?.permissions.some(p => p.id === permission.id)
                                  : newRole.permissions.includes(permission.id)
                                }
                                onChange={() => isEditing
                                  ? handlePermissionToggle(permission.id)
                                  : setNewRole({
                                      ...newRole,
                                      permissions: newRole.permissions.includes(permission.id)
                                        ? newRole.permissions.filter(id => id !== permission.id)
                                        : [...newRole.permissions, permission.id]
                                    })
                                }
                                disabled={!isEditing && !!selectedRole}
                              />
                              <div>
                                <p className="font-medium text-sm">
                                  {permission.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {permission.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  {selectedRole ? (
                    isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={handleUpdateRole}
                          loading={isLoading}
                        >
                          Save Changes
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleDeleteRole(selectedRole.id)}
                          loading={isLoading}
                          className="flex items-center"
                        >
                          <TrashIcon className="h-5 w-5 mr-2" />
                          Delete Role
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center"
                      >
                        <KeyIcon className="h-5 w-5 mr-2" />
                        Edit Role
                      </Button>
                    )
                  ) : (
                    <Button
                      onClick={handleCreateRole}
                      loading={isLoading}
                      disabled={!newRole.name || newRole.permissions.length === 0}
                    >
                      Create Role
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleManagement;
