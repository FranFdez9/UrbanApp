import { BotonPersonalizado } from "@/components/BotonPersonalizado";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as MailComposer from "expo-mail-composer";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { CategoriaIncidencia, guardarIncidencia } from "../../utils/storage";

export default function CamaraScreen() {
  const [imagen, setImagen] = useState<string | null>(null);

  // Nuevos estados para el formulario
  const [titulo, setTitulo] = useState("");
  const [categoriaStr, setcategoriaStr] = useState<CategoriaIncidencia>("Otro");
  const [descripcion, setDescripcion] = useState("");

  const abrirGaleria = async () => {
    let resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!resultado.canceled) {
      setImagen(resultado.assets[0].uri);
    }
  };

  const abrirFoto = async () => {
    const permisos = await ImagePicker.requestCameraPermissionsAsync();

    if (permisos.granted) {
      let resultado = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!resultado.canceled) {
        setImagen(resultado.assets[0].uri);
      }
    } else {
      alert("Necesitamos permisos de cámara para poder tomar una foto.");
    }
  };

  // Función para guardar la incidencia en la memoria local y mandarla por correo
  const guardar = async () => {
    // Validamos que todo esté relleno
    if (!titulo.trim() || !descripcion.trim() || !imagen) {
      Alert.alert(
        "Faltan datos",
        "Por favor, ponle un título, una descripción y adjunta una foto (de la cámara o galería).",
      );
      return;
    }

    // 1. OBTENER GPS EXACTO Y LINK
    let ubicacionLink = "Ubicación GPS no disponible";
    //let lat: number | undefined = undefined;
    //let lon: number | undefined = undefined;

    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status === "granted") {
      try {
        let location = await Location.getCurrentPositionAsync({});
        // Creamos un link mágico que abre Google Maps directamente con las coordenadas
        ubicacionLink = `https://www.google.com/maps/search/?api=1&query=${location.coords.latitude},${location.coords.longitude}`;
      } catch (e) {
        console.log("No se pudo sacar el GPS fino");
      }
    } else {
      Alert.alert(
        "Aviso",
        "Sin permisos de GPS. Se enviará el reporte sin la ubicación exacta.",
      );
    }

    // 2. ENVIAR CORREO AL ENCARGADO PRINCIPAL (Fran)
    const canSendMail = await MailComposer.isAvailableAsync();
    if (canSendMail) {
      await MailComposer.composeAsync({
        recipients: ["fraanfernandezz9@gmail.com"], // Fran recibe todas las alertas
        subject: `🚨 Nueva Incidencia: ${titulo}`,
        body:
          `Se ha reportado una nueva incidencia urbana:\n\n` +
          `📌 Título: ${titulo}\n` +
          `📝 Descripción: ${descripcion}\n\n` +
          `📍 Ubicación exacta: ${ubicacionLink}\n\n` +
          `Se adjunta la fotografía de evidencia del desperfecto guardada en alta calidad en el móvil del reportero.`,
        attachments: [imagen], // Expo coge la foto y te la adjunta como archivo físico!
      });
    }

    // 3. GUARDAR EL HISTÓRICO EN LA MEMORIA DE LA APP
    const nueva = {
      id: Date.now().toString(),
      titulo: titulo,
      descripcion: descripcion,
      fotoUri: imagen,
      fecha: new Date().toLocaleString(),
      categoria: categoriaStr, // Categoria elegida por el usuario
      estado: "Pendiente" as const, // Siempre nace como Pendiente
    };
    await guardarIncidencia(nueva);

    // 4. LIMPIAR FORMULARIO
    setTitulo("");
    setDescripcion("");
    setImagen(null);
    Alert.alert(
      "¡Enviada!",
      "Tu incidencia se ha derivado al encargado y se ha guardado en el tablón.",
    );
  };

  // Cambiamos View por ScrollView por si los móviles son pequeños y no cabe el teclado
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Nueva Incidencia 🚧</Text>

      {/* Inputs del formulario */}
      <TextInput
        style={styles.input}
        placeholder="Título (Ej: Bache en la carretera)"
        placeholderTextColor="#888"
        value={titulo}
        onChangeText={setTitulo}
      />

      <TextInput
        style={[styles.input, styles.inputMultilinea]}
        placeholder="Descripción detallada (Ej: Frente al Zara...)"
        placeholderTextColor="#888"
        value={descripcion}
        onChangeText={setDescripcion}
        multiline
      />

      <Text style={styles.etiquetaCategoria}>Categoría de la avería:</Text>
      <View style={styles.contenedorRadios}>
        {(
          [
            "Limpieza",
            "Mobiliario",
            "Vía Pública",
            "Otro",
          ] as CategoriaIncidencia[]
        ).map((cat) => {
          const seleccionado = categoriaStr === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={styles.radioOpcion}
              onPress={() => setcategoriaStr(cat)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.radioCirculo,
                  seleccionado && styles.radioSeleccionado,
                ]}
              >
                {seleccionado && <View style={styles.radioPuntoInner} />}
              </View>
              <Text
                style={[
                  styles.radioTexto,
                  seleccionado && styles.radioTextoSeleccionado,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Botones de foto en una misma fila para ocupar la mitad cada uno */}
      <View style={styles.filaBotones}>
        <View style={{ flex: 1 }}>
          <BotonPersonalizado
            texto="Galería"
            onPress={abrirGaleria}
            color="#007AFF"
            estilo={{ paddingHorizontal: 5, paddingVertical: 12 }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <BotonPersonalizado
            texto="Cámara"
            onPress={abrirFoto}
            color="#007AFF"
            estilo={{ paddingHorizontal: 5, paddingVertical: 12 }}
          />
        </View>
      </View>

      {/* Miniatura de la foto elegida */}
      {imagen && <Image source={{ uri: imagen }} style={styles.foto} />}

      {/* Botón Maestro Final */}
      <View style={{ marginTop: 20, width: "100%" }}>
        <BotonPersonalizado
          texto="Guardar Incidencia"
          onPress={guardar}
          color="#007AFF"
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#F0F2F5",
    padding: 20,
    paddingTop: 40, // Dejamos algo de aire por arriba
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 40, // Más espacio entre el título y el primer campo
    color: "#333",
  },
  input: {
    width: "100%",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10, // Bordes redondeados elegantes
    marginBottom: 15,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  inputMultilinea: {
    minHeight: 100, // Más alto porque es una descripción
    textAlignVertical: "top", // Que empiece a escribir desde arriba
    marginBottom: 35, // Mucho más aire entre el último campo y los botones de foto
  },
  filaBotones: {
    flexDirection: "row", // Los pone uno al lado de otro
    gap: 15, // Espacio entre ellos
    marginBottom: 20,
    width: "100%", // Obliga a ocupar todo el ancho
  },
  foto: {
    width: 300,
    height: 250,
    borderRadius: 20,
  },

  // ----- ESTILOS NUEVOS PARA LOS RADIO BUTTONS -----
  etiquetaCategoria: {
    alignSelf: "flex-start",
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 10,
    marginTop: 5,
  },
  contenedorRadios: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    marginBottom: 35,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  radioOpcion: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  radioCirculo: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  radioSeleccionado: {
    borderColor: "#007AFF",
  },
  radioPuntoInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF",
  },
  radioTexto: {
    fontSize: 16,
    color: "#444",
  },
  radioTextoSeleccionado: {
    fontWeight: "bold",
    color: "#007AFF",
  },
});
