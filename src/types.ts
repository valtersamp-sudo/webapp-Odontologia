export type UserRole = 'patient' | 'dentist' | 'receptionist';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  cpf?: string;
  birthDate?: string;
}

export interface Dentist {
  id: string;
  name: string;
  cro: string;
  title: string;
  specialties: string[];
  bio: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  availableDays: number[]; // 0=Sunday, 1=Monday, etc.
}

export interface Service {
  id: string;
  name: string;
  category: 'estetica' | 'clinica' | 'ortodontia' | 'cirurgia';
  categoryLabel: string;
  durationMinutes: number;
  priceFormatted: string;
  description: string;
  preparationNote: string;
  popular?: boolean;
}

export type AppointmentStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  dentistId: string;
  dentistName: string;
  dentistCro: string;
  serviceId: string;
  serviceName: string;
  categoryLabel: string;
  durationMinutes: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: AppointmentStatus;
  notes?: string;
  allergiesSensitivities?: string;
  createdAt: string;
}

export interface BlockedSlot {
  id: string;
  dentistId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  reason: string;
}
