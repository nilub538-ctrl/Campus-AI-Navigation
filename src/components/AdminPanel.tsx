import React, { useState } from 'react';
import { 
  Building, 
  MapPin, 
  Users, 
  Navigation, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  X, 
  Check, 
  ShieldCheck, 
  Clock, 
  Accessibility,
  AlertTriangle
} from 'lucide-react';
import { CampusLocation, Building as BuildingType, LocationCategory } from '../types/campus';

interface AdminPanelProps {
  locations: CampusLocation[];
  buildings: BuildingType[];
  onAddLocation: (loc: Partial<CampusLocation>) => void;
  onEditLocation: (id: string, updated: Partial<CampusLocation>) => void;
  onDeleteLocation: (id: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  locations,
  buildings,
  onAddLocation,
  onEditLocation,
  onDeleteLocation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState<CampusLocation | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formCategory, setFormCategory] = useState<LocationCategory>('Classroom');
  const [formBuildingId, setFormBuildingId] = useState('acad_b');
  const [formFloor, setFormFloor] = useState(2);
  const [formRoom, setFormRoom] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formHours, setFormHours] = useState('8:30 AM – 5:30 PM');
  const [formWheelchair, setFormWheelchair] = useState(true);

  const categories: LocationCategory[] = [
    'Classroom',
    'Laboratory',
    'Department',
    'Library',
    'Canteen',
    'Administrative',
    'Medical',
    'Hostel',
    'Parking',
    'Playground',
    'Auditorium',
    'Washroom',
    'Gate',
  ];

  const handleOpenAdd = () => {
    setFormName('');
    setFormCode('');
    setFormCategory('Classroom');
    setFormBuildingId('acad_b');
    setFormFloor(2);
    setFormRoom('');
    setFormDesc('');
    setFormHours('8:30 AM – 5:30 PM');
    setFormWheelchair(true);
    setEditingLocation(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (loc: CampusLocation) => {
    setEditingLocation(loc);
    setFormName(loc.name);
    setFormCode(loc.code);
    setFormCategory(loc.category);
    setFormBuildingId(loc.buildingId);
    setFormFloor(loc.floor);
    setFormRoom(loc.room || '');
    setFormDesc(loc.description);
    setFormHours(loc.openingHours);
    setFormWheelchair(loc.accessibility.wheelchair);
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const bldg = buildings.find(b => b.id === formBuildingId) || buildings[0];

    const data: Partial<CampusLocation> = {
      name: formName,
      code: formCode || formName.toUpperCase().replace(/\s+/g, '-').slice(0, 8),
      category: formCategory,
      building: bldg.name,
      buildingId: bldg.id,
      floor: Number(formFloor),
      room: formRoom,
      description: formDesc,
      openingHours: formHours,
      coordinates: editingLocation?.coordinates || {
        x: bldg.coordinates.x + bldg.coordinates.width / 2,
        y: bldg.coordinates.y + bldg.coordinates.height / 2,
        latitude: 20.2965,
        longitude: 85.8245,
      },
      nodeId: editingLocation?.nodeId || 'node_central_plaza',
      accessibility: {
        wheelchair: formWheelchair,
        elevatorAvailable: bldg.hasElevator,
      },
      tags: [formCategory.toLowerCase(), bldg.shortName.toLowerCase()],
    };

    if (editingLocation) {
      onEditLocation(editingLocation.id, data);
    } else {
      onAddLocation(data);
    }

    setShowAddModal(false);
  };

  const filtered = locations.filter(l =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#dadce0] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#1a73e8]" />
            <h1 className="text-2xl font-bold text-[#202124] font-['Google_Sans',sans-serif]">
              Campus Administration Dashboard
            </h1>
          </div>
          <p className="text-xs text-[#5f6368] mt-1">
            Maintain university buildings, classrooms, laboratory nodes, and navigation metrics.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#155724] text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Location</span>
        </button>
      </div>

      {/* 4 Stats Cards from Section 11 of brief */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-white border border-[#dadce0] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#5f6368] uppercase tracking-wider">
              Total Buildings
            </span>
            <p className="text-2xl font-bold text-[#202124] mt-1">24</p>
            <span className="text-[11px] text-[#137333] font-medium">8 Academic & Labs</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#e8f0fe] text-[#1a73e8] flex items-center justify-center">
            <Building className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#dadce0] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#5f6368] uppercase tracking-wider">
              Total Locations
            </span>
            <p className="text-2xl font-bold text-[#202124] mt-1">{locations.length}</p>
            <span className="text-[11px] text-[#137333] font-medium">All GPS & Graph Mapped</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#e6f4ea] text-[#137333] flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#dadce0] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#5f6368] uppercase tracking-wider">
              Total Users
            </span>
            <p className="text-2xl font-bold text-[#202124] mt-1">1,248</p>
            <span className="text-[11px] text-[#1a73e8] font-medium">Students & Faculty</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#fef7e0] text-[#b06000] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#dadce0] shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#5f6368] uppercase tracking-wider">
              Navigation Requests
            </span>
            <p className="text-2xl font-bold text-[#202124] mt-1">4,532</p>
            <span className="text-[11px] text-[#137333] font-medium">99.4% Path Accuracy</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#fce8e6] text-[#c5221f] flex items-center justify-center">
            <Navigation className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Location Management Table */}
      <div className="bg-white rounded-2xl border border-[#dadce0] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#dadce0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#202124] font-['Google_Sans',sans-serif]">
              Campus Location Management
            </h2>
            <p className="text-xs text-[#5f6368]">
              Add, update, or remove classrooms, laboratories, and facilities
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-[#5f6368] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter places..."
              className="w-full pl-9 pr-3 py-2 text-xs text-[#202124] bg-[#f1f3f4] focus:bg-white rounded-lg border border-transparent focus:border-[#1a73e8] focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs text-[#3c4043]">
            <thead>
              <tr className="bg-[#f8f9fa] border-b border-[#dadce0] text-[11px] font-semibold text-[#5f6368] uppercase tracking-wider">
                <th className="py-3 px-4">Location Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Building</th>
                <th className="py-3 px-4">Floor / Room</th>
                <th className="py-3 px-4">Hours</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f3f4]">
              {filtered.map(loc => (
                <tr key={loc.id} className="hover:bg-[#f8f9fa] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#202124]">
                    <div>{loc.name}</div>
                    <div className="text-[10px] text-[#5f6368] font-mono">{loc.code}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#e8f0fe] text-[#1967d2]">
                      {loc.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-[#202124]">
                    {loc.building}
                  </td>
                  <td className="py-3 px-4">
                    Floor {loc.floor === 0 ? 'Ground' : loc.floor} {loc.room ? `· ${loc.room}` : ''}
                  </td>
                  <td className="py-3 px-4 text-[#5f6368]">
                    {loc.openingHours}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(loc)}
                      className="p-1.5 rounded-md text-[#5f6368] hover:text-[#1a73e8] hover:bg-[#e8f0fe] transition-colors"
                      title="Edit location"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${loc.name}?`)) {
                          onDeleteLocation(loc.id);
                        }
                      }}
                      className="p-1.5 rounded-md text-[#5f6368] hover:text-[#d93025] hover:bg-[#fce8e6] transition-colors"
                      title="Delete location"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Location Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-[#dadce0] shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 border-b border-[#dadce0] flex items-center justify-between bg-[#f8f9fa]">
              <h3 className="text-sm font-bold text-[#202124] font-['Google_Sans',sans-serif]">
                {editingLocation ? 'Edit Campus Location' : 'Add New Campus Location'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-[#5f6368] hover:text-[#202124]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#202124] mb-1">
                  Location Name *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. MCA Classroom or Robotics Lab"
                  className="w-full px-3 py-2 text-xs border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#202124] mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as LocationCategory)}
                    className="w-full px-3 py-2 text-xs border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8]"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#202124] mb-1">
                    Building *
                  </label>
                  <select
                    value={formBuildingId}
                    onChange={(e) => setFormBuildingId(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8]"
                  >
                    {buildings.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#202124] mb-1">
                    Floor (0 = Ground)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    value={formFloor}
                    onChange={(e) => setFormFloor(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#202124] mb-1">
                    Room / Door Number
                  </label>
                  <input
                    type="text"
                    value={formRoom}
                    onChange={(e) => setFormRoom(e.target.value)}
                    placeholder="e.g. Room B-204"
                    className="w-full px-3 py-2 text-xs border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202124] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Details, facilities, capacity..."
                  className="w-full px-3 py-2 text-xs border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#202124] mb-1">
                    Opening Hours
                  </label>
                  <input
                    type="text"
                    value={formHours}
                    onChange={(e) => setFormHours(e.target.value)}
                    placeholder="e.g. 8:30 AM – 5:30 PM"
                    className="w-full px-3 py-2 text-xs border border-[#dadce0] rounded-lg focus:outline-none focus:border-[#1a73e8]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="accCheck"
                    checked={formWheelchair}
                    onChange={(e) => setFormWheelchair(e.target.checked)}
                    className="w-4 h-4 text-[#1a73e8] rounded border-[#dadce0]"
                  />
                  <label htmlFor="accCheck" className="text-xs text-[#202124]">
                    Wheelchair Accessible
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#dadce0]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-[#5f6368] hover:bg-[#f1f3f4]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#1a73e8] hover:bg-[#155724] text-white shadow-xs"
                >
                  {editingLocation ? 'Save Changes' : 'Create Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
