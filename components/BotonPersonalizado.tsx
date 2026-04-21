import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

/**
 * PASO 1: LA INTERFAZ (Tu "contrato" de TypeScript)
 * Aquí definimos qué "props" (propiedades) acepta nuestro botón.
 * Es igual que lo que hiciste en '02-interfaces.ts'.
 */
interface Props {
  texto: string;
  onPress: () => void;
  color?: string; // El '?' significa que es opcional
  estilo?: ViewStyle; // Permite pasar estilos extra desde fuera
}

/**
 * PASO 2: EL COMPONENTE
 * Usamos desestructuración para sacar las props.
 */
export const BotonPersonalizado = ({ texto, onPress, color = '#4630EB', estilo }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.boton, { backgroundColor: color }, estilo]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Text style={styles.textoBoton}>{texto}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  boton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
