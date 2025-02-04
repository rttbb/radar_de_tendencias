document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("urlForm");
  const responseContainer = document.getElementById("responseContainer");
  const loadingMessage = document.getElementById("loadingMessage");
  const ga4Select = document.getElementById("ga4Select");
  const customGa4Container = document.getElementById("customGa4Container");
  const customGa4Input = document.getElementById("customGa4Input");

  // Exibe ou esconde o campo GA4 personalizado
  ga4Select.addEventListener("change", function() {
    if (ga4Select.value === "Outro") {
      customGa4Container.style.display = "block";
      customGa4Input.disabled = false;
    } else {
      customGa4Container.style.display = "none";
      customGa4Input.disabled = true;
    }
  });

  form.addEventListener("submit", async function(event) {
    event.preventDefault();

    // Esconder resposta anterior e mostrar "Carregando..."
    responseContainer.innerHTML = "";
    responseContainer.style.display = "none";
    loadingMessage.style.display = "block";

    // Obter os dados do formulário
    const formData = new FormData(form);
    const data = {
      url_destino: formData.get('url_destino'),
      tipo_campanha: formData.get('tipo_campanha'),
      utm_source: formData.get('source'),
      utm_medium: formData.get('medium'),
      utm_campaign: formData.get('campaign'),
      ga4_id: formData.get('ga4_id') === "Outro" ? formData.get('custom_ga4') : "G-SEC2DGHJ6P"
    };

    try {
      const response = await fetch('http://localhost:8000/generate_url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      loadingMessage.style.display = "none"; // Esconde "Carregando..."
      responseContainer.style.display = "block";

      if (result.url) {
        responseContainer.innerHTML = `URL gerada: <a href="${result.url}" target="_blank">${result.url}</a>`;
      } else {
        responseContainer.innerHTML = `Erro: ${result.error || "Erro desconhecido"}`;
      }
    } catch (error) {
      loadingMessage.style.display = "none";
      responseContainer.style.display = "block";
      responseContainer.innerHTML = `Erro: ${error.message}`;
    }
  });
});
