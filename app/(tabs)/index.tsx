import { IconSymbol } from "@/components/ui/icon-symbol";
import {
  actualizarEstadoIncidencia,
  borrarIncidencia,
  Incidencia,
  obtenerIncidencias,
} from "@/utils/storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Index() {
  const [lista, setLista] = useState<Incidencia[]>([]);
  const navegador = useRouter();

  const cargarDatos = async () => {
    let reportes = await obtenerIncidencias();
    setLista(reportes);
  };

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, []),
  );

  const handleDelete = (id: string) => {
    Alert.alert(
      "Eliminar incidencia",
      "¿Estás seguro de que quieres borrar esta avería?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Borrar",
          style: "destructive",
          onPress: async () => {
            await borrarIncidencia(id);
            cargarDatos();
          },
        },
      ],
    );
  };

  // ----- NUEVA FUNCIÓN PARA MARCAR COMO RESUELTA -----
  const handleResolver = (id: string) => {
    Alert.alert(
      "Resolver incidencia",
      "¿Marcar esta avería como resuelta? ¡Bravo por solucionarlo!",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, Resuelta",
          style: "default",
          onPress: async () => {
            await actualizarEstadoIncidencia(id, "Resuelta");
            cargarDatos();
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Cabecera elegante */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Tablón de Averías</Text>
        <Text style={styles.subtitulo}>
          Tus reportes urbanos ({lista.length})
        </Text>
      </View>

      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listaContenedor}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.vacioContenedor}>
            <IconSymbol size={60} name="checkmark.shield.fill" color="#ccc" />
            <Text style={styles.vacioTexto}>Todo está en orden. ✨</Text>
            <Text style={styles.vacioSubtexto}>
              Aún no has reportado ninguna avería en tu zona.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.tarjetaIncidencia}>
            {/* Si hay foto, la ponemos arriba del todo para hacer efecto "portada" */}
            {item.fotoUri && (
              <Image
                source={{ uri: item.fotoUri }}
                style={styles.fotoTarjeta}
              />
            )}

            {/* Indicador de estado */}
            <View
              style={[
                styles.bolitaEstado,
                {
                  backgroundColor:
                    item.estado === "Resuelta" ? "#34C759" : "#FF3B30",
                }, // Verde si resuelto, rojo si pendiente
              ]}
            />

            <View style={styles.contenidoTarjeta}>
              <View style={styles.headerTarjeta}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.textoTitulo}>{item.titulo}</Text>

                  {/* Etiqueta de la categoría */}
                  {item.categoria && (
                    <View style={styles.etiquetaCategoriaWrapper}>
                      <Text style={styles.textoCategoria}>
                        {item.categoria}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Zona de Botones a la derecha */}
                <View style={{ flexDirection: "row", gap: 10 }}>
                  {/* Botón Verde (Solo si NO está resuelto aún) */}
                  {item.estado !== "Resuelta" && (
                    <TouchableOpacity
                      onPress={() => handleResolver(item.id)}
                      style={styles.botonAccion}
                    >
                      <IconSymbol
                        size={22}
                        name="checkmark.shield.fill"
                        color="#34C759"
                      />
                    </TouchableOpacity>
                  )}
                  {/* Botón Papelera Roja */}
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    style={styles.botonAccion}
                  >
                    <IconSymbol size={22} name="trash.fill" color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.textoDescripcion} numberOfLines={3}>
                {item.descripcion}
              </Text>

              {/* Fecha formateada pequeñita al fondo con un icono separador */}
              <View style={styles.fechaContenedor}>
                <IconSymbol size={14} name="calendar" color="#888" />
                <Text style={styles.textoFecha}>{item.fecha}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F9",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    zIndex: 10,
  },
  titulo: {
    fontSize: 32,
    fontWeight: "900",
    color: "#1A1A24",
    letterSpacing: -0.5,
  },
  subtitulo: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
    fontWeight: "500",
  },
  listaContenedor: {
    padding: 20,
    paddingBottom: 100,
  },
  vacioContenedor: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
  },
  vacioTexto: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#777",
    marginTop: 15,
  },
  vacioSubtexto: {
    fontSize: 15,
    color: "#aaa",
    marginTop: 5,
    textAlign: "center",
  },
  tarjetaIncidencia: {
    backgroundColor: "white",
    borderRadius: 20,
    marginBottom: 25,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 4,
  },
  fotoTarjeta: {
    width: "100%",
    height: 200,
    backgroundColor: "#eee",
  },
  bolitaEstado: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "white",
  },
  contenidoTarjeta: {
    padding: 20,
  },
  headerTarjeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  textoTitulo: {
    fontSize: 22,
    fontWeight: "800",
    color: "#222",
    paddingRight: 10,
  },
  etiquetaCategoriaWrapper: {
    backgroundColor: "#E6F4FE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 5,
    marginTop: 5,
  },
  textoCategoria: {
    color: "#007AFF",
    fontSize: 13,
    fontWeight: "bold",
  },
  botonAccion: {
    padding: 4,
    minWidth: 35,
    alignItems: "center",
  },
  textoDescripcion: {
    fontSize: 16,
    color: "#555",
    lineHeight: 22,
    marginBottom: 20,
  },
  fechaContenedor: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingTop: 15,
  },
  textoFecha: {
    fontSize: 13,
    color: "#888",
    fontWeight: "600",
  },
});
