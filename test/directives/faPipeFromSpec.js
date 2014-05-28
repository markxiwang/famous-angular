'use strict';

describe('faPipeFrom', function() {
  var eventHandler, $compile, $scope, $rootScope, $famous;
  var listenerValue = false;

  beforeEach(module('famous.angular'));

  beforeEach(inject(function(_$compile_, _$rootScope_, _$famous_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $famous = _$famous_;

    eventHandler = new $famous['famous/core/EventHandler']();
  }));

  it('should undo the work of fa-pipe-to', function() {

    $scope.toEventHandler = eventHandler;

    // Inject a simple disconnected pipeline into the document body
    var pipeline = $compile(
      '<fa-view fa-pipe-from="fromEventHandler" id="pipe-from">' +
        '<fa-surface fa-pipe-to="toEventHandler" id="pipe-to"></fa-surface>' +
      '</fa-view>'
    )($scope);

    document.body.appendChild(pipeline[0]);

    var toHandler   = $famous.find('#pipe-to')[0].renderNode.eventHandler;
    var fromHandler = $famous.find('#pipe-from')[0].renderNode._eventInput;

    // The view changes the listenerValue to true when it receives a testevent
    fromHandler.on('testevent', function() {
      listenerValue = true;
    });

    // The surface isn't piped up to the view
    toHandler.trigger('testevent');
    expect(listenerValue).toBe(false);

    $scope.fromEventHandler = eventHandler;
    $scope.$apply();

    // Now that we have a pipeline from the surface to the view,
    // the pipeline is connected
    toHandler.trigger('testevent');
    expect(listenerValue).toBe(true);
  });
});