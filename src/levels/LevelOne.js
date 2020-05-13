import { Vector } from 'simple-physics-engine';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import AbstractLevel from './AbstractLevel';
import { Levels } from './LevelManager';
import Player from '../physics/Player';
import EnemyPack from '../math/EnemyPack';
import { PSystemType } from '../physics/ParticleSystem';
import playerSpaceshipImg from '../assets/models/playerSpaceship.glb';
import enemySpaceshipImg from '../assets/models/enemySpaceship.glb';

/**
 * Probably the only level this game will have. The actual game functionality goes in here
 *
 * @class LevelOne
 * @extends {AbstractLevel}
 */
export default class LevelOne extends AbstractLevel {
  enemyPacks;
  player;

  // Stats
  ammos;
  currentPackYPos;
  totalShots;
  clock;

  constructor(engine, renderer, camera, assets, switchLevel) {
    super(engine, renderer, camera, assets, switchLevel);
    this.enemyPacks = [];
    this.ammos = 1000;
    this.currentPackYPos = 0;
    this.totalShots = 0;
    this.clock = new THREE.Clock();
    this.clock.start();
  }

  init = async () => {
    // TODO: Loading message
    await this.loadAssets();
    this.spawnPlayer();
    this.addEventListeners();
    this.spawnEnemies();
    this.displayControlsText();
  };

  spawnPlayer = () => {
    // The player will be initialized to the bottom middle of the screen
    this.player = new Player(
      new Vector(0, -15, 400),
      this.assets.playerSpaceship
    );

    // Add player to scene
    this.engine.addObject(this.player);
  };

  spawnEnemies = () => {
    const model = this.assets.enemySpaceship;
    // spawn 2 packs initially
    for (let i = 0; i < 2; i++) {
      let pack = new EnemyPack(
        new Vector(-140, this.currentPackYPos + i * 70, 200),
        model,
        5,
        i + 1
      );
      this.enemyPacks.push(pack);
      this.currentPackYPos += i * 70;
    }
    for (let pack of this.enemyPacks) {
      for (let enemy of pack.enemies) {
        this.engine.addObject(enemy);
      }
    }
  };

  movePlayer = (e) => {
    const amt = 0.3;
    this.player.inMotion = true;
    if (e.keyCode === 68 || e.keyCode === 39) {
      // move right with arrow or D
      this.player.setVel(new Vector(amt, 0, 0));
    }
    if (e.keyCode === 65 || e.keyCode === 37) {
      // move left with arrow or A
      this.player.setVel(new Vector(-1 * amt, 0, 0));
    }
    if (e.keyCode === 87 || e.keyCode === 38) {
      // move up with arrow or W
      this.player.setVel(new Vector(0, amt, -0));
    }
    if (e.keyCode === 83 || e.keyCode === 40) {
      // move down with arrow or S
      this.player.setVel(new Vector(0, -1 * amt, 0));
    }
    if (e.keyCode === 69) {
      // move forward with E
      this.player.setVel(new Vector(0, 0, -1 * amt));
    }
    if (e.keyCode === 81) {
      // move backward with Q
      this.player.setVel(new Vector(0, 0, amt));
    }
  };

  stopPlayer = (e) => {
    this.player.inMotion = false;
  };

  spawnLaser = (e) => {
    if (this.ammos > 1) {
      const pos = this.player.pos.copy();
      pos.z -= 70; // don't collide with player
      const vel = this.player.mesh.getWorldDirection(new THREE.Vector3());
      vel.z *= 0.5;
      this.engine.createParticleSystem(PSystemType.LASER, {
        pos,
        vel,
      });
      this.totalShots++;

      // handling ammos and respawning enemies
      this.ammos--;
      // loop through each pack and respawn the pack if all enemies in the pack has been destroyed
      for (let pack of this.enemyPacks) {
        if (pack.isDead()) {
          pack.respawn();
          for (let enemy of pack.enemies) {
            this.engine.addObject(enemy);
          }
        }
        for (let enemy of pack.enemies) {
          // each enemy has 30% chance of start chasing the player
          enemy.chase(this.player.pos);
        }
      }
    }
  };

  // Point player towards mouse, completely based off the following link
  // https://stackoverflow.com/questions/44823986/how-to-rotate-object-to-look-mouse-point-in-three-js
  pointTowardsMouse = (e) => {
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster(); //for reuse
    const mouse = new THREE.Vector2(); //for reuse
    const intersectPoint = new THREE.Vector3(); //for reuse

    //get mouse coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, this.camera); //set raycaster
    raycaster.ray.intersectPlane(plane, intersectPoint); // find the point of intersection
    this.player.lookAt(intersectPoint); // face our arrow to this point
  };

  getTotalEnemies = () => {
    let total = 0;
    for (let pack of this.enemyPacks) {
      for (let _ of pack.enemies) {
        total++;
      }
    }
    return total;
  };

  displayControlsText = () => {
    const controlsDiv = document.getElementById('controls');
    controlsDiv.style.display = 'inherit';
  };

  addEventListeners = () => {
    window.addEventListener('keydown', this.movePlayer, false);
    window.addEventListener('keyup', this.stopPlayer, false);
    window.addEventListener('mousedown', this.spawnLaser, false);
    window.addEventListener('mousemove', this.pointTowardsMouse, false);
    window.addEventListener('keypress', this.onPressEnter, false);
  };

  loadAssets = async () => {
    const promises = [
      this.loadGlb(playerSpaceshipImg),
      this.loadGlb(enemySpaceshipImg),
    ];

    // Convert resolved assetArr into assets object
    const assetArr = await Promise.all(promises);

    // Get spaceships
    const playerSpaceship = assetArr[0].scene;
    const enemySpaceship = assetArr[1].scene;

    // Set this.assets for future use
    this.assets = {
      playerSpaceship,
      enemySpaceship,
    };
  };

  loadGlb = (glbFile) => {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
      loader.load(glbFile, (data) => resolve(data), null, reject);
    });
  };

  onPlayerDeath = () => {
    this.switchLevel(Levels.CREDITS);
  };

  cleanup = () => {
    // Remove all objects
    this.engine.teardown();

    // Remove window handlers
    window.removeEventListener('keydown', this.movePlayer);
    window.removeEventListener('keyup', this.stopPlayer);
    window.removeEventListener('mousedown', this.spawnLaser);
    window.removeEventListener('mousemove', this.pointTowardsMouse);
    window.removeEventListener('keypress', this.onPressEnter); // remove

    // Stats
    const elapsedTime = this.clock.getElapsedTime();
    const kills = this.engine.getKills();
    const totalShots = this.totalShots;
    const ammos = this.ammos;
    const stats = { elapsedTime, kills, totalShots, ammos };

    // Display stats
    console.log(stats);
  };

  onPressEnter = (e) => {
    if (e.keyCode === 13) {
      // <Enter> key
      this.switchLevel(Levels.CREDITS);
    }
  };
}
