//aqui é onde geramos o site com base noque o usuario altera no editor


RainbowEngine.prototype.gerarCSS = function() {
    const g = this.dados.global;
    
    // Configuração de sombras
    let shadowVal = '0 0 0 transparent';
    if(g.sombraGlobal === 'sm') shadowVal = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    else if(g.sombraGlobal === 'md') shadowVal = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
    else if(g.sombraGlobal === 'lg') shadowVal = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';

    // Configuração de botões
    let btnRadius = `${g.bordaGlobal}px`;
    if(g.estiloBotoes === 'pill') btnRadius = '9999px';
    else if(g.estiloBotoes === 'sharp') btnRadius = '0px';

    return `
/* RAINBOW.UX PROFESSIONAL STYLE */
@import url('https://fonts.googleapis.com/css2?family=${g.fonte.replace(/ /g, '+')}:wght@300;400;600;800&display=swap');

:root {
    --primary: ${g.corPrimaria};
    --secondary: ${g.corSecundaria};
    --text-main: #1e293b;
    --bg-body: #ffffff;
    --radius-global: ${g.bordaGlobal}px;
    --radius-btn: ${btnRadius};
    --shadow-global: ${shadowVal};
    --font-base: ${g.tamanhoFonteBase}px;
}

* { margin:0; padding:0; box-sizing:border-box; font-family: '${g.fonte}', sans-serif; }
body { color: var(--text-main); line-height: 1.6; font-size: var(--font-base); overflow-x: hidden; }
img { max-width: 100%; height: auto; display: block; }
a { text-decoration: none; color: inherit; transition: 0.3s; }
ul { list-style: none; }

/* UTILS */
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.btn { 
    display: inline-flex; align-items: center; justify-content: center;
    padding: 12px 30px; font-weight: 600; border-radius: var(--radius-btn); 
    transition: all 0.3s; cursor: pointer; border: none; font-size: 1rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
.btn:hover { transform: translateY(-2px); box-shadow: 0 8px 15px rgba(0,0,0,0.15); filter: brightness(110%); }
.btn-primary { background: var(--primary); color: white; }
.btn-outline { border: 2px solid currentColor; color: inherit; background: transparent; }
.btn-outline:hover { background: rgba(255,255,255,0.1); }

/* SECTIONS */
section { position: relative; }
h1, h2, h3 { line-height: 1.2; margin-bottom: 1rem; font-weight: 800; letter-spacing: -0.02em; }
h1 { font-size: 3rem; } h2 { font-size: 2.2rem; } h3 { font-size: 1.5rem; }
p { opacity: 0.9; margin-bottom: 1.5rem; }

/* COMPONENTS */
.grid-cards { display: grid; gap: 30px; }
.card { 
    padding: 30px; transition: 0.3s; height: 100%; display: flex; flex-direction: column; 
    border-radius: var(--radius-global);
    box-shadow: var(--shadow-global);
}
.card:hover { transform: translateY(-5px); }

/* CAROUSEL */
.carousel { position: relative; overflow: hidden; width: 100%; height: 500px; border-radius: var(--radius-global); box-shadow: var(--shadow-global); }
.carousel-track { display: flex; transition: transform 0.5s ease-in-out; height: 100%; }
.carousel-slide { min-width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-size: cover; background-position: center; }
.carousel-btn { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; padding: 15px; cursor: pointer; z-index: 10; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
.carousel-btn:hover { background: var(--primary); }
.prev { left: 20px; } .next { right: 20px; }

/* NEW: GALLERY LAYOUTS */
.gallery-grid { display: grid; gap: 20px; }
.gallery-item { overflow: hidden; border-radius: var(--radius-global); position: relative; box-shadow: var(--shadow-global); }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.gallery-item:hover img { transform: scale(1.03); }

.gallery-masonry { column-gap: 20px; }
.gallery-masonry .gallery-item { margin-bottom: 20px; break-inside: avoid; }
.gallery-masonry img { width: 100%; display: block; border-radius: var(--radius-global); }

/* FAQ */
.faq-item { border-bottom: 1px solid rgba(0,0,0,0.1); padding: 20px 0; }
.faq-question { font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
.faq-answer { max-height: 0; overflow: hidden; transition: 0.3s; opacity: 0; }
.faq-item.active .faq-answer { max-height: 200px; opacity: 1; margin-top: 10px; }
.faq-icon { transition: 0.3s; }
.faq-item.active .faq-icon { transform: rotate(180deg); }

/* FORM & LINKS */
.links-grid { 
    display: flex; 
    flex-wrap: wrap; 
    justify-content: center; 
    gap: 20px; 
    margin-top: 30px; 
}
.link-item {
    display: flex; 
    flex-direction: column; 
    align-items: center; 
    gap: 10px;
    width: 120px; /* Aumentado para dar espaço */
    text-align: center; 
    color: inherit;
    word-break: break-word; /* Quebra palavras longas como emails */
    overflow-wrap: break-word;
}
.link-item img {
    width: 64px; height: 64px; object-fit: contain;
    transition: transform 0.3s; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
}
.link-item:hover img { transform: scale(1.1) rotate(-5deg); }

/* RESPONSIVE */
@media(max-width: 768px) {
    h1 { font-size: 2.2rem; } h2 { font-size: 1.8rem; }
    .nav-links { display: none; }
    .grid-cards { grid-template-columns: 1fr !important; }
    .flex-row { flex-direction: column !important; }
    .flex-row.reverse { flex-direction: column-reverse !important; }
    .gallery-grid { grid-template-columns: 1fr !important; }
    .gallery-masonry { column-count: 1 !important; }
}
`;
};

