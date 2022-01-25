// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

document.addEventListener("DOMContentLoaded", function () {
	var sidenavElements = document.querySelectorAll(".sidenav");
	M.Sidenav.init(sidenavElements);

	var dropdownElements = document.querySelectorAll(".dropdown-trigger");
	M.Dropdown.init(dropdownElements, {
		hover: false
	});

	var selectElements = document.querySelectorAll("select");
	M.FormSelect.init(selectElements);

	var datepickerElements = document.querySelectorAll(".datepicker");
	M.Datepicker.init(datepickerElements);

	var modelElements = document.querySelectorAll('.modal');
	M.Modal.init(modelElements);

	M.updateTextFields();
});

(function (hwcLib) {
	/**
	 * Shows a system message to the user via the ".kn-system-messages" element.
	 * @param {string} message The system message.
	 * @param {string} type Either "info", "warning", or "error".
	 * @param {bool} logToConsole Instructs to also log to console.
	 */
	hwcLib.showMessage = function (message, type, logToConsole) {
		var messageElement = document.querySelector(".mc-system-messages");

		if (message && type) {
			if (type === "info") {
				messageElement.appendChild(hwcLib.buildMessageMarkup(message, "light-blue lighten-5"));

				if (logToConsole) {
					console.info(message);
				}
			} else if (type === "warning") {
				messageElement.appendChild(hwcLib.buildMessageMarkup(message, "yellow lighten-4"));

				if (logToConsole) {
					console.warn(message);
				}
			} else if (type === "error") {
				messageElement.appendChild(hwcLib.buildMessageMarkup(message, "deep-orange lighten-2"));

				if (logToConsole) {
					console.error(message);
				}
			}
		}
	};

	/**
	 * Builds an HTML element of a system message.
	 * @param {string} message The system message.
	 * @param {string} cssClasses The CSS class selectors.
	 * @returns {HTMLElement} The <p> element.
	 */
	hwcLib.buildMessageMarkup = function (message, cssClasses) {
		var paragraph = document.createElement("p");
		paragraph.classList = "mc-user-message " + cssClasses;
		paragraph.innerText = message;
		var div = document.createElement("div");
		div.classList = "col xl5 l9 m12 s12";
		div.appendChild(paragraph);
		var section = document.createElement("section");
		section.classList = "row section";
		section.appendChild(div);

		return section;
	};
}(window.hwcLib = window.hwcLib || {}));

$.urlParam = function (name) {
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (results === null) return "";
	return results[1] || 0;
}

function isNotEmpty(value) {
	return value !== undefined && value !== null && value !== "";
}

$.ajaxSetup({
	cache: false,
	error: function (x, e, str) {
		__loading(false);
		var err = str ? str : x.statusText;
		var msg = '';
		var title = 'Server Error';
		if (x.status == 0) {
			msg = 'You are offline!! Please Check Your Network.<br/>' + err;
		} else if (x.status == 404) {
			msg = 'Requested URL not found.\n<br/>' + err;
		} else if (x.status == 500) {
			msg = 'Internal Server Error.<br/>' + err;
		} else if (e == 'parsererror') {
			msg = 'Error.<br/>Parsing JSON Request failed.<br/>' + err;
		} else if (e == 'timeout') {
			msg = 'Request Time out.<br/>' + err;
		} else {
			msg = 'Unknown Error.<br/>' + err + '<br/>' + x.responseText;
		}
		__swalError(msg, title);
	}
});

