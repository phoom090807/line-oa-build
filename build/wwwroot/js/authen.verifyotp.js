var isOtpExpire = false;
var isOtpLock = false;
var fullTextCountdown = "";
$(".input-otp input").on("keypress keyup blur", function (event) {
    $(this).val($(this).val().replace(/[^\d]/, ""));
    var data = $(this).val();
    var parent = $($(this).parent());
    if (data != '' && data != undefined) {
        var isNumeric = data >= 0;
        if (isNumeric) {
            var next = parent.find('input#' + $(this).data('next'));
            $(this).addClass('filled');
            if (next.length && ($(this).val() != '' && $(this).val() != undefined)) {
                $(next).focus();
            }
        }
    }

    if (event.keyCode === 8 || event.keyCode === 37) {
       /* var prev = parent.find('input#' + $(this).data('previous'));
        $(this).removeClass('filled');
        if (prev.length) {
            $(prev).focus();
        }*/
    }
    validateData();
});
$('#digit-1').keypress(function (e) {
    var maxlengthNumber = parseInt($('#digit-1').attr('maxlength'));
    var inputValueLength = $('#digit-1').val().length + 1;

    if (maxlengthNumber < inputValueLength) {
        return false;
    }
});
$('#digit-2').keypress(function () {
    var maxlengthNumber = parseInt($('#digit-2').attr('maxlength'));
    var inputValueLength = $('#digit-2').val().length + 1;

    if (maxlengthNumber < inputValueLength) {
        return false;
    }
});
$('#digit-3').keypress(function () {
    var maxlengthNumber = parseInt($('#digit-3').attr('maxlength'));
    var inputValueLength = $('#digit-3').val().length + 1;

    if (maxlengthNumber < inputValueLength) {
        return false;
    }
});
$('#digit-4').keypress(function () {
    var maxlengthNumber = parseInt($('#digit-4').attr('maxlength'));
    var inputValueLength = $('#digit-4').val().length + 1;

    if (maxlengthNumber < inputValueLength) {
        return false;
    }
});
$('#digit-5').keypress(function () {
    var maxlengthNumber = parseInt($('#digit-5').attr('maxlength'));
    var inputValueLength = $('#digit-5').val().length + 1;

    if (maxlengthNumber < inputValueLength) {
        return false;
    }
});
$('#digit-6').keypress(function () {
    var maxlengthNumber = parseInt($('#digit-6').attr('maxlength'));
    var inputValueLength = $('#digit-6').val().length + 1;

    if (maxlengthNumber < inputValueLength) {
        return false;
    }
});

function validateData() {
    
    var d = "";
    $('.input-otp input').each(function (i, v) {
        d += $(v).val();
    })
    if (d.length === 6 && !isOtpExpire && !isOtpLock) {
        $('#btnConfirm').attr('disabled', false);
        $('#ClientAction').val('verify');
        $('#InputOTP').val(d);
        return true;
    } else {
        $('#btnConfirm').attr('disabled', true);
        $('#ClientAction').val('');
        $('#InputOTP').val('');
        return false;
	}
}

function submitVerify() {
    if (validateData()) {
        $('form').submit();
	}
    
}

function countDownLock(m, s) {
    var minutes = parseInt(m);
    var seconds = parseInt(s);
    var interval = setInterval(function () {
        --seconds;
        minutes = (seconds < 0) ? --minutes : minutes;
        //minutes <= 0 && seconds === 0
        if (minutes < 0) {
            clearInterval(interval);
            isOtpLock = false;
            validateData();
            return false;
        }
        seconds = (seconds < 0) ? 59 : seconds;
        seconds = (seconds < 10) ? '0' + seconds : seconds;
        //update timer in resend otp btn
        //$('.countdown-lock').text(minutes + ':' + seconds);
        var textTime = '<span class="countdown-lock">' + minutes + ':' + seconds + '</span>';
        var fulltxt = $('#fullTextLimitWrongMsg').val().replace("##:##", textTime);
        //update timer in resend otp btn
        //$('.countdown-number').text(minutes + ':' + seconds);
        $('.error-msg').html(fulltxt);

    }, 1000);
}
function countDown(m, s) {
    var minutes = parseInt(m);
    var seconds = parseInt(s);
    var interval = setInterval(function () {
        --seconds;
        minutes = (seconds < 0) ? --minutes : minutes;
        if (minutes < 0) {
            clearInterval(interval);
            isOtpExpire = true;
            $('#openModal_otpExpired')[0].click();
            $('#btnConfirm').attr('disabled', true);
            //change text to normal mode
            return false;
        }
        seconds = (seconds < 0) ? 59 : seconds;
        seconds = (seconds < 10) ? '0' + seconds : seconds;
        //set msg fullTextExpireCaption
        var textTime = '<span class="countdown-number">' + minutes + ':' + seconds + '</span>';
        var fulltxt = $('#fullTextExpireCaption').val().replace("##:##", textTime);
        //update timer in resend otp btn
        //$('.countdown-number').text(minutes + ':' + seconds);
        $('.countdown-msg').html(fulltxt);

    }, 1000);
}
function closeModal() {
    $('#closeModal_otpExpired')[0].click();
}

$('#btn_resend').click(function () {
    $('#ClientAction').val('resend');
    $('form').submit();
});