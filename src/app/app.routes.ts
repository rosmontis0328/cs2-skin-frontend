import { Routes } from "@angular/router";
import { authGuard } from "./guards/auth.guard"; // ✅ Import Auth Guard

export const routes: Routes = [
  { path: "", redirectTo: "/collections", pathMatch: "full" },

  {
    path: "collections",
    loadComponent: () =>
      import("./pages/collections/collections.component").then(
        (m) => m.CollectionsComponent,
      ),
  },
  {
    path: "market",
    canActivate: [authGuard], // ✅ protect route
    loadComponent: () =>
      import("./pages/market/market.component").then((m) => m.MarketComponent),
  },
  {
    path: "stickers",
    loadComponent: () =>
      import("./pages/stickers/stickers.component").then(
        (m) => m.StickersComponent,
      ),
  },
  {
    path: "account",
    canActivate: [authGuard], // ✅ protect route
    loadComponent: () =>
      import("./pages/account/account.component").then(
        (m) => m.AccountComponent,
      ),
  },
  {
    path: "login", // ✅ add login route
    loadComponent: () =>
      import("./pages/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "register", // ✅ optional: registration page
    loadComponent: () =>
      import("./pages/register/register.component").then(
        (m) => m.RegisterComponent,
      ),
  },
  { path: "**", redirectTo: "/collections" }, // Wildcard
];
