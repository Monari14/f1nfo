export async function callAPI(endpoint) {
  const url = `http://localhost:3000/api${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  console.log("[callAPI] URL chamada:", url);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error("[callAPI] Erro na resposta:", response.status, response.statusText);
      throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("[callAPI] Resposta da API:", data);
    return data;
  } catch (err) {
    console.error("[callAPI] Erro no fetch:", err);
    throw err;
  }
}
