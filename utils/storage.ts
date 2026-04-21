import AsyncStorage from "@react-native-async-storage/async-storage";

// Definición del tipo de la incidencia.
export type CategoriaIncidencia =
  | "Limpieza"
  | "Mobiliaria"
  | "Vía pública"
  | "Otro";

// Definición del Estado de la incindencia.
export type EstadoIncidencia = "Pendiente" | "Resuelta";

// 1. Definimos la forma de una Incidencia.
export interface Incidencia {
  id: string; // Un identificador único (usaremos la fecha/hora en milisegundos)
  titulo: string;
  descripcion: string;
  fotoUri: string;
  fecha: string;
  categoria: CategoriaIncidencia; // Tipo de incidencias de la linea 4.
  estado: EstadoIncidencia; // Estado de incidencias de la linea 7.
}

const STORAGE_KEY = "@incidencias_urbanas";

// 2. Función para guardar una nueva incidencia
export const guardarIncidencia = async (nuevaIncidencia: Incidencia) => {
  try {
    // Primero, obtenemos lo que ya haya guardado el teléfono
    const incidenciasActuales = await obtenerIncidencias();

    // Añadimos la nueva queja al principio de la lista
    const nuevasIncidencias = [nuevaIncidencia, ...incidenciasActuales];

    // Lo "empaquetamos" en texto (JSON) y lo guardamos
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nuevasIncidencias));
  } catch (error) {
    console.error("Error al guardar la incidencia:", error);
  }
};

// 3. Función para leer todas las incidencias
export const obtenerIncidencias = async (): Promise<Incidencia[]> => {
  try {
    // Leemos el texto guardado
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);

    // Si hay datos, los convertimos de texto a un array de objetos (Incidencia[]). Si no, devolvemos array vacío []
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (error) {
    console.error("Error al obtener las incidencias:", error);
    return [];
  }
};

// 4. Función para borrar una incidencia
export const borrarIncidencia = async (id: string) => {
  try {
    const incidenciasActuales = await obtenerIncidencias();
    const nuevasIncidencias = incidenciasActuales.filter(
      (inc) => inc.id !== id,
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nuevasIncidencias));
  } catch (error) {
    console.error("Error al borrar la incidencia:", error);
  }
};

// 5. Función para cambiar el estado a "Resuelta"
export const actualizarEstadoIncidencia = async (
  id: string,
  nuevoEstado: EstadoIncidencia,
) => {
  try {
    const incidenciasActuales = await obtenerIncidencias();
    const nuevasIncidencias = incidenciasActuales.map((inc) =>
      inc.id === id ? { ...inc, estado: nuevoEstado } : inc,
    );
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nuevasIncidencias));
  } catch (error) {
    console.error("Error al actualizar la incidencia:", error);
  }
};
