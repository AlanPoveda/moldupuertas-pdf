import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { 
    padding: 45, 
    fontSize: 10, 
    fontFamily: 'Helvetica', 
    color: '#000' 
  },
  header: { 
    marginBottom: 15 
  },
  logo: { 
    width: 250, 
    marginBottom: 5 
  },
  nit: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    marginBottom: 20 
  },
  dateRow: { 
    textAlign: 'right', 
    marginBottom: 20, 
    fontSize: 11 
  },
  title: { 
    fontSize: 16, 
    textAlign: 'center', 
    marginBottom: 25, 
    fontWeight: 'bold' 
  },
  description: { 
    marginBottom: 25, 
    lineHeight: 1.5, 
    fontSize: 11 
  },
  itemRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    borderBottomWidth: 1, 
    borderBottomColor: '#CCC', 
    paddingVertical: 10 
  },
  itemText: { 
    width: '70%', 
    textTransform: 'uppercase' 
  },
  totalSection: { 
    marginTop: 25, 
    textAlign: 'right', 
    fontSize: 12, 
    fontWeight: 'bold' 
  },
  footer: { 
    marginTop: 60 
  },
  signatureImg: { 
    width: 160, 
    marginBottom: 5 
  },
  signatureLine: { 
    borderTopWidth: 1, 
    borderTopColor: '#000', 
    width: 220, 
    paddingTop: 5 
  },
  phoneText: { 
    fontSize: 11, 
    marginTop: 5 
  }
});

export const MyDocument = ({ data }) => {
  // Cálculo do total: remove os pontos para somar e depois formata
  const total = data.itens.reduce((acc, item) => {
    const numericValue = Number(item.valor.replace(/\./g, "")) || 0;
    return acc + numericValue;
  }, 0);

  const formattedTotal = new Intl.NumberFormat('de-DE').format(total);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Encabezado con Logo y NIT */}
        <View style={styles.header}>
          <Image src="/logo.png" style={styles.logo} />
        </View>

        {/* Ciudad y Fecha */}
        <View style={styles.dateRow}>
          <Text>{data.cidade}      {data.data}</Text>
        </View>

        <Text style={styles.description}>
          {data.client.toUpperCase()}
        </Text>

        {/* Título */}
        <Text style={styles.title}>COTIZACION</Text>

        {/* Descripción de la Cotización */}
        <Text style={styles.description}>
          {data.description.toUpperCase()} 
        </Text>

        {/* Lista de Servicios / Productos */}
        {data.itens.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemText}>{item.description_item}</Text>
            <Text>VALOR: $ {item.valor || "0"}</Text>
          </View>
        ))}

        {/* Total General */}
        <View style={styles.totalSection}>
          <Text>TOTAL: $ {formattedTotal}</Text>
        </View>

        {/* Firma y Contacto */}
        <View style={styles.footer}>
          <Text style={{ marginBottom: 10 }}>CORDIALMENTE :</Text>
          {/* Asegúrate de tener la imagen firma.png en la carpeta public */}
          <Image src="/assinatura.png" style={styles.signatureImg} />
          <View style={styles.signatureLine}>
            <Text style={styles.phoneText}>CEL : {data.phone}</Text>
          </View>
        </View>

      </Page>
    </Document>
  );
};