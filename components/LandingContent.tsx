'use client';

import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle, Clock, Zap, BookOpen, Infinity as InfinityIcon, MessageCircle, ChevronDown, ArrowDown } from 'lucide-react';

export function LandingContent() {
  const whatsappNumber = "56926932373";
  const whatsappBaseUrl = `https://wa.me/${whatsappNumber}?text=`;

  const openWhatsApp = (message: string) => {
    window.open(`${whatsappBaseUrl}${encodeURIComponent(message)}`, '_blank');
  };

  const scrollToPlans = () => {
    const plansSection = document.getElementById('planes');
    if (plansSection) {
      plansSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex-1 flex flex-col font-sans selection:bg-[#FCD442] selection:text-[#033E8C] bg-[#033E8C]">
      {/* 1. HERO PRINCIPAL */}
      <section className="w-full px-4 pt-8 pb-12 md:pt-16 md:pb-20 text-center flex flex-col items-center justify-center min-h-[70vh]">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Logo Circular */}
          <div className="relative w-32 h-32 mx-auto mb-6 md:w-40 md:h-40 bg-white rounded-full p-6 shadow-2xl flex items-center justify-center border-4 border-[#FCD442]">
             <div className="relative w-full h-full">
               <Image 
                  src="/logo.png" 
                  alt="Profe Tomy Logo" 
                  fill
                  className="object-contain"
                  priority
                />
             </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg">
            Rinde tu examen sin miedo.<br />
            <span className="text-[#FCD442]">Practica como si fuera el examen real.</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-blue-100 max-w-2xl mx-auto font-medium leading-relaxed">
            Simulador con formato tipo examen oficial.<br />
            35 preguntas. 45 minutos. Resultados al instante.
          </p>

          <div className="pt-6 flex flex-col gap-4 items-center justify-center">
            <button 
              onClick={() => openWhatsApp("Hola Profe Tomy, quiero activar el acceso al simulador.")}
              className="bg-[#25D366] hover:bg-[#20bd5a] text-white text-lg md:text-xl font-bold py-4 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 w-full md:w-auto animate-pulse-slow"
            >
              <MessageCircle size={28} />
              QUIERO ACCESO AHORA POR WHATSAPP
            </button>

            <button 
              onClick={scrollToPlans}
              className="text-white hover:text-[#FCD442] font-semibold text-lg flex items-center gap-2 transition-colors py-2"
            >
              <span>Ver planes y precios</span>
              <ArrowDown size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Frase de apoyo 1 */}
      <div className="bg-[#FCD442] py-4 text-center font-bold text-[#033E8C] text-sm md:text-base tracking-wide uppercase">
        • Si hace años no estudias, este simulador es para ti •
      </div>

      {/* 2. BLOQUE EMOCIONAL */}
      <section className="py-20 px-4 bg-[#022c63] text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
            No vendemos preguntas.<br />
            <span className="text-[#FCD442]">Vendemos tranquilidad antes del examen.</span>
          </h2>
          <p className="text-xl text-blue-100 leading-relaxed font-light">
            Muchas personas reprueban por nervios, no por falta de estudio.<br />
            Aquí entrenas hasta sentirte seguro y preparado el día real.
          </p>
        </div>
      </section>

      {/* 3. BENEFICIOS */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-white">Todo lo que necesitas para aprobar</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: <CheckCircle className="w-8 h-8 text-[#25D366]" />, text: "Simulación con formato tipo examen real" },
            { icon: <InfinityIcon className="w-8 h-8 text-[#033E8C]" />, text: "35 preguntas aleatorias cada intento" },
            { icon: <Clock className="w-8 h-8 text-[#033E8C]" />, text: "Tiempo real de 45 minutos" },
            { icon: <Zap className="w-8 h-8 text-[#FCD442] fill-[#FCD442]" />, text: "Resultados inmediatos", bgIcon: "bg-[#033E8C]" },
            { icon: <BookOpen className="w-8 h-8 text-[#033E8C]" />, text: "Explicación clara en cada respuesta" },
            { icon: <InfinityIcon className="w-8 h-8 text-[#033E8C]" />, text: "Práctica ilimitada durante tu acceso" },
            { icon: <MessageCircle className="w-8 h-8 text-[#25D366]" />, text: "Activación rápida por WhatsApp" },
          ].map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-xl border-b-4 border-transparent hover:border-[#FCD442] flex items-center gap-4 transition-all hover:-translate-y-1">
              <div className="bg-gray-100 p-3 rounded-full shrink-0">
                {item.icon}
              </div>
              <p className="font-bold text-lg text-[#033E8C]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Frase de apoyo 3 */}
      <div className="bg-[#FCD442] py-4 text-center font-bold text-[#033E8C] text-sm md:text-base tracking-wide uppercase">
        • Llega confiado, no nervioso •
      </div>

      {/* 4. PLANES (PRECIOS) */}
      <section id="planes" className="py-20 px-4 bg-[#033E8C]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-white">Elige tu plan de entrenamiento</h2>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
            {/* Plan 1 */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-transparent flex-1 max-w-md transform hover:scale-[1.02] transition-transform relative flex flex-col">
              <div className="h-3 bg-[#25D366]"></div>
              <div className="p-8 text-center flex flex-col h-full">
                <h3 className="text-2xl font-black text-[#033E8C] mb-2 uppercase tracking-wide">Modo Intensivo 24H</h3>
                <p className="text-gray-500 mb-6 font-medium">Ideal si das el examen pronto</p>
                <div className="text-6xl font-black text-[#033E8C] mb-8 tracking-tight">$2.990</div>
                
                <div className="flex-grow"></div>

                <button 
                  onClick={() => openWhatsApp("Hola Profe Tomy, quiero activar el Modo Intensivo 24h.")}
                  className="w-full bg-[#033E8C] hover:bg-[#022c63] text-white font-bold py-4 rounded-xl shadow-lg transition-all text-lg flex items-center justify-center gap-2"
                >
                  QUIERO ESTE PLAN
                </button>
              </div>
            </div>

            {/* Plan 2 (Recomendado) */}
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-[#FCD442] flex-1 max-w-md transform hover:scale-[1.02] transition-transform relative flex flex-col ring-4 ring-[#FCD442]/30">
              <div className="bg-[#FCD442] text-[#033E8C] text-center font-black py-2 text-sm tracking-widest uppercase">
                Recomendado
              </div>
              <div className="p-8 text-center flex flex-col h-full">
                <h3 className="text-2xl font-black text-[#033E8C] mb-2 uppercase tracking-wide">Preparación 15 Días</h3>
                <p className="text-gray-500 mb-6 font-medium">Practica con calma y seguridad</p>
                <div className="text-6xl font-black text-[#033E8C] mb-8 tracking-tight">$4.990</div>
                
                <div className="flex-grow"></div>

                <button 
                  onClick={() => openWhatsApp("Hola Profe Tomy, quiero activar la Preparación Completa 15 días.")}
                  className="w-full bg-[#033E8C] hover:bg-[#022c63] text-white font-bold py-4 rounded-xl shadow-lg transition-all text-lg flex items-center justify-center gap-2"
                >
                  QUIERO ESTE PLAN
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Frase de apoyo 4 */}
      <div className="bg-[#022c63] py-6 text-center text-white/80 text-sm md:text-base border-t border-white/10">
        <div className="flex items-center justify-center gap-2 font-semibold">
           • Entrena como si ya estuvieras en la municipalidad •
        </div>
      </div>

      {/* Footer simple */}
      <footer className="bg-[#022c63] pb-10 pt-4 text-center text-white/40 text-sm">
        <p>© {new Date().getFullYear()} Simulador Profe Tomy. Todos los derechos reservados.</p>
      </footer>

      {/* 5. BOTÓN FLOTANTE */}
      <button 
        onClick={() => openWhatsApp("")}
        className="fixed bottom-6 right-6 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold p-4 rounded-full shadow-2xl hover:shadow-[#25D366]/40 transition-all z-50 flex items-center gap-2 group animate-bounce-subtle ring-4 ring-white/20"
      >
        <MessageCircle size={28} className="fill-white text-[#25D366]" />
        <span className="pr-2 hidden group-hover:inline-block">Hablar por WhatsApp</span>
      </button>

      {/* Custom Styles for Animations */}
      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite ease-in-out;
        }
        @keyframes bounce-subtle {
           0%, 100% { transform: translateY(0); }
           50% { transform: translateY(-5px); }
        }
         .animate-bounce-subtle {
          animation: bounce-subtle 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
