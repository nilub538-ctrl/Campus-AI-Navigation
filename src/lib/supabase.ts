import { createClient } from '@supabase/supabase-js';

// User Supabase Project credentials
export const SUPABASE_PROJECT_ID = 'qmbdkwoupfkwlukqeqgs';
export const SUPABASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co`;

// Sanitized key: PostgREST requires 'sb_publishable_...' format
const RAW_KEY = 'asb_publishable_dpwznsXsroaoa8crhcfv-Q_WCOzGZth';
export const SUPABASE_PUBLISHABLE_KEY = RAW_KEY.startsWith('asb_publishable_') 
  ? RAW_KEY.replace('asb_publishable_', 'sb_publishable_') 
  : RAW_KEY;

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export interface AppointmentRecord {
  id?: string;
  created_at?: string;
  full_name: string;
  email: string;
  phone: string;
  appointment_date: string;
  time_slot: string;
  purpose: string;
  department_name?: string;
  building_name?: string;
  location_id?: string;
  number_of_visitors?: number;
  accessibility_required?: boolean;
  notes?: string;
  status?: string;
}

export const SUPABASE_SQL_SCHEMA = `-- Run this in your Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  appointment_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  purpose TEXT NOT NULL,
  department_name TEXT,
  building_name TEXT,
  location_id TEXT,
  number_of_visitors INTEGER DEFAULT 1,
  accessibility_required BOOLEAN DEFAULT false,
  notes TEXT,
  status TEXT DEFAULT 'confirmed'
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Allow public booking submissions
CREATE POLICY "Allow public insert of appointments" 
ON public.appointments 
FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- Allow public viewing of appointments
CREATE POLICY "Allow public read of appointments" 
ON public.appointments 
FOR SELECT 
TO anon, authenticated 
USING (true);
`;

/**
 * Saves appointment record to Supabase.
 * If the Supabase table doesn't exist yet, captures the error and saves to local storage with pending flag.
 */
export async function saveAppointment(data: AppointmentRecord): Promise<{
  success: boolean;
  data?: AppointmentRecord;
  error?: string;
  tableMissing?: boolean;
  savedLocally?: boolean;
}> {
  // First attempt saving via backend proxy or direct Supabase client
  try {
    const { data: insertedData, error } = await supabase
      .from('appointments')
      .insert([
        {
          full_name: data.full_name,
          email: data.email,
          phone: data.phone || null,
          appointment_date: data.appointment_date,
          time_slot: data.time_slot,
          purpose: data.purpose,
          department_name: data.department_name || null,
          building_name: data.building_name || null,
          location_id: data.location_id || null,
          number_of_visitors: Number(data.number_of_visitors) || 1,
          accessibility_required: Boolean(data.accessibility_required),
          notes: data.notes || null,
          status: data.status || 'confirmed'
        }
      ])
      .select()
      .single();

    if (error) {
      console.warn('Supabase insert warning:', error);
      const isMissing = error.code === 'PGRST205' || 
                        error.message?.includes('schema cache') || 
                        error.message?.includes('does not exist');

      // Fallback save to local storage
      const fallbackRecord: AppointmentRecord = {
        ...data,
        id: 'local-' + Date.now(),
        created_at: new Date().toISOString(),
        status: 'confirmed'
      };
      saveToLocalStorage(fallbackRecord);

      return {
        success: true,
        data: fallbackRecord,
        tableMissing: isMissing,
        savedLocally: true,
        error: isMissing 
          ? "Supabase table 'appointments' is not created yet in your project schema." 
          : error.message
      };
    }

    // Successfully saved to Supabase!
    saveToLocalStorage(insertedData);
    return {
      success: true,
      data: insertedData,
      tableMissing: false,
      savedLocally: false
    };

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown network error';
    console.error('Supabase exception:', err);

    // Save locally so the user never loses their submission
    const fallbackRecord: AppointmentRecord = {
      ...data,
      id: 'local-' + Date.now(),
      created_at: new Date().toISOString(),
      status: 'confirmed'
    };
    saveToLocalStorage(fallbackRecord);

    return {
      success: true,
      data: fallbackRecord,
      savedLocally: true,
      error: message
    };
  }
}

/**
 * Fetch recent appointments from Supabase, or fall back to local storage
 */
export async function getAppointments(): Promise<{
  appointments: AppointmentRecord[];
  source: 'supabase' | 'local';
  error?: string;
}> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(25);

    if (error || !data) {
      return {
        appointments: getFromLocalStorage(),
        source: 'local',
        error: error?.message
      };
    }

    return {
      appointments: data,
      source: 'supabase'
    };
  } catch (err) {
    return {
      appointments: getFromLocalStorage(),
      source: 'local',
      error: err instanceof Error ? err.message : 'Error fetching appointments'
    };
  }
}

const STORAGE_KEY = 'campusnav_appointments_backup';

function saveToLocalStorage(record: AppointmentRecord) {
  try {
    const existing = getFromLocalStorage();
    const updated = [record, ...existing.filter(item => item.id !== record.id)].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn('Could not save to localStorage', e);
  }
}

function getFromLocalStorage(): AppointmentRecord[] {
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}
