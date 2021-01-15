import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { getLocaleFirstDayOfWeek, registerLocaleData } from '@angular/common';

interface SelectItem {
  label: string;
  value: string;
}

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
  number: number;
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
  yourgoal: number[];
  deadline: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private http: HttpClient) {
    //this.getAvailableLogFiles();
  }
  logFiles: SelectItem[];
  gameData: SpeedData[];
  data: SpeedData;
  cells: number[][];
  isPlaying: boolean = false;

  players: SpeedPlayer[];
  currentRound = 0;

  getSize() {
    return 'min(calc(calc(100vw - 400px) / ' + this.data.width + '), calc(100vh / ' + this.data.height + '))';
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
      case -11: return "fuchsia";
      default: return "white";
    }
  }

  async play() {
    this.isPlaying = true;
    while (this.currentRound < this.gameData.length) {
      this.currentRound = this.currentRound +1;
      this.handleChange();
      await this.delay(200);
      if (!this.isPlaying)
        return;
    }
    this.isPlaying = false;
  }

  step(dir) {
    this.currentRound += dir;
    this.handleChange()
  }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  isYou(player: SpeedPlayer) {
    if (this.gameData && this.gameData[0])
      return this.gameData[0].you == player.number;
    else
      return false;
  }

  handleChange() {
    this.data = this.gameData[this.currentRound];
    this.cells = this.gameData[this.currentRound].cells;
    if (this.data.yourgoal != null && this.data.yourgoal.length > 0)
    {
      var goalx = this.data.yourgoal[0];
      var goaly = this.data.yourgoal[1];
      this.cells[goalx][goaly] = -11;
    }
    let play = this.gameData[this.currentRound].players;
    let arrPlayer = [];
    for (let key in play) {
      let p = play[key]
      p.number = Number.parseInt(key);
      arrPlayer.push(p);
    }
    this.players = arrPlayer;
  }
  
  dropHandler(ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (ev.dataTransfer.items[i].kind === 'file') {
          let file: File = ev.dataTransfer.items[i].getAsFile();
          if (file.type.match('application/json')) {
            const reader = new FileReader();
            reader.addEventListener('load', (event) => {
              this.gameData = JSON.parse(<string>event.target.result).game;
            });
            reader.readAsText(file);
            console.log('... file[' + i + '].name = ' + file.name);
          }
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (var i = 0; i < ev.dataTransfer.files.length; i++) {
        console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
      }
    }
  }

  dragOverHandler(ev) {
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  }
}