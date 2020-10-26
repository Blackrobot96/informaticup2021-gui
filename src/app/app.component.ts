import { Component, ElementRef, ViewChild } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { API_KEY } from '../API_KEY';
import { HttpClient } from '@angular/common/http';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

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
    //let ws = webSocket('wss://msoll.de/spe_ed?key=' + API_KEY.key);
    let ws = webSocket('ws://localhost:8081');
    ws.subscribe(
      (data: SpeedData) => {
        http.post('/agent', data).subscribe((resp) => {
          ws.next(resp);
        });
        this.data = data;
        this.player = data.players[data.you];
        this.cells = data.cells;
      },
      err => console.log(err),
      () => console.log('complete')
    );
  }
  data: SpeedData;
  cells: number[][];
  player: SpeedPlayer;

  getSize() {
    return 'min(calc(100vw / ' + this.data.width + '), calc(100vh / ' + this.data.height + '))';
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
}