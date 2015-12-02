(function() {
  var THREE, _, amplitude, bgcolor, blocks, cam, createGame, createMesh, delta, dur, fft, flatColors, game, generator, grad, i, length, map_range, materials, matter, mode, pd, pulsingCube, pulsingHelix, pulsingWaveform, res, songs, sound, texture, theta, tinygradient, travelDir, traveller, voxel;

  createGame = require('voxel-engine');

  voxel = require('voxel');

  texture = require('voxel-texture');

  tinygradient = require('tinygradient');

  _ = require('lodash');


  /*
   * Utilities
   */

  map_range = function(value, low1, high1, low2, high2) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  };

  createMesh = function(x, y, z, size, material) {
    var item, mesh;
    if (size == null) {
      size = 1;
    }
    if (material == null) {
      material = "grass_top";
    }
    mesh = new THREE.Mesh(new THREE.CubeGeometry(size, size, size), game.materials.material);
    game.materials.paint(mesh, material);
    mesh.position.set(x, y, z);
    item = game.addItem({
      mesh: mesh,
      size: 1
    });
    return item;
  };

  materials = ["#424242", "#DDDDDD", "#EEEEEE"];

  game = createGame({

    /*
    generate: (x,y,z) ->
      if z == -50
        if -20 < x < 20
          if -20 < y < 20
            return 1
      return 0
     */
    generate: function(x, y, z) {
      return 0;
    },
    chunkSize: 32,
    materials: materials,
    materialFlatColor: true,
    fogDisabled: true
  });

  flatColors = texture({
    game: game,
    materialFlatColor: true,
    materialNames: ["#420420", "#888888"]
  });

  THREE = game.THREE;

  game.paused = true;

  game.appendTo(document.body);

  generator = function(x, y, z) {
    if (x * x + y * y <= 10 * 10) {
      return 1;
    } else {
      return 0;
    }
  };

  window.game = game;

  songs = ["casin.mp3", "ecozones.mp3", "lone.mp3"];

  sound = new p5.SoundFile(songs[0], function(file) {
    file.play();
    return game.paused = false;
  });

  amplitude = new p5.Amplitude();

  fft = new p5.FFT();

  pd = new p5.PeakDetect();

  i = 0;

  delta = 0;

  theta = 0;

  cam = 0;

  dur = 0;

  blocks = [];

  length = 50;

  traveller = -(length / 2);

  pulsingHelix = function(length, amp, traveller, wave, matter) {
    var idx, j, lenHigh, lenLow, mod, ref, ref1, ref2, wf, x, y, z;
    blocks = [];
    lenLow = -length / 2;
    lenHigh = length / 2;
    for (x = j = ref = lenLow, ref1 = lenHigh; ref <= ref1 ? j <= ref1 : j >= ref1; x = ref <= ref1 ? ++j : --j) {
      y = function(x, d) {
        if (d == null) {
          d = 0;
        }
        return Math.sin(x / (12 / (1 + amp * .3)) + i + d) * 10;
      };
      z = function(x, d) {
        if (d == null) {
          d = 0;
        }
        return Math.cos(x / 12 + i + d) * 10;
      };
      mod = x + traveller;
      idx = Math.floor(map_range(x, lenLow, lenHigh, 0, wave.length - 1));
      wf = Math.abs(wave[idx]);
      if ((0 < (ref2 = mod % 10) && ref2 < 4)) {
        blocks.push(createMesh(x / 2, z(x), y(x) - 40, 0.5 + wf * 2 + Math.abs(Math.sin(mod / 8)), materials[matter]));
      } else {
        blocks.push(createMesh(x / 2, z(x), y(x) - 40, 2, materials[matter]));
      }
    }
    return blocks;
  };

  pulsingCube = function(length, amp, traveller, matter) {
    blocks = [];
    return blocks;
  };

  pulsingWaveform = function(length, wave, matter) {
    var idx, j, lenHigh, lenLow, ref, ref1, x;
    blocks = [];
    lenLow = -length * 2;
    lenHigh = length * 2;
    for (x = j = ref = lenLow, ref1 = lenHigh; ref <= ref1 ? j <= ref1 : j >= ref1; x = ref <= ref1 ? ++j : --j) {
      idx = Math.floor(map_range(x, lenLow, lenHigh, 0, wave.length - 1));
      blocks.push(createMesh(x / 3, Math.abs(wave[idx] * 20) - 10, -40, 1.5 - Math.abs(wave[idx]), materials[matter]));
    }
    return blocks;
  };

  mode = 1;

  bgcolor = 0;

  matter = 0;

  travelDir = 0;

  game.scene.__lights[1].intensity = 1;

  grad = [tinygradient(["555555", "60c4e6"]), tinygradient(["555555", "be7fd4"])];

  res = grad[bgcolor].rgb(20);

  game.on('tick', function(d) {
    var amp, background, bass, color, n, o, treb, wav, zeta;
    fft.analyze();
    bass = (fft.getEnergy("bass")) / 256;
    treb = (fft.getEnergy("treble")) / 256;
    amp = amplitude.getLevel();
    pd.update(fft);
    wav = fft.waveform();
    if (pd.isDetected) {
      bgcolor = (1 + bgcolor) % grad.length;
      res = grad[bgcolor].rgb(20);
    }
    dur += d;
    delta += d;
    theta += d;
    zeta += d;
    cam += d / 2000;
    background = res[Math.abs(Math.floor((bass - .5) * 2 * 20))];
    color = parseInt(background.toHex(), 16);
    game.view.renderer.setClearColorHex(color, dur / 50000);
    n = new THREE.Vector3(Math.sin(cam + 8) * -0.1, Math.sin(cam + Math.random() * .01 * bass) * -0.2, 0);
    game.camera.rotation = n;
    o = new THREE.Vector3(Math.sin(cam) * 10, 0, Math.cos(cam) * 10 + 10);
    game.camera.position = o;

    /*
    if delta > 100
      if travelDir is 0 and traveller++ > length/2
        traveller =  -(length/2)
      if travelDir is 1 and traveller-- < -(length/2)
        traveller =  (length/2)
      delta = 0
     */
    if (zeta > 15000) {
      travelDir = (travelDir + 1) % 2;
      zeta = 0;
    }
    if (theta > 10000) {
      mode = (mode + 1) % 3;
      matter = (matter + 1) % materials.length;
      theta = 0;
    }
    _.forEach(blocks, function(n) {
      return game.removeItem(n);
    });
    blocks = [];
    i += d / 1000;
    return blocks = (function() {
      switch (mode) {
        case 0:
          return pulsingWaveform(length, wav, matter);
        case 1:
          return pulsingHelix(Math.ceil(length + (length * bass * 4)), treb * 1.5, traveller, wav, matter);
        case 2:
          return pulsingHelix(Math.ceil(length + (length * bass * 4)), bass / 2 + treb, traveller * 2, wav, matter);
      }
    })();
  });

  return game;

}).call(this);
