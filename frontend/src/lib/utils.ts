import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number): string {
  return `%${value}`;
}

const COURT_STATUS: Record<string, string> = {
  available: 'Müsait',
  in_use: 'Kullanımda',
  maintenance: 'Bakımda',
  retired: 'Emekli',
};

export function formatCourtStatus(status: string): string {
  return COURT_STATUS[status] || status;
}

const COURT_TYPE: Record<string, string> = {
  hard: 'Sert Zemin',
  clay: 'Kil',
  grass: 'Çim',
  indoor: 'Kapalı',
};

export function formatCourtType(type: string): string {
  return COURT_TYPE[type] || type;
}

const SESSION_STATUS: Record<string, string> = {
  recorded: 'Kayıtlı',
  verified: 'Doğrulandı',
  disputed: 'İtirazlı',
};

export function formatSessionStatus(status: string): string {
  return SESSION_STATUS[status] || status;
}

const BALL_MACHINE_MAINTENANCE_STATUS: Record<string, string> = {
  open: 'Açık',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
  cancelled: 'İptal',
};

export function formatBallMachineMaintenanceStatus(status: string): string {
  return BALL_MACHINE_MAINTENANCE_STATUS[status] || status;
}

const BALL_MACHINE_MAINTENANCE_PRIORITY: Record<string, string> = {
  low: 'Düşük',
  medium: 'Orta',
  high: 'Yüksek',
  urgent: 'Acil',
};

export function formatBallMachineMaintenancePriority(priority: string): string {
  return BALL_MACHINE_MAINTENANCE_PRIORITY[priority] || priority;
}

const COURT_MAINTENANCE_STATUS: Record<string, string> = {
  scheduled: 'Planlandı',
  in_progress: 'Devam Ediyor',
  completed: 'Tamamlandı',
  overdue: 'Gecikmiş',
};

export function formatCourtMaintenanceStatus(status: string): string {
  return COURT_MAINTENANCE_STATUS[status] || status;
}

const COURT_MAINTENANCE_CATEGORY: Record<string, string> = {
  surface_repair: 'Yüzey Bakımı',
  net_post: 'Ağ ve Direk',
  lighting: 'Aydınlatma',
  irrigation: 'Sulama',
  line_marking: 'Çizgi İşaretleme',
  other: 'Diğer',
};

export function formatCourtMaintenanceCategory(category: string): string {
  return COURT_MAINTENANCE_CATEGORY[category] || category;
}

const STRING_TYPE: Record<string, string> = {
  polyester: 'Polyester',
  natural_gut: 'Doğal Bağırsak',
  hybrid: 'Hibrit',
  synthetic: 'Sentetik',
  multifilament: 'Multifilament',
};

export function formatStringType(type: string): string {
  return STRING_TYPE[type] || type;
}

const STRINGING_ORDER_STATUS: Record<string, string> = {
  pending: 'Beklemede',
  in_progress: 'Devam Ediyor',
  ready: 'Hazır',
  picked_up: 'Teslim Edildi',
};

export function formatStringingOrderStatus(status: string): string {
  return STRINGING_ORDER_STATUS[status] || status;
}

const RATE_STATUS: Record<string, string> = {
  active: 'Aktif',
  upcoming: 'Yakında',
  archived: 'Arşiv',
};

export function formatRateStatus(status: string): string {
  return RATE_STATUS[status] || status;
}

const RATE_CATEGORY: Record<string, string> = {
  court_rental: 'Kort Kiralama',
  lesson_package: 'Ders Paketi',
  clinic: 'Klinik/Kamp',
  league: 'Lig',
  tournament: 'Turnuva',
  membership: 'Üyelik',
  other: 'Diğer',
};

export function formatRateCategory(category: string): string {
  return RATE_CATEGORY[category] || category;
}

const MONTH_NAMES: Record<number, string> = {
  1: 'Ocak',
  2: 'Şubat',
  3: 'Mart',
  4: 'Nisan',
  5: 'Mayıs',
  6: 'Haziran',
  7: 'Temmuz',
  8: 'Ağustos',
  9: 'Eylül',
  10: 'Ekim',
  11: 'Kasım',
  12: 'Aralık',
};

export function formatMonth(month: number): string {
  return MONTH_NAMES[month] || String(month);
}
