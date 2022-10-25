import * as PIXI from "pixi.js";
import { EventDispatcher } from "./EventDispatcher";
import { GameView } from "./views/GameView";
import { GameEvents } from "./GameEvents";
import { StartScreen } from "./views/StartScreen";
import { IGameState } from './states/IGameState';
import { EnterState } from "./states/EnterState";
import { ScoreView } from './views/ScoreView';
import { Model } from './Model';
import { EndScreen } from './views/EndScreen';
import { LostState } from "./states/LostState";
import { GameApplication } from "./GameApplication";

export class GameController extends PIXI.Container {

    private endScreen: EndScreen;
    private startScreen: StartScreen;
    private game: GameView;
    private scoreView: ScoreView;    
    private currentState: IGameState;
    private gameContainer: PIXI.Container;
    private uiContainer: PIXI.Container;

    constructor() {
        super();
        this.init();
    }

    public changeGameState(newState: IGameState) {
        this.currentState = newState;
    }

    public showStartScreen() {
        this.startScreen.show();
    }

    public hideStartScreen() {
        this.startScreen.hide();
    }

    public showEndScreen() {
        this.endScreen.show();
    }

    public hideEndScreen() {
        this.endScreen.hide();
    }

    public showGame() {
        this.game.show();
        
    }

    public showScore() {
        this.scoreView.show();
    }

    public hideScore() {
        this.scoreView.hide();
    }
    

    public hideGame() {
        this.game.hide();
    }

    private init() {
        this.createContainers();
        this.createViews();
        this.resetGame();
        this.setInitialGameState();
        this.addKeyÚpListener();
        
        EventDispatcher.getInstance().getDispatcher().on(GameEvents.ENEMY_HIT, this.updateScore, this);
    }

    private addKeyÚpListener() {
        this.onKeyUp = this.onKeyUp.bind(this);
        document.addEventListener('keyup', this.onKeyUp);
    }

    private setInitialGameState() {
        this.changeGameState(new EnterState(this));
        this.currentState.gameEnter();
    }

    private createContainers() {
        this.uiContainer = new PIXI.Container();
        this.gameContainer = new PIXI.Container();

        this.addChild(this.uiContainer);
        this.addChild(this.gameContainer);
    }

    private createViews() {
        this.game = new GameView();
        this.gameContainer.addChild(this.game);

        this.scoreView = new ScoreView();
        this.scoreView.x = GameApplication.STAGE_WIDTH * 0.7;
        this.scoreView.y = GameApplication.STAGE_HEIGHT * 0.9;
        this.addChild(this.scoreView);        

        this.startScreen = new StartScreen();
        this.gameContainer.addChild(this.startScreen);

        this.endScreen = new EndScreen();
        this.gameContainer.addChild(this.endScreen);
    }

    private resetGame() {
        Model.getInstance().resetGame();
        this.scoreView.setScore(Model.getInstance().getScore());        
    }

    private updateScore() {        
        Model.getInstance().addScore(1);
        this.scoreView.setScore(Model.getInstance().getScore());
    }
    
    private onKeyUp() {
        if (this.currentState instanceof EnterState ||
            this.currentState instanceof LostState) {
            this.currentState.gameStart();
            EventDispatcher.getInstance().getDispatcher().emit(GameEvents.GAME_START);
        }
    }    
    
}