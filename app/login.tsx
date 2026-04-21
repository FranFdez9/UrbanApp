import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Switch
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { supabase } from "@/utils/supabase";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(true);
    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            Alert.alert("Error de Inicio de Sesión", error.message);
        } else {
            await AsyncStorage.setItem("rememberMeData", JSON.stringify({
                timestamp: Date.now(),
                remember: rememberMe
            }));
            router.replace("/(tabs)");
        }
        setLoading(false);
    };

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert("Atención", "Por favor, introduce tu correo electrónico para poder enviarte el enlace de recuperación.");
            return;
        }
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) {
            Alert.alert("Error", error.message);
        } else {
            Alert.alert("¡Enlace enviado!", "Revisa tu bandeja de entrada o carpeta de spam para restablecer tu contraseña.");
        }
        setLoading(false);
    };



      return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
        {/* Cabecera / Logo */}
        <View style={styles.headerContainer}>
          <Text style={styles.emojiLogo}>🏙️</Text>
          <Text style={styles.titulo}>UrbanApp</Text>
          <Text style={styles.subtitulo}>Mejora tu ciudad, un reporte a la vez</Text>
        </View>
        {/* Formulario */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Correo Electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="ejemplo@correo.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#999"
            secureTextEntry // Oculta las letras con puntitos
            value={password}
            onChangeText={setPassword}
          />
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 15 }}>
            <Switch
              value={rememberMe}
              onValueChange={setRememberMe}
              trackColor={{ false: "#ccc", true: "#007AFF" }}
            />
            <Text style={{ marginLeft: 10, color: "#555", fontSize: 14 }}>
              Recordarme por 15 días
            </Text>
          </View>

          <TouchableOpacity style={styles.olvidoPassword} onPress={handleResetPassword} disabled={loading}>
            <Text style={styles.textoOlvido}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.botonPrincipal} onPress={handleLogin} disabled={loading}>
            <Text style={styles.textoBotonPrincipal}>{loading ? "Cargando..." : "Entrar"}</Text>
          </TouchableOpacity>
        </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  emojiLogo: {
    fontSize: 70,
    marginBottom: 10,
  },
  titulo: {
    fontSize: 36,
    fontWeight: "900",
    color: "#1A1A24",
    letterSpacing: -1,
  },
  subtitulo: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
    textAlign: "center",
  },
  formContainer: {
    width: "100%",
  },
  label: {
    fontSize: 14,
    fontWeight: "700", // Letra un poco más contundente
    color: "#333",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: "#F4F6F9",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 12,
    fontSize: 16,
    color: "#222",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#EAEAEA",
  },
  olvidoPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  textoOlvido: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "600",
  },
  botonPrincipal: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    // Sombra chula azul brillante para que invite a clickar
    shadowColor: "#007AFF", 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  textoBotonPrincipal: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
