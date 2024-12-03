const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

// Configuração do cliente
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true },
});

// Estados para gerenciar interações
let userStates = {};

const mainMenu = `
🎸 *Solidários Rock Clube* 🎸
🌟 Seja bem-vindo(a) ao nosso atendimento! 🌟
Escolha uma opção:
1️⃣ Sobre nossa história
2️⃣ Fazer uma doação
3️⃣ Convocar para ação social
4️⃣ Quero ser membro
5️⃣ Diretoria

🔄 *Digite "V" para Voltar ao menu principal*
❌ *Digite "E" para Encerrar atendimento*
`;

// Respostas para cada opção do menu
const responses = {
    1: `🎶 Solidários RC foi criado para ajudar uns aos outros, criado em 2023 por um grupo de amigos de São Paulo, Brasil, que possuem em comum o seu amor pelo Rock! 🎸\n\n💪 Focados em ações sociais sem pensar em nenhum tipo de lucro. Utilizamos a cultura dos Moto Clubes como base de inspiração para conduzir o grupo.`,
    2: `💰 Segue o link do formulário para você fazer a sua doação!\n\n👉 [Clique aqui para doar](https://solidarios.vercel.app)`,
    3: `🤝 Precisa de APOIO ou ORGANIZAÇÃO para uma ação social?\n\n📩 Envie uma DM no nosso Instagram: [@solidarios.rc](https://www.instagram.com/solidarios.rc/)`,
    4: `🤘 Quer fazer parte do Solidários RC?\n\nPreencha este formulário e alguém da DIRETORIA entrará em contato com você:\n\n👉 [Formulário de Membro](https://forms.gle/ya6XnhP24PRXRpUY8)`,
    5: `👔 *DIRETORIA DO SOLIDÁRIOS RC*\n\n1️⃣ Presidente: FELIX\n2️⃣ Vice-Presidente: ❌\n3️⃣ Secretário: MAX\n4️⃣ Disciplina: ❌\n5️⃣ Tesoureiro: EDY (EDSON)\n6️⃣ Diretor Geral: SHEILA\n7️⃣ Comunicação: PEIXE\n8️⃣ Dir. Marketing: ERIKA\n9️⃣ Marketing: BIANCA`,
};

// Evento para gerar o QR Code
client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});

// Evento ao autenticar
client.on("ready", () => {
    console.log("Bot está pronto!");
});

// Evento ao receber mensagem
client.on("message", (msg) => {
    const { from, body, isGroupMsg } = msg;
    const lowerCaseBody = body.toLowerCase();

    // Evita interação em grupos
    if (isGroupMsg) return;

    // Ativa o bot apenas com a palavra-chave "solidarios"
    if (!userStates[from] && lowerCaseBody.includes("solidarios")) {
        userStates[from] = "MAIN_MENU";
        msg.reply(mainMenu);
        return;
    }

    // Controla o estado do menu
    if (userStates[from]) {
        const state = userStates[from];
        if (state === "MAIN_MENU") {
            if (responses[body]) {
                userStates[from] = `OPTION_${body}`;
                msg.reply(
                    `${responses[body]}\n\n🔄 *Digite "V" para Voltar ao menu principal*\n❌ *Digite "E" para Encerrar atendimento*`
                );
            } else if (body === "v") {
                msg.reply(mainMenu);
            } else if (body === "e") {
                delete userStates[from];
                msg.reply(
                    "👋 Obrigado por entrar em contato com o Solidários Rock Clube! Até breve!"
                );
            } else {
                msg.reply(
                    "❓ Opção inválida. Por favor, escolha uma das opções do menu."
                );
            }
        } else {
            if (body === "v") {
                userStates[from] = "MAIN_MENU";
                msg.reply(mainMenu);
            } else if (body === "e") {
                delete userStates[from];
                msg.reply(
                    "👋 Obrigado por entrar em contato com o Solidários Rock Clube! Até breve!"
                );
            } else {
                msg.reply(
                    "❓ Por favor, escolha 'V' para Voltar ao menu principal ou 'E' para Encerrar atendimento."
                );
            }
        }
    }
});

// Inicia o cliente
client.initialize();
