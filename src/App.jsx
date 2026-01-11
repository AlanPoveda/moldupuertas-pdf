import React, { useState } from 'react';
import { Plus, Trash2, FileText, Download, Share2 } from 'lucide-react';
import { pdf } from '@react-pdf/renderer'; // Importamos apenas o motor do pdf
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

  const [isGenerating, setIsGenerating] = useState(false);

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

  // Função para Gerar e Compartilhar
  const handleShare = async () => {
    setIsGenerating(true);
    try {
      const doc = <MyDocument data={formData} />;
      const blob = await pdf(doc).toBlob();
      const fileName = `Cotizacion_${formData.client || 'cliente'}.pdf`;
      const file = new File([blob], fileName, { type: 'application/pdf' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Cotización Moldupuertas',
          text: `Envío cotización para ${formData.client}`,
        });
      } else {
        alert("Navegador no soporta compartir. Se descargará el archivo.");
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Função apenas para Baixar
  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const doc = <MyDocument data={formData} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Cotizacion_${formData.client || 'doc'}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-10">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        
        <div className="flex items-center gap-3 mb-8 border-b pb-4">
          <FileText className="text-blue-700" size={32} />
          <h1 className="text-2xl font-bold text-gray-800">Nueva Cotización</h1>
        </div>

        <div className="space-y-6">
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

          <div>
            <label className="block text-sm font-semibold text-gray-600">Cliente / Proyecto</label>
            <input name="client" placeholder="Ej: Tierra Castilla" value={formData.client} onChange={handleChange} className="mt-1 w-full border-2 rounded-xl p-3 outline-none focus:border-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600">Descripción General</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 w-full border-2 rounded-xl p-3 outline-none focus:border-blue-500" />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-700">Lista de Servicios</h2>
            {formData.itens.map((item, index) => (
              <div key={index} className="p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 space-y-3">
                <input
                  placeholder="Descripción del servicio"
                  value={item.description_item}
                  onChange={(e) => handleItemChange(index, 'description_item', e.target.value)}
                  className="w-full border-2 rounded-lg p-2 outline-none"
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
                    <button onClick={() => removeItem(index)} className="bg-red-50 text-red-500 p-3 rounded-lg"><Trash2 size={20} /></button>
                  )}
                </div>
              </div>
            ))}
            <button onClick={addItem} className="w-full py-4 border-2 border-dashed border-blue-300 text-blue-600 rounded-2xl font-bold"><Plus size={20} className="inline mr-2"/> Agregar Servicio</button>
          </div>

          <div className="pt-4">
            <label className="block text-sm font-semibold text-gray-600">Teléfono de Contacto</label>
            <input name="phone" value={formData.phone} onChange={handleChange} className="mt-1 w-full border-2 rounded-xl p-3" />
          </div>

          <div className="pt-6 space-y-4">
            <button 
              onClick={handleShare}
              disabled={isGenerating}
              className={`w-full py-5 rounded-2xl text-white font-black text-lg shadow-lg flex items-center justify-center gap-3 transition-transform active:scale-95 ${isGenerating ? 'bg-gray-400' : 'bg-blue-700'}`}
            >
              <Share2 size={24} /> {isGenerating ? 'GENERANDO...' : 'ENVIAR POR WHATSAPP'}
            </button>

            <button 
              onClick={handleDownload}
              disabled={isGenerating}
              className="w-full py-3 text-gray-500 font-bold flex items-center justify-center gap-2"
            >
              <Download size={18} /> Solo descargar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;