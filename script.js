
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

let blockchain = [
  { index: 0, timestamp: new Date().toLocaleString(), data: "Genesis Block", previousHash: "0", hash: "GENESIS" }
];

function checkPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  return score;
}

function updateStrengthUI(score) {
  const msg = document.getElementById("strengthMsg");
  const bar = document.getElementById("progress");
  const colors = ["#ff4b5c", "#ff914d", "#ffda77", "#9fff8c", "#00c896"];
  const messages = [
    "Too Weak ",
    "Weak ",
    "Medium ",
    "Strong ",
    "Very Strong "
  ];

  msg.innerText = messages[score - 1] || "Enter a password!";
  bar.style.width = `${(score / 5) * 100}%`;
  bar.style.background = colors[score - 1] || "#ff4b5c";
}

async function addBlock(password) {
  const latestBlock = blockchain[blockchain.length - 1];
  const hash = await sha256(password);
  const newBlock = {
    index: blockchain.length,
    timestamp: new Date().toLocaleString(),
    data: hash,
    previousHash: latestBlock.hash,
    hash: await sha256(hash + latestBlock.hash)
  };
  blockchain.push(newBlock);
  renderBlockchain();
}

function renderBlockchain() {
  const container = document.getElementById("blockchainContainer");
  container.innerHTML = "";
  blockchain.forEach(block => {
    const div = document.createElement("div");
    div.className = "block";
    div.innerHTML = `
      <strong>Block #${block.index}</strong><br>
       ${block.timestamp}<br>
       Hash: ${block.hash}<br>
       Data: ${block.data}<br>
       Prev: ${block.previousHash}
    `;
    container.appendChild(div);
  });
}

document.getElementById("togglePassword").addEventListener("click", () => {
  const input = document.getElementById("passwordInput");
  const toggleBtn = document.getElementById("togglePassword");
  if (input.type === "password") {
    input.type = "text";
    toggleBtn.textContent = "🕶";
  } else {
    input.type = "password";
    toggleBtn.textContent = "👁";
  }
});

document.getElementById("checkBtn").addEventListener("click", async () => {
  const password = document.getElementById("passwordInput").value;
  const score = checkPasswordStrength(password);
  updateStrengthUI(score);

  if (score === 5) {
    await addBlock(password);
    document.getElementById("strengthMsg").innerText += "  Added to blockchain!";
  }
});

renderBlockchain();
