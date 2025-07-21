const apiKeyInput = document.getElementById('apiKey');
const gameSelect = document.getElementById('gameSelect');
const questionInput = document.getElementById('questionInput');
const askButton = document.getElementById('askButton');
const aiResponse = document.getElementById('aiResponse');
const form = document.getElementById('form');

const perguntarAI = async (question, game, apiKey) => {
  const model = "gemini-1.5-flash"; // ou gemini-1.5-pro, se tiver acesso
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const prompt = `Tenho o jogo ${game} e quero saber: ${question}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    }),
  });

  const data = await response.json();
  console.log("Resposta bruta da IA:", data);

  try {
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    return "Não foi possível entender a resposta da IA. Verifique se sua API Key é válida.";
  }
};

const enviarFormulario = async (event) => {
  event.preventDefault();

  const apiKey = apiKeyInput.value.trim();
  const game = gameSelect.value.trim();
  const question = questionInput.value.trim();

  if (!apiKey || !game || !question) {
    alert('Por favor, preencha todos os campos.');
    return;
  }

  askButton.disabled = true;
  askButton.textContent = 'Perguntando...';
  askButton.classList.add('loading');

  try {
    const resposta = await perguntarAI(question, game, apiKey);
    aiResponse.querySelector('.response-content').innerHTML = resposta.replace(/\n/g, "<br>");
  } catch (error) {
    console.error("Erro na requisição:", error);
    aiResponse.querySelector('.response-content').textContent = "Erro ao tentar obter resposta da IA.";
  } finally {
    askButton.disabled = false;
    askButton.textContent = 'Perguntar';
    askButton.classList.remove('loading');
  }
};

form.addEventListener('submit', enviarFormulario);
