smodules.ui.tab = (function() {
    var ok = function(event, callback) {
        var target = event.target;

        if (target.tagName === "A") {
            callback(target);
        }
    };

    var changeContent = function(spec, target) {
        $("#" + spec.id).find("a").each(function(idx, element) {
            if (element === target) {
                $(element).addClass(spec.selected);
                $($(element).attr("href")).show();
            } else {
                $(element).removeClass(spec.selected);
                $($(element).attr("href")).hide();
            }
        });
    };

    return function(spec) {
        if (typeof spec.id !== "string") {
            return;
        }

        spec = $.extend({
            mouseover: "mouse",
            selected:  "selected",
            initial:   0,
        }, spec);

        $("#" + spec.id).
            click(function(e) {
                ok(e, function(target) {
                    changeContent(spec, target);
                    e.preventDefault();
                });
            }).
            mouseover(function(e) {
                ok(e, function(target) {
                    $(target).addClass(spec.mouseover);
                });
            }).
            mouseout(function(e) {
                ok(e, function(target) {
                    $(target).removeClass(spec.mouseover);
                });
            });

        $("#" + spec.id).find("a").eq(spec.initial).click();

        return smodules.ui;
    };
})();
