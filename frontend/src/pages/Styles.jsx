import { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Edit } from 'lucide-react';
import api from '../services/api';

const Styles = () => {
  const [styles, setStyles] = useState([]);
  const [defaults, setDefaults] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStyle, setEditingStyle] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sections: [],
    tone: 'formal_exam',
    maxWordCount: '',
    approximateLength: 'medium',
    instructions: ''
  });
  const [newSection, setNewSection] = useState('');

  useEffect(() => {
    fetchStyles();
    fetchDefaults();
  }, []);

  const fetchStyles = async () => {
    try {
      const response = await api.get('/styles');
      setStyles(response.data);
    } catch (error) {
      console.error('Failed to fetch styles:', error);
    }
  };

  const fetchDefaults = async () => {
    try {
      const response = await api.get('/styles/defaults');
      setDefaults(response.data);
    } catch (error) {
      console.error('Failed to fetch defaults:', error);
    }
  };

  const handleUseDefault = async (defaultStyle) => {
    try {
      await api.post('/styles', {
        ...defaultStyle,
        isDefault: false
      });
      fetchStyles();
    } catch (error) {
      alert('Failed to create style');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStyle) {
        await api.put(`/styles/${editingStyle._id}`, formData);
      } else {
        await api.post('/styles', formData);
      }
      setShowModal(false);
      setEditingStyle(null);
      setFormData({
        name: '',
        sections: [],
        tone: 'formal_exam',
        maxWordCount: '',
        approximateLength: 'medium',
        instructions: ''
      });
      fetchStyles();
    } catch (error) {
      alert('Failed to save style');
    }
  };

  const handleEdit = (style) => {
    setEditingStyle(style);
    setFormData({
      name: style.name,
      sections: style.sections,
      tone: style.tone,
      maxWordCount: style.maxWordCount || '',
      approximateLength: style.approximateLength || 'medium',
      instructions: style.instructions || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this style?')) return;
    try {
      await api.delete(`/styles/${id}`);
      fetchStyles();
    } catch (error) {
      alert('Failed to delete style');
    }
  };

  const handleActivate = async (id) => {
    try {
      await api.put(`/styles/${id}/activate`);
      fetchStyles();
    } catch (error) {
      alert('Failed to activate style');
    }
  };

  const addSection = () => {
    if (newSection.trim()) {
      setFormData({
        ...formData,
        sections: [...formData.sections, newSection.trim()]
      });
      setNewSection('');
    }
  };

  const removeSection = (index) => {
    setFormData({
      ...formData,
      sections: formData.sections.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Answer Style Profiles</h1>
        <button
          onClick={() => {
            setEditingStyle(null);
            setFormData({
              name: '',
              sections: [],
              tone: 'formal_exam',
              maxWordCount: '',
              approximateLength: 'medium',
              instructions: ''
            });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Create Custom Style
        </button>
      </div>

      {/* Default Styles */}
      {defaults.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Default Presets</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {defaults.map((style, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-semibold mb-2">{style.name}</h3>
                <p className="text-sm text-gray-600 mb-2">Tone: {style.tone}</p>
                <p className="text-sm text-gray-600 mb-4">
                  Sections: {style.sections.join(', ')}
                </p>
                <button
                  onClick={() => handleUseDefault(style)}
                  className="w-full bg-gray-100 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-200"
                >
                  Use This Style
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Styles */}
      <div>
        <h2 className="text-xl font-semibold mb-4">My Styles</h2>
        {styles.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <p className="text-gray-600">No custom styles yet. Create one or use a default preset.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {styles.map((style) => (
              <div key={style._id} className="bg-white p-6 rounded-lg shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{style.name}</h3>
                  {style.isDefault && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">Tone: {style.tone}</p>
                <p className="text-sm text-gray-600 mb-4">
                  Sections: {style.sections.join(', ')}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleActivate(style._id)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 text-sm flex items-center justify-center gap-1"
                  >
                    <Check size={16} />
                    Activate
                  </button>
                  <button
                    onClick={() => handleEdit(style)}
                    className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(style._id)}
                    className="bg-red-100 text-red-600 py-2 px-4 rounded-md hover:bg-red-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingStyle ? 'Edit Style' : 'Create Style'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tone *
                </label>
                <select
                  value={formData.tone}
                  onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="formal_exam">Formal Exam</option>
                  <option value="conceptual">Conceptual</option>
                  <option value="casual">Casual</option>
                  <option value="academic">Academic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sections *
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSection())}
                    placeholder="Add section name"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    onClick={addSection}
                    className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.sections.map((section, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded flex items-center gap-2"
                    >
                      {section}
                      <button
                        type="button"
                        onClick={() => removeSection(index)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Word Count (Optional)
                </label>
                <input
                  type="number"
                  value={formData.maxWordCount}
                  onChange={(e) => setFormData({ ...formData, maxWordCount: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Approximate Length
                </label>
                <select
                  value={formData.approximateLength}
                  onChange={(e) => setFormData({ ...formData, approximateLength: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Instructions (Optional)
                </label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  {editingStyle ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingStyle(null);
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

export default Styles;

