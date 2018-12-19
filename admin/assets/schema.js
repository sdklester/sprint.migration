function schemaScrollList() {
    var $el = $('#schema_list');
    $el.scrollTop($el.prop("scrollHeight"));
}

function schemaOutLog(result) {
    var $log = $('#schema_log');
    $log.append(result);
    $log.scrollTop($log.prop("scrollHeight"));
}

function schemaProgress(type, val) {
    var $progress = $('#schema_progress_' + type);
    var $bar = $progress.find('span');

    val = parseInt(val, 10);
    if (val) {
        $bar.width(val + '%');
        $progress.show();
    } else {
        $progress.hide();
    }
}

function schemaProgressReset() {
    schemaProgress('full', 0);
    schemaProgress('current', 0);
}

function schemaRefresh(callbackAfterRefresh) {
    var $el = $('#schema_list');

    schemaExecuteStep('schema_list', {}, function (data) {
        $el.empty().html(data);
        if (callbackAfterRefresh) {
            callbackAfterRefresh()
        } else {
            schemaEnableButtons(1);
        }
    });
}

function schemaEnableButtons(enable) {
    var $el = $('#schema-container');
    var buttons = $el.find('input,select');
    if (enable) {
        buttons.removeAttr('disabled');
    } else {
        buttons.attr('disabled', 'disabled');
    }
}

function schemaExecuteStep(step_code, postData, succesCallback) {
    var $el = $('#schema-container');

    postData = postData || {};
    postData['step_code'] = step_code;
    postData['send_sessid'] = $el.data('sessid');
    postData['schema_checked'] = $el.find(".sp-schema.adm-btn-active").map(function () {
        return $(this).data('id');
    }).get();

    schemaEnableButtons(0);

    jQuery.ajax({
        type: "POST",
        dataType: "html",
        data: postData,
        success: function (result) {
            if (succesCallback) {
                succesCallback(result)
            } else {
                schemaOutLog(result);
            }
        },
        error: function (result) {

        }
    });
}

jQuery(document).ready(function ($) {
    var $container = $('#schema-container');

    $.fn.serializeFormJSON = function () {

        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

    schemaRefresh(function () {
        schemaEnableButtons(1);
        schemaScrollList();
    });


    $container.on('click', '.sp-schema-export', function (e) {
        e.preventDefault();

        $('#schema_log').empty();
        schemaProgressReset();
        schemaExecuteStep('schema_export');
    });


    $container.on('click', '.sp-schema-test', function (e) {
        e.preventDefault();

        $('#schema_log').empty();
        schemaProgressReset();
        schemaExecuteStep('schema_test');
    });

    $container.on('click', '.sp-schema-import', function (e) {
        e.preventDefault();

        if (confirm('Confirm action')) {
            $('#schema_log').empty();
            schemaProgressReset();
            schemaExecuteStep('schema_import');
        }
    });

    $container.on('click', '.sp-schema', function (e) {
        $(this).toggleClass('adm-btn-active');
    });

    $container.on('click', '.sp-schema-check', function (e) {
        e.preventDefault();

        var checkboxes = $container.find(".sp-schema");
        if (checkboxes.hasClass('adm-btn-active')) {
            checkboxes.removeClass('adm-btn-active');
        } else {
            checkboxes.addClass('adm-btn-active');
        }
    });

});