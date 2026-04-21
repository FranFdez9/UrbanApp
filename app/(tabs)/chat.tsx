import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// NOTA: Reemplaza esto con tu API Key de Google AI Studio
const GEMINI_API_KEY = "AIzaSyDYezBXqQoIHfCL4c8kHD3F044BZNoRcRo".trim();

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

export default function ChatScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "¡Hola! Soy tu agente personal de IA. ¿En qué puedo ayudarte hoy?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const testKey = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`,
      );
      const data = await response.json();
      console.log("Modelos disponibles:", data);

      if (data.error) {
        alert(`Error de API: ${data.error.message}`);
      } else {
        const models = data.models
          ?.map((m: any) => m.name.split("/").pop())
          .join(", ");
        alert(`¡Conexión OK! Modelos disponibles: ${models || "Ninguno"}`);
      }
    } catch (error: any) {
      alert(`Error de red: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (inputText.trim() === "" || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      // Usamos el modelo que apareció en tu diagnóstico (2.5 Flash)
      const model = "gemini-2.5-flash";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

      console.log(`Intentando con: ${apiUrl.replace(GEMINI_API_KEY, "***")}`);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-client": "genai-js", // Añadimos este header que a veces es necesario
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: inputText }] }],
        }),
      });

      if (response.status === 404) {
        throw new Error(
          `El modelo '${model}' no fue encontrado. Pulsa el botón '?' para ver qué modelos tienes disponibles.`,
        );
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(`${data.error.message} (Código: ${data.error.code})`);
      }

      const aiText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No recibí respuesta del modelo.";

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiText,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Error detallado:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Error: ${error.message || "Fallo de conexión"}`,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        100,
      );
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === "user"
          ? styles.userBubble
          : [
              styles.aiBubble,
              {
                backgroundColor:
                  colors.background === "#fff" ? "#f0f0f0" : "#333",
              },
            ],
      ]}
    >
      <Text
        style={[
          styles.messageText,
          { color: item.sender === "user" ? "#fff" : colors.text },
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.background }]}
      keyboardVerticalOffset={100}
    >
      <View style={styles.header}>
        <IconSymbol size={32} name="brain.fill" color={colors.tint} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Agente IA
        </Text>
        <TouchableOpacity onPress={testKey} style={{ marginLeft: "auto" }}>
          <IconSymbol
            size={24}
            name="questionmark.circle"
            color={colors.tint}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.messageList}
      />
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Pensando...
          </Text>
        </View>
      )}
      <View
        style={[
          styles.inputContainer,
          { borderTopColor: colors.background === "#fff" ? "#eee" : "#444" },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              color: colors.text,
              backgroundColor:
                colors.background === "#fff" ? "#f9f9f9" : "#1a1a1a",
            },
          ]}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Pregunta algo..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={[styles.sendButton, { backgroundColor: colors.tint }]}
          disabled={isLoading}
        >
          <IconSymbol size={24} name="paperplane.fill" color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  headerTitle: { fontSize: 24, fontWeight: "bold" },
  messageList: { padding: 20, paddingBottom: 40 },
  messageBubble: {
    padding: 14,
    borderRadius: 20,
    marginBottom: 12,
    maxWidth: "85%",
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  aiBubble: { alignSelf: "flex-start", borderBottomLeftRadius: 4 },
  messageText: { fontSize: 16, lineHeight: 22 },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    paddingBottom: Platform.OS === "ios" ? 36 : 16,
    alignItems: "center",
    gap: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderRadius: 25,
    paddingHorizontal: 20,
    height: 48,
    fontSize: 16,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingText: { fontSize: 12, fontStyle: "italic" },
});
