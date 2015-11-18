(function() {
  var THREE, _, blocks, createGame, createMesh, delta, game, generator, i, voxel;

  createGame = require('voxel-engine');

  voxel = require('voxel');

  _ = require('lodash');

  game = createGame({
    chunkSize: 32,
    materials: ["stuff"],
    materialFlatColor: false
  });

  THREE = game.THREE;

  game.paused = false;

  game.appendTo(document.body);

  generator = function(x, y, z) {
    if (x * x + y * y <= 10 * 10) {
      return 1;
    } else {
      return 0;
    }
  };

  window.game = game;

  createMesh = function(x, y, z) {
    var item, mesh;
    mesh = new THREE.Mesh(new THREE.CubeGeometry(1, 1, 1), game.materials.material);
    game.materials.paint(mesh, "stuff");
    mesh.position.set(x, y, z);
    item = game.addItem({
      mesh: mesh,
      size: 1
    });
    return item;
  };

  i = 0;

  delta = 0;

  blocks = [];

  game.on('tick', function(d) {
    var j, results, x, y, z;
    delta += d;
    if (delta < 60) {
      return;
    }
    delta = 0;
    _.forEach(blocks, function(n) {
      return game.removeItem(n);
    });
    blocks = [];
    i += d / 100;
    results = [];
    for (x = j = -50; j <= 50; x = ++j) {
      y = function(x, d) {
        if (d == null) {
          d = 0;
        }
        return Math.sin(x / 9 + i + d) * 10;
      };
      z = function(x, d) {
        if (d == null) {
          d = 0;
        }
        return Math.cos(x / 9 + i + d) * 10;
      };
      results.push(blocks.push(createMesh(x / 2, y(x), z(x) - 40)));
    }
    return results;
  });

  return game;

}).call(this);
