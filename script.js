// --- DADOS DO MENU ---

const pizzas = {
    'margherita': { nome: 'Margherita', preco: 45.00, descricao: 'Molho de tomate fresco, muçarela e manjericão.', imagem: 'img/margherita.jpg' },
    'calabresa': { nome: 'Calabresa', preco: 50.00, descricao: 'Molho, muçarela, calabresa fatiada e cebola roxa.', imagem: 'img/calabresa.jpg' },
    'frango-catupiry': { nome: 'Frango com Catupiry', preco: 60.00, descricao: 'Molho, muçarela, frango desfiado temperado e Catupiry original.', imagem: 'img/frango-catupiry.jpg' },
    'quatro-queijos': { nome: 'Quatro Queijos', preco: 55.00, descricao: 'Muçarela, provolone, parmesão e gorgonzola. Uma explosão de sabor!', imagem: 'img/quatro-queijos.jpg' },
    'portuguesa': { nome: 'Portuguesa', preco: 58.00, descricao: 'Molho, muçarela, presunto, ovos, cebola e azeitonas.', imagem: 'img/portuguesa.jpg' }
};

const bebidas = {
    'coca-cola': { nome: 'Coca-Cola 2L', preco: 12.00, descricao: 'Refrigerante clássico de cola para acompanhar sua pizza.', imagem: 'img/coca.jpg' },
    'guarana': { nome: 'Guaraná Antarctica 2L', preco: 10.00, descricao: 'O sabor do Brasil, ideal para a família.', imagem: 'img/guarana.jpg' },
    'agua': { nome: 'Água Mineral (c/ gás)', preco: 4.00, descricao: 'Água mineral com gás 500ml.', imagem: 'img/agua.jpg' },
    'cerveja': { nome: 'Cerveja Long Neck', preco: 8.50, descricao: 'Cerveja pilsen gelada (verificar disponibilidade).', imagem: 'img/cerveja.jpg' },
};

let carrinho = []; 
const TELEFONE_LOJA = '5561986062980'; // **SUBSTITUA PELO SEU NÚMERO DE WHATSAPP**

// --- FUNÇÕES DE INTERAÇÃO E RENDERIZAÇÃO ---

/** Exibe uma mensagem de feedback (toast). */
function showToast(message) {
    const toast = document.getElementById('toast-message');
    toast.textContent = message;
    toast.className = 'toast show';
    setTimeout(function(){ toast.className = toast.className.replace('show', ''); }, 3000); 
}

/** * Renderiza itens do menu (pizzas ou bebidas) no HTML.
 */
function renderizarItensMenu(data, containerId, type) {
    const containerDiv = document.getElementById(containerId);
    if (!containerDiv) return; // Garante que o container existe
    
    containerDiv.innerHTML = ''; 

    for (const id in data) {
        const item = data[id];
        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item';
        itemDiv.setAttribute('data-id', id);

        itemDiv.innerHTML = `
            <img src="${item.imagem || 'imagens/placeholder.jpg'}" alt="${item.nome}">
            <div class="item-details">
                <h3>${item.nome}</h3>
                <p>${item.descricao}</p>
                <p class="item-price">R$ ${item.preco.toFixed(2).replace('.', ',')}</p>
                <button class="add-button" onclick="adicionarItemAoCarrinho('${id}', '${type}')">Adicionar <i class="fas fa-plus-circle"></i></button>
            </div>
        `;
        containerDiv.appendChild(itemDiv);
    }
}

function renderizarPizzas() {
    renderizarItensMenu(pizzas, 'pizza-list', 'pizza');
}

function renderizarBebidas() {
    renderizarItensMenu(bebidas, 'bebida-list', 'bebida');
}

/** Adiciona qualquer item (pizza ou bebida) ao carrinho. */
function adicionarItemAoCarrinho(itemId, type) {
    let itemData;
    let nomeTipo;
    
    // **CORRIGIDO/REVISADO:** Lógica de seleção do objeto correto
    if (type === 'pizza') {
        itemData = pizzas[itemId];
        nomeTipo = 'Pizza';
    } else if (type === 'bebida') {
        itemData = bebidas[itemId];
        nomeTipo = 'Bebida';
    } else {
        return;
    }

    if (itemData) {
        carrinho.push({
            nome: itemData.nome,
            preco: itemData.preco
        });
        showToast(`${nomeTipo} ${itemData.nome} adicionada ao carrinho!`);
        atualizarCarrinhoHTML();
    }
}


