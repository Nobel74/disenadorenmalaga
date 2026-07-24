"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function TestEmailPage() {
  const [formData, setFormData] = useState({
    nombre: 'Usuario de Pruebas',
    email: 'test@ejemplo.com',
    asunto: 'Propuesta de colaboración de Test',
    mensaje: 'Hola Francisco,\n\nEste es un mensaje de prueba para validar que el nuevo diseño HTML corporativo se renderiza correctamente en Outlook, Gmail y dispositivos móviles.\n\nUn saludo,\nEquipo de Pruebas.',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [responseMsg, setResponseMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setResponseMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Error en el envío');
      }

      setStatus('success');
      setResponseMsg('¡Correo enviado con éxito! Revisa tu bandeja de entrada.');
    } catch (error: any) {
      setStatus('error');
      setResponseMsg(error.message || 'Hubo un error al enviar.');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: '#1e293b', color: '#ffffff', padding: '20px', borderRadius: '8px 8px 0 0' }}>
        <h1 style={{ margin: 0, fontSize: '20px' }}>🧪 Panel de Pruebas: Envío de Email</h1>
        <p style={{ margin: '5px 0 0 0', fontSize: '13px', color: '#94a3b8' }}>
          Este formulario envía correos utilizando la API local <code>/api/contact</code>.
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ border: '1px solid #e2e8f0', padding: '30px', borderRadius: '0 0 8px 8px', display: 'flex', flexDirection: 'column', gap: '20px', backgroundColor: '#ffffff' }}>
        
        <div style={{ padding: '12px', backgroundColor: '#eff6ff', borderRadius: '6px', fontSize: '13px', color: '#1e40af', lineHeight: '1.5' }}>
          <strong>Paso previo requerido:</strong> Asegúrate de configurar tus credenciales de correo (SMTP) en el archivo <code>.env.local</code> y de ejecutar <code>npm install</code> para instalar las dependencias de Nodemailer.
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#334155' }}>Nombre:</label>
          <input 
            type="text" 
            name="nombre" 
            value={formData.nombre} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box', color: '#0f172a', backgroundColor: '#ffffff' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#334155' }}>Email remitente:</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box', color: '#0f172a', backgroundColor: '#ffffff' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#334155' }}>Asunto:</label>
          <input 
            type="text" 
            name="asunto" 
            value={formData.asunto} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box', color: '#0f172a', backgroundColor: '#ffffff' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold', color: '#334155' }}>Mensaje:</label>
          <textarea 
            name="mensaje" 
            value={formData.mensaje} 
            onChange={handleChange} 
            required 
            rows={5}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontFamily: 'sans-serif', color: '#0f172a', backgroundColor: '#ffffff' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={status === 'loading'}
          style={{ backgroundColor: '#3b82f6', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '6px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', transition: 'background-color 0.2s' }}
        >
          {status === 'loading' ? 'Enviando...' : 'Enviar Email de Prueba'}
        </button>

        {status === 'success' && (
          <div style={{ padding: '15px', backgroundColor: '#dcfce7', color: '#166534', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold' }}>
            {responseMsg}
          </div>
        )}

        {status === 'error' && (
          <div style={{ padding: '15px', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold' }}>
            {responseMsg}
          </div>
        )}

        <div style={{ marginTop: '10px', textAlign: 'center' }}>
          <Link href="/" style={{ color: '#64748b', fontSize: '14px', textDecoration: 'underline' }}>
            Volver al Inicio
          </Link>
        </div>
      </form>
    </div>
  );
}