RainbowEngine.prototype.gerarHTML = function(isExport = false) {
    const resolverSrc = (key, secaoIdx) => {
        if(isExport) {
            const fileKey = `${secaoIdx}_${key}`;
            if(this.arquivos[fileKey]) return `assets/${this.arquivos[fileKey].name}`;
            return ''; 
        }
        return this.dados.secoes[secaoIdx].dados[key];
    };

    const resolverFavicon = () => {
        if(isExport) {
            if(this.arquivos['favicon']) return `assets/${this.arquivos['favicon'].name}`;
            return '';
        }
        return this.dados.global.favicon;
    }

    const resolverGaleria = (secaoIdx) => {
        if(!isExport) return this.dados.secoes[secaoIdx].dados.imagens;
        const imgs = [];
        this.dados.secoes[secaoIdx].dados.imagens.forEach((img, i) => {
            let url = '';
            for(let k in this.arquivos) {
                if(k.startsWith(`${secaoIdx}_galeria`) && k.includes(`_${i}_`)) {
                    url = `assets/${this.arquivos[k].name}`;
                }
            }
            imgs.push({ url: url });
        });
        return imgs;
    };

    // FIT GLOBAL para todas as imagens
    const fitGlobal = this.dados.global.fitImagens || 'cover';

    let html = `<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${document.getElementById('nome-projeto').value}</title>
${resolverFavicon() ? `<link rel="icon" type="image/x-icon" href="${resolverFavicon()}">` : ''}
<link rel="stylesheet" href="css/style.css">
<link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
</head>
<body>`;

    this.dados.secoes.forEach((s, idx) => {
        if(!s.ativo) return;
        const d = s.dados;
        const e = s.estilo;
        const style = `background:${e.fundo}; color:${e.texto}; padding:${e.padding}px 0;`;

        // --- HEADER ---
        if(s.tipo === 'header') {
            const logo = resolverSrc('logoImg', idx);
            html += `
<header style="background:${e.fundo}; padding:${e.padding}px 0; position:sticky; top:0; z-index:100; box-shadow: ${s.estilo.sombra ? '0 4px 20px rgba(0,0,0,0.05)' : 'none'};">
<div class="container" style="display:flex; justify-content:space-between; align-items:center;">
<a href="#" style="font-weight:900; font-size:1.5rem; color:${e.texto}; display:flex; align-items:center; gap:10px;">
    ${logo ? `<img src="${logo}" style="height:40px; object-fit:${fitGlobal};">` : ''} ${d.logoTexto}
</a>
<nav class="nav-links">
    ${d.links.map(l => `<a href="#${l.toLowerCase()}" style="margin-left:30px; font-weight:600; font-size:0.95rem;">${l}</a>`).join('')}
</nav>
</div>
</header>`;
        }

        // --- HERO ---
        if(s.tipo === 'hero') {
            const bg = resolverSrc('bgImg', idx);
            html += `
<section id="hero" style="${style} min-height:80vh; display:flex; align-items:center; position:relative; overflow:hidden;">
${bg ? `<div style="position:absolute; top:0; left:0; width:100%; height:100%; background:url('${bg}') no-repeat center; background-size:${fitGlobal};"></div>` : ''}
<div style="position:absolute; top:0; left:0; width:100%; height:100%; background:black; opacity:${d.bgOverlay};"></div>
<div class="container" style="position:relative; z-index:2; text-align:${e.alinhar};">
<h1 style="color:white; margin-bottom:20px;">${d.titulo}</h1>
<p style="color:rgba(255,255,255,0.9); font-size:1.25rem; max-width:600px; margin:${e.alinhar === 'center' ? '0 auto' : '0'} 30px;">${d.subtitulo}</p>
<div style="display:flex; gap:15px; justify-content:${e.alinhar}; flex-wrap:wrap;">
    ${d.btn1 ? `<a href="#contato" class="btn btn-primary">${d.btn1}</a>` : ''}
    ${d.btn2 ? `<a href="#portfolio" class="btn btn-outline">${d.btn2}</a>` : ''}
</div>
</div>
</section>`;
        }

        // --- GRID SERVIÇOS ---
        if(s.tipo === 'grid') {
            html += `
<section id="servicos" style="${style}">
<div class="container">
<h2 style="text-align:center; margin-bottom:50px;">${d.titulo}</h2>
<div class="grid-cards" style="grid-template-columns: repeat(${e.colunas}, 1fr);">
    ${d.itens.map(item => `
    <div class="card" style="background:${e.cardFundo}; border-radius:${e.borda}px;">
        <div style="width:50px; height:50px; background:var(--primary); border-radius:10px; margin-bottom:20px;"></div>
        <h3 style="color:${e.texto}">${item.titulo}</h3>
        <p>${item.texto}</p>
    </div>`).join('')}
</div>
</div>
</section>`;
        }

        // --- FLEX ---
        if(s.tipo === 'flex') {
            const img = resolverSrc('imagem', idx);
            const direcao = d.posicaoImg === 'right' ? '' : (d.posicaoImg === 'left' ? 'flex-direction:row-reverse;' : 'flex-direction:column-reverse; text-align:center;');
            html += `
<section id="sobre" style="${style}">
<div class="container flex-row" style="display:flex; align-items:center; gap:50px; ${direcao}">
<div style="flex:1;">
    <h2>${d.titulo}</h2>
    <p>${d.texto.replace(/\n/g, '<br>')}</p>
</div>
<div style="flex:1;">
    ${img ? `<img src="${img}" style="width:100%; max-height:500px; object-fit:${fitGlobal}; border-radius:12px; box-shadow:var(--shadow-global);">` : '<div style="background:#eee; height:300px; border-radius:12px; display:flex; align-items:center; justify-content:center;">Sem Imagem</div>'}
</div>
</div>
</section>`;
        }

        // --- GALERIA ---
        if(s.tipo === 'carousel') {
            const imgs = isExport ? resolverGaleria(idx) : s.dados.imagens;
            const layout = e.layout || 'carousel';
            const cols = e.colunas || 3;

            html += `
<section id="galeria" style="${style}">
<div class="container">
<h2 style="text-align:center; margin-bottom:40px;">${d.titulo}</h2>
${imgs.length > 0 ? (() => {
    if (layout === 'carousel') {
        return `
        <div class="carousel" id="carousel-${idx}">
            <button class="carousel-btn prev" onclick="moveSlide(${idx}, -1)">&#10094;</button>
            <div class="carousel-track">
                ${imgs.map(im => `<div class="carousel-slide" style="background-image:url('${im.url}'); background-size:${fitGlobal}"></div>`).join('')}
            </div>
            <button class="carousel-btn next" onclick="moveSlide(${idx}, 1)">&#10095;</button>
        </div>`;
    } else if (layout === 'grid') {
        return `
        <div class="gallery-grid" style="grid-template-columns: repeat(${cols}, 1fr);">
             ${imgs.map(im => `
                <div class="gallery-item" style="aspect-ratio: 1/1;">
                    <img src="${im.url}" style="object-fit:${fitGlobal}">
                </div>
             `).join('')}
        </div>`;
    } else if (layout === 'masonry') {
        return `
        <div class="gallery-masonry" style="column-count: ${cols};">
             ${imgs.map(im => `
                <div class="gallery-item">
                    <img src="${im.url}" style="margin-bottom:20px; border-radius:var(--radius-global);">
                </div>
             `).join('')}
        </div>`;
    }
})() : '<p style="text-align:center;">Adicione imagens.</p>'}
</div>
</section>`;
        }

        // --- FAQ ---
        if(s.tipo === 'faq') {
            html += `
<section id="faq" style="${style}">
<div class="container" style="max-width:800px;">
<h2 style="text-align:center; margin-bottom:40px;">${d.titulo}</h2>
<div class="faq-list">
    ${d.itens.map(i => `
    <div class="faq-item">
        <div class="faq-question" onclick="toggleFaq(this)">
            ${i.p} <i class="ri-arrow-down-s-line faq-icon"></i>
        </div>
        <div class="faq-answer"><p>${i.r}</p></div>
    </div>`).join('')}
</div>
</div>
</section>`;
        }

        // --- CONTATO CORRIGIDO ---
        if(s.tipo === 'form') {
            html += `
<section id="contato" style="${style}">
<div class="container" style="max-width:800px; background:${e.cardFundo || '#ffffff'}; color:${e.texto}; padding:40px; border-radius:${e.borda}px; box-shadow:var(--shadow-global); text-align:center;">
<h2 style="color:${e.texto}; margin-bottom:30px;">${d.titulo}</h2>

<div class="links-grid">
    ${d.links ? d.links.map(link => `
    <a href="${link.url}" target="_blank" class="link-item" title="${link.tipo}" style="color:${e.texto};">
        <img src="${link.img}" alt="${link.tipo}">
        <span>${link.valor}</span>
    </a>
    `).join('') : ''}
</div>

</div>
</section>`;
        }

        // --- FOOTER ---
        if(s.tipo === 'footer') {
            html += `
<footer style="${style} border-top:1px solid rgba(255,255,255,0.1);">
<div class="container" style="text-align:center;">
<p style="margin:0; font-size:0.9rem;">${d.texto}</p>
</div>
</footer>`;
        }
    });

    html += `
<script>
function toggleFaq(el) { el.parentElement.classList.toggle('active'); }
const carousels = {};
function moveSlide(id, dir) {
const track = document.querySelector('#carousel-'+id+' .carousel-track');
if(!track) return;
const slides = track.children;
if(!carousels[id]) carousels[id] = 0;
carousels[id] += dir;
if(carousels[id] < 0) carousels[id] = slides.length - 1;
if(carousels[id] >= slides.length) carousels[id] = 0;
track.style.transform = 'translateX(-' + (carousels[id] * 100) + '%)';
}
<\/script>
</body>
</html>`;
    return html;
};

