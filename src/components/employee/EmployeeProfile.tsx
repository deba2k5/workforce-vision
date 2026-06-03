import { useState } from 'react';
import { User, Mail, Phone, Building2, Calendar, Briefcase, Edit2, Save, X, Download, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { jsPDF } from 'jspdf';

export function EmployeeProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
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

  const generateProfilePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPosition = 20;

      // Header
      pdf.setFontSize(20);
      pdf.text('Employee Profile Report', pageWidth / 2, yPosition, { align: 'center' });

      pdf.setFontSize(10);
      pdf.setTextColor(100);
      yPosition += 10;
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });

      // Main Profile Info
      yPosition += 20;
      pdf.setFontSize(14);
      pdf.setTextColor(0);
      pdf.text('Employee Information', 20, yPosition);

      yPosition += 15;
      pdf.setFontSize(10);
      const profileData = [
        ['Full Name:', profile.fullName],
        ['Email:', profile.email],
        ['Mobile:', profile.mobile],
        ['Department:', profile.department],
        ['Position:', profile.position],
        ['Manager:', profile.manager],
        ['Date of Joining:', profile.dateOfJoining],
        ['Employment Type:', profile.employmentType],
      ];

      profileData.forEach(([label, value]) => {
        pdf.text(label, 25, yPosition);
        pdf.setTextColor(0, 102, 204);
        pdf.text(value, 90, yPosition);
        pdf.setTextColor(0);
        yPosition += 8;
      });

      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(150);
      pdf.text('This is an official employee profile document', pageWidth / 2, pdf.internal.pageSize.getHeight() - 10, { align: 'center' });

      pdf.save(`${profile.fullName.replace(/\s+/g, '_')}_Profile_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
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
            <div className="flex gap-2">
              {!isEditing && (
                <>
                  <Button
                    onClick={generateProfilePDF}
                    disabled={isGeneratingPDF}
                    variant="outline"
                    className="gap-2"
                  >
                    {isGeneratingPDF ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                    Download PDF
                  </Button>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="outline"
                    className="gap-2"
                  >
                    <Edit2 className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </>
              )}
            </div>
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
