import { useState } from 'react';
import { User, Mail, Phone, Building2, Calendar, Briefcase, Edit2, Save, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

export function EmployeeProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: 'Ana Kowalski',
    email: 'ana.kowalski@company.com',
    mobile: '+1 (555) 123-4567',
    department: 'Operations',
    position: 'Operations Lead',
    manager: 'John Smith',
    dateOfJoining: '2023-01-15',
    employmentType: 'Permanent',
  });

  const [editData, setEditData] = useState(profile);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData(profile);
  };

  const handleSave = () => {
    setProfile(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (field: string, value: string) => {
    setEditData({ ...editData, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                <User className="h-10 w-10 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{profile.fullName}</CardTitle>
                <CardDescription>{profile.position}</CardDescription>
                <p className="text-xs text-muted-foreground mt-1">{profile.employmentType} • {profile.department}</p>
              </div>
            </div>
            {!isEditing && (
              <Button
                onClick={handleEdit}
                variant="outline"
                className="gap-2"
              >
                <Edit2 className="h-4 w-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Profile Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </label>
              {isEditing ? (
                <Input
                  value={editData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="bg-background"
                />
              ) : (
                <p className="text-sm font-medium">{profile.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Mobile
              </label>
              {isEditing ? (
                <Input
                  value={editData.mobile}
                  onChange={(e) => handleChange('mobile', e.target.value)}
                  className="bg-background"
                />
              ) : (
                <p className="text-sm font-medium">{profile.mobile}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Employment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Department
              </label>
              {isEditing ? (
                <Input
                  value={editData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  className="bg-background"
                />
              ) : (
                <p className="text-sm font-medium">{profile.department}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Position
              </label>
              {isEditing ? (
                <Input
                  value={editData.position}
                  onChange={(e) => handleChange('position', e.target.value)}
                  className="bg-background"
                />
              ) : (
                <p className="text-sm font-medium">{profile.position}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Additional Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Additional Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Manager
                </label>
                {isEditing ? (
                  <Input
                    value={editData.manager}
                    onChange={(e) => handleChange('manager', e.target.value)}
                    className="bg-background"
                  />
                ) : (
                  <p className="text-sm font-medium">{profile.manager}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date of Joining
                </label>
                {isEditing ? (
                  <Input
                    type="date"
                    value={editData.dateOfJoining}
                    onChange={(e) => handleChange('dateOfJoining', e.target.value)}
                    className="bg-background"
                  />
                ) : (
                  <p className="text-sm font-medium">{profile.dateOfJoining}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Employment Type
                </label>
                {isEditing ? (
                  <select
                    value={editData.employmentType}
                    onChange={(e) => handleChange('employmentType', e.target.value)}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option>Permanent</option>
                    <option>Temporary</option>
                    <option>Contractor</option>
                  </select>
                ) : (
                  <p className="text-sm font-medium">{profile.employmentType}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Actions */}
      {isEditing && (
        <div className="flex gap-3 justify-end">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}
