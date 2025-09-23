import React, { useState, useEffect } from 'react';
import { mockUser } from '../data';
import { EnvelopeIcon, PhoneIcon, UserCircleIcon } from '../components/Icons';

const ProfileInfoItem = ({ label, value }: { label: string, value: string }) => (
    <div>
        <dt className="text-sm font-medium text-slate-500">{label}</dt>
        <dd className="mt-1 text-base text-slate-900">{value}</dd>
    </div>
);

const ProfileScreen: React.FC = () => {
    const [email, setEmail] = useState(mockUser.email);
    const [phone, setPhone] = useState(mockUser.phone);
    const [isDirty, setIsDirty] = useState(false);

    useEffect(() => {
        // Check if form data is different from original data
        if (email !== mockUser.email || phone !== mockUser.phone) {
            setIsDirty(true);
        } else {
            setIsDirty(false);
        }
    }, [email, phone]);

    const handleSaveChanges = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Cambios guardados:\nEmail: ${email}\nTeléfono: ${phone}`);
        // Here you would typically make an API call
        // For now, we'll just reset the dirty state
        setIsDirty(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col items-center space-y-4">
                <UserCircleIcon className="w-24 h-24 text-slate-300" />
                <div>
                    <h1 className="text-2xl font-bold text-center">{mockUser.name}</h1>
                    <p className="text-slate-500 text-center">Preceptora</p>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-semibold border-b border-slate-200 pb-3 mb-4">Información Personal</h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <ProfileInfoItem label="Nombre Completo" value={mockUser.name} />
                    <ProfileInfoItem label="Legajo" value={mockUser.legajo} />
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
                                className="block w-full rounded-md border-slate-300 bg-white pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5"
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
                                className="block w-full rounded-md border-slate-300 bg-white pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2.5"
                                placeholder="11-2233-4455"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={!isDirty}
                        className="w-full md:w-auto md:px-8 bg-indigo-700 text-white font-bold py-3 rounded-lg hover:bg-indigo-800 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileScreen;