'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { 
  MOCK_TRAFFIC_ALERTS, 
  MOCK_BUS_STATUS, 
  TrafficAlert, 
  BusStatus,
  TrafficCategory 
} from '@/data/mockTrafficData';
import { 
  Car, 
  Bus, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Compass, 
  Mic, 
  ThumbsUp, 
  CheckCircle2, 
  X, 
  Send, 
  Wind, 
  Radio, 
  ShieldAlert, 
  Sparkles,
  Flame,
  Search,
  Navigation,
  Zap,
  Volume2,
  MessageSquareText,
  Bot,
  ExternalLink,
  RotateCcw,
  Share2,
  Download,
  Smartphone,
  ShieldCheck
} from 'lucide-react';

const COMMON_ZONES = [
  'Acceso Sur', 
  'Mcal. López', 
  'Eusebio Ayala', 
  'Fernando de la Mora', 
  'San Lorenzo Centro', 
  'Ñemby', 
  'Madame Lynch', 
  'Asunción Centro'
];

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickReplies?: string[];
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'traffic' | 'buses' | 'assistant'>('traffic');
  const [searchQuery, setSearchQuery] = useState('');
  const [trafficAlerts, setTrafficAlerts] = useState<TrafficAlert[]>(MOCK_TRAFFIC_ALERTS);
  const [busStatuses, setBusStatuses] = useState<BusStatus[]>(MOCK_BUS_STATUS);

  // Toast de confirmación
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string } | null>(null);

  // Modal de instalación PWA
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Modal de reporte ciudadano
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportCategory, setReportCategory] = useState<'Tráfico pesado' | 'Accidente' | 'Bache peligroso' | 'Colectivo lleno' | 'Colectivo demorado'>('Tráfico pesado');
  const [selectedZone, setSelectedZone] = useState('Acceso Sur');
  const [reportText, setReportText] = useState('');
  const [isSimulatingAudio, setIsSimulatingAudio] = useState(false);
  const [audioTranscript, setAudioTranscript] = useState<string | null>(null);

  // Estado del Asistente Vial (Chat WhatsApp Style)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: '¡Hola! Soy el Bot Vial de MbareteTráfico 🇵🇾. ¿Hacia dónde te dirigís hoy o qué colectivo estás esperando?',
      timestamp: '14:30',
      quickReplies: [
        '¿Cómo está Acceso Sur hoy?',
        '¿Hay tráfico para ir al centro?',
        '¿Cómo viene la Línea 26?',
        'Líneas de San Lorenzo a Asunción'
      ]
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll en el chat
  useEffect(() => {
    if (activeTab === 'assistant') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isBotTyping, activeTab]);

  // Votar alerta
  const handleVoteAlert = (id: string) => {
    setTrafficAlerts(prev => prev.map(alert => {
      if (alert.id === id) {
        return { ...alert, votesCount: alert.votesCount + 1 };
      }
      return alert;
    }));
  };

  // Simulación de dictado por voz
  const handleToggleVoiceDictation = () => {
    if (isSimulatingAudio) {
      setIsSimulatingAudio(false);
      return;
    }

    setIsSimulatingAudio(true);
    setAudioTranscript('Grabando audio...');

    setTimeout(() => {
      let simulatedText = '';
      if (reportCategory === 'Colectivo lleno' || reportCategory === 'Colectivo demorado') {
        simulatedText = `Línea 26 coche 45 pasó recién por ${selectedZone} completamente repleto y no paró.`;
      } else {
        simulatedText = `Embotellamiento total sobre ${selectedZone}, apenas avanza a paso de hombre por un bache y choque.`;
      }
      setReportText(simulatedText);
      setAudioTranscript('Audio transcripto con éxito 🎙️');
      setIsSimulatingAudio(false);
    }, 1800);
  };

  // Enviar reporte ciudadano
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;

    if (reportCategory === 'Colectivo lleno' || reportCategory === 'Colectivo demorado') {
      const newBus: BusStatus = {
        id: `bus-${Date.now()}`,
        lineName: 'Línea Reportada',
        companyName: 'Transporte Ciudadano',
        busNumber: 'Coche Ciudadano',
        routeBranch: selectedZone,
        lastSeenLocation: reportText,
        status: reportCategory === 'Colectivo lleno' ? 'Impedido / Lleno' : 'Demorado',
        airConditioned: true,
        minutesAgo: 1,
        speedKmH: 12
      };
      setBusStatuses([newBus, ...busStatuses]);
    } else {
      let mappedCategory: TrafficCategory = 'Tráfico Pesado';
      if (reportCategory === 'Accidente') mappedCategory = 'Accidente';
      if (reportCategory === 'Bache peligroso') mappedCategory = 'Bache Gigante';

      const newAlert: TrafficAlert = {
        id: `alert-${Date.now()}`,
        location: `${selectedZone} - ${reportText}`,
        zone: selectedZone,
        category: mappedCategory,
        severity: 'Alta',
        delayMinutes: 25,
        alternativeRoute: `Desvío sugerido por calles internas paralelas a ${selectedZone}`,
        reportedBy: 'Vos (Comunidad Mbarete)',
        votesCount: 1,
        timestamp: 'Justo ahora'
      };
      setTrafficAlerts([newAlert, ...trafficAlerts]);
    }

    setIsReportModalOpen(false);
    setReportText('');
    setAudioTranscript(null);

    setToastMessage({
      title: '¡Reporte enviado con éxito! 🇵🇾✨',
      subtitle: 'Sumaste +50 puntos en la comunidad de MbareteTráfico.'
    });

    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Lógica del Chatbot Inteligente
  const handleSendMessage = (messageText?: string) => {
    const textToSend = messageText || chatInput;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsBotTyping(true);

    const lower = textToSend.toLowerCase();

    setTimeout(() => {
      let botResponse = '';
      let quickReplies: string[] | undefined = undefined;

      if (lower.includes('acceso sur') || lower.includes('4 mojones') || lower.includes('cuatro mojones')) {
        const alertSur = trafficAlerts.find(a => a.location.toLowerCase().includes('acceso sur'));
        botResponse = alertSur 
          ? `⚠️ Atención sobre Acceso Sur: Tenemos reporte de ${alertSur.category} a la altura de 4 Mojones (+${alertSur.delayMinutes} min de demora). 💡 Ruta recomendada: ${alertSur.alternativeRoute}.`
          : '✅ Acceso Sur reporta tránsito relativamente fluido en los últimos 20 minutos.';
      } else if (lower.includes('centro') || lower.includes('asunción') || lower.includes('eusebio ayala') || lower.includes('mcal')) {
        botResponse = '🚗 Para entrar al Centro de Asunción: Hay manifestación activa sobre Eusebio Ayala y tráfico pesado en Mcal. López y Villamorra. Te conviene ingresar por Avda. Fernando de la Mora o Costanera Norte.';
      } else if (lower.includes('26') || lower.includes('línea 26')) {
        const bus26 = busStatuses.find(b => b.lineName.includes('26'));
        botResponse = bus26 
          ? `🚌 La Línea 26 (${bus26.busNumber}) fue vista hace ${bus26.minutesAgo} min en ${bus26.lastSeenLocation}. Estado actual: "${bus26.status}" y viene a ${bus26.speedKmH} km/h.`
          : '🚌 La Línea 26 tiene frecuencia regular de 8 a 12 minutos.';
      } else if (lower.includes('san lorenzo')) {
        botResponse = '🚌 De San Lorenzo a Asunción podés tomar: Línea 26 (por Eusebio Ayala, asientos libres ahora), Línea 56 (por Mcal. López) o Línea 21. Si vas en auto, el nudo de Curva Romero tiene +20 min de demora.';
      } else {
        botResponse = '🤖 Entendido. Estoy monitoreando las cámaras comunitarias y reportes de choferes. Podés preguntarme por cualquier avenida (Acceso Sur, Mcal. López, Eusebio Ayala) o consultar el estado de una línea de colectivo.';
        quickReplies = [
          '¿Cómo está Acceso Sur hoy?',
          '¿Hay tráfico para ir al centro?',
          '¿Cómo viene la Línea 26?'
        ];
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies
      };

      setChatMessages(prev => [...prev, botMsg]);
      setIsBotTyping(false);
    }, 900);
  };

  // Filtrado de alertas de tráfico
  const filteredAlerts = useMemo(() => {
    if (!searchQuery.trim()) return trafficAlerts;
    const q = searchQuery.toLowerCase().trim();
    return trafficAlerts.filter(a => 
      a.location.toLowerCase().includes(q) ||
      a.zone.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q)
    );
  }, [trafficAlerts, searchQuery]);

  // Filtrado de colectivos
  const filteredBuses = useMemo(() => {
    if (!searchQuery.trim()) return busStatuses;
    const q = searchQuery.toLowerCase().trim();
    return busStatuses.filter(b => 
      b.lineName.toLowerCase().includes(q) ||
      b.routeBranch.toLowerCase().includes(q) ||
      b.lastSeenLocation.toLowerCase().includes(q)
    );
  }, [busStatuses, searchQuery]);

  const activeSearchResult = searchQuery.trim() !== '' && filteredAlerts.length > 0;

  // Enlace para compartir en WhatsApp
  const shareWhatsAppUrl = useMemo(() => {
    const text = encodeURIComponent(
      `🚨 *MbareteTráfico 🇵🇾 - Reporte en Vivo*\n` +
      `Hay demoras activas en ${trafficAlerts[0]?.location || 'Asunción y Central'}.\n` +
      `Mirá los desvíos y colectivos en tiempo real aquí: https://mbaretetrafico.py`
    );
    return `https://api.whatsapp.com/send?text=${text}`;
  }, [trafficAlerts]);

  return (
    <main className="max-w-md mx-auto min-h-screen bg-slate-950 text-slate-50 flex flex-col shadow-2xl relative border-x border-slate-900/60 pb-28">
      
      {/* NOTIFICACIÓN TOAST */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm bg-slate-900/95 border border-emerald-500/60 text-white p-3.5 rounded-2xl shadow-2xl flex items-start gap-3 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-emerald-300">{toastMessage.title}</h4>
            <p className="text-[11px] text-slate-300 mt-0.5">{toastMessage.subtitle}</p>
          </div>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* HEADER PRINCIPAL */}
      <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-extrabold text-lg shadow-sm">
              🇵🇾
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-tight text-white">Mbarete<span className="text-amber-400">Tráfico</span></span>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">PROD</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 beacon-pulse inline-block" />
                <span className="text-[11px] text-emerald-400 font-medium">En vivo • Asunción y Central</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* BOTÓN INSTALAR PWA */}
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 hover:border-amber-500/50 transition"
              title="Instalar App en el Celular"
            >
              <Smartphone className="w-4 h-4" />
            </button>

            {/* BOTÓN COMPARTIR VIRAL */}
            <a
              href={shareWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition flex items-center"
              title="Compartir reporte en WhatsApp"
            >
              <Share2 className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 3 PESTAÑAS TÁCTILES SUPERIORES */}
        <div className="grid grid-cols-3 gap-1.5 mt-3 p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('traffic')}
            className={`py-2 px-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'traffic'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>🚗 Tráfico</span>
          </button>

          <button
            onClick={() => setActiveTab('buses')}
            className={`py-2 px-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'buses'
                ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>🚌 Micros</span>
          </button>

          <button
            onClick={() => setActiveTab('assistant')}
            className={`py-2 px-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
              activeTab === 'assistant'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquareText className="w-3.5 h-3.5" />
            <span>💬 Asistente</span>
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <div className="p-4 space-y-4 flex-1">

        {/* TAB 1: TRÁFICO */}
        {activeTab === 'traffic' && (
          <div className="space-y-4">
            <section className="space-y-2">
              <div className="relative">
                <Navigation className="w-4 h-4 text-amber-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder='¿Por dónde te vas? (ej. "San Lorenzo", "Centro")...'
                  className="w-full bg-slate-900/90 border border-slate-800/90 rounded-2xl py-2.5 pl-10 pr-10 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0">Ejes:</span>
                {COMMON_ZONES.slice(0, 5).map(zone => (
                  <button
                    key={zone}
                    onClick={() => setSearchQuery(searchQuery === zone ? '' : zone)}
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap transition ${
                      searchQuery === zone
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </section>

            {/* BOTÓN VIRAL WHATSAPP DESTACADO */}
            <div className="flex items-center justify-between p-2.5 bg-slate-900/80 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-xs text-slate-300 font-medium">¿Vas a salir ahora?</span>
              </div>
              <a
                href={shareWhatsAppUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 transition"
              >
                <span>Compartir reporte en WhatsApp 📤</span>
              </a>
            </div>

            {activeSearchResult && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/40 border border-emerald-500/60 shadow-lg shadow-emerald-500/10 space-y-1.5 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-4 h-4" />
                    Desvío Mbarete para tu trayecto:
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Ahorrá hasta 25 min
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Detectamos demoras en tu búsqueda ({searchQuery}). <strong>Ruta más rápida sugerida:</strong> {filteredAlerts[0].alternativeRoute}.
                </p>
              </div>
            )}

            <section className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Alertas Viales en Vivo ({filteredAlerts.length})
                </h2>
                <span className="text-[10px] text-slate-500">Ordenado por urgencia</span>
              </div>

              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`rounded-2xl border p-3.5 transition space-y-2.5 overflow-hidden ${
                    alert.severity === 'Alta' 
                      ? 'bg-gradient-to-br from-slate-900 via-slate-900/90 to-rose-950/20 border-rose-500/40' 
                      : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                          alert.category === 'Accidente' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                          alert.category === 'Manifestación' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          alert.category === 'Bache Gigante' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                          'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        }`}>
                          {alert.category}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {alert.timestamp}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-white tracking-tight leading-snug">
                        {alert.location}
                      </h3>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {alert.zone}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 block font-semibold">Demora est.</span>
                      <span className="text-sm font-black text-rose-400">
                        +{alert.delayMinutes} min
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs shadow-inner">
                    <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1 mb-0.5">
                      <Compass className="w-3.5 h-3.5" />
                      Ruta Alternativa Mbarete:
                    </span>
                    <p className="text-slate-100 text-[11px] leading-relaxed font-medium">
                      {alert.alternativeRoute}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60">
                    <span className="text-[10px] text-slate-500">Reportó: {alert.reportedBy}</span>
                    <button
                      onClick={() => handleVoteAlert(alert.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-[11px] active:scale-95"
                    >
                      <ThumbsUp className="w-3 h-3 text-amber-400" />
                      <span>Sigue ahí ({alert.votesCount})</span>
                    </button>
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}

        {/* TAB 2: COLECTIVOS */}
        {activeTab === 'buses' && (
          <section className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-blue-400" />
                Colectivos en Ruta ({filteredBuses.length})
              </h2>
              <span className="text-[10px] text-slate-500">Actualizado hace instantes</span>
            </div>

            {filteredBuses.map((bus) => (
              <div
                key={bus.id}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/70 p-3.5 space-y-2.5 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-white px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                        {bus.lineName}
                      </span>
                      <span className="text-xs font-semibold text-slate-300">
                        {bus.busNumber}
                      </span>
                      {bus.airConditioned && (
                        <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20 flex items-center gap-0.5">
                          <Wind className="w-2.5 h-2.5" />
                          Aire
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {bus.companyName} • {bus.routeBranch}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full block text-center ${
                      bus.status === 'Asientos libres' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-extrabold' :
                      bus.status === 'Demorado' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                      'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      {bus.status}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 block">
                      hace {bus.minutesAgo} min
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate text-[11px]">Última parada: {bus.lastSeenLocation}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0 pl-2">
                    {bus.speedKmH} km/h
                  </span>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* TAB 3: ASISTENTE VIAL */}
        {activeTab === 'assistant' && (
          <section className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden flex flex-col h-[520px] shadow-2xl">
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900 absolute bottom-0 right-0" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1">
                    <span>Bot Vial Mbarete</span>
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 rounded">IA</span>
                  </h3>
                  <p className="text-[10px] text-emerald-400">En línea • Datos en tiempo real</p>
                </div>
              </div>

              <button
                onClick={() => setChatMessages([chatMessages[0]])}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                title="Reiniciar chat"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-950/70">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="block text-[9px] text-slate-400 text-right mt-1 opacity-70">
                      {msg.timestamp}
                    </span>
                  </div>

                  {msg.quickReplies && msg.quickReplies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {msg.quickReplies.map((q) => (
                        <button
                          key={q}
                          onClick={() => handleSendMessage(q)}
                          className="text-[10px] font-medium bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 hover:border-emerald-500/40 px-2.5 py-1 rounded-full transition"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isBotTyping && (
                <div className="flex items-center gap-1.5 p-2 bg-slate-900 border border-slate-800 rounded-2xl w-20">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-150" />
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce delay-300" />
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            <div className="p-2.5 bg-slate-900 border-t border-slate-800 space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-1.5"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Preguntale al bot sobre calles o micros..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

              <a
                href="https://wa.me/595981000000?text=Hola%20MbareteTráfico,%20quiero%20consultar%20el%20estado%20del%20tránsito"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-emerald-500/30 text-emerald-400 text-[11px] font-bold flex items-center justify-center gap-1.5 transition"
              >
                <span>Continuar esta consulta en WhatsApp 💬</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </section>
        )}

        {/* FOOTER INFORMATIVO & BOTÓN INSTALAR PWA */}
        <footer className="pt-4 border-t border-slate-900 text-center space-y-2 text-[10px] text-slate-500">
          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400 transition"
          >
            <Download className="w-3 h-3 text-amber-400" />
            <span>📲 Instalar App en Inicio</span>
          </button>
          <p className="text-slate-600">
            © 2026 MbareteTráfico • Inteligencia Ciudadana para Asunción y Central
          </p>
        </footer>

      </div>

      {/* BARRA DE ACCIÓN INFERIOR FIJA */}
      <footer className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-3">
        <div className="max-w-md mx-auto">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.98] transition"
          >
            <Mic className="w-4 h-4 text-slate-950 fill-slate-950" />
            <span>🎙️ Reportar Tráfico o Colectivo</span>
          </button>
        </div>
      </footer>

      {/* MODAL INSTRUCCIONES DE INSTALACIÓN PWA */}
      {isInstallModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Instalar MbareteTráfico</h3>
              </div>
              <button 
                onClick={() => setIsInstallModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>Instalá esta PWA directamente en la pantalla de tu celular sin pasar por la Play Store:</p>
              
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-start gap-2">
                  <span className="font-bold text-amber-400">1.</span>
                  <span>En Chrome o Safari, tocá el menú de los tres puntos <strong>(⋮)</strong> o el botón <strong>Compartir</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-amber-400">2.</span>
                  <span>Seleccioná <strong>"Agregar a la pantalla principal"</strong> o <strong>"Instalar aplicación"</strong>.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="font-bold text-amber-400">3.</span>
                  <span>¡Listo! Abrila como una aplicación nativa en cualquier momento.</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsInstallModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* DRAWER MODAL DESLIZABLE (REPORTE CIUDADANO) */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border-t border-slate-800 rounded-t-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
            <div className="pt-3 pb-2 px-4 border-b border-slate-800 flex flex-col items-center relative">
              <div className="w-12 h-1.5 rounded-full bg-slate-700 mb-2" />
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-xl bg-amber-500/20 text-amber-400">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Reporte Ciudadano Mbarete</h3>
                    <p className="text-[10px] text-slate-400">Alertá a miles de conductores en segundos</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsReportModalOpen(false)}
                  className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitReport} className="p-4 overflow-y-auto space-y-3.5 flex-1">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  1. ¿Qué querés reportar?
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['Tráfico pesado', 'Accidente', 'Bache peligroso', 'Colectivo lleno', 'Colectivo demorado'] as const).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setReportCategory(cat)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-semibold border text-left flex items-center justify-between transition ${
                        reportCategory === cat
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-sm'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="truncate">{cat}</span>
                      {reportCategory === cat && <Zap className="w-3 h-3 text-amber-400 shrink-0 ml-1" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  2. Zona o Eje Vial:
                </label>
                <select
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {COMMON_ZONES.map(z => (
                    <option key={z} value={z}>{z}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    3. Describí lo que pasa:
                  </label>
                  <button
                    type="button"
                    onClick={handleToggleVoiceDictation}
                    className={`text-[10px] font-bold flex items-center gap-1 px-2 py-0.5 rounded-full transition ${
                      isSimulatingAudio
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                    }`}
                  >
                    <Mic className="w-3 h-3" />
                    <span>{isSimulatingAudio ? 'Escuchando...' : 'Simular Audio / Voz'}</span>
                  </button>
                </div>

                <textarea
                  rows={3}
                  required
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Ej. Tránsito totalmente parado frente al viaducto por un bache, desviar por calles internas..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />

                {audioTranscript && (
                  <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
                    <Volume2 className="w-3 h-3" />
                    <span>{audioTranscript}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20 hover:opacity-95 transition"
              >
                Enviar Reporte a la Comunidad
              </button>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
