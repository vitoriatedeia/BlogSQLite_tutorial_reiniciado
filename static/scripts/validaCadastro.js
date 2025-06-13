console.log("JS CONECTADO!");

const formulario = document.getElementById("cadastroForm");
const nome = document.getElementById("nome");
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const confirmarSenha = document.getElementById("confirmarSenha");
const celular = document.getElementById("celular");
const cpf = document.getElementById("cpf");
const rg = document.getElementById("rg");
const msgErrorElements = document.getElementsByClassName("msgError"); // Renomeando para clareza

/* ------ FUNÇÃO PARA RENDERIZAR AS DIFERENTES MENSAGENS DE ERRO! ------ */
const createDisplayMsgError = (mensagem) => {
  if (msgErrorElements.length > 0) {
    //Boa prática verificar se o elemento
    msgErrorElements[0].textContent = mensagem;
    msgErrorElements[0].style.display = mensagem ? "block" : "none";
  }
};
/* --------------------------------------------------------------------- */

/* ---------------- FUNÇÃO PARA VERIFICAR O NOME ----------------------- */
const checkNome = () => {
  const nomeRegex = /^[A-Za-zÀ-ÿ\s'-]+$/; //Permitindo apóstrofos e hífens
  return nomeRegex.test(nome.value.trim()); // .trim() para remover espaços
};
/* --------------------------------------------------------------------- */

/* ---------- FUNÇÃO PARA VERIFICAR O EMAIL --------------------- */
const checkEmail = (emailValue) => {
  const emailTrimed = emailValue.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailTrimed)) {
    return false;
  }
  const partesEmail = emailTrimed.split("@");
  if (partesEmail.length === 2) {
    const domain = partesEmail[1].toLowerCase();
    const allowedDomains = [
      "gmail.com",
      "outlook.com",
      "hotmail.com",
      "icloud.com",
      "yahoo.com",
    ];
    return true;
  }
  return false;
};
/* --------------------------------------------------------------------- */

/* ---------- FUNÇÃO PARA VERIFICAR IGUALDADE DAS SENHAS --------------- */
function checkPasswordMatch() {
  return senha.value === confirmarSenha.value;
}
/* --------------------------------------------------------------------- */

/* ----------- FUNÇÃO PARA INSERIR MASCARA NO TELEFONE ----------------- */

function maskPhoneNumber(event) {
  let celularValue = event.target.value;

  if (/[A-Za-zÀ-ÿ]/.test(celularValue)) {
    createDisplayMsgError("O celular deve conter apenas números!");
  } else {
    createDisplayMsgError("");
  }

  celular = celular.replace(/\D/g, ""); // Remove os caracteres não numéricos

  if (celular.length > 11) {
    celular = celular.substring(0, 11);
  }

  if (celular.length > 2) {
    celular = `(${celular.substring(0, 2)}) ${celular.substring(2)}`;
  } else if (celular.length > 0) {
    celular = `(${celular}`;
  }

  if (celular.length > 10) {
    celular = celular.replace(/(\(\d{2}\)) (\d{5})(\d{1,4})/, "$1 $2-$3");
  }

  event.target.value = celular;
}
/* --------------------------------------------------------------------- */

/* ------------- FUNÇÃO PARA VERIFICAR FORÇA DA SENHA ------------------ */
function checkPasswordStrength(senha) {
  if (!/[a-z]/.test(senha)) {
    return "A senha deve ter pelo menos uma letra minúscula!";
  }
  if (!/[A-Z]/.test(senha)) {
    return "A senha deve ter pelo menos uma letra maiúscula!";
  }
  if (!/[\W_]/.test(senha)) {
    return "A senha deve ter pelo menos um caractere especial!";
  }
  if (!/\d/.test(senha)) {
    return "A senha deve ter pelo menos um número!";
  }
  if (senha.length < 8) {
    return "A senha deve ter pelo menos 8 caracteres!";
  }

  return null;
}
/* --------------------------------------------------------------------- */

