var atualiza = function () {
	var entrada = document.getElementById("entrada"),
		almoco = document.getElementById("almoco"),
		retorno = document.getElementById("retorno"),
		expediente = document.getElementById("expediente"),
		saida = document.getElementById("saida"),
		mensagem = document.getElementById("mensagem"),
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

	horaEntrada = entrada.valueAsNumber / 60000;
	horaAlmoco = almoco.valueAsNumber / 60000;
	horaRetorno = retorno.valueAsNumber / 60000;

	minutoExpediente = horaEntrada + horaRetorno - horaAlmoco;
	minutoExpediente += 8 * 60 + 45;

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
		mensagem.innerHTML = "<h1>Expediente extraordinário</h1><span>Huum! Você é muito trabalhadeiro.</span>";
	} else {
		mensagem.innerHTML = "<h1>Saída antecipada</h1><span>Vai trabalhar vagabundo!</span>";
	}
};

window.onload = function () {
	var entrada = document.getElementById("entrada"),
		almoco = document.getElementById("almoco"),
		retorno = document.getElementById("retorno"),
		saida = document.getElementById("saida"),
		tipoEvento = "blur",
		evento;

	entrada.addEventListener(tipoEvento, atualiza, false);
	almoco.addEventListener(tipoEvento, atualiza, false);
	retorno.addEventListener(tipoEvento, atualiza, false);
	saida.addEventListener(tipoEvento, atualiza, false);

	evento = new Event(tipoEvento);

	// Recupera valores salvos caso existam
	entrada.value = localStorage.getItem("entrada");
	entrada.dispatchEvent(evento);
	almoco.value = localStorage.getItem("almoco");
	almoco.dispatchEvent(evento);
	retorno.value = localStorage.getItem("retorno");
	retorno.dispatchEvent(evento);
	saida.value = localStorage.getItem("saida")
	saida.dispatchEvent(evento);
};