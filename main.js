const skills = {
  js: ["Lógica e interação", "JavaScript", "No Kairós, reúne tarefas, agenda e hábitos no painel do dia. No ATLAS, processa o histórico para exibir a progressão dos treinos.", "kairos", "Ver no Kairós"],
  html: ["Estrutura", "HTML", "Estrutura as telas dos dois apps. No Kairós, organiza tarefas, agenda, estudos e hábitos em áreas fáceis de acessar no celular.", "kairos", "Ver no Kairós"],
  css: ["Interface", "CSS", "No Kairós, dá forma ao layout para celular, às animações e aos temas claro e escuro.", "kairos", "Ver no Kairós"],
  pwa: ["Instalação e offline", "PWA", "Kairós e ATLAS podem ser instalados na tela inicial do celular. Um service worker guarda os arquivos usados para abrir os apps sem internet.", "atlas", "Ver no ATLAS"],
  db: ["Backup na nuvem", "Supabase", "No ATLAS, oferece backup opcional na nuvem, com regras de acesso para cada pessoa consultar e gravar os próprios dados.", "atlas", "Ver no ATLAS"],
  pdf: ["Relatórios", "jsPDF", "No Kairós, gera o resumo do dia em PDF. No painel de logística, gera relatórios de turno.", "logistica", "Ver no painel de logística"],
};

const keys = [...document.querySelectorAll("[data-skill]")];
const kind = document.querySelector("#skill-kind");
const name = document.querySelector("#skill-name");
const copy = document.querySelector("#skill-copy");
const link = document.querySelector("#skill-link");

for (const key of keys) {
  key.addEventListener("click", () => {
    const [category, title, description, target, label] = skills[key.dataset.skill];
    for (const option of keys) {
      option.setAttribute("aria-pressed", String(option === key));
    }
    kind.textContent = category.toLocaleUpperCase("pt-BR");
    name.textContent = title;
    copy.textContent = description;
    link.href = "#" + target;
    link.textContent = label;
  });
}
