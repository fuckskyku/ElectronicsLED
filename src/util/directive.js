import hasAuthority from './AuthorityStting'
import Vue from 'vue'

//注册全局自定义指令
const hasButton = Vue.directive('hasButton', {
    bind: function (el, binding) {
        if (!hasAuthority(el.name)) {
            if (el.parentNode == null) { el.style.display = "none"; }
            else
                el.parentNode.removeChild(el);
        }
    }
});
//注册全局自定义指令
const hasButtonId = Vue.directive('hasButtonId', {
    bind: function (el, binding) {
        if (!hasAuthority(el.id)) {
            if (el.parentNode == null) { el.style.display = "none"; }
            else
                el.parentNode.removeChild(el);
        }
    }
});
//注册全局自定义指令
const hasMenu = Vue.directive('hasMenu', {
    bind: function (el, binding) {
        var show = false;
        var array = el.name.split(',');
        for (var i = 0; i < array.length; i++) {
            if (hasAuthority(array[i])) {
                show = true;
                break;
            }
            else {
                continue;
            }
        }
        if (!show) {
            el.style.display = "none"
        }
    }
});

export { hasButton, hasButtonId, hasMenu }
