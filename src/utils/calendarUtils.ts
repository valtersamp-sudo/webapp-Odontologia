import { Appointment } from '../types';
import { CLINIC_INFO } from '../data/mockData';

// Generates an .ics file data URL to add the appointment to any calendar (Apple, Outlook, Google)
export function generateICSDataUri(apt: Appointment): string {
  const [year, month, day] = apt.date.split('-').map(Number);
  const [hours, minutes] = apt.time.split(':').map(Number);

  const startDate = new Date(year, month - 1, day, hours, minutes);
  const endDate = new Date(startDate.getTime() + (apt.durationMinutes || 60) * 60000);

  const formatICSDate = (date: Date): string => {
    return date
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}/, '');
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Harmony Smile Odontologia//Agendamentos//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:harmonysmile-${apt.id}@harmonysmile.com.br`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `SUMMARY:Consulta Odontológica: ${apt.serviceName} - Harmony Smile`,
    `DESCRIPTION:Consulta com ${apt.dentistName} (${apt.dentistCro})\\nProcedimento: ${apt.serviceName}\\nEndereço: ${CLINIC_INFO.address}\\nTelefone: ${CLINIC_INFO.phone}\\nFavor chegar com 10 minutos de antecedência.`,
    `LOCATION:${CLINIC_INFO.address}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT120M',
    'ACTION:DISPLAY',
    'DESCRIPTION:Lembrete de consulta na Harmony Smile em 2 horas',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  return `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;
}

// Generates Google Calendar link
export function generateGoogleCalendarUrl(apt: Appointment): string {
  const [year, month, day] = apt.date.split('-').map(Number);
  const [hours, minutes] = apt.time.split(':').map(Number);

  const startDate = new Date(year, month - 1, day, hours, minutes);
  const endDate = new Date(startDate.getTime() + (apt.durationMinutes || 60) * 60000);

  const formatGDate = (date: Date) =>
    date
      .toISOString()
      .replace(/[-:]/g, '')
      .replace(/\.\d{3}Z/, 'Z');

  const title = encodeURIComponent(`Consulta: ${apt.serviceName} | Harmony Smile`);
  const details = encodeURIComponent(
    `Dentista: ${apt.dentistName} (${apt.dentistCro})\nProcedimento: ${apt.serviceName}\nClínica Harmony Smile Odontologia\nEndereço: ${CLINIC_INFO.address}\nContato: ${CLINIC_INFO.phone}\n${apt.notes ? `Observações: ${apt.notes}` : ''}`
  );
  const location = encodeURIComponent(CLINIC_INFO.address);
  const dates = `${formatGDate(startDate)}/${formatGDate(endDate)}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
}

// Generates WhatsApp message link
export function generateWhatsAppConfirmationUrl(apt: Appointment): string {
  const [year, month, day] = apt.date.split('-');
  const formattedDate = `${day}/${month}/${year}`;

  const message = `Olá, equipe da *Harmony Smile Odontologia*!\n\nGostaria de confirmar minha consulta agendada:\n🗓 *Data:* ${formattedDate} às ${apt.time}\n👤 *Paciente:* ${apt.patientName}\n🩺 *Profissional:* ${apt.dentistName}\n✨ *Procedimento:* ${apt.serviceName}\n\nObrigado!`;

  return `https://wa.me/${CLINIC_INFO.whatsappClean}?text=${encodeURIComponent(message)}`;
}

// Format friendly date
export function formatFriendlyDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(year, month - 1, day);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Amanhã';
  if (diffDays === -1) return 'Ontem';

  const dayOfWeek = date.toLocaleDateString('pt-BR', { weekday: 'short' });
  const dayMonth = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  return `${dayOfWeek.toUpperCase()}, ${dayMonth}`;
}

export function formatFullDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
