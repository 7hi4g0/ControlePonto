var atualiza = function () {
	var carga = document.getElementById("carga"),
	    entrada = document.getElementById("entrada"),
		almoco = document.getElementById("almoco"),
		retorno = document.getElementById("retorno"),
		expediente = document.getElementById("expediente"),
		saida = document.getElementById("saida"),
		mensagem = document.getElementById("mensagem"),
		horaCarga,
		horaEntrada,
		horaAlmoco,
		horaRetorno,
		horaSaida,
		diferencaExpediente,
		minutoExpediente,
		stringExpediente;

	// Salva o valor do horário que teve foi alterado
	localStorage.setItem(this.id, this.value);

	mensagem.innerHTML = "";

	if (entrada.value.trim() === "" || almoco.value.trim() === "" || retorno.value.trim() === "") {
		expediente.value = "";
		return true;
	}

	if (carga.value.trim() === "") {
		mensagem.innerHTML = "<h1>Bem vindo :-)</h1><span>Adicione um valor de carga diária para começar.</span>";
	} else {

		horaCarga = carga.valueAsNumber / 60000;
		horaEntrada = entrada.valueAsNumber / 60000;
		horaAlmoco = almoco.valueAsNumber / 60000;
		horaRetorno = retorno.valueAsNumber / 60000;

		minutoExpediente = horaEntrada + horaRetorno - horaAlmoco;
		minutoExpediente += horaCarga;

		stringExpediente = ("00" + Math.floor(minutoExpediente / 60)).slice(-2) + ":" + ("00" + (minutoExpediente % 60)).slice(-2);

		expediente.value = stringExpediente;

		if (saida.value.trim() === "") {
			return true;
		}

		horaSaida = saida.valueAsNumber / 60000;

		diferencaExpediente = horaSaida - minutoExpediente;

		if (diferencaExpediente === 0) {
			mensagem.innerHTML = "<h1>Expediente correto</h1><span>Você até pode fingir, mas não acredito!</span>";
		} else if (diferencaExpediente > 0) {
			mensagem.innerHTML = "<h1>Regime extraordinário</h1><span>Cuidado, não deixe seu banco alcançar mais de 40 horas positivas.</span>";
		} else {
			mensagem.innerHTML = "<h1>Saída antecipada</h1><span>Informe seus superiores.<br/>Não acumule mais de 10 horas negativas no seu banco.</span>";
		}
	};
};

window.onload = function () {
	var entrada = document.getElementById("entrada"),
		almoco = document.getElementById("almoco"),
		retorno = document.getElementById("retorno"),
		saida = document.getElementById("saida"),
		dia = document.getElementById("dia"),
		tipoEvento = "blur",
		evento;

	dia.valueAsDate = new Date();

	carga.addEventListener(tipoEvento, atualiza, false);
	entrada.addEventListener(tipoEvento, atualiza, false);
	almoco.addEventListener(tipoEvento, atualiza, false);
	retorno.addEventListener(tipoEvento, atualiza, false);
	saida.addEventListener(tipoEvento, atualiza, false);

	evento = new Event(tipoEvento);

	// Recupera valores salvos caso existam
	carga.value = localStorage.getItem("carga");
	carga.dispatchEvent(evento);
	entrada.value = localStorage.getItem("entrada");
	entrada.dispatchEvent(evento);
	almoco.value = localStorage.getItem("almoco");
	almoco.dispatchEvent(evento);
	retorno.value = localStorage.getItem("retorno");
	retorno.dispatchEvent(evento);
	saida.value = localStorage.getItem("saida");
	saida.dispatchEvent(evento);
};