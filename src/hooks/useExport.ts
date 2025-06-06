
import { useToast } from '@/hooks/use-toast';

interface ExportData {
  appointments?: any[];
  medications?: any[];
  moodLogs?: any[];
  documents?: any[];
}

export const useExport = () => {
  const { toast } = useToast();

  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      toast({
        title: "No data to export",
        description: "There's no data available for export.",
        variant: "destructive"
      });
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Handle values that might contain commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value || '';
        }).join(',')
      )
    ].join('\n');

    downloadFile(csvContent, `${filename}.csv`, 'text/csv');
  };

  const exportToPDF = async (data: ExportData, filename: string) => {
    // Simple HTML to PDF conversion
    const htmlContent = generateHTMLReport(data);
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const generateHTMLReport = (data: ExportData) => {
    const today = new Date().toLocaleDateString();
    
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>MedEase Health Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #2563eb; }
            h2 { color: #1f2937; margin-top: 30px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f3f4f6; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 40px; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>MedEase Health Report</h1>
            <p>Generated on: ${today}</p>
          </div>
          
          ${data.appointments ? generateAppointmentsSection(data.appointments) : ''}
          ${data.medications ? generateMedicationsSection(data.medications) : ''}
          ${data.moodLogs ? generateMoodLogsSection(data.moodLogs) : ''}
          ${data.documents ? generateDocumentsSection(data.documents) : ''}
          
          <div class="no-print" style="margin-top: 40px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 5px; cursor: pointer;">
              Print Report
            </button>
          </div>
        </body>
      </html>
    `;
  };

  const generateAppointmentsSection = (appointments: any[]) => {
    if (!appointments.length) return '';
    
    return `
      <div class="section">
        <h2>Appointments</h2>
        <table>
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Specialty</th>
              <th>Status</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            ${appointments.map(apt => `
              <tr>
                <td>${apt.doctor_name}</td>
                <td>${new Date(apt.appointment_date).toLocaleDateString()}</td>
                <td>${apt.appointment_time}</td>
                <td>${apt.specialty || 'N/A'}</td>
                <td>${apt.status}</td>
                <td>${apt.location || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  };

  const generateMedicationsSection = (medications: any[]) => {
    if (!medications.length) return '';
    
    return `
      <div class="section">
        <h2>Medications</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Prescribed By</th>
              <th>Status</th>
              <th>Start Date</th>
            </tr>
          </thead>
          <tbody>
            ${medications.map(med => `
              <tr>
                <td>${med.name}</td>
                <td>${med.dosage}</td>
                <td>${med.frequency.replace('_', ' ')}</td>
                <td>${med.prescribed_by || 'N/A'}</td>
                <td>${med.is_active ? 'Active' : 'Inactive'}</td>
                <td>${med.start_date ? new Date(med.start_date).toLocaleDateString() : 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  };

  const generateMoodLogsSection = (moodLogs: any[]) => {
    if (!moodLogs.length) return '';
    
    return `
      <div class="section">
        <h2>Mood Tracking</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Mood Level</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            ${moodLogs.slice(0, 20).map(mood => `
              <tr>
                <td>${new Date(mood.log_date).toLocaleDateString()}</td>
                <td>${mood.mood_level.replace('_', ' ')}</td>
                <td>${mood.note || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  };

  const generateDocumentsSection = (documents: any[]) => {
    if (!documents.length) return '';
    
    return `
      <div class="section">
        <h2>Medical Documents</h2>
        <table>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Type</th>
              <th>Upload Date</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            ${documents.map(doc => `
              <tr>
                <td>${doc.file_name}</td>
                <td>${doc.document_type || 'N/A'}</td>
                <td>${new Date(doc.upload_date).toLocaleDateString()}</td>
                <td>${doc.description || 'N/A'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export successful",
      description: `File ${filename} has been downloaded.`,
    });
  };

  return {
    exportToCSV,
    exportToPDF
  };
};
