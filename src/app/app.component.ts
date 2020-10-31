import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface SpeedAnswer {
  action: SpeedAction;
}

enum SpeedAction {
  NOTHING = "change_nothing",
  SPEED_UP = "speed_up",
  SLOW_DOWN = "slow_down",
  TURN_LEFT = "turn_left",
  TURN_RIGHT = "turn_right"
}

enum SpeedDirection {
  UP = "up",
  DOWN = "down",
  LEFT = "left",
  RIGHT = "right"
}

interface SpeedPlayer {
  x: number;
  y: number;
  direction: SpeedDirection;
  speed: number;
  active: boolean;
}

interface SpeedData {
  width: number;
  height: number;
  cells: number[][];
  players: { [key: number]: SpeedPlayer };
  you: number;
  running: boolean;
  deadline: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private http: HttpClient) {
    this.http.get('assets/log.json').subscribe((data) => {
      this.gameData = data["game"];
    });
  }
  gameData: SpeedData[]
  data: SpeedData;
  cells: number[][];
  player: SpeedPlayer;
  currentRound = 0;
  getSize() {
    return 'min(calc(calc(100vw - 200px) / ' + this.data.width + '), calc(100vh / ' + this.data.height + '))';
  }

  getColor(cell) {
    switch (cell) {
      case 1: return "blue";
      case 2: return "red";
      case 3: return "green";
      case 4: return "yellow";
      case 5: return "navy";
      case 6: return "brown";
      case 7: return "magenta";
      case 8: return "orangered";
      default: return "white";
    }
  }
  
  async play() {
    for(let i = this.currentRound; i < this.gameData.length; i++) {
      this.currentRound = i;
      this.handleChange(this); 
      await this.delay(200);
    }
  }

 delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  handleChange(event) {
    this.data = this.gameData[this.currentRound];
    this.cells = this.gameData[this.currentRound].cells;
  }
}