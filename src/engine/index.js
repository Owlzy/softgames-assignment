import isMobile from "ismobilejs";

window.isMobile = isMobile;

import TWEEN from "../lib/Tween";

window.TWEEN = TWEEN;

import MiniSignal from 'mini-signals';

window.MiniSignal = MiniSignal;

//import '@pixi/assets';

import AssetManager from "./core/AssetManager";
import Button from "./core/Button";
import GameTime from "./core/GameTime";
import Logger from "./core/Logger";
import Scene from "./core/Scene";
import SceneStack from "./core/SceneStack";
import View from "./core/View";
import AudioManager from "./audio/AudioManager";
import Input from "./core/Input";
//import ResourceManager from "../game/word/ResourceManager";
import * as Utils from "./utils";
import * as Math from "./math";

/**
 * @type {AssetManager}
 */
const asset = new AssetManager();

/**
 * @type {View}
 */
const view = new View();

/**
 * @type {AudioManager}
 */
const audio = new AudioManager();

/**
 * @type {GameTime}
 */
const gameTime = new GameTime();

//const resourceManager = new ResourceManager();
const input = new Input();

export {Button, GameTime, Logger, Scene, SceneStack, View, Math, asset, audio, view, gameTime, input, Utils};