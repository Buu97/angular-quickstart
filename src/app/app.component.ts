import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'location';
  coordinates!: GeolocationCoordinates;
  errorMessage = '';
  changeCount = 0;
  readonly options: PositionOptions = {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 5000
  };
  private watchId: number = 0;

  constructor(private snackbar: MatSnackBar) {}

  ngOnInit(): void {
  }

  watchPosition() {
    if ('geolocation' in navigator) {
      this.startWatcher();
    } else {
      this.errorMessage = 'geolocation not supported';
    }
  }

  getCurrentPosition() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
    }
    navigator.geolocation.getCurrentPosition(this.successHandler.bind(this), error => {
      this.errorHandler(error);
      if (error.code === error.TIMEOUT) {
        this.snackbar.open('Query timeout. Starting watcher.', 'OK', {duration: 1500});
        this.startWatcher()
      }
    }, this.options);
  }

  get latitude() {
    return this.coordinates.latitude;
  }
  get longitude() {
    return this.coordinates.longitude;
  }

  private startWatcher() {
    this.watchId = navigator.geolocation.watchPosition(this.successHandler.bind(this), this.errorHandler.bind(this), this.options);
  }
  private successHandler(coordinates: GeolocationPosition) {
    this.coordinates = coordinates.coords;
    this.changeCount++;
    this.errorMessage = '';
  }
  private errorHandler(error: GeolocationPositionError) {
    this.errorMessage = error.message;
  }
}
