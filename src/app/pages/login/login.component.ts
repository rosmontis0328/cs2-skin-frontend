import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  standalone: true,
  selector: "app-login",
  imports: [CommonModule, FormsModule],
  templateUrl: "./login.component.html",
})
export class LoginComponent {
  email = "";
  password = "";
  error = "";

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  login() {
    this.authService.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(["/market"]),
      error: () => (this.error = "Invalid credentials"),
    });
  }
}
