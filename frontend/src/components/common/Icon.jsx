import {
  Activity,
  Bell,
  CalendarDays,
  Check,
  ClipboardList,
  Clock3,
  CreditCard,
  FileText,
  FlaskConical,
  HeartPulse,
  House,
  LogOut,
  MapPin,
  Megaphone,
  Menu,
  QrCode,
  Search,
  ShieldCheck,
  Star,
  Stethoscope,
  Ticket,
  UserRound,
  UsersRound,
  X,
} from 'lucide-react';

const icons = {
  activity: Activity,
  alert: Bell,
  appointment: CalendarDays,
  calendar: CalendarDays,
  check: Check,
  clipboard: ClipboardList,
  clock: Clock3,
  creditCard: CreditCard,
  document: FileText,
  lab: FlaskConical,
  logo: HeartPulse,
  home: House,
  logout: LogOut,
  mapPin: MapPin,
  menu: Menu,
  notification: Bell,
  qr: QrCode,
  search: Search,
  shield: ShieldCheck,
  doctor: Stethoscope,
  queue: Ticket,
  user: UserRound,
  users: UsersRound,
  announcement: Megaphone,
  close: X,
  star: Star,
};

const legacyIconNames = {
  '📅': 'calendar',
  '🕐': 'clock',
  '🔍': 'search',
  '🔔': 'notification',
  '🎫': 'queue',
  '👤': 'user',
  '👥': 'users',
  '🏠': 'home',
  '🩺': 'doctor',
  '📋': 'clipboard',
  '💰': 'creditCard',
  '✅': 'check',
  '📭': 'document',
  '⏰': 'clock',
  '🎉': 'check',
  '📷': 'qr',
};

function Icon({ name = 'activity', size = 20, strokeWidth = 1.8, className, ...props }) {
  const resolvedName = legacyIconNames[name] || name;
  const IconComponent = icons[resolvedName] || Activity;

  return <IconComponent size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" {...props} />;
}

export default Icon;
