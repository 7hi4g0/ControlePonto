var atualiza = function () {
	var entrada = document.getElementById("entrada"),
		almoco = document.getElementById("almoco"),
		retorno = document.getElementById("retorno"),
		expediente = document.getElementById("expediente"),
		horaEntrada,
		horaAlmoco,
		horaRetorno,
		minutoExpediente,
		stringExpediente;

	if (entrada.value.trim() === "" || almoco.value.trim() === "" || retorno.value.trim() === "") {
		expediente.value = "";
		return true;
	}

	horaEntrada = entrada.valueAsNumber / 60000;
	horaAlmoco = almoco.valueAsNumber / 60000;
	horaRetorno = retorno.valueAsNumber / 60000;

	minutoExpediente = horaEntrada + horaRetorno - horaAlmoco;
	minutoExpediente += 8 * 60 + 45;

	stringExpediente = ("00" + parseInt((minutoExpediente / 60), 10)).slice(-2) + ":" + ("00" + (minutoExpediente % 60)).slice(-2);

	expediente.value = stringExpediente;
};

window.onload = function () {
	document.getElementById("entrada").onblur = atualiza;
	document.getElementById("almoco").onblur = atualiza;
	document.getElementById("retorno").onblur = atualiza;
};