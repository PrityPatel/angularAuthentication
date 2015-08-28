(function() {
  'use strict';
  angular.module('authService', [])
    //auth factory to login and get information
    //inject $http for communication with our API
    //inject $q to return promise objects
    //j inject AuthToken to manage tokens
    .factory('Auth', function($http, $q, AuthToken){
      //create auth factory object
      var authFactory = {};

      //log a user in
      authFactory.login = function(username, password){

        //return the promise object and its data
        return $http.post('/api/authenticate', {username: username, password: password})
                  .success(function(data){
                    AuthToken.setToken(data.token);
                    return data;
                  });
      }

      authFactory.logout = function(){
        //clear the token
        AuthToken.setToken();
      }
      authFactory.isLoggedIn = function(){
        if(AuthToken.getToken())
          return true;
        else{
          return false;
        }
      }
      //get the logged in user
      authFactory.getUser = function(){
        if(AuthToken.getToken())
          return $http.get('/api/me', {cache: true});
        else{
          return $q.reject({message: 'User has no token'})
        }
      }
      //return factory object
      return authFactory;


    })
    .factory('AuthToken', function($window){
      var AuthTokenFactory ={};

    //get the token out of local storage
    AuthTokenFactory.getToken = function(){
      return $window.localStorage.getItem('token');
    };

    //function to set token or clear the token
    AuthTokenFactory.setToken = function(token){
      if (token)
        $window.localStorage.setItem('token', token);
      else
        $window.localStorage.removeItem('token');

    }

    return AuthTokenFactory;

    })
    //create my authinterceptor factory
    .factory('AuthInterceptor', function($q, $location, AuthToken){
      var interceptorFactory = {};

      //this will happen on all HTTP requests
      interceptorFactory.request = function(config){
        //grab the token
        var token = AuthToken.getToken();

        //if the token exists, add it to the header as x-access-token
        if(token)
          config.headers['x-access-token'] = token;

        return config;
      };
      return interceptorFactory;
    })



}());


