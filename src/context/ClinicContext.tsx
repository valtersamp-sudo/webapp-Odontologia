import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appointment, BlockedSlot, Dentist, Service, User } from '../types';
import {
  DAILY_TIME_SLOTS,
  DEFAULT_DENTISTS,
  DEFAULT_SERVICES,
  DEMO_USERS,
  INITIAL_APPOINTMENTS,
} from '../data/mockData';

interface ClinicContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  registerPatient: (name: string, email: string, phone: string, cpf?: string) => User;
  dentists: Dentist[];
  services: Service[];
  appointments: Appointment[];
  blockedSlots: BlockedSlot[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => Appointment;
  rescheduleAppointment: (appointmentId: string, newDate: string, newTime: string) => boolean;
  cancelAppointment: (appointmentId: string, reason?: string) => boolean;
  updateAppointmentStatus: (appointmentId: string, status: Appointment['status']) => boolean;
  blockSlot: (dentistId: string, date: string, time: string, reason: string) => void;
  unblockSlot: (slotId: string) => void;
  getAvailableSlots: (dentistId: string, dateStr: string) => { time: string; available: boolean; conflictReason?: string }[];
  resetToDefaultData: () => void;
}

const STORAGE_KEYS = {
  CURRENT_USER: 'hs_current_user_v1',
  APPOINTMENTS: 'hs_appointments_v1',
  BLOCKED_SLOTS: 'hs_blocked_slots_v1',
  CUSTOM_USERS: 'hs_custom_users_v1',
};

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load users
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CUSTOM_USERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...DEMO_USERS, ...parsed.filter((u: User) => !DEMO_USERS.some(d => d.id === u.id))];
      }
    } catch {
      // fallback
    }
    return DEMO_USERS;
  });

  // Current logged in user (default to Valter for immediate presentation readiness)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEMO_USERS[0]; // Valter Sampaio
  });

  // Appointments
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_APPOINTMENTS;
  });

  // Blocked slots
  const [blockedSlots, setBlockedSlots] = useState<BlockedSlot[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BLOCKED_SLOTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // Sync to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BLOCKED_SLOTS, JSON.stringify(blockedSlots));
  }, [blockedSlots]);

  const registerPatient = (name: string, email: string, phone: string, cpf?: string): User => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      cpf,
      role: 'patient',
    };
    const updated = [...users, newUser];
    setUsers(updated);
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_USERS, JSON.stringify(updated.filter(u => !DEMO_USERS.some(d => d.id === u.id))));
    } catch {
      // ignore
    }
    setCurrentUser(newUser);
    return newUser;
  };

  const addAppointment = (newAptData: Omit<Appointment, 'id' | 'createdAt'>): Appointment => {
    const newApt: Appointment = {
      ...newAptData,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setAppointments(prev => [newApt, ...prev]);
    return newApt;
  };

  const rescheduleAppointment = (appointmentId: string, newDate: string, newTime: string): boolean => {
    setAppointments(prev =>
      prev.map(apt => {
        if (apt.id === appointmentId) {
          return {
            ...apt,
            date: newDate,
            time: newTime,
            status: 'confirmed',
            notes: apt.notes ? `${apt.notes} (Reagendado pelo paciente)` : 'Reagendado pelo paciente',
          };
        }
        return apt;
      })
    );
    return true;
  };

  const cancelAppointment = (appointmentId: string, reason?: string): boolean => {
    setAppointments(prev =>
      prev.map(apt => {
        if (apt.id === appointmentId) {
          return {
            ...apt,
            status: 'cancelled',
            notes: reason ? `${apt.notes ? apt.notes + ' · ' : ''}Motivo de cancelamento: ${reason}` : apt.notes,
          };
        }
        return apt;
      })
    );
    return true;
  };

  const updateAppointmentStatus = (appointmentId: string, status: Appointment['status']): boolean => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === appointmentId ? { ...apt, status } : apt))
    );
    return true;
  };

  const blockSlot = (dentistId: string, date: string, time: string, reason: string) => {
    const newBlock: BlockedSlot = {
      id: `blk-${Date.now()}`,
      dentistId,
      date,
      time,
      reason,
    };
    setBlockedSlots(prev => [...prev, newBlock]);
  };

  const unblockSlot = (slotId: string) => {
    setBlockedSlots(prev => prev.filter(b => b.id !== slotId));
  };

  const getAvailableSlots = (dentistId: string, dateStr: string) => {
    // Check dentist working days
    const dentist = DEFAULT_DENTISTS.find(d => d.id === dentistId);
    const dateObj = new Date(dateStr + 'T12:00:00');
    const dayOfWeek = dateObj.getDay();

    if (dentist && !dentist.availableDays.includes(dayOfWeek)) {
      return DAILY_TIME_SLOTS.map(time => ({
        time,
        available: false,
        conflictReason: 'Profissional não atende nesta data',
      }));
    }

    // Check Sunday (clinic closed)
    if (dayOfWeek === 0) {
      return DAILY_TIME_SLOTS.map(time => ({
        time,
        available: false,
        conflictReason: 'Clínica fechada aos domingos',
      }));
    }

    return DAILY_TIME_SLOTS.map(time => {
      // Check Saturday afternoon (clinic closes at 14:00 on Saturdays)
      if (dayOfWeek === 6 && parseInt(time.split(':')[0], 10) >= 14) {
        return {
          time,
          available: false,
          conflictReason: 'Horário fora do expediente de sábado',
        };
      }

      // Check existing appointments that are active
      const occupiedByApt = appointments.find(
        apt =>
          apt.dentistId === dentistId &&
          apt.date === dateStr &&
          apt.time === time &&
          apt.status !== 'cancelled'
      );

      if (occupiedByApt) {
        return {
          time,
          available: false,
          conflictReason: 'Horário já reservado',
        };
      }

      // Check blocked slots
      const blocked = blockedSlots.find(
        b => b.dentistId === dentistId && b.date === dateStr && b.time === time
      );

      if (blocked) {
        return {
          time,
          available: false,
          conflictReason: blocked.reason || 'Horário reservado pela clínica',
        };
      }

      return {
        time,
        available: true,
      };
    });
  };

  const resetToDefaultData = () => {
    localStorage.removeItem(STORAGE_KEYS.APPOINTMENTS);
    localStorage.removeItem(STORAGE_KEYS.BLOCKED_SLOTS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_USERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    setAppointments(INITIAL_APPOINTMENTS);
    setBlockedSlots([]);
    setUsers(DEMO_USERS);
    setCurrentUser(DEMO_USERS[0]);
  };

  return (
    <ClinicContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        registerPatient,
        dentists: DEFAULT_DENTISTS,
        services: DEFAULT_SERVICES,
        appointments,
        blockedSlots,
        addAppointment,
        rescheduleAppointment,
        cancelAppointment,
        updateAppointmentStatus,
        blockSlot,
        unblockSlot,
        getAvailableSlots,
        resetToDefaultData,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
