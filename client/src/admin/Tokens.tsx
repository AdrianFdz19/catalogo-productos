// src/pages/Tokens.tsx
import React, { useState } from 'react';
import { useAppContext } from '../context/AppProvider';

interface Token {
    id: string;
    value: string;
    createdAt: string;
}

export default function Tokens() {
    const {apiUrl} = useAppContext();
    const [tokens, setTokens] = useState<Token[]>([
        { id: '1', value: 'abcd1234', createdAt: '2025-10-31' },
        { id: '2', value: 'efgh5678', createdAt: '2025-10-30' },
    ]);

    const [newToken, setNewToken] = useState('');

    const createToken = async () => {
        try {
            const res = await fetch(`${apiUrl}/admin/tokens`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    // opcional: algún nombre o descripción para el token
                    name: 'Token de prueba',
                }),
            });

            if (!res.ok) throw new Error('No se pudo crear el token');

            const data = await res.json();
            console.log('Nuevo token:', data.token);
            // aquí podrías setearlo en un state para mostrarlo en la UI
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <section className="w-full min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-gray-800">Panel de Tokens</h1>

                {/* Crear nuevo token */}
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-4">
                    <button
                        onClick={createToken}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        + Crear nuevo token
                    </button>
                    {newToken && (
                        <div className="text-sm text-gray-700 break-all">
                            Nuevo token: <span className="font-mono">{newToken}</span>
                        </div>
                    )}
                </div>

                {/* Lista de tokens */}
                <div className="bg-white shadow rounded-lg border border-gray-200">
                    <div className="grid grid-cols-[2fr_2fr_1fr] gap-4 px-4 py-2 bg-gray-100 font-semibold text-gray-700">
                        <span>ID</span>
                        <span>Token</span>
                        <span>Creado</span>
                    </div>
                    <div>
                        {tokens.length > 0 ? (
                            tokens.map((token) => (
                                <div
                                    key={token.id}
                                    className="grid grid-cols-[2fr_2fr_1fr] gap-4 px-4 py-2 border-b border-gray-200 items-center"
                                >
                                    <span>{token.id}</span>
                                    <span className="font-mono break-all">{token.value}</span>
                                    <span>{token.createdAt}</span>
                                </div>
                            ))
                        ) : (
                            <p className="p-4 text-center text-gray-500">No hay tokens generados.</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
