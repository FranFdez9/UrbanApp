import { obtenerIncidencias } from "@/utils/storage";
import { router, useFocusEffect } from "expo-router";
import { supabase } from "@/utils/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function PerfilScreen() {
  const [estadisticas, setEstadisticas] = useState({
    totalAvisos: 0,
    resueltos: 0,
  });

  const cargarDatos = async () => {
    let reportes = await obtenerIncidencias();
    const resueltos = reportes.filter((r) => r.estado === "Resuelta").length;

    setEstadisticas({
      totalAvisos: reportes.length,
      resueltos: resueltos,
    });
  };

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, []),
  );

  // LOGICA DE GAMIFICACIÓN: Calcula nivel y título
  let tituloCivico = "Vecino Novato";
  let iconoMedalla = "🥉";
  if (estadisticas.totalAvisos >= 5) {
    tituloCivico = "Ciudadano Ejemplar";
    iconoMedalla = "🥈";
  }
  if (estadisticas.totalAvisos >= 10) {
    tituloCivico = "Héroe del Barrio";
    iconoMedalla = "🥇";
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
        <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarEmoji}>{iconoMedalla}</Text>
        </View>
        <Text style={styles.textoNombre}>Mi Perfil</Text>
        <Text style={styles.textoNivel}>{tituloCivico}</Text>
      </View>

      <View style={styles.tarjetaStats}>
        <Text style={styles.tituloStats}>Tus Estadísticas de Impacto</Text>

        <View style={styles.filaStat}>
          <Text style={styles.statLabel}>Averías Reportadas:</Text>
          <Text style={styles.statValor}>{estadisticas.totalAvisos}</Text>
        </View>

        <View style={styles.filaStat}>
          <Text style={styles.statLabel}>Problemas Resueltos:</Text>
          <Text style={[styles.statValor, { color: "#34C759" }]}>
            {estadisticas.resueltos}
          </Text>
        </View>

        {estadisticas.totalAvisos < 5 && (
          <Text style={styles.mensajitoAnimador}>
            ¡Reporta {5 - estadisticas.totalAvisos} incidencias más para subir a
            Ciudadano Ejemplar!
          </Text>
        )}
      </View>

      {/* BOTON TEMPORAL PARA VER EL LOGIN */}
      <View style={{ padding: 20 }}>
        <TouchableOpacity
          onPress={async () => {
            await supabase.auth.signOut();
            await AsyncStorage.removeItem("rememberMeData");
            router.replace("/login");
          }}
          style={{
            backgroundColor: "#FF3B30",
            padding: 15,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F9",
  },
  header: {
    padding: 40,
    alignItems: "center",
    backgroundColor: "white",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E6F4FE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  avatarEmoji: {
    fontSize: 50,
  },
  textoNombre: {
    fontSize: 28,
    fontWeight: "900",
    color: "#222",
  },
  textoNivel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginTop: 5,
  },
  tarjetaStats: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  tituloStats: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 20,
    color: "#333",
  },
  filaStat: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  statLabel: {
    fontSize: 16,
    color: "#555",
  },
  statValor: {
    fontSize: 18,
    fontWeight: "900",
    color: "#222",
  },
  mensajitoAnimador: {
    marginTop: 20,
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
  },
});
