
var pizza;
var preco;
var imagem;
var PIZZARIA_ID = 'Ruizz Pizzas ';
var listaPizzasCadastradas = [];

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    cordova.plugin.http.setDataSerializer('json');

    imagem = document.getElementById('imagem');
    pizza = document.getElementById('pizza');
    preco = document.getElementById('preco');
    document.getElementById('btnCancelar').addEventListener('click', cancelar);
    document.getElementById('btnNovo').addEventListener('click', novo);
    document.getElementById('btnSalvar').addEventListener('click', salvar);
    document.getElementById('btnExcluir').addEventListener('click', excluir);
    document.getElementById('btnFoto').addEventListener('click', foto);
    carregarPizzas();
}

function novo() {
    applista.style.display = 'none'; // oculta lista
    appcadastro.style.display = 'flex'; // exibe cadastro
}

function foto() {
    navigator.camera.getPicture(onSuccess, 
                                onFail, 
                                { quality: 50, 
                                  destinationType: Camera.DestinationType.DATA_URL }
                               );  
    
    function onSuccess(imageData) {
        imagem.style.backgroundImage = "url(https://st2.depositphotos.com/1692343/5636/i/600/depositphotos_56360353-stock-photo-hot-homemade-pepperoni-pizza.jpg" + imageData + "')"; 
    }  
    
    function onFail(message) { 
        alert('Failed because: ' + message); 
    }
}

function salvar() {
    cordova.plugin.http.setDataSerializer('json');
    cordova.plugin.http.post('https://pedidos-pizzaria.glitch.me/admin/pizza/', {
        pizzaria: PIZZARIA_ID, 
        pizza: pizza.value, 
        preco: preco.value, 
        imagem: imagem.style.backgroundImage
    }, {}, function(response) {
        alert(response.status);
    }, function(response) {
        alert(response.error);
    });
    carregarPizzas();
}

function excluir() {
    var PIZZA_NOME = document.getElementById('pizza').value;
    cordova.plugin.http.delete('https://pedidos-pizzaria.glitch.me/admin/pizza/'+ PIZZARIA_ID + '/' +  PIZZA_NOME,{ 
    }, {}, function(response) {
        alert(response.status);
    }, function(response) {
        alert(response.error);
    });
    carregarPizzas();
}

function cancelar() {  
    applista.style.display = 'flex'; // exibe lista
    appcadastro.style.display = 'none'; // oculta cadastro
}

function carregarPizzas() {
    cordova.plugin.http.get('https://pedidos-pizzaria.glitch.me/admin/pizzas/' +  PIZZARIA_ID, {   
    }, {}, function(response) {
        if(response.data != null) {
            listaPizzasCadastradas = JSON.parse(response.data);
            listaPizzasCadastradas.forEach((item, idx) => {
                const novo = document.createElement('div');
                novo.classList.add('linha');
                novo.innerHTML = item.pizza;
                novo.id = idx;
                novo.onclick = function () {
                    carregarDadosPizza(novo.id);
                    applista.style.display = 'none'; // oculta lista
                    appcadastro.style.display = 'flex'; // exibe cadastro
                };
                listaPizzas.appendChild(novo);
            });
        } alert(response.status);
    }, function(response) {
        alert(response.error);
    });     
}

function carregarDadosPizza(id) {
    imagem.style.backgroundImage = listaPizzasCadastradas[id].imagem;
    pizza.value = listaPizzasCadastradas[id].pizza;
    preco.value = listaPizzasCadastradas[id].preco;
    let idPizza = listaPizzasCadastradas[id]._id;
    btnSalvar.onclick = function() {
        attPizza(idPizza);
    }
}

function attPizza(_id_pizza) {
    cordova.plugin.http.put('https://pedidos-pizzaria.glitch.me/admin/pizza/', {
        pizzaId: _id_pizza,
        pizzaria: PIZZARIA_ID,
        pizza: pizza.value,
        preco: preco.value,
        imagem: imagem.style.backgroundImage
    }, {}, function(response){
        alert(response.status);
    }, function(response){
        alert(response.error);
    })
}