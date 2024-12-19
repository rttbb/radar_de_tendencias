document.getElementById("urlForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  // Captura dos dados do formulário
  const formData = {
    url_destino: document.querySelector('input[name="url_destino"]').value,
    tipo_campanha: document.querySelector('select[name="tipo_campanha"]').value,
    utm_source: document.querySelector('input[name="source"]').value,
    utm_medium: document.querySelector('input[name="medium"]').value,
    utm_campaign: document.querySelector('input[name="campaign"]').value,
  };

  try {
    const response = await fetch("http://localhost:8000/generate_url", { // Verifique o nome correto da rota aqui!
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Erro ao enviar dados para a API");
    }

    const data = await response.json();
    console.log("Dados da resposta:", data);

    alert(`URL gerada: ${data.redirect_url}`);
  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao gerar a URL.");
  }
});
