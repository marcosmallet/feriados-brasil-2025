# Feriados Brasil 2025

Uma aplicação para consulta de feriados nacionais, estaduais e municipais do Brasil para o ano de 2025.

## 🌟 Funcionalidades

- **Filtros Avançados**: Filtre feriados por mês, tipo (nacional, estadual, municipal) e estado
- **Interface Intuitiva**: Interface moderna e responsiva com componentes de seleção múltipla
- **Dados Completos**: Base de dados completa com mais de 8.000 feriados de todos os estados e principais municípios
- **Busca Dinâmica**: Resultados atualizados em tempo real conforme os filtros selecionados
- **Loading Animado**: Indicador de carregamento com feedback visual durante a busca
- **Responsivo**: Funciona perfeitamente em desktop e dispositivos móveis

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça fork deste repositório
2. Conecte sua conta do GitHub ao Vercel
3. Importe o projeto no Vercel
4. O deploy será automático!

🔗 Aplicação publicada: [https://feriados-brasil-2025.vercel.app](https://feriados-brasil-2025.vercel.app)

### Netlify

1. Faça fork deste repositório
2. Conecte sua conta do GitHub ao Netlify
3. Configure:
   - Build command: `pnpm run build`
   - Publish directory: `dist`
4. Deploy!

## 🛠️ Desenvolvimento Local

### Pré-requisitos

- Node.js 18+
- pnpm (recomendado) ou npm

### Instalação

```bash
# Clone o repositório
git clone https://github.com/marcosmallet/feriados-brasil-2025.git
cd feriados-brasil-2025

# Instale as dependências
pnpm install

# Inicie o servidor de desenvolvimento
pnpm run dev
```

### Scripts Disponíveis

```bash
pnpm run dev      # Servidor de desenvolvimento
pnpm run build    # Build para produção
pnpm run preview  # Preview da build de produção
pnpm run lint     # Verificar código
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/              # Componentes UI do shadcn/ui
│   ├── checkbox.jsx     # Componente de checkbox customizado
│   └── multi-select.jsx # Componente de seleção múltipla
├── assets/
│   ├── national_holidays_2025.json     # Feriados nacionais
│   ├── state_holidays_2025.json        # Feriados estaduais
│   └── municipal_holidays_2025.json    # Feriados municipais
├── App.jsx              # Componente principal
├── App.css              # Estilos da aplicação
└── main.jsx             # Ponto de entrada
```

## 🎨 Tecnologias

- **React 18** - Biblioteca JavaScript para interfaces
- **Vite** - Ferramenta de build e desenvolvimento
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Biblioteca de componentes UI
- **Lucide React** - Ícones
- **Radix UI** - Componentes primitivos acessíveis

## 📊 Dados dos Feriados

A aplicação utiliza dados de feriados brasileiros para 2025, incluindo:

- **Feriados Nacionais**: Datas comemorativas válidas em todo o território nacional
- **Feriados Estaduais**: Feriados específicos de cada estado brasileiro
- **Feriados Municipais**: Feriados de principais municípios do país

Os dados são carregados a partir de arquivos JSON localizados na pasta `src/assets/`.

### 📚 Fonte dos Dados

Os dados utilizados nesta aplicação foram extraídos e adaptados a partir do repositório [feriados-brasil](https://github.com/joaopbini/feriados-brasil), mantido por [joaopbini](https://github.com/joaopbini). Agradecimentos pela coleta e disponibilização pública dessas informações.

## 🎯 Como Usar

1. **Selecionar Filtros**: Use os campos de seleção para escolher:

   - Meses desejados
   - Tipos de feriado (nacional, estadual, municipal)
   - Estados específicos

2. **Buscar Feriados**: Clique no botão "Buscar Feriados" para visualizar os resultados

3. **Limpar Busca**: Use o botão "Limpar Busca" para limpar os resultados

4. **Visualizar Resultados**: Os feriados encontrados são exibidos em cards com:
   - Nome do feriado
   - Data
   - Tipo (nacional, estadual ou municipal)
   - Localização (quando aplicável)
   - Descrição detalhada

## 🤝 Contribuindo

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique se todas as dependências foram instaladas corretamente
2. Certifique-se de que o Node.js está na versão 18 ou superior
3. Abra uma issue no GitHub para reportar bugs ou solicitar features

---

Desenvolvido com ❤️ para facilitar a consulta de feriados brasileiros.
