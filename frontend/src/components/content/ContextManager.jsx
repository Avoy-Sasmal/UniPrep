import { useState, useEffect } from 'react';
import { Upload, FileText, X, Cloud, Loader2, Eye, Download, Share2 } from 'lucide-react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ContextManager = ({ subjectId }) => {
  const navigate = useNavigate();
  const [contexts, setContexts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    type: 'syllabus',
    title: '',
    content: '',
    topic: '',
    keywords: ''
  });
  const [file, setFile] = useState(null);
  const [cloudinaryUrl, setCloudinaryUrl] = useState(null);
  const [cloudinaryPublicId, setCloudinaryPublicId] = useState(null);
  const [uploadingToCloudinary, setUploadingToCloudinary] = useState(false);

  useEffect(() => {
    fetchContexts();
  }, [subjectId]);

  const fetchContexts = async () => {
    try {
      const response = await api.get(`/context/${subjectId}`);
      setContexts(response.data);
    } catch (error) {
      console.error('Failed to fetch contexts:', error);
    }
  };

  const handleCloudinaryUpload = async (fileToUpload) => {
    if (!fileToUpload) return;
    
    setUploadingToCloudinary(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', fileToUpload);
      
      const response = await api.post('/cloudinary/upload', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setCloudinaryUrl(response.data.url);
      setCloudinaryPublicId(response.data.public_id);
      alert('File uploaded to Cloudinary successfully!');
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      alert('Failed to upload file to Cloudinary. You can still upload directly.');
    } finally {
      setUploadingToCloudinary(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('subjectId', subjectId);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('title', formData.title);
      
      // If Cloudinary URL exists, use it; otherwise use direct file upload or content
      if (cloudinaryUrl) {
        // Send Cloudinary URL in a format the backend can parse
        formDataToSend.append('content', `[Cloudinary File]\nURL: ${cloudinaryUrl}\nPublic ID: ${cloudinaryPublicId}`);
      } else if (file) {
        formDataToSend.append('file', file);
      } else {
        formDataToSend.append('content', formData.content);
      }
      
      formDataToSend.append('topic', formData.topic);
      formDataToSend.append('keywords', formData.keywords);

      await api.post('/context', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setShowModal(false);
      setFormData({ type: 'syllabus', title: '', content: '', topic: '', keywords: '' });
      setFile(null);
      setCloudinaryUrl(null);
      setCloudinaryPublicId(null);
      fetchContexts();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload context');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this context?')) return;
    try {
      await api.delete(`/context/${id}`);
      fetchContexts();
    } catch (error) {
      alert('Failed to delete context');
    }
  };

  const handleViewFile = (context) => {
    let fileUrl = null;
    
    // Extract URL from context
    if (context.fileUrl && context.fileUrl.startsWith('http')) {
      fileUrl = context.fileUrl;
    } else if (context.content && context.content.startsWith('http')) {
      fileUrl = context.content;
    } else if (context.content && context.content.includes('[Cloudinary File]')) {
      // Extract Cloudinary URL from content string
      const urlMatch = context.content.match(/URL:\s*(https?:\/\/[^\s]+)/);
      if (urlMatch) {
        fileUrl = urlMatch[1];
      }
    }
    
    if (fileUrl) {
      // Check if it's a PDF - Cloudinary raw files need special handling
      const isPDF = fileUrl.toLowerCase().includes('.pdf') || 
                   fileUrl.includes('format=pdf') || 
                   fileUrl.includes('resource_type=raw') ||
                   (context.content && context.content.toLowerCase().includes('pdf'));
      
      if (isPDF) {
        // For PDFs, try to open in new tab with proper viewer
        // Cloudinary raw files can be viewed directly
        window.open(fileUrl, '_blank');
      } else {
        // For other files, open directly
        window.open(fileUrl, '_blank');
      }
    } else {
      // Show content in a modal or new page
      alert('File content:\n\n' + context.content.substring(0, 500) + (context.content.length > 500 ? '...' : ''));
    }
  };

  const handleShareToCommunity = async (context) => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('type', context.type === 'notes' ? 'notes' : 'notes');
      formDataToSend.append('title', context.title);
      
      // If context has a file URL, use it
      if (context.fileUrl) {
        formDataToSend.append('content', `[Cloudinary File]\nURL: ${context.fileUrl}`);
      } else {
        formDataToSend.append('content', context.content);
      }

      // Get user info for metadata
      const userResponse = await api.get('/auth/me');
      const user = userResponse.data;

      formDataToSend.append(
        'metadata',
        JSON.stringify({
          subject: 'Shared from Context',
          topic: context.metadata?.topic || context.title,
          semester: user.semester || 1,
          university: user.university || '',
          branch: user.branch || ''
        })
      );

      await api.post('/community/posts', formDataToSend);
      alert('Context shared to community successfully!');
      navigate('/community');
    } catch (error) {
      console.error('Share error:', error);
      alert('Failed to share to community. Please try again.');
    }
  };

  const typeLabels = {
    syllabus: 'Syllabus',
    pyq: 'Past Year Questions',
    notes: 'Notes',
    reference: 'Reference Material'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Context Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Upload size={20} />
          Upload Context
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contexts.map((context) => (
          <div key={context._id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {typeLabels[context.type]}
                </span>
                <h3 className="font-semibold mt-2">{context.title}</h3>
              </div>
              <button
                onClick={() => handleDelete(context._id)}
                className="text-red-600 hover:text-red-700"
              >
                <X size={18} />
              </button>
            </div>
            {context.metadata?.topic && (
              <p className="text-sm text-gray-600">Topic: {context.metadata.topic}</p>
            )}
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">
              {context.fileUrl ? '📎 File attached' : context.content.substring(0, 100) + '...'}
            </p>
            <div className="flex gap-2 mt-3">
              {(context.fileUrl || (context.content && context.content.startsWith('http'))) && (
                <button
                  onClick={() => handleViewFile(context)}
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50"
                >
                  <Eye size={14} />
                  View
                </button>
              )}
              {(context.fileUrl || (context.content && context.content.startsWith('http'))) && (
                <a
                  href={context.fileUrl || context.content}
                  download
                  className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 px-2 py-1 rounded hover:bg-green-50"
                >
                  <Download size={14} />
                  Download
                </a>
              )}
              <button
                onClick={() => handleShareToCommunity(context)}
                className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 px-2 py-1 rounded hover:bg-purple-50"
              >
                <Share2 size={14} />
                Share
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Upload Context</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="syllabus">Syllabus</option>
                  <option value="pyq">Past Year Questions</option>
                  <option value="notes">Notes</option>
                  <option value="reference">Reference Material</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload File (PDF/Text/Images/Videos) or Enter Content
                </label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept=".pdf,.txt,.doc,.docx,.jpg,.jpeg,.png,.mp4,.avi,.mov,.mkv,.webm,.mp3,.wav,.m4v"
                      onChange={(e) => {
                        const selectedFile = e.target.files[0];
                        if (selectedFile) {
                          setFile(selectedFile);
                          setCloudinaryUrl(null);
                          setCloudinaryPublicId(null);
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                    />
                    {file && (
                      <button
                        type="button"
                        onClick={() => handleCloudinaryUpload(file)}
                        disabled={uploadingToCloudinary}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploadingToCloudinary ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Cloud size={16} />
                            Upload to Cloudinary
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  {cloudinaryUrl && (
                    <div className="p-2 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-green-700">
                          ✓ File uploaded to Cloudinary
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            const isPDF = file && file.type === 'application/pdf';
                            const isVideo = file && file.type.startsWith('video/');
                            
                            if (isPDF) {
                              // For PDFs, ensure we use the correct URL format
                              // Cloudinary raw files can be viewed directly
                              window.open(cloudinaryUrl, '_blank');
                            } else if (isVideo) {
                              // For videos, open in new tab
                              window.open(cloudinaryUrl, '_blank');
                            } else {
                              window.open(cloudinaryUrl, '_blank');
                            }
                          }}
                          className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 flex items-center gap-1"
                        >
                          <Eye size={14} />
                          View
                        </button>
                      </div>
                      {file && file.type === 'application/pdf' && (
                        <div className="mt-2">
                          <div className="w-full h-64 border border-gray-300 rounded overflow-hidden">
                            <iframe
                              src={`${cloudinaryUrl}#toolbar=0`}
                              className="w-full h-full"
                              title="PDF Preview"
                              onError={(e) => {
                                // Fallback: show message if iframe fails
                                e.target.parentElement.innerHTML = `
                                  <div class="p-4 text-center text-gray-600">
                                    <p>PDF preview not available. Click "View" to open in new tab.</p>
                                    <a href="${cloudinaryUrl}" target="_blank" class="text-blue-600 hover:underline mt-2 inline-block">
                                      Open PDF
                                    </a>
                                  </div>
                                `;
                              }}
                            />
                          </div>
                        </div>
                      )}
                      {file && file.type.startsWith('video/') && (
                        <div className="mt-2">
                          <video
                            src={cloudinaryUrl}
                            controls
                            className="w-full max-h-64 rounded"
                            title="Video Preview"
                          >
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                    </div>
                  )}
                  {file && !cloudinaryUrl && (
                    <p className="text-xs text-gray-500">
                      File selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content (if not uploading file)
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic (Optional)
                </label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Upload
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFile(null);
                    setCloudinaryUrl(null);
                    setCloudinaryPublicId(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContextManager;

