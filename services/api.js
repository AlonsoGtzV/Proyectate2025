// services/api.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function getUser(token) {
  const userId = await AsyncStorage.getItem('userId');
  if (!userId || !token) return null;
  const res = await fetch(`http://10.0.2.2:8080/api/users/${userId}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al obtener usuario');
  return await res.json();
}

export async function getLessons(token, filters) {
  const params = new URLSearchParams(filters).toString();
  const res = await fetch(`http://10.0.2.2:8080/api/lessons/filter?${params}`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Error al obtener lecciones');
  return await res.json();
}

export async function updateUserPartial(token, data) {
  const userId = await AsyncStorage.getItem('userId');
  if (!userId || !token) return null;
  const res = await fetch(`http://10.0.2.2:8080/api/users/${userId}/update-partial`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar usuario');
  return await res.json();
}