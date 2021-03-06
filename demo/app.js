'use strict';
// Angular Init
var app = angular.module('app', ['ng',
	'ui.router',
	'hljs',
	'formly'
]);

app.constant('usingCustomTypeTemplates', window.localStorage.getItem('useCustomTypeTemplates') === 'true');

app.config(function($stateProvider, $urlRouterProvider, $locationProvider, formlyTemplateProvider, formlyOptionsProvider, usingCustomTypeTemplates) {
	$locationProvider.html5Mode(false);
	$locationProvider.hashPrefix('!');

	$urlRouterProvider.otherwise('/');

	$stateProvider.state('home', {
		url: '/',
		title: 'Formly for Angular',
		templateUrl: 'views/home.html',
		controller: 'home'
	});

	// Normally wouldn't have to worry about this,
	// but we need to specify it because we're not using a built version.
	var fields = [
		'textarea', 'radio', 'select', 'number', 'checkbox',
		'password', 'hidden', 'email', 'text'
	];
	angular.forEach(fields, function(field) {
		formlyTemplateProvider.setTemplateUrl(field, 'src/bootstrap/fields/formly-field-' + field + '.html');
	});

	if (usingCustomTypeTemplates) {
		formlyTemplateProvider.setTemplateUrl('text', 'views/custom-field-text.html');
		// or
		formlyTemplateProvider.setTemplateUrl({
			radio: 'views/custom-field-radio.html',
			checkbox: 'views/custom-field-checkbox.html'
		});
	}
	
	formlyOptionsProvider.setOption('uniqueFormId', 'defaultUniqueId');
	// or
	formlyOptionsProvider.setOption({
		submitCopy: 'Configured Submit',
		hideSubmit: true,
		submitButtonTemplate: [
			'<button type="submit" class="btn btn-primary" ng-hide="options.hideSubmit">',
				'{{options.submitCopy || "Submit"}} boo yeah!',
			'</button>'
		].join('')
	});
});

app.run(function($rootScope, $state, $stateParams, $window) {
	// loading animation
	$rootScope.setLoading = function() {
		$rootScope.isViewLoading = true;
	};

	$rootScope.unsetLoading = function() {
		$rootScope.isViewLoading = false;
	};

	$rootScope.isViewLoading = true;

	$rootScope.$on('$viewContentLoading', function(ev, to, toParams, from, fromParams) {
		console.log('viewContentLoading');
		$rootScope.setLoading();
	});

	$rootScope.$on('$viewContentLoaded', function(ev, to, toParams, from, fromParams) {
		console.log('viewContentLoaded');
		$rootScope.unsetLoading();
	});

	$rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
		if (error)
			console.log('stateChangeError:', error.data);
	});
});