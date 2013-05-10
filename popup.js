var PONTO = {};

PONTO.atualiza = function () {
	var horaCarga,
		horaEntrada,
		horaAlmoco,
		horaRetorno,
		horaSaida,
		diferencaExpediente,
		minutoExpediente,
		stringExpediente;

	// Salva o valor do horário que foi alterado
	localStorage.setItem(this.id, this.value);

	PONTO.dom.mensagem.innerHTML = "";

	if (PONTO.dom.entrada.value.trim() === "" || PONTO.dom.almoco.value.trim() === "" || PONTO.dom.retorno.value.trim() === "") {
		PONTO.dom.expediente.value = "";
		return true;
	}

	if (PONTO.dom.carga.value.trim() === "") {
		PONTO.dom.mensagem.innerHTML = "<h1>Bem vindo :-)</h1><span>Adicione um valor de carga diária para começar.</span>";
	} else {

		horaCarga = PONTO.dom.carga.valueAsNumber / 60000;
		horaEntrada = PONTO.dom.entrada.valueAsNumber / 60000;
		horaAlmoco = PONTO.dom.almoco.valueAsNumber / 60000;
		horaRetorno = PONTO.dom.retorno.valueAsNumber / 60000;

		minutoExpediente = horaEntrada + horaRetorno - horaAlmoco;
		minutoExpediente += horaCarga;

		stringExpediente = ("00" + Math.floor(minutoExpediente / 60)).slice(-2) + ":" + ("00" + (minutoExpediente % 60)).slice(-2);

		PONTO.dom.expediente.value = stringExpediente;

		if (PONTO.dom.saida.value.trim() === "") {
			return true;
		}

		horaSaida = PONTO.dom.saida.valueAsNumber / 60000;

		diferencaExpediente = horaSaida - minutoExpediente;

		if (diferencaExpediente === 0) {
			PONTO.dom.mensagem.innerHTML = "<h1>Expediente correto</h1><span>Você até pode fingir, mas não acredito!</span>";
		} else if (diferencaExpediente > 0) {
			PONTO.dom.mensagem.innerHTML = "<h1>Regime extraordinário</h1><span>Cuidado, não deixe seu banco alcançar mais de 40 horas positivas.</span>";
		} else {
			PONTO.dom.mensagem.innerHTML = "<h1>Saída antecipada</h1><span>Informe seus superiores.<br/>Não acumule mais de 10 horas negativas no seu banco.</span>";
		}
	}
};

PONTO.init = function () {
	var tipoEvento = "blur",
		evento;

	PONTO.dom = {
		carga: document.getElementById("carga"),
		entrada: document.getElementById("entrada"),
		almoco: document.getElementById("almoco"),
		retorno: document.getElementById("retorno"),
		expediente: document.getElementById("expediente"),
		saida: document.getElementById("saida"),
		dia: document.getElementById("dia"),
		mensagem: document.getElementById("mensagem"),
		salvar: document.getElementById("salvar"),
	};

	PONTO.dom.dia.valueAsDate = new Date();

	PONTO.dom.carga.addEventListener(tipoEvento, PONTO.atualiza, false);
	PONTO.dom.entrada.addEventListener(tipoEvento, PONTO.atualiza, false);
	PONTO.dom.almoco.addEventListener(tipoEvento, PONTO.atualiza, false);
	PONTO.dom.retorno.addEventListener(tipoEvento, PONTO.atualiza, false);
	PONTO.dom.saida.addEventListener(tipoEvento, PONTO.atualiza, false);

	PONTO.dom.salvar.addEventListener("click", PONTO.salvar, false);
	PONTO.dom.dia.addEventListener("change", PONTO.recuperar, false);

	evento = new Event(tipoEvento);

	// Recupera valores salvos caso existam
	PONTO.dom.carga.value = localStorage.getItem("carga");
	PONTO.dom.carga.dispatchEvent(evento);
	PONTO.dom.entrada.value = localStorage.getItem("entrada");
	PONTO.dom.entrada.dispatchEvent(evento);
	PONTO.dom.almoco.value = localStorage.getItem("almoco");
	PONTO.dom.almoco.dispatchEvent(evento);
	PONTO.dom.retorno.value = localStorage.getItem("retorno");
	PONTO.dom.retorno.dispatchEvent(evento);
	PONTO.dom.saida.value = localStorage.getItem("saida");
	PONTO.dom.saida.dispatchEvent(evento);

	// Inicia o banco de dados
	PONTO.db.init();
};

PONTO.erro = function (erro) {
	console.log(erro.value);
};

PONTO.salvar = function () {
	PONTO.db.salvar({
		"dia": PONTO.dom.dia.valueAsDate,
		"entrada": PONTO.dom.entrada.value,
		"almoco": PONTO.dom.almoco.value,
		"retorno": PONTO.dom.retorno.value,
		"saida": PONTO.dom.saida.value,
	});
};

PONTO.recuperar = function () {
	PONTO.db.recuperar(PONTO.dom.dia.valueAsDate);
};

PONTO.recuperado = function (evento) {
	var regime = evento.target.result;

	if (regime === undefined || regime === null) {
		PONTO.erro({ value: "Dia não encontrado" });
		return;
	}

	PONTO.dom.entrada.value = regime["entrada"];
	PONTO.dom.almoco.value = regime["almoco"];
	PONTO.dom.retorno.value = regime["retorno"];
	PONTO.dom.saida.value = regime["saida"];

	PONTO.dom.carga.dispatchEvent(new Event("blur"));
};

PONTO.db = {
	init: function () {
		var versao = 1,
			requisicao = indexedDB.open("regimes", versao);

		requisicao.onupgradeneeded = function (evento) {
			var db = evento.target.result;

			evento.target.transaction.onerror = PONTO.erro;

			if (db.objectStoreNames.contains("regime")) {
				db.deleteObjectStore("regime");
			}

			db.createObjectStore("regime", {keyPath: "dia"});
		};

		requisicao.onsuccess = function (evento) {
			PONTO.db.instancia = evento.target.result;
		};

		requisicao.onerror = PONTO.erro;
	},
	salvar: function (regime) {
		var db = PONTO.db.instancia,
			transacao,
			armazanamento,
			requisicao;

		if (db === undefined) {
			PONTO.erro({ value: "Sem banco de dados" });
			return;
		}

		transacao = db.transaction(["regime"], "readwrite");
		armazanamento = transacao.objectStore("regime");
		requisicao = armazanamento.put(regime);

		requisicao.onsuccess = function (evento) {
			console.log("Salvo com sucesso!");
		};

		requisicao.onerror = PONTO.erro;
	},
	recuperar: function (dia) {
		var db = PONTO.db.instancia,
			transacao,
			armazenamento,
			requisicao;

		if (db === undefined) {
			PONTO.erro({ value: "Sem banco de dados" });
			return;
		}

		transacao = db.transaction(["regime"], "readwrite");
		armazenamento = transacao.objectStore("regime");
		requisicao = armazenamento.get(dia);

		requisicao.onsuccess = PONTO.recuperado;

		requisicao.onerror = PONTO.erro;
	}
};

window.onload = PONTO.init;