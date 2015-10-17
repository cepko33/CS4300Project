(function() {
  var createGame, game;

  createGame = require('voxel-engine');

  game = createGame({
    generate: function(x, y, z) {
      if (x > 5) {
        return 1;
      }
    },
    materials: ["stuff"]
  });

  game.appendTo(document.body);

}).call(this);
