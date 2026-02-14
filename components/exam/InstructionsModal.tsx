'use client';

interface InstructionsModalProps {
  onClose: () => void;
}

export function InstructionsModal({ onClose }: InstructionsModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{
      zIndex: 1000,
      backgroundColor: 'rgba(0,0,0,0.5)'
    }}>
      <div className="bg-white rounded-lg text-center" style={{
        margin: '15% auto',
        padding: '30px',
        borderRadius: '8px',
        width: '80%',
        maxWidth: '500px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        <h2 className="font-bold" style={{
          color: '#3F51B5',
          marginBottom: '20px',
          fontSize: '1.5rem'
        }}>
          Instrucciones del Examen
        </h2>
        
        <div style={{ marginBottom: '24px', textAlign: 'left' }}>
          <p style={{ marginBottom: '15px', fontSize: '1.1rem', color: '#333' }}>
            <strong>• Tiempo:</strong> 45 minutos
          </p>
          <p style={{ marginBottom: '15px', fontSize: '1.1rem', color: '#333' }}>
            <strong>• Preguntas:</strong> 35 preguntas aleatorias
          </p>
          <p style={{ marginBottom: '15px', fontSize: '1.1rem', color: '#333' }}>
            <strong>• Puntuación:</strong> 3 preguntas valen doble puntaje
          </p>
          <p style={{ marginBottom: '15px', fontSize: '1.1rem', color: '#333' }}>
            <strong>• Aprobación:</strong> Menos de 6 puntos incorrectos
          </p>
          <p style={{ marginBottom: '15px', fontSize: '1.1rem', color: '#333' }}>
            <strong>• Navegación:</strong> Puedes ir a cualquier pregunta usando la cuadrícula
          </p>
          <p style={{ marginBottom: '15px', fontSize: '1.1rem', color: '#333' }}>
            <strong>• Colores:</strong> Naranja = doble puntaje, Azul = respondida
          </p>
          <p style={{ marginBottom: '15px', fontSize: '1.1rem', color: '#333' }}>
            <strong>• Modo Corrección:</strong> Disponible después de finalizar el examen
          </p>
        </div>

        <button
          onClick={onClose}
          className="text-white rounded cursor-pointer"
          style={{
            background: '#3F51B5',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            margin: '5px'
          }}
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
