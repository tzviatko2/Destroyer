import * as PIXI from "pixi.js";
import { GameApplication } from "../GameApplication";
import { BaseView } from './BaseView';
import { GameObject } from '../game/GameObject';
import { DestroyerBehavior } from '../game/behavior/DestroyerBehavior';
import { ShotBehavior } from '../game/behavior/ShotBehavior';
import { EventDispatcher } from "../EventDispatcher";
import { GameEvents } from '../GameEvents';
import { CollisionManager } from "../CollisionManager";
import { EnemyBehavior } from "../game/behavior/EnemyBehavior";

export class GameView extends BaseView {

    private gameObjects: Map<string, GameObject>;
    
    private collisionManager: CollisionManager;
    private intervalId: NodeJS.Timer;
    private countEnemy: number = 0; 
    loader: any;

    public show() {
        super.show();

        this.activate();
    }

    public hide() {
        super.hide();

        this.deactivate();
    }

    private createCollisionManager() {
        this.collisionManager = new CollisionManager();
      }

    public getGameObjectById(id: string): GameObject | null | undefined {
        if (!this.gameObjects.has(id)) {
            console.warn("getGameObjectById() " + id + " does not exist");
            return null;
        }

        return this.gameObjects.get(id);
    }

    public registerGameObject(id: string, gameObj: GameObject) {
        gameObj.setId(id);
        this.gameObjects.set(id, gameObj);
        this.addChild(gameObj);
    }

    public unregisterGameObject(id: string) {
        const gameObject: GameObject = this.getGameObjectById(id);

        if (!gameObject) {
            console.warn("unregisterGameObject() " + id + " does not exist");
            return;
        }

        this.removeChild(gameObject);
        this.gameObjects.delete(id);
        gameObject.destroy();
    }

    protected init() {
        super.init();
        this.createCollisionManager();
        this.gameObjects = new Map<string, GameObject>();
        this.hide();
        this.createGameObjects();
        this.collisionManager.registerShot(this.getGameObjectById("shot"));
        this.collisionManager.registerDestroyer(this.getGameObjectById("destroyer"));        
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.OBJECT_HIDE, this.onObjectHide, this);
    }

    

    private activate() {
        this.activateGameObjects();
        GameApplication.getApp().ticker.add(this.update, this);
    }

    private deactivate() {
        this.deactivateGameObjects();
        GameApplication.getApp().ticker.remove(this.update, this);
    }

    protected createBackground() {
        this.background = new PIXI.Graphics();
        this.background.beginFill(0x000000);
        this.background.lineStyle({ width: 2, color: 0xffffff });
        this.background.drawRect(0, 0, GameApplication.STAGE_WIDTH, GameApplication.STAGE_HEIGHT);
        this.background.endFill();

        this.addChild(this.background);
    }

    private createGameObjects() {
        this.createDestroyer();
        this.createShot();
        this.createEnemy();
    }

    
       private createEnemy() {        
        this.intervalId = setInterval(() => {
        const enemy: GameObject = new GameObject(this);
        const gfx: PIXI.Graphics = new PIXI.Graphics();
        gfx.beginFill(0x00ccff);
        gfx.drawRoundedRect(0, 0, 30, 60, 5);
        gfx.endFill();
        gfx.cacheAsBitmap = true;
        enemy.x = Math.round(Math.random()* (500 - 100 + 1) + 100) ;                
        enemy.y = 0 ;
        enemy.registerRenderable("enemyImg", gfx);
        const enemyBehavior: EnemyBehavior = new EnemyBehavior(enemy);
        enemy.registerBehavior("enemyBehavior", enemyBehavior);
        this.registerGameObject("enemy"+this.countEnemy, enemy);
        this.collisionManager.registerBrickObject(enemy);
        this.countEnemy++;
        if(this.countEnemy > 6) {
            clearInterval(this.intervalId);
        }
        }               
            , 3000);
           
       }

    private createDestroyer() {
         const destroyer: GameObject = new GameObject(this);
        const gfx: PIXI.Graphics = new PIXI.Graphics();
        gfx.beginFill(0xA01230);
        gfx.drawRoundedRect(0, 0, 30, 60, 5);
        gfx.endFill();
        gfx.cacheAsBitmap = true;
        const texture: PIXI.Texture = GameApplication.getApp().renderer.generateTexture(gfx);
        const sprite: PIXI.Sprite = new PIXI.Sprite(texture);
        // const loader = new PIXI.Loader();
        // loader.add("sunshine", '../../assets/image/sun-sunglasses.jpg');
        // loader.load();
        // const sun: PIXI.Texture = GameApplication.getApp().loader.resources.sunshine.texture;
        // const sprite: PIXI.Sprite = new PIXI.Sprite(sun);
        
        destroyer.registerRenderable("destroyerImg", sprite);
        const destroyerBehavior: DestroyerBehavior = new DestroyerBehavior(destroyer);
        destroyer.registerBehavior("destroyerBehavior", destroyerBehavior);
        this.registerGameObject("destroyer", destroyer);

    }

    private createShot() {
        const shot: GameObject = new GameObject(this);
        const gfx: PIXI.Graphics = new PIXI.Graphics();
        gfx.beginFill(0xffffff);
        gfx.drawCircle(0, 0, 5);
        gfx.endFill();
        gfx.cacheAsBitmap = true;
        shot.registerRenderable("shotImg", gfx);
        const shotBehavior: ShotBehavior = new ShotBehavior(shot);
        shot.registerBehavior("shotBehavior", shotBehavior);
        this.registerGameObject("shot", shot);
    }
    
    private activateGameObjects() {
        this.gameObjects.forEach((obj, id) => {
            obj.activate();
        });
    }

    private deactivateGameObjects() {
        this.gameObjects.forEach((obj, id) => {
            obj.deactivate();
        });
    }

    private update(deltaTime: number) {
        this.gameObjects.forEach((obj, id) => {
            obj.update(deltaTime);
        });
        this.collisionManager.update();
        
    }
    
    private onObjectHide(e: any) {        
        this.collisionManager.unregisterBrickObject(e.objId);     
        this.unregisterGameObject(e.objId);      
    }
}