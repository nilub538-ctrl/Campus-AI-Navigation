import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ChevronRight,
  Database,
  ExternalLink,
  Users,
  Compass,
  FileText,
  X,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CampusLocation } from '../types/campus';
import {
  supabase,
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_SQL_SCHEMA,
  saveAppointment,
  getAppointments,
  AppointmentRecord
} from '../lib/supabase';

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  locations: CampusLocation[];
  onNavigateToLocation?: (location: CampusLocation) => void;
  initialLocation?: CampusLocation | null;
}

export const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({
  isOpen,
  onClose,
  locations,
  onNavigateToLocation,
  initialLocation,
}) => {
  const [activeTab, setActiveTab] = useState<'book' | 'my-bookings' | 'supabase-info'>('book');

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:30 AM');
  const [purpose, setPurpose] = useState('Admission & Course Enquiry (MCA / BCA / BBA)');
  const [selectedLocationId, setSelectedLocationId] = useState<string>(initialLocation?.id || 'admin-block');
  const [visitorsCount, setVisitorsCount] = useState<number>(1);
  const [accessibility, setAccessibility] = useState(false);
  const [notes, setNotes] = useState('');

  // Status & UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<AppointmentRecord | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [recentAppointments, setRecentAppointments] = useState<AppointmentRecord[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [sourceType, setSourceType] = useState<'supabase' | 'local'>('supabase');
  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(null);
  const [tableExists, setTableExists] = useState<boolean | null>(null);

  // Sync initial location if passed
  useEffect(() => {
    if (initialLocation) {
      setSelectedLocationId(initialLocation.id);
    }
  }, [initialLocation]);

  // Check Supabase connection on open
  useEffect(() => {
    if (isOpen) {
      checkConnectionStatus();
      loadAppointmentsList();
    }
  }, [isOpen]);

  const checkConnectionStatus = async () => {
    try {
      const res = await fetch('/api/supabase/status');
      const data = await res.json();
      setSupabaseConnected(data.connected);
      setTableExists(data.tableExists);
    } catch {
      setSupabaseConnected(true);
      setTableExists(false);
    }
  };

  const loadAppointmentsList = async () => {
    setLoadingList(true);
    try {
      const result = await getAppointments();
      setRecentAppointments(result.appointments);
      setSourceType(result.source);
    } catch (e) {
      console.warn('Error loading appointments:', e);
    } finally {
      setLoadingList(false);
    }
  };

  const copySqlToClipboard = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !email.trim() || !date) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setIsSubmitting(true);

    const selectedLoc = locations.find(l => l.id === selectedLocationId);

    const newAppointment: AppointmentRecord = {
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      appointment_date: date,
      time_slot: timeSlot,
      purpose: purpose,
      department_name: selectedLoc?.name || 'Main Reception Desk',
      building_name: selectedLoc?.building || 'Main Campus Block',
      location_id: selectedLocationId,
      number_of_visitors: visitorsCount,
      accessibility_required: accessibility,
      notes: notes.trim(),
      status: 'confirmed',
    };

    try {
      // 1. Submit through Supabase client helper
      const res = await saveAppointment(newAppointment);

      // 2. Also send to our server endpoint to ensure persistence in backend
      fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppointment),
      }).catch(err => console.warn('Server sync secondary note:', err));

      if (res.success && res.data) {
        setSubmissionSuccess(res.data);
        loadAppointmentsList();

        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#1a73e8', '#34a853', '#fbbc05', '#ea4335'],
          });
        } catch {
          // ignore confetti if unsupported
        }
      } else {
        setErrorMsg(res.error || 'Failed to submit appointment. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmissionSuccess(null);
    setFullName('');
    setEmail('');
    setPhone('');
    setNotes('');
  };

  if (!isOpen) return null;

  const selectedLocObj = locations.find(l => l.id === selectedLocationId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#dadce0] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white border-b border-[#dadce0] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#1a73e8] to-[#34a853] text-white flex items-center justify-center shadow-sm">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#202124] font-['Google_Sans',sans-serif]">
                  Campus Appointment Booking
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] text-[11px] font-semibold">
                  <Database className="w-3 h-3 text-[#137333]" />
                  <span>Supabase Live</span>
                </span>
              </div>
              <p className="text-xs text-[#5f6368]">
                NIIS Group of Institutions · Syncs directly to Supabase Backend
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#f1f3f4] text-[#5f6368] transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-[#dadce0] px-6 bg-[#f8f9fa] shrink-0 text-xs font-medium">
          <button
            onClick={() => setActiveTab('book')}
            className={`py-3 px-4 border-b-2 font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'book'
                ? 'border-[#1a73e8] text-[#1a73e8]'
                : 'border-transparent text-[#5f6368] hover:text-[#202124]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Book Visit</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('my-bookings');
              loadAppointmentsList();
            }}
            className={`py-3 px-4 border-b-2 font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'my-bookings'
                ? 'border-[#1a73e8] text-[#1a73e8]'
                : 'border-transparent text-[#5f6368] hover:text-[#202124]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Recent Bookings ({recentAppointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('supabase-info')}
            className={`py-3 px-4 border-b-2 font-semibold transition-colors flex items-center gap-2 ${
              activeTab === 'supabase-info'
                ? 'border-[#1a73e8] text-[#1a73e8]'
                : 'border-transparent text-[#5f6368] hover:text-[#202124]'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Supabase Details & SQL</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* TAB 1: BOOKING FORM OR CONFIRMATION */}
          {activeTab === 'book' && (
            <>
              {submissionSuccess ? (
                /* Success Receipt View */
                <div className="flex flex-col items-center text-center p-6 rounded-3xl bg-[#f8f9fa] border border-[#dadce0]">
                  <div className="w-16 h-16 rounded-full bg-[#e6f4ea] text-[#137333] flex items-center justify-center mb-4 shadow-sm animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>

                  <span className="px-3 py-1 rounded-full bg-[#e8f0fe] text-[#1967d2] text-xs font-bold uppercase tracking-wider mb-2">
                    Appointment Confirmed
                  </span>

                  <h3 className="text-2xl font-bold text-[#202124] font-['Google_Sans',sans-serif]">
                    Visit Scheduled Successfully!
                  </h3>
                  <p className="text-xs text-[#5f6368] mt-1 max-w-md">
                    Appointment details have been saved to your Supabase project backend (ID: <code className="text-[#1a73e8]">{SUPABASE_PROJECT_ID}</code>).
                  </p>

                  {/* Summary Card */}
                  <div className="w-full max-w-md mt-6 p-4 rounded-2xl bg-white border border-[#dadce0] text-left space-y-3 text-xs shadow-xs">
                    <div className="flex justify-between items-center pb-2 border-b border-[#f1f3f4]">
                      <span className="text-[#5f6368]">Visitor Name:</span>
                      <span className="font-bold text-[#202124]">{submissionSuccess.full_name}</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-[#f1f3f4]">
                      <span className="text-[#5f6368]">Email & Phone:</span>
                      <span className="font-semibold text-[#202124]">{submissionSuccess.email} · {submissionSuccess.phone || 'N/A'}</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-[#f1f3f4]">
                      <span className="text-[#5f6368]">Date & Time Slot:</span>
                      <span className="font-bold text-[#1a73e8]">{submissionSuccess.appointment_date} at {submissionSuccess.time_slot}</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-[#f1f3f4]">
                      <span className="text-[#5f6368]">Purpose:</span>
                      <span className="font-semibold text-[#202124] text-right">{submissionSuccess.purpose}</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-[#f1f3f4]">
                      <span className="text-[#5f6368]">Destination:</span>
                      <span className="font-bold text-[#137333] flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {submissionSuccess.department_name} ({submissionSuccess.building_name})
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-1 text-[11px] text-[#5f6368]">
                      <span>Supabase Sync Status:</span>
                      <span className="text-[#137333] font-semibold flex items-center gap-1">
                        <Database className="w-3 h-3" /> Transferred to Supabase Table
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                    {onNavigateToLocation && selectedLocObj && (
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToLocation(selectedLocObj);
                        }}
                        className="px-5 py-2.5 rounded-full bg-[#1a73e8] text-white font-semibold text-xs flex items-center gap-2 hover:bg-[#155724] transition-colors shadow-sm"
                      >
                        <Compass className="w-4 h-4" />
                        <span>Navigate to {submissionSuccess.department_name}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={resetForm}
                      className="px-5 py-2.5 rounded-full bg-white border border-[#dadce0] text-[#3c4043] font-semibold text-xs hover:bg-[#f8f9fa] transition-colors"
                    >
                      Book Another Visit
                    </button>
                  </div>
                </div>
              ) : (
                /* The Booking Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Backend Status Bar */}
                  <div className="p-3.5 rounded-2xl bg-[#e8f0fe] border border-[#d2e3fc] flex items-center justify-between text-xs text-[#1967d2]">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#34a853] animate-pulse"></span>
                      <span>Connected to <strong>Supabase</strong> Project: <code className="bg-white/80 px-1.5 py-0.5 rounded text-[11px]">{SUPABASE_PROJECT_ID}</code></span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('supabase-info')}
                      className="text-[11px] font-semibold underline hover:text-[#174ea6]"
                    >
                      View Table SQL
                    </button>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-2xl bg-[#fce8e6] border border-[#fad2cf] text-[#c5221f] text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Personal Information */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#202124] mb-1.5 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#1a73e8]" />
                        <span>Full Name *</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#dadce0] bg-[#f8f9fa] focus:bg-white focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] text-xs text-[#202124] transition-all outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#202124] mb-1.5 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#1a73e8]" />
                        <span>Email Address *</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. rahul@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#dadce0] bg-[#f8f9fa] focus:bg-white focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] text-xs text-[#202124] transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* Phone & Visitors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#202124] mb-1.5 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#1a73e8]" />
                        <span>Phone / WhatsApp Number</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#dadce0] bg-[#f8f9fa] focus:bg-white focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] text-xs text-[#202124] transition-all outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#202124] mb-1.5 flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-[#1a73e8]" />
                        <span>Number of Visitors</span>
                      </label>
                      <select
                        value={visitorsCount}
                        onChange={(e) => setVisitorsCount(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#dadce0] bg-[#f8f9fa] focus:bg-white focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] text-xs text-[#202124] transition-all outline-none"
                      >
                        <option value={1}>1 person (Solo visitor / Student)</option>
                        <option value={2}>2 persons (Student + Parent / Guardian)</option>
                        <option value={3}>3 persons (Family visit)</option>
                        <option value={4}>4+ persons (Group visit / Delegation)</option>
                      </select>
                    </div>
                  </div>

                  {/* Date & Time Slot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#202124] mb-1.5 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#1a73e8]" />
                        <span>Appointment Date *</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-[#dadce0] bg-[#f8f9fa] focus:bg-white focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] text-xs text-[#202124] transition-all outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#202124] mb-1.5 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#1a73e8]" />
                        <span>Preferred Time Slot *</span>
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {['09:30 AM', '10:30 AM', '11:45 AM', '02:00 PM', '03:15 PM', '04:30 PM'].map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setTimeSlot(slot)}
                            className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all border ${
                              timeSlot === slot
                                ? 'bg-[#1a73e8] text-white border-[#1a73e8] shadow-xs'
                                : 'bg-[#f8f9fa] text-[#5f6368] border-[#dadce0] hover:bg-white'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Purpose of Visit */}
                  <div>
                    <label className="block text-xs font-semibold text-[#202124] mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#1a73e8]" />
                      <span>Purpose of Visit *</span>
                    </label>
                    <select
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#dadce0] bg-[#f8f9fa] focus:bg-white focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] text-xs text-[#202124] transition-all outline-none"
                    >
                      <option value="Admission & Course Enquiry (MCA / BCA / BBA)">Admission & Course Enquiry (MCA / BCA / BBA / M.Sc)</option>
                      <option value="Campus Tour & Interactive Navigation">Campus Tour & Interactive Facility Navigation</option>
                      <option value="Faculty & Department HOD Meeting">Faculty & Department HOD Meeting</option>
                      <option value="Principal & Director Executive Office">Principal & Director Executive Office</option>
                      <option value="Training & Corporate Placement Cell">Training & Corporate Placement Cell</option>
                      <option value="Administrative, Examination & Fee Counter">Administrative, Examination & Fee Counter</option>
                      <option value="Library & Research Facilities Visit">Library & Research Facilities Visit</option>
                      <option value="Other Campus Visit">Other Campus Visit</option>
                    </select>
                  </div>

                  {/* Destination Department/Location on Campus */}
                  <div>
                    <label className="block text-xs font-semibold text-[#202124] mb-1.5 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#1a73e8]" />
                      <span>Campus Building / Department to Visit</span>
                    </label>
                    <select
                      value={selectedLocationId}
                      onChange={(e) => setSelectedLocationId(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#dadce0] bg-[#f8f9fa] focus:bg-white focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] text-xs text-[#202124] transition-all outline-none"
                    >
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name} · {loc.building} ({loc.floor})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Accessibility Checkbox */}
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-[#f8f9fa] border border-[#dadce0]">
                    <input
                      type="checkbox"
                      id="accessibility"
                      checked={accessibility}
                      onChange={(e) => setAccessibility(e.target.checked)}
                      className="w-4 h-4 rounded text-[#1a73e8] focus:ring-[#1a73e8] border-[#dadce0]"
                    />
                    <label htmlFor="accessibility" className="text-xs text-[#3c4043] cursor-pointer">
                      <strong>Step-Free / Accessibility Support:</strong> Request wheelchair ramp and elevator-priority assistance during visit.
                    </label>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-[#202124] mb-1.5">
                      Additional Notes or Specific Queries (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Inquiring regarding MCA syllabus, fee concession, and hostel accommodation."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#dadce0] bg-[#f8f9fa] focus:bg-white focus:border-[#1a73e8] focus:ring-2 focus:ring-[#e8f0fe] text-xs text-[#202124] transition-all outline-none resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 rounded-full border border-[#dadce0] text-xs text-[#5f6368] font-semibold hover:bg-[#f1f3f4] transition-colors"
                    >
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-full bg-[#1a73e8] text-white text-xs font-semibold flex items-center gap-2 hover:bg-[#155724] disabled:opacity-50 transition-all shadow-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Saving to Supabase...</span>
                        </>
                      ) : (
                        <>
                          <Database className="w-4 h-4" />
                          <span>Confirm & Save to Supabase</span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}
            </>
          )}

          {/* TAB 2: RECENT BOOKINGS */}
          {activeTab === 'my-bookings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#202124]">
                    Appointments Stored in Backend
                  </h3>
                  <p className="text-xs text-[#5f6368]">
                    Source: <span className="font-semibold capitalize text-[#1a73e8]">{sourceType}</span>
                  </p>
                </div>

                <button
                  onClick={loadAppointmentsList}
                  className="px-3 py-1.5 rounded-full bg-[#f1f3f4] hover:bg-[#e8eaed] text-xs font-semibold text-[#3c4043] flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingList ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>

              {recentAppointments.length === 0 ? (
                <div className="text-center py-10 rounded-2xl bg-[#f8f9fa] border border-[#dadce0] text-[#5f6368]">
                  <Calendar className="w-10 h-10 mx-auto text-[#bdc1c6] mb-2" />
                  <p className="text-xs font-semibold">No appointments found yet.</p>
                  <p className="text-[11px] text-[#80868b] mt-1">Book your first campus visit using the "Book Visit" tab above.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentAppointments.map((apt, idx) => {
                    const matchedLoc = locations.find(l => l.id === apt.location_id);
                    return (
                      <div
                        key={apt.id || idx}
                        className="p-4 rounded-2xl bg-white border border-[#dadce0] hover:border-[#1a73e8] transition-colors shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#202124]">{apt.full_name}</span>
                            <span className="px-2 py-0.5 rounded-full bg-[#e6f4ea] text-[#137333] text-[10px] font-bold">
                              {apt.status || 'Confirmed'}
                            </span>
                            <span className="text-[10px] text-[#5f6368]">
                              ID: {apt.id ? String(apt.id).slice(0, 8) : 'Local'}
                            </span>
                          </div>

                          <p className="text-xs text-[#1a73e8] font-semibold">
                            {apt.appointment_date} · {apt.time_slot}
                          </p>

                          <div className="flex items-center gap-3 text-[11px] text-[#5f6368]">
                            <span>{apt.purpose}</span>
                            <span>•</span>
                            <span>{apt.department_name || 'Campus Reception'}</span>
                          </div>
                        </div>

                        {onNavigateToLocation && matchedLoc && (
                          <button
                            onClick={() => {
                              onClose();
                              onNavigateToLocation(matchedLoc);
                            }}
                            className="px-3.5 py-1.5 rounded-full bg-[#e8f0fe] hover:bg-[#d2e3fc] text-[#1967d2] text-xs font-semibold flex items-center gap-1.5 shrink-0 self-start sm:self-center"
                          >
                            <Compass className="w-3.5 h-3.5" />
                            <span>Navigate</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SUPABASE BACKEND DETAILS & SQL TABLE SCHEMA */}
          {activeTab === 'supabase-info' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-[#e8f0fe] border border-[#d2e3fc]">
                <h3 className="text-sm font-bold text-[#1967d2] flex items-center gap-2 mb-1">
                  <Database className="w-4 h-4 text-[#1a73e8]" />
                  <span>Configured Supabase Project Backend</span>
                </h3>
                <p className="text-xs text-[#3c4043] leading-relaxed">
                  Your project is connected to Supabase using the credentials you provided. Appointments submitted through the form are routed to your Supabase PostgreSQL table.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-[#d2e3fc]">
                    <span className="text-[10px] text-[#5f6368] font-semibold block uppercase">Project ID</span>
                    <span className="font-mono font-bold text-[#202124]">{SUPABASE_PROJECT_ID}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white border border-[#d2e3fc]">
                    <span className="text-[10px] text-[#5f6368] font-semibold block uppercase">Supabase REST URL</span>
                    <span className="font-mono text-[11px] text-[#1a73e8] truncate block">{SUPABASE_URL}</span>
                  </div>
                </div>
              </div>

              {/* Ready-to-run SQL Schema */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#202124]">
                    SQL Table Schema (<code className="text-[#1a73e8]">public.appointments</code>)
                  </span>
                  <button
                    onClick={copySqlToClipboard}
                    className="px-3 py-1 rounded-full bg-[#f1f3f4] hover:bg-[#e8eaed] text-xs font-semibold text-[#1a73e8] flex items-center gap-1.5 transition-colors"
                  >
                    {copiedSql ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#137333]" />
                        <span className="text-[#137333]">Copied SQL!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy SQL to Clipboard</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <pre className="p-3.5 rounded-2xl bg-[#1e293b] text-[#e2e8f0] text-[11px] font-mono overflow-x-auto leading-relaxed max-h-56">
                    {SUPABASE_SQL_SCHEMA}
                  </pre>
                </div>

                <p className="text-[11px] text-[#5f6368] mt-2 leading-relaxed">
                  💡 <strong>Tip:</strong> If you haven't created the table in your Supabase dashboard yet, click "Copy SQL to Clipboard", open your Supabase project's SQL Editor, paste and click "Run". The table will be ready instantly!
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