RainbowEngine.prototype.atualizarPreview = function() {
    const doc = this.frame.contentDocument || this.frame.contentWindow.document;
    doc.open();
    doc.write(this.gerarHTML(false) + `<style>${this.gerarCSS()}</style>`);
    doc.close();
};

RainbowEngine.prototype.baixarZip = async function() {
    const zip = new JSZip();
    const folderName = document.getElementById('nome-projeto').value.replace(/\s/g,'_').toLowerCase();
    const folder = zip.folder(folderName);
    
    // Frontend
    const front = folder.folder('frontend');
    const css = front.folder('css');
    const assets = front.folder('assets');
    const imgFolder = front.folder('img'); // Pasta para ícones

    // Gerar arquivos principais
    front.file('index.html', this.gerarHTML(true));
    css.file('style.css', this.gerarCSS());
    
    // Assets: Imagens upadas e favicon
    for(let k in this.arquivos) {
        assets.file(this.arquivos[k].name, this.arquivos[k].file);
    }

    // Identificar e buscar ícones usados (que são caminhos, não base64)
    const iconesUsados = new Set();
    this.dados.secoes.forEach(s => {
        if(s.dados.links) {
            s.dados.links.forEach(l => {
                // Se for um caminho relativo (img/...) e não base64
                if(l.img && !l.img.startsWith('data:')) {
                    iconesUsados.add(l.img);
                }
            });
        }
    });

    // Função auxiliar para buscar e adicionar ao zip
    const promises = Array.from(iconesUsados).map(async (caminho) => {
        try {
            const response = await fetch(caminho);
            if(response.ok) {
                const blob = await response.blob();
                const nomeArquivo = caminho.split('/').pop(); // Pega 'whatsapp.png' de 'img/whatsapp.png'
                imgFolder.file(nomeArquivo, blob);
            }
        } catch(e) {
            console.warn("Erro ao baixar ícone:", caminho, e);
        }
    });

    await Promise.all(promises);
    
    zip.generateAsync({type:"blob"}).then(blob => saveAs(blob, `${folderName}.zip`));
};