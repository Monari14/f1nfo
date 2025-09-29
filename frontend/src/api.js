export async function callAPI(endpoint) {
  const url = `http://localhost:3000/api${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
  return response.json();
}