/** Atualiza a lista de itens e o total no HTML do carrinho. */
function atualizarCarrinhoHTML() {
    const lista = document.getElementById('carrinho-lista');
    const totalSpan = document.getElementById('carrinho-total');
    let total = 0;

    lista.innerHTML = ''; 

    if (carrinho.length === 0) {
        lista.innerHTML = '<li>Carrinho vazio.</li>';
        totalSpan.textContent = '0,00';
        return;
    }

    carrinho.forEach((item, index) => {
        const li = document.createElement('li');
        const precoFormatado = item.preco.toFixed(2).replace('.', ',');
        
        li.innerHTML = `
            <span>${item.nome} - R$ ${precoFormatado}</span>
            <button onclick="removerDoCarrinho(${index})"><i class="fas fa-trash-alt"></i></button>
        `;
        lista.appendChild(li);

        total += item.preco;
    });

    totalSpan.textContent = total.toFixed(2).replace('.', ',');
}

/** Remove um item do carrinho pelo seu índice. */
function removerDoCarrinho(index) {
    if (index > -1 && index < carrinho.length) {
        const itemRemovido = carrinho.splice(index, 1); 
        showToast(`Item "${itemRemovido[0].nome}" removido do carrinho.`);
        atualizarCarrinhoHTML();
    }
}

/** Preenche os dropdowns da seção Meia-a-Meia com os sabores disponíveis. */
function preencherOpcoesMeiaMeia() {
    const select1 = document.getElementById('metade1');
    const select2 = document.getElementById('metade2');
    
    select1.innerHTML = '<option value="">Selecione um sabor</option>';
    select2.innerHTML = '<option value="">Selecione um sabor</option>';

    for (const id in pizzas) {
        const pizza = pizzas[id];
        const option1 = new Option(pizza.nome, id);
        const option2 = new Option(pizza.nome, id);
        
        select1.add(option1);
        select2.add(option2);
    }
}

/** Adiciona a pizza Meia-a-Meia ao carrinho. */
function adicionarMeiaMeia() {
    const id1 = document.getElementById('metade1').value;
    const id2 = document.getElementById('metade2').value;

    if (!id1 || !id2) {
        showToast('Por favor, selecione dois sabores para a pizza Meia-a-Meia.');
        return;
    }
    if (id1 === id2) {
        showToast('Você selecionou dois sabores iguais. Escolha sabores diferentes ou peça a pizza inteira.');
        return;
    }
    
    const pizza1 = pizzas[id1];
    const pizza2 = pizzas[id2];

    const precoFinal = Math.max(pizza1.preco, pizza2.preco);
    
    const itemMeiaMeia = {
        nome: `Meia-a-Meia: ${pizza1.nome} / ${pizza2.nome}`,
        preco: precoFinal
    };

    carrinho.push(itemMeiaMeia);
    showToast(`Pizza Meia-a-Meia (${pizza1.nome}/${pizza2.nome}) adicionada! Preço: R$ ${precoFinal.toFixed(2).replace('.', ',')}`);
    atualizarCarrinhoHTML();
}

/** Monta a mensagem final e envia para o WhatsApp. */
function finalizarPedido() {
    if (carrinho.length === 0) {
        showToast('Seu carrinho está vazio. Adicione itens para finalizar o pedido.');
        return;
    }

    let mensagem = '*🍕 NOVO PEDIDO ONLINE 🍕*\n\n';
    let total = 0;

    carrinho.forEach((item, index) => {
        const precoFormatado = item.preco.toFixed(2).replace('.', ',');
        mensagem += `${index + 1}. ${item.nome} - R$ ${precoFormatado}\n`;
        total += item.preco;
    });

    const totalFormatado = total.toFixed(2).replace('.', ',');

    mensagem += `\n*TOTAL DO PEDIDO: R$ ${totalFormatado}*`;
    mensagem += '\n\n_Por favor, aguarde a confirmação e informe seu endereço para entrega._';

    const mensagemCodificada = encodeURIComponent(mensagem);
    const urlWhatsApp = `https://wa.me/${TELEFONE_LOJA}?text=${mensagemCodificada}`;
    
    window.open(urlWhatsApp, '_blank');
}

// --- INICIALIZAÇÃO ---

document.addEventListener('DOMContentLoaded', () => {
    // Renderiza as duas seções do menu
    renderizarPizzas(); 
    renderizarBebidas();
    
    // Configura o Meia-a-Meia
    preencherOpcoesMeiaMeia();
    document.getElementById('addMeiaMeia').addEventListener('click', adicionarMeiaMeia);
    
    // Configura o Carrinho
    atualizarCarrinhoHTML(); 
    document.getElementById('finalizar-pedido').addEventListener('click', finalizarPedido);
});