/* ------------- FUNÇÃO PARA VERIFICAR E ENVIAR DADOS ------------------ */
async function fetchDatas(event) {
  // Tornar a função async para usar await
  event.preventDefault();
  createDisplayMsgError(""); // Limpa mensagens de erro anteriores

  if (!checkNome()) {
    // Correção aqui: chamar a função.
    createDisplayMsgError(
      "O nome não pode conter números ou caracteres especiais!"
    );
    nome.focus();
    return;
  }

  if (!checkEmail(email.value)) {
    createDisplayMsgError(
      // Correção aqui: mensagem apropriada
      "O email digitado não é válido ou não é de um domínio permitido!"
    );
    email.focus();
    return;
  }

  const senhaError = checkPasswordStrength(senha.value);
  if (senhaError) {
    createDisplayMsgError(senhaError);
    senha.focus();
    return;
  }

  if (!checkPasswordMatch()) {
    createDisplayMsgError("As senhas digitadas não coincidem!");
    confirmarSenha.focus();
    return;
  }

  // Validação do celular (opcional, já que a máscara tenta corrigir)
  const celularLimpo = celular.value.replace(/\D/g, "");
  if (celular.value && (celularLimpo.length < 10 || celularLimpo.length > 11)) {
    createDisplayMsgError("O número de celular parece inválido.");
    celular.focus();
    return;
  }

  const formData = {
    username: nome.value.trim(),
    email: email.value.trim(),
    password: senha.value,
    celular: celularLimpo,
    cpf: cpf.value.replace(/\D/g, ""),
    rg: rg.value.replace(/\D/g, ""),
  };

  console.log("Dados a serem enviados: ", JSON.stringify(formData, null, 2));

  // --- INÍCIO DA LÓGICA DE ENVIO ---
  try {
    const response = await fetch("/cadastro", {
      method: "POST", // Método HTTP
      headers: {
        "Content-Type": "application/json", // Indicando que estamos enviando JSON
        // 'Accept': 'application/json'  // Opcional, indica que esperamos JSON de volta
      },
      body: JSON.stringify(formData), // Converte o objeto JavaScript para uma string JSON
    });

    if (response.ok) {
      // Verifica se a resposta do servidor foi bem-sucedida (status 2xx)
      const result = await response.json(); // Tenta parsear a resposta do servidor como JSON
      console.log("Sucesso:", result);
      // createDisplayMsgError('Cadastro realizado com sucesso! ' + (result.message || ''));
      alert("Cadastro realizado com sucesso! " + (result.message || ""));
      window.location.href = "/login";
      // Redirecionar ou mostrar mensagem de sucesso mais elaborada
    } else {
      // O servidor respondeu com um erro (status 4xx ou 5xx)
      const errorData = await response.json().catch(() => ({
        message: "Erro ao processar a resposta do servidor.",
      }));
      console.error("Erro do servidor:", response.status, errordata);
      createDisplayMsgError(
        `Erro: ${errorData.message || response.statusText}`
      );
    }
  } catch (error) {
    //Erro de rede ou algo impediu a requisição de ser completada
    console.error("Erro do servidor:", response.status, errorData);
    createDisplayMsgError("Erro de conexão. Por favor, tente novamente.");
  }
  // --- FIM DA LÓGICA DE ENVIO ---
}
/* --------------------------------------------------------------------- */

formulario.addEventListener("submit", fetchDatas);

nome.addEventListener("input", () => {
  if (nome.value && !checkNome()) {
    createDisplayMsgError(
      "O nome não pode conter números ou caracteres especiais!"
    );
  } else {
    createDisplayMsgError("");
  }
});

email.addEventListener("input", () => {
  if (email.value && !checkEmail(email.value)) {
    createDisplayMsgError("O e-mail digitado não é valido!");
  } else {
    createDisplayMsgError("");
  }
});

senha.addEventListener("input", () => {
  if (senha.value && checkPasswordStrength(senha.value)) {
    createDisplayMsgError(checkPasswordStrength(senha.value));
  } else {
    createDisplayMsgError("");
  }
});

function checkPasswordStrength(senha) {
  if (!/[a-z]/.test(senha)) {
    return "A senha deve ter pelo menos uma letra minúscula!";
  }
  if (!/[A-Z]/.test(senha)) {
    return "A senha deve ter pelo menos uma letra maiúscula!";
  }
  if (!/[\W_]/.test(senha)) {
    return "A senha deve ter pelo menos um caractere especial!";
  }
  if (!/\d/.test(senha)) {
    return "A senha deve ter pelo menos um número!";
  }
  if (senha.length < 8) {
    return "A senha deve ter pelo menos 8 caracteres!";
  }

  return null;
}
