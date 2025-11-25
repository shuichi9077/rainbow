/**
 * aqui é onde geramos o site com base noque o usuario altera no editor
 */

RainbowEngine.prototype.gerarCSS = function() {
    const { fonte, corPrimaria, corSecundaria } = this.dados.global;
    return `
/* RAINBOW.UX PROFESSIONAL STYLE */
@import url('https://fonts.googleapis.com/css2?family=${fonte}:wght@300;400;600;800&display=swap');

:root {
    --primary: ${corPrimaria};
    --secondary: ${corSecundaria};
    --text-main: #1e293b;
    --bg-body: #ffffff;
    --radius-sm: 8px;
    --radius-md: 12px;
    --shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
}

* { margin:0; padding:0; box-sizing:border-box; font-family: '${fonte}', sans-serif; }
body { color: var(--text-main); line-height: 1.7; overflow-x: hidden; }
img { max-width: 100%; height: auto; display: block; }
a { text-decoration: none; color: inherit; transition: 0.3s; }
ul { list-style: none; }

/* UTILS */
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.btn { 
    display: inline-flex; align-items: center; justify-content: center;
    padding: 14px 32px; font-weight: 600; border-radius: 50px; 
    transition: all 0.3s; cursor: pointer; border: none; font-size: 1rem;
    box-shadow: 0 4px 14px 0 rgba(0,0,0,0.1);
}
.btn:hover { transform: translateY(-3px); box-shadow: 0 8px 20px rgba(0,0,0,0.2); }
.btn-primary { background: var(--primary); color: white; }
.btn-outline { border: 2px solid white; color: white; background: transparent; }
.btn-outline:hover { background: white; color: var(--text-main); }

/* SECTIONS */
section { position: relative; }
h1, h2, h3 { line-height: 1.2; margin-bottom: 1rem; font-weight: 800; letter-spacing: -0.02em; }
h1 { font-size: 3.5rem; } h2 { font-size: 2.5rem; } h3 { font-size: 1.5rem; }
p { opacity: 0.85; margin-bottom: 1.5rem; }

/* COMPONENTS */
.grid-cards { display: grid; gap: 30px; }
.card { padding: 30px; transition: 0.3s; height: 100%; display: flex; flex-direction: column; }
.card:hover { transform: translateY(-10px); box-shadow: var(--shadow); }

/* CAROUSEL */
.carousel { position: relative; overflow: hidden; width: 100%; height: 500px; border-radius: var(--radius-md); }
.carousel-track { display: flex; transition: transform 0.5s ease-in-out; height: 100%; }
.carousel-slide { min-width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background-size: cover; background-position: center; }
.carousel-btn { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); color: white; border: none; padding: 15px; cursor: pointer; z-index: 10; border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
.carousel-btn:hover { background: var(--primary); }
.prev { left: 20px; } .next { right: 20px; }

/* NEW: GALLERY LAYOUTS */
.gallery-grid { display: grid; gap: 20px; }
.gallery-item { overflow: hidden; border-radius: var(--radius-md); position: relative; }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.gallery-item:hover img { transform: scale(1.05); }

.gallery-masonry { column-gap: 20px; }
.gallery-masonry .gallery-item { margin-bottom: 20px; break-inside: avoid; }
.gallery-masonry img { width: 100%; display: block; border-radius: var(--radius-md); }

/* FAQ */
.faq-item { border-bottom: 1px solid rgba(0,0,0,0.1); padding: 20px 0; }
.faq-question { font-weight: 600; cursor: pointer; display: flex; justify-content: space-between; align-items: center; }
.faq-answer { max-height: 0; overflow: hidden; transition: 0.3s; opacity: 0; }
.faq-item.active .faq-answer { max-height: 200px; opacity: 1; margin-top: 10px; }
.faq-icon { transition: 0.3s; }
.faq-item.active .faq-icon { transform: rotate(180deg); }

/* FORM */
.form-group { margin-bottom: 20px; }
.form-control { width: 100%; padding: 15px; border: 1px solid #e2e8f0; border-radius: var(--radius-sm); background: white; }
.form-control:focus { border-color: var(--primary); outline: none; }

/* RESPONSIVE */
@media(max-width: 768px) {
    h1 { font-size: 2.5rem; } h2 { font-size: 2rem; }
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

    const resolverGaleria = (secaoIdx) => {
        if(!isExport) return this.dados.secoes[secaoIdx].dados.imagens;
        const imgs = [];
        for(let k in this.arquivos) {
            if(k.startsWith(`${secaoIdx}_galeria`)) imgs.push(`assets/${this.arquivos[k].name}`);
        }
        return imgs.map(url => ({url}));
    };

    let html = `<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${document.getElementById('nome-projeto').value}</title>
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
    ${logo ? `<img src="${logo}" style="height:40px;">` : ''} ${d.logoTexto}
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
${bg ? `<div style="position:absolute; top:0; left:0; width:100%; height:100%; background:url('${bg}') center/cover;"></div>` : ''}
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
    ${img ? `<img src="${img}" style="width:100%; border-radius:12px; box-shadow:0 20px 40px rgba(0,0,0,0.1);">` : '<div style="background:#eee; height:300px; border-radius:12px; display:flex; align-items:center; justify-content:center;">Sem Imagem</div>'}
</div>
</div>
</section>`;
        }

        // --- GALERIA ---
        if(s.tipo === 'carousel') {
            const imgs = resolverGaleria(idx);
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
                ${imgs.map(im => `<div class="carousel-slide" style="background-image:url('${im.url}')"></div>`).join('')}
            </div>
            <button class="carousel-btn next" onclick="moveSlide(${idx}, 1)">&#10095;</button>
        </div>`;
    } else if (layout === 'grid') {
        return `
        <div class="gallery-grid" style="grid-template-columns: repeat(${cols}, 1fr);">
             ${imgs.map(im => `
                <div class="gallery-item" style="aspect-ratio: 1/1;">
                    <img src="${im.url}" alt="Projeto">
                </div>
             `).join('')}
        </div>`;
    } else if (layout === 'masonry') {
        return `
        <div class="gallery-masonry" style="column-count: ${cols};">
             ${imgs.map(im => `
                <div class="gallery-item">
                    <img src="${im.url}" alt="Projeto" style="margin-bottom:20px;">
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

        // --- CONTATO ---
        if(s.tipo === 'form') {
            html += `
<section id="contato" style="${style}">
<div class="container" style="max-width:600px; background:white; padding:40px; border-radius:${e.borda}px; box-shadow:0 20px 50px rgba(0,0,0,0.05);">
<h2 style="text-align:center; color:#1e293b;">${d.titulo}</h2>
<form action="../backend/mail.php" method="POST">
    <div class="form-group"><input type="text" name="nome" class="form-control" placeholder="Seu Nome" required></div>
    <div class="form-group"><input type="email" name="email" class="form-control" placeholder="Seu E-mail" required></div>
    <div class="form-group"><textarea name="msg" class="form-control" rows="4" placeholder="Como podemos ajudar?" required></textarea></div>
    <button type="submit" class="btn btn-primary" style="width:100%;">Enviar Mensagem</button>
</form>
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

    // SCRIPTS DO SITE GERADO
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

RainbowEngine.prototype.baixarZip = function() {
    const zip = new JSZip();
    const folderName = document.getElementById('nome-projeto').value.replace(/\s/g,'_').toLowerCase();
    const folder = zip.folder(folderName);
    
    // Frontend
    const front = folder.folder('frontend');
    front.file('index.html', this.gerarHTML(true));
    front.folder('css').file('style.css', this.gerarCSS());
    const assets = front.folder('assets');
    
    // Assets
    for(let k in this.arquivos) {
        assets.file(this.arquivos[k].name, this.arquivos[k].file);
    }

    // Backend
    const back = folder.folder('backend');
    back.file('mail.php', `<?php 
header('Content-Type: application/json');
if($_SERVER['REQUEST_METHOD'] == 'POST') {
echo json_encode(['status'=>'success']);
}
?>`);

    zip.generateAsync({type:"blob"}).then(blob => saveAs(blob, `${folderName}.zip`));
};