export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al subir imagen');
    }

    const data = await response.json();
    return data.data.secure_url; // ✅ acceso correcto a la URL segura
  } catch (err) {
    console.error('❌ Error en uploadImage:', err);
    throw err;
  }
}
