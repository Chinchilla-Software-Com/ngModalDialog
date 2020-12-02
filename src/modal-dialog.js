/*
Modal.showErrorDialog('Are you sure you want to delete this record?');
Modal.info('This record is current inactive');
Modal.alert('Are you sure?', {color:'blue', hoverColor:'red', buttonLabel:'Cancel'});
*/

angular.module("ngModalDialog", ["ngDialog", "ngLogger"]);

angular
	.module('ngModalDialog')
	.factory('modalDialog', ["ngDialog", "logger", modalDialog]);

function modalDialog(ngDialog, logger) {
	var showErrorDialog = function (err) {
		if (!err) {
			return;
		}
		var message = window.angular.isObject(err) ? err.error || err.ExceptionMessage || err.Message : err;
		logger.error(message);
	};

	var info = function (message) {
		logger.info(message);
	};

	var success = function (message) {
		logger.success(message);
	};

	var warning = function (message) {
		logger.warning(message);
	};

	var warn = function (message) {
		warning(message);
	};

	var error = function (message) {
		showErrorDialog(message);
	};

	var confirm = function (title, message, options) {

		return ngDialog.openConfirm({
			template: '' +
				'<div class="ngdialog-title {{titleColor}}">' +
				'  <p>' + title + '</p>' +
				'</div>' +
				'<div class="ngdialog-message">' +
				'  <p>' + message + '</p>' +
				'</div>' +
				'<div class="ngdialog-buttons">' +
				'  <button type="button" class="btn {{confirmColor}} smaller hover-{{hoverConfirmColor}}" ng-click="confirm()">{{confirmLabel}}</button>' +
				'  <button type="button" class="btn {{cancelColor}} smaller hover-{{hoverCancelColor}}" ng-click="closeThisDialog()">{{cancelLabel}}</button>' +
				'</div>',
			controller: [
				'$scope', function ($scope) {
					angular.extend($scope, {
						confirmLabel: 'Confirm',
						cancelLabel: 'Cancel',
						confirmColor: 'blue',
						cancelColor: 'white',
						hoverConfirmColor: 'red',
						hoverCancelColor: 'red',
						titleColor: 'blue'
					}, options);

					$scope._options = options;
					$scope.$watch("_options.closeNow", function (newValue, oldValue) {
						if (newValue != oldValue && newValue === true)
							$scope.closeThisDialog();
					});
				}
			],
			"plain": true
		}).then(function () {
			return true;
		}, function () {
			return false;
		});
	};

	var alert = function (message, options) {
		return ngDialog.open({
			template: '' +
				'<div class="ngdialog-message">' +
				'  <p>' + message + '</p>' +
				'</div>' +
				'<div class="ngdialog-buttons">' +
				'  <button type="button" class="btn {{color}} smaller hover-{{hoverColor}}" ng-click="closeThisDialog(1)">{{buttonLabel}}</button>' +
				'</div>',
			controller: [
				'$scope', function ($scope) {
					angular.extend($scope, { buttonLabel: 'Ok', color: 'white', hoverColor: 'orange' }, options);
				}
			],
			"plain": true
		}).closePromise.then(function (response) {
			return response;
		}, function (e) {
			return e;
		});
	};

	var rawPrompt = function (control, message, defaultValue, confirmLabel, cancelLabel, allowEmptyResult) {
		if (allowEmptyResult === undefined)
			allowEmptyResult = false;
		var controlType = "";
		var trapFocus = true;
		switch (control) {
			case "datetime":
				trapFocus = false;
				controlType = "jq-date-time-picker";
				break;
			case "date":
				trapFocus = false;
				controlType = "jq-date-picker";
				break;
			case "password":
				trapFocus = true;
				controlType = "type='password'";
				break;
			case "text":
			default:
				trapFocus = true;
				controlType = "type='text'";
				break;
		}
		return ngDialog.openConfirm({
			"trapFocus": trapFocus,
			template: '' +
				'<div class="ngdialog-message">' +
				'  <p>' + message + '</p>' +
				'  <p><input ' + controlType + ' ng-model="confirmValue" style="width:100%" ng-keyup="$event.keyCode == 13 && (allowEmptyResult || (confirmValue !== undefined && confirmValue !== null && confirmValue.length > 0)) ? confirm(confirmValue) : null"/></p>' +
				'</div>' +
				'<div class="ngdialog-buttons">' +
				'  <button type="button" class="btn blue smaller" ng-click="confirm(confirmValue)" ng-disabled="!allowEmptyResult && (confirmValue === undefined || confirmValue === null || confirmValue.length === 0)">' + (confirmLabel || "Confirm") + '</button>' +
				'  <button type="button" class="btn white smaller hover-red" ng-click="closeThisDialog()">' + (cancelLabel || "Cancel") + '</button>' +
				'</div>',
			controller: [
				'$scope', function ($scope) {
					$scope.confirmValue = defaultValue;
					$scope.allowEmptyResult = allowEmptyResult;
				}
			],
			"plain": true
		}).then(function (data) {
			return data;
		}, function (e) {
			return e;
		});
	};

	var prompt = function (message, defaultValue, confirmLabel, cancelLabel, allowEmptyResult) {
		return rawPrompt("text", message, defaultValue, confirmLabel, cancelLabel, allowEmptyResult);
	};

	var promptForDate = function (message, defaultValue, confirmLabel, cancelLabel, allowEmptyResult) {
		return rawPrompt("date", message, defaultValue, confirmLabel, cancelLabel, allowEmptyResult);
	};

	var promptForDateTime = function (message, defaultValue, confirmLabel, cancelLabel, allowEmptyResult) {
		return rawPrompt("datetime", message, defaultValue, confirmLabel, cancelLabel, allowEmptyResult);
	};

	var promptForPassword = function (message, defaultValue, confirmLabel, cancelLabel, allowEmptyResult) {
		return rawPrompt("password", message, defaultValue, confirmLabel, cancelLabel, allowEmptyResult);
	};

	var decide = function (message, options, showCancel, defaultValue) {
		var optionsHtml = '';
		var cancelHtml = showCancel ? '  <button type="button" class="btn white smaller hover-red" ng-click="closeThisDialog(\'cancel\')">Cancel</button>' : '';

		options.forEach(function (option) {
			optionsHtml += ' <button type="button" class="btn blue smaller" ng-click="confirm(\'' + option.value + '\')">' + option.label + '</button>';
		});

		return ngDialog.openConfirm({
			template: '' +
				'<div class="ngdialog-message">' +
				'  <p>' + message + '</p>' +
				'</div>' +
				'<div class="ngdialog-buttons">' +
				optionsHtml +
				cancelHtml +
				'</div>',
			controller: [
				'$scope', function ($scope) {
				}
			],
			"plain": true
		}).then(function (data) {
			return data;
		}, function (e) {
			return e;
		});
	};

	return {
		showErrorDialog: showErrorDialog,
		info: info,
		confirm: confirm,
		alert: alert,
		error: error,
		prompt: prompt,
		promptForDate: promptForDate,
		promptForDateTime: promptForDateTime,
		promptForPassword: promptForPassword,
		decide: decide,
		success: success
	};
}