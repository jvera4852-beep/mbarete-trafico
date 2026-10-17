export type TrafficCategory = 'Accidente' | 'Bache Gigante' | 'Manifestación' | 'Tráfico Pesado';
export type AlertSeverity = 'Alta' | 'Media';
export type BusOccupancyStatus = 'Asientos libres' | 'Impedido / Lleno' | 'Demorado';

export interface TrafficAlert {
  id: string;
  location: string;
  zone: string; // e.g. "Fernando de la Mora", "Asunción", "San Lorenzo", "Lambaré"
  category: TrafficCategory;
  severity: AlertSeverity;
  delayMinutes: number;
  alternativeRoute: string;
  reportedBy: string;
  votesCount: number;
  timestamp: string; // e.g. "Hace 4 min"
}

export interface BusStatus {
  id: string;
  lineName: string;
  companyName: string;
  busNumber: string;
  routeBranch: string; // e.g. "Por Mcal. López", "Por Eusebio Ayala", "Acceso Sur"
  lastSeenLocation: string;
  status: BusOccupancyStatus;
  airConditioned: boolean; // Diferencial con aire
  minutesAgo: number;
  speedKmH: number;
}

export const MOCK_TRAFFIC_ALERTS: TrafficAlert[] = [
  {
    id: 'alert-1',
    location: 'Acceso Sur c/ Avelino Martínez (4 Mojones)',
    zone: 'Fernando de la Mora / Asunción',
    category: 'Accidente',
    severity: 'Alta',
    delayMinutes: 35,
    alternativeRoute: 'Desviar por Avda. Defensores del Chaco hacia Villa Elisa',
    reportedBy: 'Carlos M. (Chofer Bolt)',
    votesCount: 42,
    timestamp: 'Hace 3 min'
  },
  {
    id: 'alert-2',
    location: 'Avda. Mcal. López y San Martín (Villamorra)',
    zone: 'Asunción',
    category: 'Tráfico Pesado',
    severity: 'Alta',
    delayMinutes: 25,
    alternativeRoute: 'Tomar Avda. Boggiani o Guido Spano para cruzar hacia San Cristóbal',
    reportedBy: 'Lorena B.',
    votesCount: 29,
    timestamp: 'Hace 6 min'
  },
  {
    id: 'alert-3',
    location: 'Avda. Madame Lynch c/ Santa Teresa',
    zone: 'Asunción',
    category: 'Bache Gigante',
    severity: 'Media',
    delayMinutes: 18,
    alternativeRoute: 'Circular con extrema precaución por carril izquierdo bajo el viaducto',
    reportedBy: 'Esteban R.',
    votesCount: 37,
    timestamp: 'Hace 11 min'
  },
  {
    id: 'alert-4',
    location: 'Avda. Eusebio Ayala c/ Bartolomé de las Casas',
    zone: 'Asunción',
    category: 'Manifestación',
    severity: 'Alta',
    delayMinutes: 40,
    alternativeRoute: 'Subir por Avda. Fernando de la Mora o cruzar por Dr. Fernando de la Mora',
    reportedBy: 'Patrulla Urbana',
    votesCount: 56,
    timestamp: 'Hace 15 min'
  },
  {
    id: 'alert-5',
    location: 'Ruta PY02 c/ Curva Romero',
    zone: 'San Lorenzo',
    category: 'Tráfico Pesado',
    severity: 'Media',
    delayMinutes: 20,
    alternativeRoute: 'Desviar por Laguna Grande para salir directo a Luque / Asunción',
    reportedBy: 'Marcos V.',
    votesCount: 19,
    timestamp: 'Hace 22 min'
  }
];

export const MOCK_BUS_STATUS: BusStatus[] = [
  {
    id: 'bus-26',
    lineName: 'Línea 26',
    companyName: 'Lince S.R.L.',
    busNumber: 'Coche 48',
    routeBranch: 'Por Eusebio Ayala - San Lorenzo',
    lastSeenLocation: 'Km 5 (Frente al Colegio Nacional)',
    status: 'Asientos libres',
    airConditioned: true,
    minutesAgo: 2,
    speedKmH: 34
  },
  {
    id: 'bus-21',
    lineName: 'Línea 21',
    companyName: 'San Fernando S.A.',
    busNumber: 'Coche 12',
    routeBranch: 'Zona Sur - Mcal. Estigarribia',
    lastSeenLocation: 'Municipalidad de Fernando de la Mora',
    status: 'Impedido / Lleno',
    airConditioned: true,
    minutesAgo: 4,
    speedKmH: 18
  },
  {
    id: 'bus-15',
    lineName: 'Línea 15-4',
    companyName: 'Automotores Guaraní S.A.C.I.',
    busNumber: 'Coche 104',
    routeBranch: 'Acceso Sur - Ypané',
    lastSeenLocation: 'Parada 4 Mojones',
    status: 'Demorado',
    airConditioned: true,
    minutesAgo: 14,
    speedKmH: 8
  },
  {
    id: 'bus-56',
    lineName: 'Línea 56',
    companyName: 'La Sanlorenzana',
    busNumber: 'Coche 77',
    routeBranch: 'Por Mcal. López - San Lorenzo',
    lastSeenLocation: 'Mcal. López y Denis Roa',
    status: 'Asientos libres',
    airConditioned: true,
    minutesAgo: 3,
    speedKmH: 28
  },
  {
    id: 'bus-18',
    lineName: 'Línea 18',
    companyName: '29 de Septiembre S.R.L.',
    busNumber: 'Coche 31',
    routeBranch: 'Lambaré - Félix Bogado - Centro',
    lastSeenLocation: 'Avda. Félix Bogado y 21 Proyectadas',
    status: 'Impedido / Lleno',
    airConditioned: false,
    minutesAgo: 7,
    speedKmH: 22
  }
];
