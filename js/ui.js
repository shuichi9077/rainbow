/**
 * responsavel por renderizar o editor de seções
 */

RainbowEngine.prototype.renderizarEditor = function() {
    this.painel.innerHTML = '';
    this.dados.secoes.forEach((secao, idx) => {
        const el = document.createElement('div');
        el.className = 'secao-container';
        el.innerHTML = `
            <div class="cabecalho-secao ${secao.ativo ? 'ativo' : ''}" onclick="gerador.toggleSecao(${idx})">
                <div class="titulo-secao">
                    <label class="switch" onclick="event.stopPropagation()">
                        <input type="checkbox" ${secao.ativo ? 'checked' : ''} onchange="gerador.toggleAtivo(${idx}, this.checked)">
                        <span class="slider"></span>
                    </label>
                    ${this.getIcone(secao.tipo)} ${secao.titulo}
                </div>
                <i class="ri-arrow-down-s-line" style="color:#64748b"></i>
            </div>
            <div class="conteudo-secao" id="conteudo-${idx}">
                <div class="abas-secao">
                    <div class="aba ativa" onclick="gerador.mudarAba(${idx}, 'conteudo')">Conteúdo</div>
                    <div class="aba" onclick="gerador.mudarAba(${idx}, 'aparencia')">Aparência</div>
                    <div class="aba" onclick="gerador.mudarAba(${idx}, 'layout')">Layout & Ajustes</div>
                </div>
                <div class="painel-aba ativo" id="aba-conteudo-${idx}">
                    ${this.renderConteudo(secao, idx)}
                </div>
                <div class="painel-aba" id="aba-aparencia-${idx}">
                    ${this.renderAparencia(secao, idx)}
                </div>
                <div class="painel-aba" id="aba-layout-${idx}">
                    ${this.renderLayout(secao, idx)}
                </div>
            </div>
        `;
        this.painel.appendChild(el);
    });
};

RainbowEngine.prototype.getIcone = function(tipo) {
    const icones = { header: 'ri-layout-top-line', hero: 'ri-image-line', grid: 'ri-grid-fill', flex: 'ri-layout-column-line', carousel: 'ri-gallery-line', faq: 'ri-question-answer-line', form: 'ri-mail-send-line', footer: 'ri-layout-bottom-line' };
    return `<i class="${icones[tipo] || 'ri-layout-line'}"></i>`;
};

RainbowEngine.prototype.mudarAba = function(idx, aba) {
    const root = document.getElementById(`conteudo-${idx}`);
    root.querySelectorAll('.aba').forEach(e => e.classList.remove('ativa'));
    root.querySelectorAll('.painel-aba').forEach(e => e.classList.remove('ativo'));
    const map = { conteudo: 0, aparencia: 1, layout: 2 };
    root.querySelectorAll('.aba')[map[aba]].classList.add('ativa');
    document.getElementById(`aba-${aba}-${idx}`).classList.add('ativo');
};


