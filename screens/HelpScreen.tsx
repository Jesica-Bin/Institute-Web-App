import React, { useState } from 'react';
import { ChevronDownIcon } from '../components/Icons';

const faqs = [
    {
        q: '¿Cómo justifico una inasistencia?',
        a: 'Para justificar una inasistencia, debes dirigirte a la sección de "Asistencia" y seleccionar la opción "Justificar ausencia". Deberás adjuntar el certificado correspondiente.',
    },
    {
        q: '¿Dónde veo mis notas y promedio?',
        a: 'Puedes consultar tus notas y promedios en la sección "Mis Materias". Selecciona una materia para ver el detalle de tus calificaciones.',
    },
    {
        q: '¿Cómo solicito un certificado de alumno regular?',
        a: 'Ve a la sección "Certificados y Constancias", presiona "Solicitar Nuevo" y selecciona "Certificado de Alumno Regular" en la lista. Luego, envía la solicitud.',
    },
     {
        q: '¿Cómo me registro para un evento?',
        a: 'En la sección de Asistencia, ve a "Asistencia a eventos". En la pestaña de "Eventos Activos", podrás seleccionar el evento y registrar tu asistencia, lo cual requerirá escanear un QR y verificar tu ubicación.',
    },
];

const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-200 py-4 last:border-b-0">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center text-left" aria-expanded={isOpen}>
                <span className="font-semibold text-slate-800">{question}</span>
                <ChevronDownIcon className={`w-5 h-5 text-slate-500 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                 <div className="overflow-hidden">
                    <p className="mt-3 text-slate-600 pr-6">
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    );
};

const HelpScreen: React.FC = () => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        alert('¡Gracias! Tu feedback ha sido enviado.');
        form.reset();
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold mb-4">Preguntas Frecuentes</h2>
                <div>
                    {faqs.map((faq, index) => (
                        <FaqItem key={index} question={faq.q} answer={faq.a} />
                    ))}
                </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
                 <h2 className="text-xl font-bold mb-4">Contáctanos</h2>
                 <p className="text-sm text-slate-500 mb-4">¿No encontraste lo que buscabas? Envíanos tus comentarios, sugerencias o reporta un problema.</p>
                 <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Asunto</label>
                        <input type="text" id="subject" required className="w-full p-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                     <div>
                        <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Mensaje</label>
                        <textarea id="message" rows={5} required className="w-full p-2 border border-slate-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                    </div>
                    <div className="flex justify-end">
                         <button type="submit" className="w-full md:w-auto md:px-8 bg-indigo-700 text-white font-bold py-3 rounded-lg hover:bg-indigo-800 transition-colors">
                            Enviar Feedback
                        </button>
                    </div>
                 </form>
            </div>
        </div>
    );
};

export default HelpScreen;