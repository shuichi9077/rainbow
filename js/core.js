class RainbowEngine {
    constructor() {
        this.dados = this.carregarEstado() || JSON.parse(JSON.stringify(ESTADO_PADRAO));
        
        // Garante que o objeto global exista e tenha novas props
        if(!this.dados.global.fitImagens) {
            this.dados.global = { ...ESTADO_PADRAO.global, ...this.dados.global };
            if(!this.dados.global.fitImagens) this.dados.global.fitImagens = 'cover';
        }

        this.arquivos = {};
        this.painel = document.getElementById('painel-editor');
        this.frame = document.getElementById('frame-site');
        this.init();
    }

    init() {
        const nomeSalvo = localStorage.getItem('rainbow_projeto_nome');
        if(nomeSalvo) document.getElementById('nome-projeto').value = nomeSalvo;

        this.renderizarEditor();
        this.atualizarPreview();
        
        document.getElementById('nome-projeto').addEventListener('input', (e) => {
            localStorage.setItem('rainbow_projeto_nome', e.target.value);
            this.atualizarPreview();
        });
    }


    salvarEstado() {
        localStorage.setItem('rainbow_dados_site', JSON.stringify(this.dados));
    }

    carregarEstado() {
        const salvo = localStorage.getItem('rainbow_dados_site');
        return salvo ? JSON.parse(salvo) : null;
    }

    resetarProjeto() {
        if(confirm("Tem certeza? Todo o progresso atual será perdido.")) {
            localStorage.removeItem('rainbow_dados_site');
            localStorage.removeItem('rainbow_projeto_nome');
            location.reload();
        }
    }


    toggleSecao(idx) { 
        const el = document.getElementById(`conteudo-${idx}`);
        if(idx === 'global') {
            document.getElementById('conteudo-global').classList.toggle('aberto');
            return;
        }
        el.classList.toggle('aberto'); 
    }

    toggleAtivo(idx, val) { 
        this.dados.secoes[idx].ativo = val; 
        this.salvarEstado();
        this.atualizarPreview(); 
    }

    // --- ATUALIZADORES GENÉRICOS ---
    
    atualizarGlobal(key, val) {
        this.dados.global[key] = val;
        this.salvarEstado();
        this.atualizarPreview();
    }

    atualizarDado(idx, key, val) { 
        this.dados.secoes[idx].dados[key] = val; 
        this.salvarEstado();
        this.atualizarPreview(); 
    }

    atualizarEstilo(idx, key, val) { 
        this.dados.secoes[idx].estilo[key] = val; 
        this.salvarEstado();
        this.atualizarPreview(); 
    }
    
    atualizarEstiloEEditor(idx, key, val) {
        this.dados.secoes[idx].estilo[key] = val;
        this.salvarEstado();
        this.renderizarEditor(); 
        this.atualizarPreview();
        setTimeout(() => {
            document.getElementById(`conteudo-${idx}`).classList.add('aberto');
            this.mudarAba(idx, 'layout');
        }, 50);
    }

    atualizarItem(idxItem, iSub, key, val) {
        if(key === 'titulo' || key === 'p') this.dados.secoes[idxItem].dados.itens[iSub][key === 'titulo' ? 'titulo' : 'p'] = val;
        else this.dados.secoes[idxItem].dados.itens[iSub][key === 'texto' ? 'texto' : 'r'] = val;
        this.salvarEstado();
        this.atualizarPreview();
    }

    adicionarItem(idx) {
        const novo = this.dados.secoes[idx].tipo === 'grid' ? { titulo:'Novo', texto:'...' } : { p:'Pergunta?', r:'Resposta.' };
        this.dados.secoes[idx].dados.itens.push(novo);
        this.renderizarEditor(); 
        this.salvarEstado();
        this.atualizarPreview();
    }

    removeItem(idx, subIdx) {
        this.dados.secoes[idx].dados.itens.splice(subIdx, 1);
        this.renderizarEditor(); 
        this.salvarEstado();
        this.atualizarPreview();
    }

    // --- GERENCIAMENTO DE IMAGENS ---

    deletarImagem(idx, key) {
        if(confirm("Remover esta imagem?")) {
            this.dados.secoes[idx].dados[key] = null;
            delete this.arquivos[`${idx}_${key}`];
            this.salvarEstado();
            this.renderizarEditor();
            this.atualizarPreview();
        }
    }
    
    deletarImagemGaleria(idx, imgIdx) {
        if(confirm("Remover esta imagem da galeria?")) {
            this.dados.secoes[idx].dados.imagens.splice(imgIdx, 1);
            this.salvarEstado();
            this.renderizarEditor();
            this.atualizarPreview();
        }
    }

    deletarFavicon() {
        this.dados.global.favicon = null;
        this.salvarEstado();
        this.renderizarEditor();
        this.atualizarPreview();
    }

    // --- LINKS & VALIDAÇÃO ---
    // Agora aceita um index para edição
    validarEAdicionarLink(idx, tipo, valor, customImg = null, editIndex = null) {
        let urlFinal = '';
        let valorExibido = valor;
        const baseImg = `img/${tipo}.png`;
        const v = valor.trim();

        if (!v || v === '') return { erro: "O campo não pode estar vazio." };

        const checkUrl = (input, dominio) => {
            const isUrl = input.includes('http') || input.includes('www.') || input.includes('.com') || input.includes('.net') || input.includes('.br');
            if (isUrl) {
                if (!input.toLowerCase().includes(dominio)) return false;
                return input.startsWith('http') ? input : `https://${input}`;
            }
            return null;
        };
        const makeUrl = (base, user) => `https://${base}/${user.replace('@', '').replace('/', '')}`;

        switch(tipo) {
            case 'whatsapp':
                const num = v.replace(/\D/g, '');
                if (num.length < 10) return { erro: "Número inválido. Use DDD + Número." };
                urlFinal = `https://wa.me/${num}`;
                valorExibido = `(${num.substring(0,2)}) ${num.substring(2)}`;
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(v)) return { erro: "E-mail inválido." };
                urlFinal = `mailto:${v}`;
                break;
            case 'telegram':
                const tUrl = checkUrl(v, 't.me');
                if (v.includes('http') && !tUrl) return { erro: "Link deve ser t.me" };
                urlFinal = tUrl || makeUrl('t.me', v);
                break;
            case 'discord':
                const dUrl = checkUrl(v, 'discord.gg') || checkUrl(v, 'discord.com');
                if (v.includes('http') && !dUrl) return { erro: "Link deve ser do Discord" };
                urlFinal = dUrl || `https://discord.gg/${v}`; 
                break;
            case 'instagram':
            case 'facebook':
            case 'tiktok':
            case 'x':
            case 'youtube':
            case 'linkedin':
            case 'github':
            case 'behance':
            case 'dribbble':
            case 'twitch':
            case 'snapchat':
            case 'threads':
            case 'tumblr':
            case 'patreon':
            case 'wattpad':
            case 'goodreads':
            case 'pixiv':
            case 'reddit':
            case 'ifood': 
            case 'pinterest':
                const dominios = {
                    instagram: 'instagram.com', facebook: 'facebook.com', tiktok: 'tiktok.com', x: 'x.com',
                    youtube: 'youtube.com', linkedin: 'linkedin.com', github: 'github.com', behance: 'behance.net',
                    dribbble: 'dribbble.com', twitch: 'twitch.tv', snapchat: 'snapchat.com', threads: 'threads.net',
                    tumblr: 'tumblr.com', patreon: 'patreon.com', wattpad: 'wattpad.com', goodreads: 'goodreads.com',
                    pixiv: 'pixiv.net', reddit: 'reddit.com', ifood: 'ifood.com.br', pinterest: 'pinterest.com'
                };
                let domCheck = dominios[tipo];
                if(tipo === 'youtube' && v.includes('youtu.be')) domCheck = 'youtu.be';
                if(tipo === 'x' && v.includes('twitter.com')) domCheck = 'twitter.com';
                if(tipo === 'pinterest' && v.includes('pin.it')) domCheck = 'pin.it';
                const urlValidada = checkUrl(v, domCheck);
                if (v.includes('http') || v.includes('www.')) {
                    if (!urlValidada) return { erro: `Link inválido para ${tipo}.` };
                    urlFinal = urlValidada;
                } else {
                    if(tipo === 'linkedin') urlFinal = `https://linkedin.com/in/${v}`;
                    else if(tipo === 'youtube') urlFinal = `https://youtube.com/@${v}`;
                    else if(tipo === 'tiktok') urlFinal = `https://tiktok.com/@${v.replace('@','')}`;
                    else urlFinal = makeUrl(dominios[tipo], v);
                }
                break;
            case 'amazon':
            case 'shopee':
            case 'mercadolivre':
            case 'aliexpress':
            case 'spotify':
            case 'mastodon':
                if (!v.includes('.') || (!v.includes('http') && !v.includes('www'))) {
                     return { erro: "Insira o link completo (URL)." };
                }
                urlFinal = v.startsWith('http') ? v : `https://${v}`;
                valorExibido = 'Link Externo';
                break;
            case 'maps':
                if (v.length < 5) return { erro: "Endereço muito curto." };
                urlFinal = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v)}`;
                break;
            case 'livre':
                if (!v.includes('.') || v.includes(' ')) return { erro: "URL inválida." };
                urlFinal = v.startsWith('http') ? v : `https://${v}`;
                valorExibido = "Link Personalizado";
                if(!customImg && editIndex === null) return { erro: "Imagem obrigatória." };
                break;
            default: return { erro: "Erro desconhecido." };
        }

        const linkObj = {
            tipo: tipo, valor: valorExibido, url: urlFinal,
            img: tipo === 'livre' ? (customImg || (editIndex !== null ? this.dados.secoes[idx].dados.links[editIndex].img : 'img/link.png')) : baseImg
        };

        if(!this.dados.secoes[idx].dados.links) this.dados.secoes[idx].dados.links = [];
        
        if (editIndex !== null) {
            // Editando existente
            this.dados.secoes[idx].dados.links[editIndex] = linkObj;
        } else {
            // Adicionando novo
            this.dados.secoes[idx].dados.links.push(linkObj);
        }
        
        this.salvarEstado();
        this.renderizarEditor();
        this.atualizarPreview();
        return { sucesso: true };
    }

    removerLink(idx, linkIdx) {
        if(confirm("Deseja remover este link?")) {
            this.dados.secoes[idx].dados.links.splice(linkIdx, 1);
            this.salvarEstado();
            this.renderizarEditor();
            this.atualizarPreview();
        }
    }


    // --- UPLOADS ---

    handleUpload(idx, key, input) {
        const file = input.files[0];
        if(!file) return;
        if(file.size > 3 * 1024 * 1024) { 
            document.getElementById(`erro-${idx}-${key}`).style.display = 'block';
            return;
        }
        document.getElementById(`erro-${idx}-${key}`).style.display = 'none';

        const reader = new FileReader();
        reader.onload = (e) => {
            this.dados.secoes[idx].dados[key] = e.target.result; 
            this.arquivos[`${idx}_${key}`] = { file: file, name: `img_${idx}_${key}_${file.name.replace(/\s/g,'_')}` };
            this.salvarEstado();
            this.renderizarEditor(); 
            this.atualizarPreview();
        };
        reader.readAsDataURL(file);
    }

    handleFaviconUpload(input) {
        const file = input.files[0];
        if(!file) return;
        if(!file.name.toLowerCase().endsWith('.ico')) {
            alert("Apenas arquivos .ico são permitidos.");
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            this.dados.global.favicon = e.target.result; 
            this.arquivos[`favicon`] = { file: file, name: `favicon.ico` };
            this.salvarEstado();
            this.renderizarEditor();
            this.atualizarPreview();
        };
        reader.readAsDataURL(file);
    }

    handleMultiUpload(idx, input) {
        Array.from(input.files).forEach((file, i) => {
            if(file.size > 3 * 1024 * 1024) return;
            const reader = new FileReader();
            reader.onload = (e) => {
                this.dados.secoes[idx].dados.imagens.push({ url: e.target.result });
                this.arquivos[`${idx}_galeria_${Date.now()}_${i}`] = { file: file, name: `gallery_${idx}_${i}_${file.name}` };
                if(i === input.files.length - 1) {
                    this.salvarEstado();
                    this.renderizarEditor();
                    this.atualizarPreview();
                }
            };
            reader.readAsDataURL(file);
        });
    }

    alternarView(modo) {
        const wrap = document.getElementById('wrapper-preview');
        wrap.style.maxWidth = modo === 'mobile' ? '375px' : '100%';
        wrap.style.margin = '0 auto';
        this.atualizarPreview();
    }
}