RainbowEngine.prototype.renderConteudo = function(s, idx) {
    let html = '';
    const d = s.dados;
    
    if(d.titulo !== undefined) html += this.campoInput(idx, 'titulo', 'Título Principal', d.titulo);
    if(d.subtitulo !== undefined) html += this.campoArea(idx, 'subtitulo', 'Subtítulo / Descrição', d.subtitulo);
    if(d.texto !== undefined) html += this.campoArea(idx, 'texto', 'Texto do Corpo', d.texto);

    if(s.tipo === 'header') {
        html += this.campoInput(idx, 'logoTexto', 'Nome da Marca', d.logoTexto);
        html += this.campoUpload(idx, 'logoImg', 'Upload Logo (PNG/SVG)', d.logoImg);
    }
    if(s.tipo === 'hero') {
        html += this.campoInput(idx, 'btn1', 'Texto Botão Primário', d.btn1);
        html += this.campoInput(idx, 'btn2', 'Texto Botão Secundário', d.btn2);
        html += this.campoUpload(idx, 'bgImg', 'Imagem de Fundo', d.bgImg);
    }
    if(s.tipo === 'flex') {
        html += this.campoSelect(idx, 'posicaoImg', 'Posição da Imagem', d.posicaoImg, [{v:'left', t:'Esquerda'}, {v:'right', t:'Direita'}, {v:'top', t:'Topo'}]);
        html += this.campoUpload(idx, 'imagem', 'Imagem de Destaque', d.imagem);
    }
    if(s.tipo === 'grid' || s.tipo === 'faq') {
        html += `<label style="color:#94a3b8; font-size:0.8rem; display:block; margin-top:10px;">ITENS DA LISTA</label>`;
        html += `<div class="lista-itens">`;
        d.itens.forEach((item, iItem) => {
            html += `
            <div class="item-lista">
                <div class="cabecalho-item"><span>Item #${iItem+1}</span> <i class="ri-delete-bin-line btn-remove-item" onclick="gerador.removeItem(${idx}, ${iItem})"></i></div>
                <input type="text" class="input-texto" value="${item.titulo || item.p}" oninput="gerador.atualizarItem(${idx}, ${iItem}, '${item.titulo ? 'titulo':'p'}', this.value)" placeholder="Título/Pergunta" style="margin-bottom:5px;">
                <textarea class="input-texto" rows="2" oninput="gerador.atualizarItem(${idx}, ${iItem}, '${item.texto ? 'texto':'r'}', this.value)" placeholder="Texto/Resposta">${item.texto || item.r}</textarea>
            </div>`;
        });
        html += `<button class="btn-add-item" onclick="gerador.adicionarItem(${idx})">+ Adicionar Novo Item</button></div>`;
    }
    if(s.tipo === 'carousel') {
        html += this.campoUploadMulti(idx, 'Adicionar Imagens (Max 3MB)');
    }
    return html;
};

RainbowEngine.prototype.renderAparencia = function(s, idx) {
    const e = s.estilo;
    let html = '';
    html += this.campoCor(idx, 'fundo', 'Cor de Fundo', e.fundo);
    html += this.campoCor(idx, 'texto', 'Cor do Texto', e.texto);
    if(s.tipo === 'grid') html += this.campoCor(idx, 'cardFundo', 'Cor do Cartão', e.cardFundo);
    
    if(s.tipo === 'hero') {
        // MELHORIA 3: Slider com atualização em tempo real
        html += `
        <div class="grupo-campo">
            <label>Opacidade da Sombra (Overlay)</label>
            <div class="input-range-wrapper">
                <input type="range" class="input-range" min="0" max="1" step="0.1" value="${s.dados.bgOverlay}" 
                    oninput="this.nextElementSibling.innerText = this.value; gerador.atualizarDado(${idx}, 'bgOverlay', this.value)">
                <span class="range-valor">${s.dados.bgOverlay}</span>
            </div>
        </div>`;
    }
    return html;
};

RainbowEngine.prototype.renderLayout = function(s, idx) {
    const e = s.estilo;
    let html = '';
    
    // MELHORIA 3: Atualização em tempo real do valor em texto (innerText)
    html += `
    <div class="grupo-campo">
        <label>Altura / Espaçamento (Padding)</label>
        <div class="input-range-wrapper">
            <input type="range" class="input-range" min="0" max="200" step="10" value="${e.padding}" 
                oninput="this.nextElementSibling.innerText = this.value + 'px'; gerador.atualizarEstilo(${idx}, 'padding', this.value)">
            <span class="range-valor">${e.padding}px</span>
        </div>
    </div>`;
    
    if(s.tipo === 'grid' || s.tipo === 'contato') {
        html += `
        <div class="grupo-campo">
            <label>Arredondamento (Border Radius)</label>
            <div class="input-range-wrapper">
                <input type="range" class="input-range" min="0" max="50" value="${e.borda}" 
                    oninput="this.nextElementSibling.innerText = this.value + 'px'; gerador.atualizarEstilo(${idx}, 'borda', this.value)">
                <span class="range-valor">${e.borda}px</span>
            </div>
        </div>`;
    }

    if(s.tipo === 'grid') {
        html += this.campoSelect(idx, 'colunas', 'Colunas no Desktop', e.colunas, [{v:2, t:'2 Colunas'}, {v:3, t:'3 Colunas'}, {v:4, t:'4 Colunas'}]);
    }

    if(s.tipo === 'carousel') {
        html += this.campoSelect(idx, 'layout', 'Estilo de Exibição', e.layout || 'carousel', [
            {v:'carousel', t:'Carrossel Deslizante'},
            {v:'grid', t:'Grid Padrão (Quadrado)'},
            {v:'masonry', t:'Mosaico (Masonry)'}
        ]);
        if(e.layout !== 'carousel') {
            html += this.campoSelect(idx, 'colunas', 'Número de Colunas', e.colunas || 3, [{v:2, t:'2 Colunas'},{v:3, t:'3 Colunas'},{v:4, t:'4 Colunas'}]);
        }
    }

    if(s.tipo === 'hero') {
        html += this.campoSelect(idx, 'alinhar', 'Alinhamento do Texto', e.alinhar, [{v:'left', t:'Esquerda'}, {v:'center', t:'Centro'}]);
    }

    return html;
};

