class RainbowEngine {
    constructor() {
        // MELHORIA 1: Tenta carregar do LocalStorage, se não, usa o padrão
        this.dados = this.carregarEstado() || JSON.parse(JSON.stringify(ESTADO_PADRAO));
        
        this.arquivos = {}; // Armazena blobs reais para o ZIP
        this.painel = document.getElementById('painel-editor');
        this.frame = document.getElementById('frame-site');
        this.init();
    }

    init() {
        // Restaura o nome do projeto se existir
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
        el.classList.toggle('aberto'); 
    }

    toggleAtivo(idx, val) { 
        this.dados.secoes[idx].ativo = val; 
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


    // --- uploads ---

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

    handleMultiUpload(idx, input) {
        Array.from(input.files).forEach((file, i) => {
            if(file.size > 3 * 1024 * 1024) { alert(`A imagem ${file.name} tem mais de 3MB e foi ignorada.`); return; }
            
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
        wrap.style.maxWidth = modo === 'mobile' ? '500px' : '100%';
        wrap.style.margin = '0 auto';
    }
}