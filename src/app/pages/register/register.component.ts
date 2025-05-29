import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  standalone: true,
  selector: "app-register",
  imports: [CommonModule, FormsModule],
  templateUrl: "./register.component.html",
})
export class RegisterComponent {
  username = "";
  email = "";
  password = "";
  confirmPassword = "";
  error = "";

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  register() {
    this.error = "";

    if (this.password !== this.confirmPassword) {
      this.error = "Passwords do not match";
      return;
    }

    this.authService
      .register(this.username, this.email, this.password)
      .subscribe({
        next: () => this.router.navigate(["/login"]),
        error: (err) => {
          this.error = err?.error?.message || "Registration failed";
        },
      });
  }
}
