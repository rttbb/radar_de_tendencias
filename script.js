document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("urlForm");
  const responseContainer = document.getElementById("responseContainer");
  const loadingMessage = document.getElementById("loadingMessage");
  const ga4Select = document.getElementById("ga4Select");
  const customGa4Container = document.getElementById("customGa4Container");
  const customGa4Input = document.getElementById("customGa4Input");
  const campaignsTable = document.getElementById("campaignsTable")?.querySelector("tbody");
  
  const API_URL = "http://redirect-users.ten.hm.bb.com.br";

  ga4Select?.addEventListener("change", function() {
    if (ga4Select.value === "Outro") {
      customGa4Container.style.display = "block";
      customGa4Input.disabled = false;
    } else {
      customGa4Container.style.display = "none";
      customGa4Input.disabled = true;
    }
  });

  form?.addEventListener("submit", async function(event) {
    event.preventDefault();
    responseContainer.innerHTML = "";
    responseContainer.style.display = "none";
    loadingMessage.style.display = "block";

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
      const response = await fetch(`${API_URL}/generate_url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      loadingMessage.style.display = "none";
      responseContainer.style.display = "block";

      if (result.url) {
        responseContainer.innerHTML = `✅ URL gerada: <a href="${result.url}" target="_blank">${result.url}</a>`;
      } else {
        responseContainer.innerHTML = `❌ Erro: ${result.error || "Erro desconhecido"}`;
      }
    } catch (error) {
      loadingMessage.style.display = "none";
      responseContainer.style.display = "block";
      responseContainer.innerHTML = `❌ Erro ao fazer a requisição: ${error.message}`;
      console.error("Erro na requisição:", error);
    }
  });

  async function checkAPIStatus() {
    try {
      const response = await fetch(`${API_URL}/status`);
      const data = await response.json();
      console.log("🟢 API Online:", data);
    } catch (error) {
      console.error("🔴 API Offline:", error);
    }
  }

  async function fetchCampaigns() {
    if (!campaignsTable) return;
    try {
      const response = await fetch(`${API_URL}/list_pages`);
      const data = await response.json();

      if (data.pages) {
        campaignsTable.innerHTML = "";
        data.pages.forEach(campaign => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${campaign}</td>
            <td>
              <button class="delete-btn" onclick="deleteCampaign('${campaign}')">Excluir</button>
            </td>
          `;
          campaignsTable.appendChild(row);
        });
      }
    } catch (error) {
      console.error("Erro ao buscar campanhas:", error);
    }
  }

  async function deleteCampaign(campaignName) {
    if (!confirm(`Tem certeza que deseja excluir a campanha "${campaignName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/delete_page`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_name: campaignName })
      });

      const result = await response.json();
      if (result.message) {
        alert("Campanha removida com sucesso!");
        fetchCampaigns();
      } else {
        alert("Erro ao excluir campanha: " + result.error);
      }
    } catch (error) {
      console.error("Erro ao excluir campanha:", error);
    }
  }

  checkAPIStatus();
  fetchCampaigns();
});
