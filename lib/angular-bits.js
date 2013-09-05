/**
 * Created with JetBrains WebStorm.
 * User: dave
 * Date: 5/09/13
 * Time: 4:26 PM
 * To change this template use File | Settings | File Templates.
 */

//TODO: include copyright &/or credit to the AngularJS source/project for all of the following

function assertArg(arg, name, reason) {
    if (!arg) {
        throw new Error("Argument '" + (name || '?') + "' is " + (reason || "required"));
    }
    return arg;
}
function assertArgFn(arg, name, acceptArrayAnnotation) {
    if (acceptArrayAnnotation && isArray(arg)) {
        arg = arg[arg.length - 1];
    }

    assertArg(isFunction(arg), name, 'not a function, got ' +
        (arg && typeof arg == 'object' ? arg.constructor.name || 'Object' : typeof arg));
    return arg;
}
function isString(value){return typeof value == 'string';}
function isArray(value) {
    return toString.apply(value) == '[object Array]';
}
function isFunction(value){return typeof value == 'function';}
function forEach(obj, iterator, context) {
    var key;
    if (obj) {
        if (isFunction(obj)){
            for (key in obj) {
                if (key != 'prototype' && key != 'length' && key != 'name' && obj.hasOwnProperty(key)) {
                    iterator.call(context, obj[key], key);
                }
            }
        } else if (obj.forEach && obj.forEach !== forEach) {
            obj.forEach(iterator, context);
        } else if (isArrayLike(obj)) {
            for (key = 0; key < obj.length; key++)
                iterator.call(context, obj[key], key);
        } else {
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    iterator.call(context, obj[key], key);
                }
            }
        }
    }
    return obj;
}
var FN_ARGS = /^function\s*[^\(]*\(\s*([^\)]*)\)/m;
var FN_ARG_SPLIT = /,/;
var FN_ARG = /^\s*(_?)(\S+?)\1\s*$/;
var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
function annotate(fn) {
    var $inject,
        fnText,
        argDecl,
        last;

    if (typeof fn == 'function') {
        if (!($inject = fn.$inject)) {
            $inject = [];
            fnText = fn.toString().replace(STRIP_COMMENTS, '');
            argDecl = fnText.match(FN_ARGS);
            forEach(argDecl[1].split(FN_ARG_SPLIT), function(arg){
                arg.replace(FN_ARG, function(all, underscore, name){
                    $inject.push(name);
                });
            });
            fn.$inject = $inject;
        }
    } else if (isArray(fn)) {
        last = fn.length - 1;
        assertArgFn(fn[last], 'fn');
        $inject = fn.slice(0, last);
    } else {
        assertArgFn(fn, 'fn', true);
    }
    return $inject;
}

exports.annotate = annotate;