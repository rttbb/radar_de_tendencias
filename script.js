document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("urlForm");
  const responseContainer = document.getElementById("responseContainer");
  const loader = document.createElement('div');
  loader.classList.add('loader'); // Para mostrar a animação de carregamento
  responseContainer.appendChild(loader);
  responseContainer.style.display = "none"; // Inicialmente escondido

  const ga4Select = document.getElementById("ga4Select");
  const customGa4Input = document.getElementById("customGa4Input");

  // Exibe ou esconde o campo de ID customizado dependendo da seleção
  ga4Select.addEventListener("change", function() {
    if (ga4Select.value === "Outro") {
      customGa4Input.style.display = "block";
    } else {
      customGa4Input.style.display = "none";
    }
  });

  form.addEventListener("submit", async function(event) {
    event.preventDefault(); // Prevenir envio padrão do formulário

    // Mostrar o loader e esconder a resposta anterior
    responseContainer.style.display = "none";
    loader.style.display = "block"; // Exibe o loader

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
      // Fazer a requisição para a API FastAPI
      const response = await fetch('http://localhost:8000/generate_url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      // Esconder o loader e mostrar a resposta
      loader.style.display = "none";
      responseContainer.style.display = "block"; // Exibe o resultado

      if (result.url_da_pagina) {
        responseContainer.innerHTML = `URL gerada: <a href="${result.url_da_pagina}" target="_blank">${result.url_da_pagina}</a>`;
      } else {
        responseContainer.innerHTML = `Erro: ${result.error}`;
      }

    } catch (error) {
      loader.style.display = "none";
      responseContainer.style.display = "block";
      responseContainer.innerHTML = `Erro: ${error.message}`;
    }
  });
});