function __callAjax(url, ajaxOptions) {
	if (!url)
		return false;

	var loading = $("#__loadingPanel");
	if (ajaxOptions.LoadingElementId)
		loading = $("#" + ajaxOptions.LoadingElementId);

	var duration = 500;

	var onSuccess = function (data) { $("#contentPanel").html(data); };
	if (ajaxOptions.OnSuccess)
		onSuccess = ajaxOptions.OnSuccess;
	else if (ajaxOptions.UpdateTargetId)
		onSuccess = function (data) { $("#" + ajaxOptions.UpdateTargetId).html(data); };

	var method = "GET";
	if (ajaxOptions.Method)
		method = ajaxOptions.Method;

	$.ajax({
		url: url,
		cache: false,
		type: method,
		beforeSend: function (xhr) {
			//loading.show(duration);
		},
		complete: function () {
			loading.hide(duration);
		},
		success: function (data, status, xhr) {

			onSuccess(data);
		},
		failure: __ajaxFailure
	});
	return true;
}

function __ajaxPostFormData(url, formData, showLoading, funcSuccess, funcError) {
	$.ajax({
		type: "POST",
		url: url,
		contentType: false,
		processData: false,
		data: formData,
		success: function (data) {
			if (showLoading)
				__loading(false);

			if (funcSuccess) {
				funcSuccess(data);
			}
			else {
				if (data.ok) {
					__swalSuccess(data.msg, null, reloadPage);
				}
				else {
					__notifyError(data.msg);
				}
			}

		},
		error: function (message) {
			if (showLoading)
				__loading(false);
			if (funcError) {
				funcError(message);
			}
			else {
				__notifyError(message);
			}
		}
	});
}

function __ajaxFailure(xhr, status, error) {
	__loading(false);
	//debugger;

	//_dlg_showError(null, xhr);
	__notifyError(status);
}

function __ajaxCallJson(url, args, funcSuccess, funcError) {
	var onError = __ajaxFailure;
	if (funcError)
		onError = funcError;
	$.ajax({
		url: url,
		dataType: "json",
		data: args,
		success: funcSuccess,
		error: onError,
		timeout: __ajax_timeout
	});
}

function __loadContent(url, contentName, notPush, showLoading, funcComplete) {
	var objContent = "#contentPanel";
	if (contentName) {
		objContent = contentName;
	}

	if (notPush && notPush === true) {

	}
	else {
		__pushHistoryState(url, url);
	}

	$.ajax({
		url: url,
		type: "GET",
		cache: false,
		async: true,
		beforeSend: function (xhr) {
			if (showLoading === true) {
				__loading(true);
			}
		},
		complete: function () {
			if (showLoading === true) {
				__loading(false);
			}
		},
		success: function (data, status, xhr) {
			$(objContent).html(data);

			if (funcComplete)
				funcComplete();
		},
		failure: __ajaxFailure
	});
}

function __onLoadContentComplete(response, status, xhr) {
	if (status == "error") {
		__loading(false);
		__swalError(xhr.status + " " + xhr.statusText);
	}
}

function __resultHasError(result) {
	__loading(false);

	switch (result.code) {
		case 2001:
		case 2002:
		case 2003:
		case 2004:
			__swalError(result.msg, null, __redirectToLogin, __redirectToLogin);
			break;
		default:
	}
}

function __pushHistoryState(uri, text) {
	if (window.history.pushState) {
		window.history.pushState({ path: uri, title: text }, text, uri);
	}
	else {
		storedHash = uri;
		location.hash = uri;
	}

}

function __setRequiredByFormName(formName) {
	var $form = $(formName);
	$('form').find("[data-val-required]").each(function (index) {
		var $input = $(this);
		var requiredAsterisk = "<span class=\"hwc-label-required\">*</span>";
		var id = $input.attr('id');
		if (id) {
			if (!id.startsWith("Is") && id != "Inactived" && id != "Enabled" && id != "DisplayOrder" && id != "AllDay") {
				var $label = $form.find("label[for='" + id + "']");
				if ($label.length > 0) {
					var html = $label.html() + " ";
					if (html.indexOf(requiredAsterisk) <= 0) $label.html(html + requiredAsterisk);
				}
				else {
					$label = $form.find("label[id='dxLabelFor" + id + "']");
					if ($label.length > 0) {
						var html = $label.html() + " ";
						if (html.indexOf(requiredAsterisk) <= 0) $label.html(html + requiredAsterisk);
					}
				}
			}
		}
	});

	$('form').find('[hwc-require]').each(function (index) {
		var $target = $(this).find('label');
		var requiredAsterisk = "<span class=\"hwc-label-required\">*</span>";
		if ($target.html().indexOf(requiredAsterisk) <= 0) {
			$target.append(' ' + requiredAsterisk);
		}
	});

	$('form').find('[jf-not-require] .jf-label-required').remove();
}

