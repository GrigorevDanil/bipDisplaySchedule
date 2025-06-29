"use client";

import { makeAutoObservable, runInAction } from "mobx";
import { getCookie, setCookie, deleteCookie } from "cookies-next";

import { PASSWORD_KEY, USERNAME_KEY } from "@/shared/lib/cookie";

class AuthStore {
  isAuth: boolean = false;
  username: string = "";
  password: string = "";
  isLoading: boolean = true;

  constructor() {
    makeAutoObservable(this);
    this.init();
  }

  private init = () => {
    this.isLoading = true;

    const username = getCookie(USERNAME_KEY)?.toString() || "";
    const password = getCookie(PASSWORD_KEY)?.toString() || "";

    runInAction(() => {
      this.username = username;
      this.password = password;
      this.isAuth = !!username && !!password;
      this.isLoading = false;
    });
  };

  login = async (username: string, password: string): Promise<boolean> => {
    if (!username || !password) return false;

    try {
      setCookie(USERNAME_KEY, username, {
        secure: true,
        maxAge: 60 * 60 * 24 * 7,
      });
      setCookie(PASSWORD_KEY, password, {
        secure: true,
        maxAge: 60 * 60 * 24 * 7,
      });

      runInAction(() => {
        this.username = username;
        this.password = password;
        this.isAuth = true;
      });

      return true;
    } catch (error) {
      console.error("Login failed:", error);

      return false;
    }
  };

  logout = () => {
    deleteCookie(USERNAME_KEY);
    deleteCookie(PASSWORD_KEY);

    runInAction(() => {
      this.username = "";
      this.password = "";
      this.isAuth = false;
    });
  };
}

export const store = new AuthStore();
