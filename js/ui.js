/**
 * responsavel por renderizar o editor de seções
 */

const LISTA_ICONES = [
    'whatsapp', 'instagram', 'facebook', 'tiktok', 'x', 'youtube', 
    'linkedin', 'email', 'maps', 'telegram', 'discord', 'spotify', 
    'twitch', 'reddit', 'tumblr', 'snapchat', 'threads', 'pinterest', 
    'amazon', 'shopee', 'mercadolivre', 'aliexpress', 'ifood', 'github', 
    'behance', 'dribbble', 'patreon', 'wattpad', 'pixiv', 
    'goodreads', 'mastodon'
];

RainbowEngine.prototype.renderizarEditor = function() {
    this.painel.innerHTML = '';
    this.renderGlobal();
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
                    <div class="aba" onclick="gerador.mudarAba(${idx}, 'layout')">Layout</div>
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

RainbowEngine.prototype.renderGlobal = function() {
    const g = this.dados.global;
    const el = document.createElement('div');
    el.className = 'secao-container global-container';
    el.innerHTML = `
        <div class="cabecalho-secao destaque" onclick="gerador.toggleSecao('global')">
            <div class="titulo-secao">
                <i class="ri-settings-3-fill"></i> Configurações Globais
            </div>
            <i class="ri-arrow-down-s-line"></i>
        </div>
        <div class="conteudo-secao" id="conteudo-global">
            <div class="painel-aba ativo" style="display:block;">
                
                <label class="label-titulo">Identidade Visual</label>
                
                <div class="grupo-campo">
                    <label>Ícone do Projeto (.ico)</label>
                    <div class="upload-area mini" onclick="document.getElementById('file-favicon').click()">
                        ${g.favicon ? `<img src="${g.favicon}" style="width:24px; height:24px;"> Ícone Definido` : '<i class="ri-upload-line"></i> Carregar .ico'}
                    </div>
                    ${g.favicon ? `<button class="btn-excluir-img" onclick="gerador.deletarFavicon()">Remover Ícone</button>` : ''}
                    <input type="file" id="file-favicon" accept=".ico" style="display:none" onchange="gerador.handleFaviconUpload(this)">
                </div>

                <div class="grupo-campo">
                    <label>Ajuste de Imagens Global</label>
                    <select class="input-texto" onchange="gerador.atualizarGlobal('fitImagens', this.value)">
                        <option value="cover" ${g.fitImagens==='cover'?'selected':''}>Preencher (Cortar)</option>
                        <option value="contain" ${g.fitImagens==='contain'?'selected':''}>Ajustar (Inteira)</option>
                        <option value="fill" ${g.fitImagens==='fill'?'selected':''}>Esticar (Deformar)</option>
                        <option value="scale-down" ${g.fitImagens==='scale-down'?'selected':''}>Tamanho Original</option>
                    </select>
                </div>

                <div class="grupo-campo">
                    <label>Fonte Principal</label>
                    <select class="input-texto" onchange="gerador.atualizarGlobal('fonte', this.value)">
                        ${LISTA_FONTES.map(f => `<option value="${f}" ${g.fonte === f ? 'selected' : ''}>${f}</option>`).join('')}
                    </select>
                </div>

                <div class="grupo-campo">
                    <label>Tamanho da Fonte Base (px)</label>
                    <input type="number" class="input-texto" value="${g.tamanhoFonteBase}" onchange="gerador.atualizarGlobal('tamanhoFonteBase', this.value)">
                </div>

                <label class="label-titulo" style="margin-top:20px;">Estilização</label>

                <div class="grupo-campo">
                    <label>Cor Primária (Destaques)</label>
                    <div style="display:flex; gap:10px;">
                        <input type="color" value="${g.corPrimaria}" oninput="gerador.atualizarGlobal('corPrimaria', this.value)" style="width:40px; border:none; background:none;">
                        <input type="text" class="input-texto" value="${g.corPrimaria}" oninput="gerador.atualizarGlobal('corPrimaria', this.value)">
                    </div>
                </div>

                <div class="grupo-campo">
                    <label>Arredondamento Global (px)</label>
                    <input type="range" class="input-range" min="0" max="30" value="${g.bordaGlobal}" oninput="gerador.atualizarGlobal('bordaGlobal', this.value)">
                </div>

                <div class="grupo-campo">
                    <label>Intensidade das Sombras</label>
                    <select class="input-texto" onchange="gerador.atualizarGlobal('sombraGlobal', this.value)">
                        <option value="none" ${g.sombraGlobal==='none'?'selected':''}>Sem Sombra</option>
                        <option value="sm" ${g.sombraGlobal==='sm'?'selected':''}>Suave</option>
                        <option value="md" ${g.sombraGlobal==='md'?'selected':''}>Média</option>
                        <option value="lg" ${g.sombraGlobal==='lg'?'selected':''}>Intensa</option>
                    </select>
                </div>

                 <div class="grupo-campo">
                    <label>Estilo dos Botões</label>
                    <select class="input-texto" onchange="gerador.atualizarGlobal('estiloBotoes', this.value)">
                        <option value="sharp" ${g.estiloBotoes==='sharp'?'selected':''}>Quadrados</option>
                        <option value="rounded" ${g.estiloBotoes==='rounded'?'selected':''}>Arredondados</option>
                        <option value="pill" ${g.estiloBotoes==='pill'?'selected':''}>Pílula (Redondos)</option>
                    </select>
                </div>

            </div>
        </div>
    `;
    this.painel.appendChild(el);
}

RainbowEngine.prototype.getIcone = function(tipo) {
    const icones = { header: 'ri-layout-top-line', hero: 'ri-image-line', grid: 'ri-grid-fill', flex: 'ri-layout-column-line', carousel: 'ri-gallery-line', faq: 'ri-question-answer-line', form: 'ri-share-line', footer: 'ri-layout-bottom-line' };
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
        html += this.campoUpload(idx, 'logoImg', 'Logo (PNG/SVG)', d.logoImg);
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
    
    // --- LÓGICA DE CONTATO/LINKS ---
    if(s.tipo === 'form') {
        html += `<label style="color:#94a3b8; font-size:0.8rem; display:block; margin-top:10px;">LINKS ATIVOS</label>`;
        html += `<div class="lista-itens">`;
        if(d.links && d.links.length > 0) {
            d.links.forEach((link, iLink) => {
                html += `
                <div class="item-lista" style="display:flex; align-items:center; gap:10px;">
                    <img src="${link.img}" style="width:24px; height:24px; object-fit:contain; border-radius:4px;" onerror="this.src='https://placehold.co/24x24?text=?'">
                    <div style="flex:1; overflow:hidden;">
                        <div style="font-weight:600; font-size:0.8rem; text-transform:capitalize;">${link.tipo}</div>
                        <div style="font-size:0.7rem; color:#94a3b8; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${link.valor}</div>
                    </div>
                    <!-- Botão de Editar -->
                    <i class="ri-pencil-line btn-remove-item" style="color:var(--destaque); margin-right:10px;" onclick="gerador.abrirOverlayLink(${idx}, '${link.tipo}', ${iLink})"></i>
                    <!-- Botão de Excluir -->
                    <i class="ri-delete-bin-line btn-remove-item" onclick="gerador.removerLink(${idx}, ${iLink})"></i>
                </div>`;
            });
        } else {
            html += `<div style="text-align:center; padding:10px; color:#64748b; font-size:0.8rem;">Nenhum link adicionado.</div>`;
        }
        html += `</div>`;

        // Grid para Adicionar (Oculta já usados, exceto livre)
        html += `<label style="color:#94a3b8; font-size:0.8rem; display:block; margin-top:20px;">ADICIONAR NOVO</label>`;
        html += `<div class="grid-icones">`;
        
        // Coleta tipos já usados
        const tiposUsados = d.links ? d.links.map(l => l.tipo) : [];

        LISTA_ICONES.forEach(icone => {
            // Se já tem, pula (exceto se for livre, mas livre não ta na LISTA_ICONES)
            if(tiposUsados.includes(icone)) return;

            html += `
            <div class="icone-opcao" onclick="gerador.abrirOverlayLink(${idx}, '${icone}')" title="${icone}">
                <img src="img/${icone}.png" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
                <i class="ri-link" style="display:none; font-size:1.2rem; color:#64748b"></i>
            </div>`;
        });
        html += `
        <div class="icone-opcao livre" onclick="gerador.abrirOverlayLink(${idx}, 'livre')">
            <i class="ri-add-line" style="font-size:1.2rem;"></i>
            <span>Livre</span>
        </div></div>`;
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

// --- MODAL DE LINK (Atualizado para Edição) ---
RainbowEngine.prototype.abrirOverlayLink = function(idx, tipo, editIndex = null) {
    let label = "Cole o link:";
    let placeholder = "https://...";
    const ecommerces = ['amazon', 'shopee', 'mercadolivre', 'aliexpress', 'ifood', 'spotify'];
    
    // Se estiver editando, busca valor atual
    let valorAtual = '';
    if(editIndex !== null) {
        // Para tipos normais, o valor exibido é formatado, mas para edição idealmente pegamos a URL ou o valor raw.
        // Como o sistema armazena valor exibido e URL, vamos tentar extrair o dado útil.
        // Simplificação: Para edição, o usuário cola o link novamente.
        // Ou melhor, podemos tentar usar o valor da URL atual se possível.
        const linkObj = this.dados.secoes[idx].dados.links[editIndex];
        // Se for whatsapp, o valor exibido é (11) ..., extrair é chato. Vamos pedir para digitar de novo ou mostrar url.
        // Vamos deixar vazio para forçar redigitação correta ou mostrar URL se for genérico.
        // Para facilitar, vamos deixar em branco no placeholder se não for trivial.
    }

    if(tipo === 'whatsapp') { label = "Número (com DDD):"; placeholder = "11999999999"; }
    else if(tipo === 'email') { label = "Endereço de E-mail:"; placeholder = "nome@email.com"; }
    else if(tipo === 'maps') { label = "Endereço Completo:"; placeholder = "Av. Paulista, 1000..."; }
    else if(ecommerces.includes(tipo)) { label = `Link da Loja/Perfil (${tipo}):`; placeholder = `https://${tipo}.com/...`; }
    else if(tipo !== 'livre') { label = "Nome de Usuário ou Link:"; placeholder = "@usuario ou https://..."; }

    const overlay = document.createElement('div');
    overlay.className = 'overlay-editor';
    overlay.id = 'modal-link';
    
    let conteudoHTML = `
        <div class="modal-conteudo">
            <div class="modal-titulo">
                ${tipo === 'livre' ? '<i class="ri-link"></i> Link Livre' : `<img src="img/${tipo}.png" style="width:24px; height:24px;"> ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`}
                ${editIndex !== null ? '<span style="font-size:0.8rem; margin-left:auto; color:#64748b;">(Editando)</span>' : ''}
            </div>
            
            <div class="grupo-campo">
                <label>${label}</label>
                <input type="text" id="input-valor-link" class="input-texto" placeholder="${placeholder}" autofocus>
                <small id="erro-msg-link" style="color:#ef4444; font-size:0.75rem; margin-top:5px; display:block; min-height:1.2em;"></small>
            </div>

            ${tipo === 'livre' ? `
            <div class="grupo-campo">
                <label>Ícone Personalizado (Max 3MB):</label>
                <label class="btn-acao outline" style="width:100%; display:flex; justify-content:center; cursor:pointer;">
                    <i class="ri-upload-2-line"></i> Escolher Arquivo
                    <input type="file" id="input-img-livre" accept="image/*" style="display:none">
                </label>
                <div id="preview-img-container" style="display:none; margin-top:10px; text-align:center;">
                    <img id="preview-img-livre" style="width:48px; height:48px; object-fit:contain; border-radius:6px; border:1px solid #475569;">
                </div>
            </div>` : ''}

            <div class="modal-botoes">
                <button class="btn-acao outline" style="flex:1" onclick="document.getElementById('modal-link').remove()">Cancelar</button>
                <button class="btn-acao" style="flex:1" id="btn-confirmar-link">${editIndex !== null ? 'Salvar' : 'Adicionar'}</button>
            </div>
        </div>
    `;
    overlay.innerHTML = conteudoHTML;
    document.querySelector('.area-trabalho').appendChild(overlay);

    const inputVal = document.getElementById('input-valor-link');
    const inputImg = document.getElementById('input-img-livre');
    const btnConfirmar = document.getElementById('btn-confirmar-link');

    setTimeout(() => inputVal.focus(), 100);
    inputVal.addEventListener('keyup', (e) => { if(e.key === 'Enter') btnConfirmar.click(); });

    if(inputImg) {
        // Se estiver editando livre e já tiver img, poderia mostrar preview, mas file input não aceita setar value.
        // Deixar para usuario reenviar se quiser trocar.
        inputImg.onchange = (e) => {
            const file = e.target.files[0];
            if(file) {
                if(file.size > 3 * 1024 * 1024) { alert("Max 3MB!"); inputImg.value = ""; return; }
                const reader = new FileReader();
                reader.onload = (ev) => {
                    document.getElementById('preview-img-livre').src = ev.target.result;
                    document.getElementById('preview-img-container').style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        };
    }

    btnConfirmar.onclick = () => {
        const valor = inputVal.value;
        const msgErro = document.getElementById('erro-msg-link');
        msgErro.innerText = "";
        let customImg = null;

        const processar = () => {
            // Passa editIndex para a função
            const resultado = this.validarEAdicionarLink(idx, tipo, valor, customImg, editIndex);
            if(resultado.sucesso) document.getElementById('modal-link').remove();
            else {
                msgErro.innerText = resultado.erro;
                inputVal.classList.add('erro-piscar');
                setTimeout(() => inputVal.classList.remove('erro-piscar'), 500);
            }
        };

        if(tipo === 'livre' && inputImg && inputImg.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                customImg = e.target.result;
                this.arquivos[`${idx}_linklivre_${Date.now()}`] = { file: inputImg.files[0], name: `icon_custom_${Date.now()}.png` };
                processar();
            };
            reader.readAsDataURL(inputImg.files[0]);
        } else { processar(); }
    };
};


RainbowEngine.prototype.renderAparencia = function(s, idx) {
    const e = s.estilo;
    let html = '';
    html += this.campoCor(idx, 'fundo', 'Cor de Fundo', e.fundo);
    html += this.campoCor(idx, 'texto', 'Cor do Texto', e.texto);
    if(s.tipo === 'grid') html += this.campoCor(idx, 'cardFundo', 'Cor do Cartão', e.cardFundo);
    
    if(s.tipo === 'hero') {
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
    
    html += `
    <div class="grupo-campo">
        <label>Altura / Espaçamento (Padding)</label>
        <div class="input-range-wrapper">
            <input type="range" class="input-range" min="0" max="200" step="10" value="${e.padding}" 
                oninput="this.nextElementSibling.innerText = this.value + 'px'; gerador.atualizarEstilo(${idx}, 'padding', this.value)">
            <span class="range-valor">${e.padding}px</span>
        </div>
    </div>`;
    
    if(s.tipo === 'grid' || s.tipo === 'form') {
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

RainbowEngine.prototype.campoInput = function(idx, key, label, val) { return `<div class="grupo-campo"><label>${label}</label><input type="text" class="input-texto" value="${val}" oninput="gerador.atualizarDado(${idx}, '${key}', this.value)"></div>`; };
RainbowEngine.prototype.campoArea = function(idx, key, label, val) { return `<div class="grupo-campo"><label>${label}</label><textarea rows="3" oninput="gerador.atualizarDado(${idx}, '${key}', this.value)">${val}</textarea></div>`; };

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
    // REMOVIDO: Dropdown de fit individual
    return `
    <div class="grupo-campo">
        <label>${label}</label>
        <div class="upload-area" onclick="document.getElementById('file-${idx}-${key}').click()">
            ${preview 
                ? `<img src="${preview}" class="preview-thumb" style="width:100%; height:120px; object-fit:contain; border:none;">`
                : `<i class="ri-upload-cloud-line" style="font-size:1.5rem; color:var(--destaque)"></i><p>Clique para selecionar (Max 3MB)</p>`
            }
        </div>
        <div id="erro-${idx}-${key}" class="aviso-erro"><i class="ri-error-warning-line"></i> Arquivo muito grande! Max 3MB.</div>
        <input type="file" id="file-${idx}-${key}" accept="image/*" style="display:none" onchange="gerador.handleUpload(${idx}, '${key}', this)">
        
        ${preview ? `
        <div class="img-controls" style="display:flex; gap:5px; margin-top:5px;">
             <button class="btn-acao outline" style="width:100%; padding:5px 10px; color:var(--erro); border-color:var(--erro);" onclick="gerador.deletarImagem(${idx}, '${key}')">
                <i class="ri-delete-bin-line"></i> Remover Imagem
             </button>
        </div>` : ''}
    </div>`;
};

RainbowEngine.prototype.campoUploadMulti = function(idx, label) {
    const imagens = this.dados.secoes[idx].dados.imagens;
    return `
    <div class="grupo-campo">
        <label>${label}</label>
        <div class="upload-area" onclick="document.getElementById('multi-${idx}').click()">
            <i class="ri-gallery-upload-line" style="font-size:1.5rem; color:var(--destaque)"></i>
            <p>Adicionar Imagens</p>
        </div>
        <input type="file" id="multi-${idx}" multiple accept="image/*" style="display:none" onchange="gerador.handleMultiUpload(${idx}, this)">
        
        <div class="preview-grid" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(60px, 1fr)); gap:8px; margin-top:10px;">
            ${imagens.map((img, i) => `
                <img src="${img.url}" class="preview-thumb" 
                     onclick="gerador.deletarImagemGaleria(${idx}, ${i})" 
                     title="Clique para excluir" 
                     style="cursor:pointer; transition: opacity 0.2s; width:100%; height:60px; object-fit:cover; border-radius:4px; border:1px solid var(--borda);" 
                     onmouseover="this.style.opacity='0.7'" 
                     onmouseout="this.style.opacity='1'">
            `).join('')}
        </div>
    </div>`;
};