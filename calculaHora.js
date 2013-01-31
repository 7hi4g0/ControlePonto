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
	document.getElementById("entrada").onblur = atualiza;
	document.getElementById("almoco").onblur = atualiza;
	document.getElementById("retorno").onblur = atualiza;
	document.getElementById("saida").onblur = atualiza;
};