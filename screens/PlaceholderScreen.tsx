import * as React from 'react';

interface PlaceholderScreenProps {
  title: string;
}

const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center bg-white p-8 rounded-lg shadow-sm min-h-[60vh]">
      <div className="text-6xl mb-4">🚧</div>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-slate-500">Esta sección está en construcción.</p>
      <p className="text-slate-500">Vuelve pronto para ver las novedades.</p>
    </div>
  );
};

export default PlaceholderScreen;