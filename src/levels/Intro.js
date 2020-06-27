import * as THREE from 'three';
import AbstractLevel from './AbstractLevel';
import { Levels } from './LevelManager';
import { PSystemType } from '../physics/ParticleSystem';
import gameplaySound from '../assets/sounds/starwars.ogg';

/**
 * First level a user sees when loading the game.
 * Simply displays game title and tells user how to proceed
 *
 * @class Intro
 * @extends {AbstractLevel}
 */
export default class Intro extends AbstractLevel {
  titleMesh;
  subtitleMesh;
  authorMesh;

  constructor(
    engine,
    renderer,
    camera,
    { assets, onSwitchLevel, onSetAudio, onToggleAudio }
  ) {
    super(engine, renderer, camera, {
      assets,
      onSwitchLevel,
      onSetAudio,
      onToggleAudio,
    });
  }

  init = () => {
    const loadingDiv = document.getElementById('loading');
    loadingDiv.style.display = 'none';
    this.addText();
    this.addStarTunnel();
    this.addEventListeners();
    this.displayControlsText();
    this.onSetAudio(gameplaySound);
  };

  cleanup = () => {
    // Remove meshs from engine
    this.engine.removeMesh(this.titleMesh);
    this.engine.removeMesh(this.subtitleMesh);
    this.engine.removeMesh(this.authorMesh);

    // Remove window eventListener for listening to "enter" key
    window.removeEventListener('keypress', this.onPressEnter);
    window.removeEventListener('keydown', this.toggleSoundOnKeyDown);
  };

  // Add a title and subtitle to main scene
  addText = () => {
    const loader = new THREE.FontLoader();

    const onFontLoad = (font) => {
      // TODO: Make text responsive
      // create text mesh
      this.titleMesh = this.createTitleMesh(font);
      this.subtitleMesh = this.createSubtitleMesh(font);
      this.authorMesh = this.createAuthorMesh(font);
      // add mesh to engine
      this.engine.addMesh(this.titleMesh);
      this.engine.addMesh(this.subtitleMesh);
      this.engine.addMesh(this.authorMesh);
    };

    loader.load(
      'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
      onFontLoad
    );
  };

  // Creates star tunnel particle system
  addStarTunnel = () => {
    this.engine.createParticleSystem(PSystemType.STAR_TUNNEL);
  };

  // Returns a mesh object for the title
  createTitleMesh = (font) => {
    const geometry = new THREE.TextGeometry('Galaga Remake', {
      font: font,
      size: 6,
      height: 1.5,
      curveSegments: 4,
      bevelEnabled: true,
      bevelThickness: 0.7,
      bevelSize: 0.3,
      bevelSegments: 20,
    });
    geometry.center();
    geometry.translate(0, 25, 460);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  };

  // Returns a mesh object for the subtitle
  createSubtitleMesh = (font) => {
    const geometry = new THREE.TextGeometry('Press <ENTER> to play...', {
      font: font,
      size: 2,
      height: 0.1,
      curveSegments: 4,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.1,
      bevelSegments: 20,
    });
    geometry.center();
    geometry.translate(0, 10, 460);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  };

  // return authors
  createAuthorMesh = (font) => {
    const geometry = new THREE.TextGeometry('By Rafi Barash and Tien Dinh', {
      font: font,
      size: 1.2,
      height: 0.1,
      curveSegments: 4,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.05,
      bevelSegments: 10,
    });
    geometry.center();
    geometry.translate(0, 0, 460);
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  };

  addSound = () => {
    const audioLoader = new THREE.AudioLoader();
    const listener = new THREE.AudioListener();
    const audio = new THREE.Audio(listener);
    audio.crossOrigin = 'anonymous';
    audioLoader.load(gameplaySound, function (buffer) {
      audio.setBuffer(buffer);
      audio.setLoop(true);
      audio.setVolume(0.5);
      audio.play();
    });
  };

  displayControlsText = () => {
    const controlsDiv = document.getElementById('controls');
    controlsDiv.style.display = 'inherit';
  };

  addEventListeners = () => {
    // Add event listener for <Enter> key
    window.addEventListener('keypress', this.onPressEnter, false);
    window.addEventListener('keydown', this.toggleSoundOnKeyDown, false);
  };

  // Switch levels when <Enter> is pressed
  onPressEnter = (e) => {
    if (e.keyCode === 13) {
      // <Enter> key
      this.onSwitchLevel(Levels.LEVEL_ONE);
    }
  };
}
