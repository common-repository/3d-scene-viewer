'use strict';

/**
 * Throttle event handler functions
 */
export class Throttle {
	/**
	 * Maximum function calls per seconds
	 *
	 * @type {int}
	 */
	callsPerSeconds;

	/**
	 * The callable
	 *
	 * @this {function}
	 */
	callback;

	/**
	 * Arguments passed to the callable
	 *
	 * @this {[]}
	 */
	callbackArgs;

	/**
	 * Last call timestamp
	 *
	 * @type {int}
	 */
	lastCallTime = 0;

	/**
	 * Whether a call is already pending
	 *
	 * @type {boolean}
	 */
	pendingCall = false;

	/**
	 * `this` argument for the callable
	 *
	 * @type {*}
	 */
	thisArg;

	/**
	 * Constructor
	 *
	 * @param {int} cps call per seconds
	 * @param {[]} args callable arguments
	 * @param {*} thisArg `this` argument
	 * @param {function} callable the function
	 */
	constructor( cps, args, thisArg, callable ) {
		this.callsPerSeconds = cps;
		this.callback        = callable;

		if ( ! Array.isArray( args ) ) {
			args = [args];
		}

		this.callbackArgs = args;
		this.thisArg      = thisArg;
		this.call();
	}

	/**
	 * Call the function then set the timeout
	 */
	call() {
		if ( this.pendingCall ) {
			return;
		}
		const now = Date.now();

		if ( now - this.lastCallTime < 1000 / this.callsPerSeconds ) {
			const self       = this;
			this.pendingCall = true;
			setTimeout(
				function () {
					self.pendingCall = false;
					self.callback.apply( self.thisArg, self.args );
				},
				this.lastCallTime + ( 1000 / this.callsPerSeconds ) - now
			);
			return;
		}
		this.callback.apply( this.thisArg, this.args );
		this.lastCallTime = now;
	}
}
