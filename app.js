const GITHUB_OWNER = "SEU_USUARIO";
const GITHUB_REPO = "SEU_REPO";
const GITHUB_FILE_PATH = "dados/coords.txt";
const GITHUB_TOKEN = "SEU_TOKEN_AQUI";

const latInput = document.getElementById("lat");
const lonInput = document.getElementById("lon");
const txtContent = document.getElementById("txtContent");
const statusDiv = document.getElementById("status");

function setStatus(msg) { statusDiv.textContent = msg; }
function toBase64(str){ return btoa(unescape(encodeURIComponent(str))); }
function fromBase64(b64){ return decodeURIComponent(escape(atob(b64))); }

async function carregarDoGitHub(){
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;
  const res = await fetch(url,{headers:{Authorization:`Bearer ${GITHUB_TOKEN}`}});
  const data = await res.json();
  const txt = fromBase64(data.content);
  txtContent.value = txt;
  const p = txt.split(",");
  latInput.value = p[0];
  lonInput.value = p[1];
  setStatus("Arquivo carregado");
}

async function salvarNoGitHub(){
  const contentStr = `${latInput.value},${lonInput.value}`;
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;

  let sha;
  const getRes = await fetch(url,{headers:{Authorization:`Bearer ${GITHUB_TOKEN}`}});
  if(getRes.ok){ const data = await getRes.json(); sha = data.sha; }

  const body = { message:"Atualização automática", content:toBase64(contentStr), ...(sha?{sha}:{}) };

  await fetch(url,{method:"PUT",headers:{Authorization:`Bearer ${GITHUB_TOKEN}`},body:JSON.stringify(body)});
  setStatus("Arquivo salvo");
}

function usarGPS(){
  navigator.geolocation.getCurrentPosition(pos=>{
    latInput.value = pos.coords.latitude.toFixed(6);
    lonInput.value = pos.coords.longitude.toFixed(6);
    txtContent.value = `${latInput.value},${lonInput.value}`;
  });
}
