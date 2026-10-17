'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'rastreo' | 'paradas' | 'billetera'>('rastreo');

  // Estado del Rastreo
  const [isFollowing, setIsFollowing] = useState(false);
  const [bellTriggered, setBellTriggered] = useState(false);
  const [recenterAnim, setRecenterAnim] = useState(false);

  // Estado de Paradas
  const [selectedRadius, setSelectedRadius] = useState<'200m' | '500m' | '1km'>('200m');
  const [filterAc, setFilterAc] = useState(false);
  const [filterFast, setFilterFast] = useState(false);
  const [filterSeats, setFilterSeats] = useState(false);

  // Estado de Billetera Real (Control Manual de Tarjeta Jaha / Más)
  const [userCardType, setUserCardType] = useState<'JAHA' | 'MÁS'>('JAHA');
  const [userCardNumber, setUserCardNumber] = useState('8421');
  const [userBalance, setUserBalance] = useState(35000);
  const [rechargeHistory, setRechargeHistory] = useState<
    Array<{ id: string; monto: number; fecha: string; medio: string; saldoResultante: number }>
  >([
    { id: 'rec-1', monto: 20000, fecha: 'Hoy · 08:30', medio: 'Bancard / Pago Móvil', saldoResultante: 35000 },
    { id: 'rec-2', monto: 15000, fecha: '14 Oct · 17:15', medio: 'Aquí Pago / Quiniela', saldoResultante: 15000 }
  ]);
  const [isAddRechargeOpen, setIsAddRechargeOpen] = useState(false);
  const [manualRechargeAmount, setManualRechargeAmount] = useState('10000');
  const [manualRechargeChannel, setManualRechargeChannel] = useState('Bancard / Pago Móvil');


  // Toast Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };


  // Lista de colectivos en Paradas
  const busArrivals = [
    {
      id: '15-2',
      line: '15-2',
      company: 'Automotores',
      type: 'Diferencial con A/C',
      route: 'Ypané → Asunción (Por Mercado 4)',
      status: 'Baja ocupación (~14 libres)',
      coche: '#408',
      eta: 3,
      ac: true,
      hasSeats: true
    },
    {
      id: '38',
      line: '38',
      company: 'Mcal. López',
      type: 'Común',
      route: 'Ytororó → Clínicas',
      status: 'Ocupación Media',
      coche: '#112',
      eta: 8,
      price: 'G. 2.300',
      ac: false,
      hasSeats: true
    },
    {
      id: '21',
      line: '21',
      company: 'San Fernando',
      type: 'Diferencial',
      route: 'Zona Sur Fdo. → Puerto Sajonia',
      status: 'Alta ocupación (De pie)',
      coche: '#054',
      eta: 14,
      ac: true,
      hasSeats: false
    },
    {
      id: '8',
      line: '8',
      company: 'De la Conquista',
      type: 'San Antonio - Asunción',
      route: 'Acceso Sur → Terminal de Asunción',
      status: 'Asientos libres',
      coche: '#210',
      eta: 22,
      ac: false,
      hasSeats: true
    }
  ];

  const filteredArrivals = busArrivals.filter((bus) => {
    if (filterAc && !bus.ac) return false;
    if (filterFast && bus.eta >= 10) return false;
    if (filterSeats && !bus.hasSeats) return false;
    return true;
  });

  return (
    <div className="bg-[#F8FAFC] text-[#0B1C30] min-h-screen flex flex-col font-sans selection:bg-[#0B2046] selection:text-white pb-24">
      {/* TOAST FLOTANTE */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#0B2046] text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-3">
          <span className="material-symbols-outlined text-[18px] text-emerald-400">check_circle</span>
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* HEADER PRINCIPAL */}
      <header className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_2px_12px_rgba(11,32,70,0.04)]">
        <div className="h-16 max-w-md mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#0B2046] text-white flex items-center justify-center font-black text-sm shadow-sm shrink-0">
              🇵🇾
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[17px] font-extrabold tracking-tight text-[#0B2046]">Mbarete</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0B2046]/10 text-[#0B2046] uppercase tracking-wider">
                  Transit
                </span>
              </div>
              <span className="text-[12px] font-medium text-slate-500 truncate">Asunción & Central</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast('Actualizando datos de GPS')}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-[#0B2046] transition-colors shadow-sm"
              title="Ajustes y GPS"
            >
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </button>
            <div className="relative flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-[#0B2046] text-amber-300 font-bold text-xs flex items-center justify-center ring-2 ring-[#0B2046]/20 shadow-sm">
                JV
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 w-full max-w-md mx-auto pt-16">
        {/* =========================================
            VISTA 1: RASTREO EN VIVO (MAPA Y UNIDAD)
           ========================================= */}
        {activeTab === 'rastreo' && (
          <div className="flex flex-col w-full relative select-none animate-in fade-in">
            {/* Mapa Interactivo con Canvas SVG */}
            <div className="relative w-full h-[370px] overflow-hidden bg-slate-100">
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center opacity-70 scale-105"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAzgeX5VM99OSYeYnAahu9m57Y_S4O1tYyuQWfsL24r7NBPSzBbpx6Hg_BGjzzqt-EwjGcxOl24pvgW9J1uZv8_OPUKM3Ue8IS_bqFiFoLrvLRy3ht6CT7_SvZK5sAsXKyo9SPQYzxBCswMrpKi1igUC_QHfouuRuB_tytry2UGwpq6UwBicEcJTxnM1kZF7LJNnMT3-Cdd27gc0jGmWTqz_0HFVivNK2FVVDbPkFIFaLkcUO9RhfRX')",
                  filter: 'saturate(0.8) brightness(1.08)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-[#F8FAFC] opacity-95 pointer-events-none" />

              {/* Trazado Vectorial de Ruta */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" fill="none" viewBox="0 0 390 370">
                <defs>
                  <filter height="140%" id="route-glow" width="140%" x="-20%" y="-20%">
                    <feGaussianBlur result="blur" stdDeviation="2.5"></feGaussianBlur>
                    <feComposite in="SourceGraphic" in2="blur" operator="over"></feComposite>
                  </filter>
                  <linearGradient gradientUnits="userSpaceOnUse" id="route-gradient" x1="50" x2="340" y1="360" y2="40">
                    <stop offset="0%" stopColor="#059669" stopOpacity="0.9"></stop>
                    <stop offset="50%" stopColor="#0B2046" stopOpacity="1"></stop>
                    <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.95"></stop>
                  </linearGradient>
                </defs>
                <path d="M 60 360 C 90 300, 110 260, 160 215" stroke="#CBD5E1" strokeLinecap="round" strokeWidth="8"></path>
                <path d="M 60 360 C 90 300, 110 260, 160 215" opacity="0.8" stroke="#10B981" strokeDasharray="3 6" strokeLinecap="round" strokeWidth="4"></path>
                <path d="M 160 215 C 205 175, 230 160, 275 110 C 310 70, 325 50, 350 20" opacity="0.35" stroke="#93C5FD" strokeLinecap="round" strokeWidth="8"></path>
                <path d="M 160 215 C 205 175, 230 160, 275 110 C 310 70, 325 50, 350 20" filter="url(#route-glow)" stroke="url(#route-gradient)" strokeLinecap="round" strokeWidth="4.5"></path>
                <circle className="animate-ping" cx="275" cy="110" fill="#F59E0B" fillOpacity="0.3" r="14" style={{ animationDuration: '2.2s' }}></circle>
                <circle cx="275" cy="110" fill="#FFFFFF" r="9" stroke="#D97706" strokeWidth="2"></circle>
                <circle cx="275" cy="110" fill="#F59E0B" r="5"></circle>
              </svg>

              {/* Colectivo en Movimiento */}
              <div
                className={`absolute left-[142px] top-[197px] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none transition-all duration-500 ease-out ${
                  recenterAnim ? 'scale-125' : 'scale-100'
                }`}
              >
                <span className="absolute w-14 h-14 rounded-full bg-blue-500/20 animate-ping" style={{ animationDuration: '1.8s' }}></span>
                <span className="absolute w-10 h-10 rounded-full bg-blue-600/25 animate-pulse"></span>
                <div className="relative w-9 h-9 rounded-full bg-[#0B2046] flex items-center justify-center shadow-lg shadow-blue-900/30 ring-2 ring-white">
                  <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    directions_bus
                  </span>
                </div>
                <div className="absolute -top-7 whitespace-nowrap bg-white/95 backdrop-blur-md px-2.5 py-0.5 rounded-full shadow-md border border-slate-200">
                  <span className="text-[11px] text-[#0B2046] font-bold tracking-wider">LÍNEA 15-2</span>
                </div>
              </div>

              {/* Pin Flotante Tu Parada */}
              <div className="absolute left-[195px] top-[48px] pointer-events-none flex flex-col items-start bg-white/95 backdrop-blur-md p-2 rounded-xl shadow-lg border border-amber-200 max-w-[175px]">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-amber-500 text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    person_pin_circle
                  </span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tu Parada</span>
                </div>
                <p className="text-xs text-[#0B2046] font-bold leading-tight mt-0.5">4 Mojones (850m)</p>
              </div>

              {/* Pastilla ETA en Vivo */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-white/95 backdrop-blur-xl p-2.5 rounded-2xl shadow-[0_8px_24px_rgba(11,32,70,0.1)] border border-slate-200/90">
                <div className="flex items-center gap-2.5">
                  <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
                    <span className="material-symbols-outlined text-[24px]">timer</span>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl text-[#0B2046] font-extrabold tracking-tight">4</span>
                      <span className="text-sm text-[#0B2046] font-bold">min</span>
                      <span className="text-xs text-slate-500 font-medium ml-1">· 850m</span>
                    </div>
                    <p className="text-xs text-emerald-600 flex items-center gap-1.5 font-semibold">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Transmisión GPS en vivo (hace 2s)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setRecenterAnim(true);
                    setTimeout(() => setRecenterAnim(false), 500);
                    showToast('Enfocando Coche 42 en 4 Mojones');
                  }}
                  className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#0B2046] flex items-center justify-center transition-transform active:scale-90 shadow-sm"
                  title="Centrar unidad"
                >
                  <span className="material-symbols-outlined text-[20px]">my_location</span>
                </button>
              </div>
            </div>

            {/* Contenido de Detalle de la Unidad */}
            <div className="px-4 space-y-3.5 py-3 -mt-2 relative z-10">
              {/* Card 1: Telemetría de Unidad */}
              <section className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(11,32,70,0.06)] border border-slate-200/80 space-y-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-[#0B2046] text-[11px] font-bold uppercase tracking-wide">
                        Coche 42
                      </span>
                      <span className="text-xs text-slate-500 font-medium">Placa ABJ 890</span>
                    </div>
                    <h2 className="text-lg text-[#0B2046] font-bold tracking-tight">Diferencial Climatizado</h2>
                    <p className="text-xs text-slate-500">Línea 15-2 • Ramal Acceso Sur / Terminal</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-[22px]">mode_fan</span>
                    </div>
                    <span className="text-xs text-sky-700 font-bold mt-1">21°C AC</span>
                  </div>
                </div>
              </section>

              {/* Card 2: Secuencia de Paradas */}
              <section className="bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(11,32,70,0.06)] border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base text-[#0B2046] font-bold">Secuencia de Ruta</h3>
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    En trayecto
                  </span>
                </div>

                <div className="relative space-y-4 pl-1">
                  <div className="absolute left-[15px] top-3 bottom-3 w-[2px] bg-blue-100"></div>

                  {/* Parada anterior */}
                  <div className="relative flex items-start gap-3 opacity-60">
                    <div className="relative z-10 w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500">
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Parada anterior · 18:24</span>
                      <p className="text-sm text-[#0B2046] font-semibold line-clamp-1">Avda. Fdo. de la Mora y De la Victoria</p>
                      <span className="text-xs text-slate-400">Superada con fluidez</span>
                    </div>
                  </div>

                  {/* Tu parada */}
                  <div className="relative flex items-start gap-3 bg-gradient-to-r from-amber-50/90 to-amber-50/40 border border-amber-200/90 p-3 rounded-xl shadow-sm">
                    <div className="relative z-10 w-9 h-9 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/30">
                      <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        directions_walk
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider animate-pulse">
                          Tu parada
                        </span>
                        <span className="text-xs text-amber-800 font-bold">Llega ~18:31</span>
                      </div>
                      <p className="text-sm text-[#0B2046] font-bold truncate mt-1">Acceso Sur y 4 Mojones</p>
                      <div className="mt-1 flex items-center gap-1.5 text-amber-700">
                        <span className="material-symbols-outlined text-[16px]">notifications_active</span>
                        <span className="text-xs font-bold">Prepárate para abordar</span>
                      </div>
                    </div>
                  </div>

                  {/* Próximo destino */}
                  <div className="relative flex items-start gap-3 opacity-85">
                    <div className="relative z-10 w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0B2046]">
                      <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Próximo destino</span>
                      <p className="text-sm text-[#0B2046] font-semibold line-clamp-1">Mercado 4 / Pettirossi</p>
                      <span className="text-xs text-slate-500">ETA aprox. 18:45</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Card 3: Acciones Rápidas */}
              <section className="grid grid-cols-2 gap-3">
                <div className="col-span-2 bg-white rounded-2xl p-3 flex items-center justify-between border border-slate-200/80 shadow-[0_4px_16px_rgba(11,32,70,0.04)]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-[22px]">traffic</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 uppercase font-bold block">Estado del Tránsito</span>
                      <p className="text-sm text-[#0B2046] font-bold">Moderado con paso fluido</p>
                    </div>
                  </div>
                  <span className="text-base text-emerald-600 font-extrabold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                    34 km/h
                  </span>
                </div>

                <button
                  onClick={() => showToast('Enlace de rastreo copiado al portapapeles 📤')}
                  className="bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl p-3.5 flex flex-col items-center justify-center gap-1 text-center transition-all active:scale-95 shadow-[0_4px_16px_rgba(11,32,70,0.04)]"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B2046] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[22px]">share_location</span>
                  </div>
                  <span className="text-xs text-[#0B2046] font-bold mt-0.5">Compartir Viaje</span>
                  <span className="text-[11px] text-slate-500">Enlace en vivo</span>
                </button>

                <button
                  onClick={() => {
                    setBellTriggered(!bellTriggered);
                    showToast(bellTriggered ? 'Aviso de parada cancelado' : 'Timbre virtual transmitido al chofer 🔔');
                  }}
                  className={`border rounded-2xl p-3.5 flex flex-col items-center justify-center gap-1 text-center transition-all active:scale-95 shadow-[0_4px_16px_rgba(11,32,70,0.04)] ${
                    bellTriggered ? 'bg-rose-50 border-rose-300 text-rose-600' : 'bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bellTriggered ? 'bg-rose-100 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                    <span className="material-symbols-outlined text-[22px]">
                      {bellTriggered ? 'notifications_active' : 'notifications_none'}
                    </span>
                  </div>
                  <span className="text-xs text-[#0B2046] font-bold mt-0.5">
                    {bellTriggered ? 'Timbre Activado' : 'Timbre Virtual'}
                  </span>
                  <span className="text-[11px] text-slate-500">Avisar bajada</span>
                </button>
              </section>

              {/* Botón Seguir con Alerta */}
              <div className="pt-1 pb-4">
                <button
                  onClick={() => {
                    setIsFollowing(!isFollowing);
                    showToast(isFollowing ? 'Alerta desactivada' : 'Alerta activada: Sonido y vibración listos');
                  }}
                  className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 border ${
                    isFollowing
                      ? 'bg-[#0B2046] text-white border-[#0B2046] shadow-blue-900/30'
                      : 'bg-[#F59E0B] hover:bg-[#D97706] text-[#0B192C] border-amber-300 shadow-[0_8px_20px_rgba(245,158,11,0.35)]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isFollowing ? 'notifications_active' : 'vibration'}
                  </span>
                  <span>{isFollowing ? 'Alerta activa: Te avisaremos a 300m' : 'Seguir con alerta sonora / vibración'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================
            VISTA 2: PARADAS CERCANAS
           ========================================= */}
        {activeTab === 'paradas' && (
          <div className="flex flex-col w-full px-4 pt-4 pb-8 space-y-4 animate-in fade-in">
            {/* Header HUD de Proximidad */}
            <section className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[#0284c7]">
                  <span className="material-symbols-outlined text-[18px] animate-pulse">my_location</span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0284c7]">GPS Activo en Tiempo Real</span>
                </div>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-600 shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Alta precisión
                </span>
              </div>

              <div className="flex items-baseline justify-between mt-1">
                <div>
                  <p className="text-xl font-extrabold text-[#0B2046] tracking-tight">Paradas Cercanas</p>
                  <p className="text-xs text-slate-500">A 150m de tu ubicación actual</p>
                </div>
                {/* Control de Radio */}
                <div className="flex p-1 rounded-xl bg-slate-200/70 border border-slate-300/60 shadow-inner">
                  {(['200m', '500m', '1km'] as const).map((rad) => (
                    <button
                      key={rad}
                      onClick={() => {
                        setSelectedRadius(rad);
                        showToast(`Radio ajustado a ${rad}`);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        selectedRadius === rad ? 'bg-[#0B2046] text-white shadow-sm' : 'bg-white/50 text-slate-600 hover:text-[#0B2046]'
                      }`}
                    >
                      {rad}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Mini Mapa de Contexto */}
            <section className="relative w-full h-44 rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100">
              <div
                className="w-full h-full bg-cover bg-center brightness-[1.02]"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAzgeX5VM99OSYeYnAahu9m57Y_S4O1tYyuQWfsL24r7NBPSzBbpx6Hg_BGjzzqt-EwjGcxOl24pvgW9J1uZv8_OPUKM3Ue8IS_bqFiFoLrvLRy3ht6CT7_SvZK5sAsXKyo9SPQYzxBCswMrpKi1igUC_QHfouuRuB_tytry2UGwpq6UwBicEcJTxnM1kZF7LJNnMT3-Cdd27gc0jGmWTqz_0HFVivNK2FVVDbPkFIFaLkcUO9RhfRX')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-white/30 pointer-events-none" />

              {/* Pin de Ubicación Actual */}
              <div className="absolute top-[52%] left-[46%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                <span className="absolute w-8 h-8 rounded-full bg-sky-400/40 animate-ping"></span>
                <div className="w-4 h-4 rounded-full bg-[#0284c7] ring-2 ring-white shadow"></div>
              </div>

              {/* Badges de Paradas */}
              <div className="absolute top-[32%] left-[58%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B2046] text-white text-[11px] font-bold shadow-lg ring-2 ring-white">
                <span className="w-4 h-4 rounded-full bg-amber-400 text-[#0B2046] font-bold text-[10px] flex items-center justify-center">1</span>
                <span>4 Mojones</span>
              </div>
            </section>

            {/* Aviso de Obras / Desvío */}
            <section className="p-3.5 rounded-xl bg-[#FEF3C7] border border-[#F59E0B]/50 shadow-sm flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/20 text-[#B45309] flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[20px]">warning</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#B45309]">Aviso de Tránsito</span>
                  <span className="text-[11px] text-[#92400E]/80 font-medium">Hace 12 min</span>
                </div>
                <p className="text-xs font-bold text-[#0B2046] mt-0.5 truncate">Obras viales en Avda. Eusebio Ayala</p>
                <p className="text-xs text-[#78350F] mt-0.5 leading-snug">
                  Desvío por calle De La Victoria. Demoras de 5 a 10 min.
                </p>
              </div>
            </section>

            {/* Chips de Filtrado */}
            <section className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setFilterAc(!filterAc)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                  filterAc ? 'bg-[#0B2046] text-white border-[#0B2046] shadow-sm' : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">mode_fan</span>
                <span>Solo con Aire</span>
              </button>

              <button
                onClick={() => setFilterFast(!filterFast)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                  filterFast ? 'bg-[#0B2046] text-white border-[#0B2046] shadow-sm' : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">timer</span>
                <span>Menos de 10 min</span>
              </button>

              <button
                onClick={() => setFilterSeats(!filterSeats)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                  filterSeats ? 'bg-[#0B2046] text-white border-[#0B2046] shadow-sm' : 'bg-white text-slate-700 border-slate-200'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">airline_seat_recline_normal</span>
                <span>Asientos libres</span>
              </button>
            </section>

            {/* Listado de Colectivos Próximos */}
            <section className="space-y-2.5">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#0B2046] text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-sm">
                    #1
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wide text-[#0B2046] block">Parada Seleccionada</span>
                    <h2 className="text-sm font-bold text-[#0B2046] truncate">Parada 4 Mojones (Acceso Sur)</h2>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-500">150m</span>
              </div>

              {filteredArrivals.map((bus) => (
                <article
                  key={bus.id}
                  className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <span className="px-2.5 py-1 rounded-lg bg-[#0B2046] text-white font-bold text-sm shadow-sm">
                          {bus.line}
                        </span>
                        <span className="text-[10px] font-bold text-sky-700 mt-1">{bus.company}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-[#0B2046]">{bus.type}</span>
                          {bus.ac && (
                            <span className="p-0.5 rounded bg-sky-100 text-sky-700">
                              <span className="material-symbols-outlined text-[14px]">ac_unit</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{bus.route}</p>
                        <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {bus.status}
                          </span>
                          <span className="text-xs text-slate-400 font-medium">Coche {bus.coche}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-sm animate-pulse">
                        <span className="material-symbols-outlined text-[14px]">electric_bolt</span>
                        <span className="text-xs font-extrabold">{bus.eta} min</span>
                      </div>
                      <span className="text-[10px] font-medium text-slate-400 mt-1">Llegando</span>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </div>
        )}

        {/* =========================================
            VISTA 3: MI BILLETERA (REGISTRO MANUAL JAHA / MÁS)
           ========================================= */}
        {activeTab === 'billetera' && (
          <div className="flex flex-col w-full px-4 pt-4 pb-8 space-y-4 animate-in fade-in">
            {/* Selector de Tarjeta: JAHA vs MÁS */}
            <section className="bg-white rounded-2xl p-3 border border-slate-200/90 shadow-sm space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                Seleccioná tu Tarjeta de Pasaje:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setUserCardType('JAHA');
                    showToast('Tarjeta seleccionada: JAHA (Azul)');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition ${
                    userCardType === 'JAHA'
                      ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-md shadow-blue-950/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                  <span>Tarjeta JAHA</span>
                </button>

                <button
                  onClick={() => {
                    setUserCardType('MÁS');
                    showToast('Tarjeta seleccionada: MÁS Tarjeta (Verde/Naranja)');
                  }}
                  className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition ${
                    userCardType === 'MÁS'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-950/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span>MÁS Tarjeta</span>
                </button>
              </div>
            </section>

            {/* Tarjeta Visual Personalizada */}
            <section className="relative w-full">
              <div
                className={`relative w-full aspect-[1.586/1] rounded-2xl p-5 flex flex-col justify-between overflow-hidden shadow-xl border border-white/20 transition-all ${
                  userCardType === 'JAHA'
                    ? 'bg-gradient-to-br from-[#1E3A8A] via-[#0E2554] to-[#0B2046]'
                    : 'bg-gradient-to-br from-emerald-700 via-teal-800 to-slate-900'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-amber-300/15 pointer-events-none mix-blend-overlay"></div>

                {/* Cabecera Tarjeta */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-8 h-8 rounded-lg bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/25">
                      <span className="material-symbols-outlined text-amber-300 text-[20px]">credit_card</span>
                    </div>
                    <div className="flex flex-col ml-1">
                      <span className="text-[17px] font-extrabold tracking-tight text-white leading-tight">
                        {userCardType === 'JAHA' ? 'JAHA Electrónico' : 'MÁS Tarjeta'}
                      </span>
                      <span className="text-[9px] font-semibold tracking-wider uppercase text-slate-200">
                        Billetaje Electrónico Paraguay
                      </span>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-white/90 text-[20px] rotate-90">contactless</span>
                </div>

                {/* Número de Tarjeta y Chip */}
                <div className="relative z-10 flex items-center justify-between my-auto">
                  <div className="w-10 h-7 rounded-lg bg-gradient-to-tr from-amber-600 via-amber-300 to-amber-100 shadow-md p-1 flex flex-col justify-between border border-amber-300/60">
                    <div className="w-full h-0.5 bg-amber-900/30"></div>
                    <div className="flex justify-between w-full h-1">
                      <div className="w-1.5 rounded-sm bg-amber-900/25"></div>
                      <div className="w-1.5 rounded-sm bg-amber-900/25"></div>
                    </div>
                    <div className="w-full h-0.5 bg-amber-900/30"></div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-300 uppercase block font-semibold">N° Tarjeta</span>
                    <input
                      type="text"
                      maxLength={8}
                      value={userCardNumber}
                      onChange={(e) => setUserCardNumber(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="8421"
                      className="bg-black/30 border border-white/20 rounded-lg px-2 py-0.5 text-right font-mono text-xs text-amber-300 font-bold focus:outline-none w-24"
                      title="Editar últimos 4 u 8 dígitos"
                    />
                  </div>
                </div>

                {/* Pie de Tarjeta */}
                <div className="relative z-10 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] text-slate-300 uppercase block">Saldo Estimado</span>
                    <span className="text-xl font-black text-white tracking-tight">
                      Gs. {userBalance.toLocaleString('es-PY')}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-[10px] font-extrabold tracking-wider uppercase">VINCULADA</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Saldo y Pasajes Restantes */}
            <section className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                Saldo de tu Tarjeta {userCardType}
              </span>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-[20px] font-bold text-[#F59E0B]">Gs.</span>
                <h1 className="text-[34px] font-extrabold tracking-tight text-[#0B2046] leading-none">
                  {userBalance.toLocaleString('es-PY')}
                </h1>
              </div>

              <div className="flex items-center gap-1.5 mt-2.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-800">
                <span className="material-symbols-outlined text-[15px] text-[#1E3A8A]">directions_bus</span>
                <span className="text-xs font-semibold">
                  Te alcanza para aprox. {Math.floor(userBalance / 3400)} pasajes Diferenciales (Gs. 3.400)
                </span>
              </div>
            </section>

            {/* Botón Principal: Anotar Última Recarga */}
            <section className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => setIsAddRechargeOpen(true)}
                className="py-3 px-3 rounded-xl bg-[#0B2046] hover:bg-[#1E3A8A] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px] text-amber-400">add_circle</span>
                <span>Anotar Nueva Recarga</span>
              </button>

              <button
                onClick={() => {
                  if (userBalance >= 3400) {
                    const newBal = userBalance - 3400;
                    setUserBalance(newBal);
                    showToast('Se descontó 1 pasaje diferencial (Gs. 3.400)');
                  } else {
                    showToast('Saldo insuficiente para un pasaje diferencial');
                  }
                }}
                className="py-3 px-3 rounded-xl bg-white border border-slate-300 text-[#0B2046] hover:bg-slate-50 font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px] text-rose-500">remove_circle_outline</span>
                <span>Marcar 1 Pasaje Usado</span>
              </button>
            </section>

            {/* Historial Real de Recargas Anotadas */}
            <section className="space-y-2.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-[#0B2046]">Historial de Recargas Cargadas</span>
                <span className="text-[10px] text-slate-500">{rechargeHistory.length} registros</span>
              </div>

              <div className="space-y-2">
                {rechargeHistory.map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200/80 shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                        <span className="material-symbols-outlined text-[18px]">payments</span>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#0B2046] block">
                          Recarga {userCardType} • {rec.medio}
                        </span>
                        <span className="text-[10px] text-slate-400">{rec.fecha}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-emerald-600 block">
                        + Gs. {rec.monto.toLocaleString('es-PY')}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Saldo: Gs. {rec.saldoResultante.toLocaleString('es-PY')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* MODAL PARA ANOTAR RECARGA MANUAL */}
        {isAddRechargeOpen && (
          <div className="fixed inset-0 z-50 bg-[#0B2046]/50 backdrop-blur-sm flex items-end justify-center p-0 animate-in fade-in">
            <div className="w-full max-w-md bg-white p-5 rounded-t-3xl shadow-2xl flex flex-col border-t border-slate-100 space-y-3.5">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-1" />
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-[#0B2046]">Anotar Recarga de Pasaje</h3>
                  <p className="text-[11px] text-slate-500">Para llevar el historial de tu saldo en {userCardType}</p>
                </div>
                <button
                  onClick={() => setIsAddRechargeOpen(false)}
                  className="p-1 rounded-full bg-slate-100 text-slate-500"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Monto que cargaste en Guaraníes:
                </label>
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  {['10000', '20000', '35000', '50000'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setManualRechargeAmount(amt)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                        manualRechargeAmount === amt
                          ? 'bg-[#0B2046] text-white border-[#0B2046]'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {parseInt(amt, 10).toLocaleString('es-PY')}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={manualRechargeAmount}
                  onChange={(e) => setManualRechargeAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold text-[#0B2046] focus:outline-none focus:border-[#0B2046]"
                  placeholder="Ej. 20000"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  ¿Dónde o por qué medio cargaste?
                </label>
                <select
                  value={manualRechargeChannel}
                  onChange={(e) => setManualRechargeChannel(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-[#0B2046] font-medium focus:outline-none focus:border-[#0B2046]"
                >
                  <option value="Bancard / Pago Móvil">Bancard / Pago Móvil</option>
                  <option value="Aquí Pago / Quiniela">Aquí Pago / Quiniela</option>
                  <option value="Tigo Money">Tigo Money</option>
                  <option value="Billetera Personal">Billetera Personal</option>
                  <option value="Boca de Cobranzas / Parada">Boca de Cobranzas en Parada</option>
                </select>
              </div>

              <button
                onClick={() => {
                  const montoNum = parseInt(manualRechargeAmount, 10);
                  if (isNaN(montoNum) || montoNum <= 0) {
                    showToast('Ingresá un monto válido');
                    return;
                  }
                  const newBalance = userBalance + montoNum;
                  setUserBalance(newBalance);

                  const newEntry = {
                    id: `rec-${Date.now()}`,
                    monto: montoNum,
                    fecha: 'Recién cargado',
                    medio: manualRechargeChannel,
                    saldoResultante: newBalance
                  };
                  setRechargeHistory([newEntry, ...rechargeHistory]);
                  setIsAddRechargeOpen(false);
                  showToast(`¡Recarga de Gs. ${montoNum.toLocaleString('es-PY')} guardada en el historial! 🎉`);
                }}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md"
              >
                Guardar Recarga
              </button>
            </div>
          </div>
        )}
      </main>


      {/* BOTTOM NAVIGATION BAR OFICIAL */}
      <nav className="fixed bottom-0 w-full z-40 pb-safe pointer-events-none">
        <div className="max-w-md mx-auto px-4 pb-2">
          <div className="pointer-events-auto h-16 rounded-2xl bg-white/95 backdrop-blur-2xl border border-slate-200/90 shadow-[0_10px_30px_-5px_rgba(11,32,70,0.12)] px-2 flex items-center justify-around">
            <button
              onClick={() => setActiveTab('rastreo')}
              className={`flex flex-col items-center justify-center min-w-[64px] transition-colors ${
                activeTab === 'rastreo' ? 'text-[#0B2046]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`w-10 h-8 flex items-center justify-center rounded-lg transition-colors ${
                activeTab === 'rastreo' ? 'bg-[#0B2046]/10' : ''
              }`}>
                <span className="material-symbols-outlined text-[22px]">explore</span>
              </div>
              <span className="text-[10px] font-bold tracking-tight">Rutas & Mapa</span>
            </button>

            <button
              onClick={() => setActiveTab('paradas')}
              className={`flex flex-col items-center justify-center min-w-[64px] transition-colors ${
                activeTab === 'paradas' ? 'text-[#0B2046]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`w-10 h-8 flex items-center justify-center rounded-lg transition-colors ${
                activeTab === 'paradas' ? 'bg-[#0B2046]/10' : ''
              }`}>
                <span className="material-symbols-outlined text-[22px]">near_me</span>
              </div>
              <span className="text-[10px] font-bold tracking-tight">Paradas</span>
            </button>

            <button
              onClick={() => setActiveTab('billetera')}
              className={`flex flex-col items-center justify-center min-w-[64px] transition-colors ${
                activeTab === 'billetera' ? 'text-[#0B2046]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`w-10 h-8 flex items-center justify-center rounded-lg transition-colors ${
                activeTab === 'billetera' ? 'bg-[#0B2046]/10' : ''
              }`}>
                <span className="material-symbols-outlined text-[22px]">contactless</span>
              </div>
              <span className="text-[10px] font-bold tracking-tight">Billetera</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
