/**
 * Created with JetBrains WebStorm.
 * User: dmcnaughton
 * Date: 31/08/13
 * Time: 7:14 AM
 * To change this template use File | Settings | File Templates.
 */
var assert = require('assert')
    , util = require('util')
    , debug = require('debug')('play-nicely');

var ab = require('./angular-bits');

/**
 * Module Constructor:
 * @type {Function}
 * @param {Object} options - option flags as object: global [true] , strict [false]
 */
exports = module.exports = function(options) {

    var serviceLocator = {};

    /**
     * Resolve and default options
     */
    options = options || {};
    options.global = (options.global === undefined) ? true : options.global;
    options.strict =  (options.strict === undefined) ? false : options.strict;
    options.formal =  (options.formal === undefined) ? false : options.formal;
    options.angularStyle =  (options.angularStyle === undefined) ? true : options.angularStyle;

    debug('Options: ', options);

    /**
     * Public method: please - adds a target (object) to the dependency list identified by the given token
     * @param {*} target
     * @param {String} token
     * @returns the target
     */
    function please (target, token) {

        assert(token, 'missing token');
        assert(typeof token === 'string', 'token must be a string');
        debug('Asked nicely to provide: ', token);
        assert(!serviceLocator.hasOwnProperty(token), 'duplicate token \"'+token+'\" encountered');

        serviceLocator[token] = target;  // don't actually care what target is
        /*****/
        serviceLocator[token].$trace = [];
        /*****/

        return target;

    };

    /**
     * Public method: thankYou - how would you describe it?
     * @param {Array} tokens, [target]
     * @param {Function} [target]
     * @returns {*}
     */
    function thankYou () {

        /*****/
        if (typeof arguments[0] == 'string') {
            var $user = arguments[0];
            [].shift.call(arguments);
        } else {
            var $user = null;
        }
        /*****/

        assert(arguments.length == 1 || arguments.length == 2, 'wrong number of arguments')

        if(arguments.length == 2) {

            var tokens = arguments[0];
            var target = arguments[1];
            assert(util.isArray(tokens), 'must inject tokens from array');
            assert(typeof target == 'function', 'must inject tokens into a function');

        } else {

            if(options.angularStyle) {

                var tokens = ab.annotate(arguments[0]); // here is the call to the AngularJS function 'annotate'

                if(util.isArray(arguments[0])) {
                    var target = arguments[0][arguments[0].length-1];
                } else {
                    var target = arguments[0];
                }

                assert(util.isArray(tokens), 'must inject tokens from array');
                assert(typeof target == 'function', 'must inject tokens into a function');

                target.$inject = tokens; //this helps angularJS annotate avoid parsing the function again if it has already been done

            } else { //even without angularStyle we can inject when the function is the last element of an array  of tokens

                assert(util.isArray(arguments[0]), 'must inject tokens from array');

                var tokens = arguments[0].slice(0,-1);
                var target = arguments[0][arguments[0].length-1];

                assert(typeof target == 'function', 'must inject tokens into a function');

            }
        }

        debug('Asked nicely to inject: ', tokens);

        var args =[];

        for(var i= 0, l=tokens.length; i < l; i++) {
            if(options.strict) assert(serviceLocator.hasOwnProperty(tokens[i]), 'token \"'+tokens[i]+'\" not found');
            args.push(serviceLocator[tokens[i]]);
            /*****/
            if ($user) serviceLocator[tokens[i]].$trace.push($user);
            /*****/
        }

        return target.apply(this, args); // apply is the magic that injects the arguments into the target function

    };

    if(!options.strict) {

        debug('You have authorised this leak'); //TODO: a better message please

        /**
         * Public method: leak -
         * @param token
         * @returns {*}
         */
        function leak (token) {

            if(hasOwnProperty(serviceLocator,token)) {
                debug('Asked to leak token: ', token);
                return serviceLocator[token];
            }

        }
    };

    /**
     * Name methods to make public (based on options.formal)
     */
    if(options.formal) {
        var $provide = 'provide';
        var $inject = 'inject';
        var $leak = 'leak';
        debug('Being formal'); //TODO: a better message please
    } else {
        var $provide = 'please';
        var $inject = 'thankYou';
        var $leak = 'share';
        debug('Being friendly'); //TODO: a better message please
    }

/** some experimental stuff that isn't working to override the built-in require() function
 * that needs the requiring module to do something like
 *    require = require('./own_modules/play-nicely')().override;
 * which is getting pretty ugly

    if(node_require == undefined) var node_require = require;

    var $require = function (path, token) {
        console.log(token);
        if(token) {
            return please(node_require(path), token);
        } else {
            return node_require(path);
        }
    }

    exports.override = $require;
*/

    /**
     * Make methods global or for export (based on options.global)
     */
    if(options.global) {
        global[$provide] = please;
        global[$inject] = thankYou;
        global[$leak] = leak;
        debug('Going global'); //TODO: a better message please
    } else {
        exports[$provide] = please;
        exports[$inject] = thankYou;
        exports[$leak] = leak;

        debug('Exporting to module'); //TODO: a better message please
    }

    /*****/
    exports.peek = function(all) {

        for(var obj in serviceLocator) {
            if(all) {
                console.log(obj, util.inspect(serviceLocator[obj]));
            } else {
                console.log(obj, util.inspect(serviceLocator[obj].$trace));
            }
        }
    }
    /*****/

    return exports;

}