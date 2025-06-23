import { Authorization } from "@/shared/api/authorization/model";
import { getItem } from "@/shared/lib/storage";
import { makeAutoObservable, runInAction } from "mobx";

class AuthStore {
  auth: Authorization | null | undefined = null;

  constructor() {
    makeAutoObservable(this);
  }

  getAuth = () => {
    const authData = getItem("auth");

    if (!authData)
      return runInAction(() => {
        this.auth = undefined;
      });

    runInAction(() => {
      this.auth = JSON.parse(authData);
    });
  };
}

export const store = new AuthStore();