// --- HELPERS DE INPUT ---
RainbowEngine.prototype.campoInput = function(idx, key, label, val) { return `<div class="grupo-campo"><label>${label}</label><input type="text" class="input-texto" value="${val}" oninput="gerador.atualizarDado(${idx}, '${key}', this.value)"></div>`; };
RainbowEngine.prototype.campoArea = function(idx, key, label, val) { return `<div class="grupo-campo"><label>${label}</label><textarea rows="3" oninput="gerador.atualizarDado(${idx}, '${key}', this.value)">${val}</textarea></div>`; };

// MELHORIA 2: Sincronia entre Picker e Texto Hexadecimal
RainbowEngine.prototype.campoCor = function(idx, key, label, val) { 
    return `
    <div class="grupo-campo">
        <label>${label}</label>
        <div style="display:flex; gap:10px;">
            <input type="color" value="${val}" 
                oninput="this.nextElementSibling.value = this.value; gerador.atualizarEstilo(${idx}, '${key}', this.value)" 
                style="height:35px; width:50px; border:none; background:none; cursor:pointer;">
            
            <input type="text" class="input-texto" value="${val}" maxlength="7"
                oninput="this.previousElementSibling.value = this.value; gerador.atualizarEstilo(${idx}, '${key}', this.value)">
        </div>
    </div>`; 
};

RainbowEngine.prototype.campoSelect = function(idx, key, label, val, opts) { 
    const refreshEditor = (key === 'layout');
    const action = refreshEditor ? 
        `gerador.atualizarEstiloEEditor(${idx}, '${key}', this.value)` : 
        `gerador.atualizar${key === 'colunas' || key === 'alinhar' ? 'Estilo' : 'Dado'}(${idx}, '${key}', this.value)`;
    return `<div class="grupo-campo"><label>${label}</label><select onchange="${action}">${opts.map(o => `<option value="${o.v}" ${val == o.v ? 'selected':''}>${o.t}</option>`).join('')}</select></div>`; 
};

RainbowEngine.prototype.campoUpload = function(idx, key, label, preview) {
    return `
    <div class="grupo-campo">
        <label>${label}</label>
        <div class="upload-area" onclick="document.getElementById('file-${idx}-${key}').click()">
            <i class="ri-upload-cloud-line" style="font-size:1.5rem; color:var(--destaque)"></i>
            <p>Clique para selecionar (Max 3MB)</p>
        </div>
        <div id="erro-${idx}-${key}" class="aviso-erro"><i class="ri-error-warning-line"></i> Arquivo muito grande! Max 3MB.</div>
        <input type="file" id="file-${idx}-${key}" accept="image/*" style="display:none" onchange="gerador.handleUpload(${idx}, '${key}', this)">
        ${preview ? `<img src="${preview}" class="preview-thumb" style="margin-top:10px; height:auto; max-height:100px;">` : ''}
    </div>`;
};

RainbowEngine.prototype.campoUploadMulti = function(idx, label) {
    const imagens = this.dados.secoes[idx].dados.imagens;
    return `
    <div class="grupo-campo">
        <label>${label}</label>
        <div class="upload-area" onclick="document.getElementById('multi-${idx}').click()">
            <i class="ri-gallery-upload-line" style="font-size:1.5rem; color:var(--destaque)"></i>
            <p>Adicionar Imagens (Max 3MB cada)</p>
        </div>
        <input type="file" id="multi-${idx}" multiple accept="image/*" style="display:none" onchange="gerador.handleMultiUpload(${idx}, this)">
        <div class="preview-grid">
            ${imagens.map(img => `<img src="${img.url}" class="preview-thumb">`).join('')}
        </div>
    </div>`;
};