function __setupForm(formName, dateFormat) {
	//_jf_bindDatepicker('dd/mm/yyyy');
	__setRequiredByFormName(formName);
}

function __prepareValidationScripts(form) {
	if (!form)
		return;
	if (form.attr("data-executed"))
		return;
	$.validator.unobtrusive.parse(form);
	form.attr("data-executed", "true");
}

function __showWindow() {
	$('#__popupForm').modal("show");
}

function __hideWindow() {
	$('#__popupForm').modal("hide");
}






function __loading(show) {
	if (show) {
		__loadPanel.show();
	}
	else {
		__loadPanel.hide();
	}
}

var __ui_dialog_ok;
var __ui_dialog_yes;
var __ui_dialog_no;
function __swalSuccess(msg, title, funcOk) {
	Swal.fire({
		title: title,
		html: msg,
		icon: "success",
		buttonsStyling: false,
		confirmButtonText: __ui_dialog_ok,
		customClass: {
			confirmButton: "btn btn-primary"
		}
	}).then(function (result) {
		if (result.value) {
			if (funcOk)
				funcOk(result);
		} else if (result.dismiss === "cancel") {

		}
	});
}

function __swalInfo(msg, title, funcOk) {
	Swal.fire({
		title: title,
		html: msg,
		icon: "info",
		buttonsStyling: false,
		confirmButtonText: __ui_dialog_ok,
		customClass: {
			confirmButton: "btn btn-primary"
		}
	}).then(function (result) {
		if (result.value) {
			if (funcOk)
				funcOk(result);
		} else if (result.dismiss === "cancel") {

		}
	});
}

function __swalError(msg, title, funcOk, fncCancel) {
	Swal.fire({
		title: title,
		html: msg,
		icon: "error",
		buttonsStyling: false,
		confirmButtonText: __ui_dialog_ok,
		customClass: {
			confirmButton: "btn btn-danger"
		}
	}).then(function (result) {
		if (result.value) {
			if (funcOk)
				funcOk(result);
		} else if (result.dismiss === "cancel") {
			if (fncCancel)
				fncCancel(result);
		}
	});
}

function __swalWarning(msg, title, funcOk, fncCancel) {
	Swal.fire({
		title: title,
		html: msg,
		icon: "warning",
		buttonsStyling: false,
		confirmButtonText: __ui_dialog_ok,
		customClass: {
			confirmButton: "btn btn-warning"
		}
	}).then(function (result) {
		if (result.value) {
			if (funcOk)
				funcOk(result);
		} else if (result.dismiss === "cancel") {
			if (fncCancel)
				fncCancel(result);
		}
	});
}

function __swalConfirm(msg, title, textYes, textNo, funcOk, fncCancel, data) {
	var yes = __ui_dialog_yes;
	var no = __ui_dialog_no;
	if (textYes)
		yes = textYes;

	if (textNo)
		no = textNo;

	Swal.fire({
		title: title,
		html: msg,
		icon: "warning",
		buttonsStyling: false,
		confirmButtonText: yes,
		showCancelButton: true,
		cancelButtonText: no,
		customClass: {
			confirmButton: "btn btn-warning",
			cancelButton: "btn btn-default"
		}
	}).then(function (result) {
		if (result.value) {
			if (funcOk)
				funcOk(result, data);
		} else if (result.dismiss === "cancel") {
			if (fncCancel)
				fncCancel(result, data);
		}


	});
}

function __redirectToLogin() {
	window.location = __ui_url_logout;
}

