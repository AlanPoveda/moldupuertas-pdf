import React, { useState } from 'react';
import { Plus, Trash2, FileText, Download, Share2 } from 'lucide-react';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import { MyDocument } from './MyDocument';

function App() {
  const [formData, setFormData] = useState({
    cidade: "BOGOTA D.C.",
    data: "10/01/2026",
    client: "",
    description: "POR SOLICITUD DE USTED ESTAMOS COTIZANDO EL TRABAJO DE CARPINTERIA PARA EL APARTAMENTO DE",
    phone: "311 587 42 76",
    itens: [{ description_item: "", valor: "" }]
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, name, value) => {
    const newItens = [...formData.itens];
    newItens[index][name] = value;
    setFormData({ ...formData, itens: newItens });
  };

  const addItem = () => {
    setFormData({ ...formData, itens: [...formData.itens, { description_item: "", valor: "" }] });
  };

  const removeItem = (index) => {
    const newItens = formData.itens.filter((_, i) => i !== index);
    setFormData({ ...formData, itens: newItens });
  };

  // Función para compartir (WhatsApp/Email)
  const handleShare = async () => {
    const doc = <MyDocument data={formData} />;
    const blob = await pdf(doc).toBlob();
    const fileName = `Cotizacion_${formData.client || 'cliente'}.pdf`;
    const file = new File([blob], fileName, { type: 'application/pdf' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: 'Cotización Moldupuertas',
          text: `Envío cotización para ${formData.client}`,
        });
      } catch (error) {
        console.log('Error al compartir:', error);
      }
    } else {
      alert("Su navegador o dispositivo no soporta el envío directo. Por favor, use el botón 'Solo descargar' y envíe el archivo manualmente.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-10">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        
        {/* Encabezado */}
        <div className="flex items-center gap-3 mb-8 border-b pb-4">
          <FileText className="text-blue-700" size={32} />
          <h1 className="text-2xl font-bold text-gray-800">Nueva Cotización</h1>
        </div>

        <div className="space-y-6">
          {/* Ciudad y Fecha */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600">Ciudad</label>
              <input name="cidade" value={formData.cidade} onChange={handleChange} className="mt-1 w-full border-2 rounded-xl p-3 outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600">Fecha</label>
              <input name="data" value={formData.data} onChange={handleChange} className="mt-1 w-full border-2 rounded-xl p-3 outline-none focus:border-blue-500" />
            </div>
          </div>

          {/* Nombre del Cliente */}
          <div>
            <label className="block text-sm font-semibold text-gray-600">Cliente / Proyecto</label>
            <input name="client" placeholder="Ej: Tierra Castilla" value={formData.client} onChange={handleChange} className="mt-1 w-full border-2 rounded-xl p-3 outline-none focus:border-blue-500" />
          </div>

          {/* Descripción General */}
          <div>
            <label className="block text-sm font-semibold text-gray-600">Descripción General</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 w-full border-2 rounded-xl p-3 outline-none focus:border-blue-500" />
          </div>

          {/* Lista de Servicios */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-700">Lista de Servicios</h2>
            {formData.itens.map((item, index) => (
              <div key={index} className="p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 space-y-3">
                <input
                  placeholder="Descripción del servicio (ej: Puerta de lavandería)"
                  value={item.description_item}
                  onChange={(e) => handleItemChange(index, 'description_item', e.target.value)}
                  className="w-full border-2 rounded-lg p-2 outline-none focus:border-blue-400"
                />
                <div className="flex gap-3">
                  <div className="flex-1 flex items-center bg-white border-2 rounded-lg px-3">
                    <span className="text-gray-500 mr-2">$</span>
                    <input
                      type="text"
                      placeholder="Valor"
                      value={item.valor}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        const formatted = new Intl.NumberFormat('de-DE').format(raw);
                        handleItemChange(index, 'valor', raw === "" ? "" : formatted);
                      }}
                      className="w-full p-2 outline-none"
                    />
                  </div>
                  {formData.itens.length > 1 && (
                    <button onClick={() => removeItem(index)} className="bg-red-50 text-red-500 p-3 rounded-lg hover:bg-red-100">
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            <button 
              onClick={addItem} 
              className="w-full py-4 border-2 border-dashed border-blue-300 text-blue-600 rounded-2xl flex items-center justify-center gap-2 font-bold hover:bg-blue-50"
            >
              <Plus size={20} /> Agregar Servicio
            </button>
          </div>

          {/* Contacto */}
          <div className="pt-4">
            <label className="block text-sm font-semibold text-gray-600">Teléfono de Contacto (Celular)</label>
            <input name="phone" value={formData.phone} onChange={handleChange} className="mt-1 w-full border-2 rounded-xl p-3" />
          </div>

          {/* Acciones */}
          <div className="pt-6 space-y-4">
            <button 
              onClick={handleShare}
              className="w-full py-5 rounded-2xl bg-blue-700 text-white font-black text-lg shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-transform"
            >
              <Share2 size={24} /> ENVIAR POR WHATSAPP
            </button>

            <PDFDownloadLink 
              document={<MyDocument data={formData} />} 
              fileName={`Cotizacion_${formData.client || 'doc'}.pdf`}
              style={{ textDecoration: 'none' }}
            >
              {({ loading }) => (
                <button 
                  className={`w-full py-3 text-gray-500 font-bold flex items-center justify-center gap-2 ${loading ? 'opacity-50' : ''}`}
                  disabled={loading}
                >
                  <Download size={18} />
                  {loading ? 'Procesando...' : 'Solo descargar PDF'}
                </button>
              )}
            </PDFDownloadLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;