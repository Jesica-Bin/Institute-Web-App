import React, { useState, useEffect } from 'react';
import { mockStudentUser } from '../../data';
import { EnvelopeIcon, UserCircleIcon, PhoneIcon } from '../../components/Icons';

const ProfileInfoItem = ({ label, value }: { label: string, value: string }) => (
    <div>
        <dt className="text-sm font-medium text-slate-500">{label}</dt>
        <dd className="mt-1 text-base text-slate-900">{value}</dd>
    </div>
);

const StudentMyProfileScreen: React.FC = () => {
    const [email, setEmail] = useState(mockStudentUser.email);
    const [phone, setPhone] = useState(mockStudentUser.phone);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        // Check if form data is different from original data
        if (email !== mockStudentUser.email || phone !== mockStudentUser.phone) {
            setIsDirty(true);
        } else {
            setIsDirty(false);
        }
    }, [email, phone]);

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        
        mockStudentUser.email = email;
        mockStudentUser.phone = phone;

        alert(`Cambios guardados:\nEmail: ${email}\nTeléfono: ${phone}.`);
        
        setIsDirty(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col items-center space-y-4">
                 <div className="w-24 h-24 rounded-full bg-slate-200">
                    <UserCircleIcon className="w-full h-full text-slate-400" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-center">{mockStudentUser.name}</h1>
                    <p className="text-slate-500 text-center">Estudiante</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold border-b border-slate-200 pb-3 mb-4">Información Personal</h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <ProfileInfoItem label="Nombre Completo" value={mockStudentUser.name} />
                    <ProfileInfoItem label="DNI" value={mockStudentUser.dni} />
                    <ProfileInfoItem label="Fecha de Nacimiento" value={new Date(mockStudentUser.dob + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })} />
                </dl>
            </div>

            <form onSubmit={handleSaveChanges} className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold border-b border-slate-200 pb-3 mb-4">Información de Contacto</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-md border-slate-300 bg-white pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5"
                                placeholder="tu@email.com"
                            />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700">Teléfono</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                             <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <PhoneIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="block w-full rounded-md border-slate-300 bg-white pl-10 focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5"
                                placeholder="11-2233-4455"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={!isDirty}
                        className="w-full md:w-auto md:px-8 bg-blue-700 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StudentMyProfileScreen;