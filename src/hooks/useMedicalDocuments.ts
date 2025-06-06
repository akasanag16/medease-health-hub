
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface MedicalDocument {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  file_type: string | null;
  document_type: string | null;
  description: string | null;
  upload_date: string;
  created_at: string;
}

export const useMedicalDocuments = () => {
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('medical_documents')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching documents:', error);
        toast({
          title: "Error",
          description: "Failed to load documents",
          variant: "destructive"
        });
      } else {
        setDocuments(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (file: File, documentType?: string, description?: string) => {
    if (!user) return false;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('medical-documents')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading file:', uploadError);
        toast({
          title: "Upload failed",
          description: "Failed to upload file to storage",
          variant: "destructive"
        });
        return false;
      }

      // Save document metadata to database
      const { error: dbError } = await supabase
        .from('medical_documents')
        .insert([
          {
            user_id: user.id,
            file_name: file.name,
            file_path: fileName,
            file_size: file.size,
            file_type: file.type,
            document_type: documentType || null,
            description: description || null
          }
        ]);

      if (dbError) {
        console.error('Error saving document metadata:', dbError);
        toast({
          title: "Error",
          description: "Failed to save document information",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Document uploaded!",
        description: "Your medical document has been uploaded successfully",
      });
      fetchDocuments();
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    } finally {
      setUploading(false);
    }
  };

  const downloadDocument = async (filePath: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('medical-documents')
        .download(filePath);

      if (error) {
        console.error('Error downloading file:', error);
        toast({
          title: "Download failed",
          description: "Failed to download file",
          variant: "destructive"
        });
        return;
      }

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return {
    documents,
    loading,
    uploading,
    uploadDocument,
    downloadDocument,
    refetchDocuments: fetchDocuments
  };
};
