import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./components/header/header.component";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
  title = "cs2-skin-frontend";

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.loadUser(); // ✅ Load user on app start if token exists
  }
}
