// aqui tem as configurações padrão do construtor de sites

const ESTILOS_PADRAO = {
    fundo: '#ffffff', texto: '#1e293b', padding: 80, borda: 0, layout: 'container'
};

const ESTADO_PADRAO = {
    global: {
        fonte: 'Inter',
        corPrimaria: '#2563eb',
        corSecundaria: '#1e293b'
    },
    secoes: [
        {
            id: 'cabecalho', tipo: 'header', titulo: 'Cabeçalho', ativo: true,
            dados: { logoTexto: 'rainbow.UX', logoImg: null, links: ['Home', 'Serviços', 'Contato'] },
            estilo: { ...ESTILOS_PADRAO, fundo: '#ffffff', padding: 20, layout: 'full', sombra: true }
        },
        {
            id: 'hero', tipo: 'hero', titulo: 'Bandeira', ativo: true,
            dados: { 
                titulo: 'Eleve seu Negócio', 
                subtitulo: 'Soluções digitais de alta performance para empresas que buscam o extraordinário.', 
                btn1: 'Começar Agora', btn2: 'Ver Portfólio',
                bgImg: null, bgOverlay: 0.6
            },
            estilo: { ...ESTILOS_PADRAO, fundo: '#1e293b', texto: '#ffffff', padding: 120, layout: 'full', alinhar: 'center' }
        },
        {
            id: 'servicos', tipo: 'grid', titulo: 'Grade', ativo: true,
            dados: {
                titulo: 'O Que Fazemos',
                itens: [
                    { titulo: 'Consultoria', texto: 'Análise estratégica para seu crescimento.' },
                    { titulo: 'Design UI/UX', texto: 'Interfaces que encantam e convertem.' },
                    { titulo: 'Desenvolvimento', texto: 'Código limpo e performático.' }
                ]
            },
            estilo: { ...ESTILOS_PADRAO, fundo: '#f8fafc', colunas: 3, cardFundo: '#ffffff', borda: 12 }
        },
        {
            id: 'flex', tipo: 'flex', titulo: 'Destaque Flexível', ativo: true,
            dados: {
                titulo: 'História da Empresa',
                texto: 'Fundada em 2024, nossa missão é simplificar a web. Utilizamos tecnologia de ponta para entregar resultados.',
                imagem: null,
                posicaoImg: 'right'
            },
            estilo: { ...ESTILOS_PADRAO, padding: 100 }
        },
        {
            id: 'galeria', tipo: 'carousel', titulo: 'Galeria', ativo: true,
            dados: { titulo: 'Nossos Projetos', imagens: [] },
            estilo: { ...ESTILOS_PADRAO, fundo: '#111827', texto: '#ffffff', layout: 'carousel', colunas: 3 }
        },
        {
            id: 'faq', tipo: 'faq', titulo: 'Perguntas Frequentes', ativo: false,
            dados: {
                titulo: 'Dúvidas?',
                itens: [
                    { p: 'Vocês dão suporte?', r: 'Sim, suporte 24/7 incluso.' },
                    { p: 'Qual o prazo?', r: 'Entrega em até 5 dias úteis.' }
                ]
            },
            estilo: { ...ESTILOS_PADRAO, fundo: '#ffffff' }
        },
        {
            id: 'contato', tipo: 'form', titulo: 'Contato', ativo: true,
            dados: { titulo: 'Vamos Conversar', email: 'contato@empresa.com' },
            estilo: { ...ESTILOS_PADRAO, fundo: '#eff6ff', borda: 16 }
        },
        {
            id: 'rodape', tipo: 'footer', titulo: 'Rodapé', ativo: true,
            dados: { texto: '© 2025 Rainbow. Todos os direitos reservados.', social: true },
            estilo: { ...ESTILOS_PADRAO, fundo: '#0f172a', texto: '#94a3b8', padding: 40 }
        }
    ]
};