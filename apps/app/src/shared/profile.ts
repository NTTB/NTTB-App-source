interface ProfileData {
  gdpr: string;
}

export interface AccountFunctions {
  readonly changeGdpr: boolean;
}

class ProfileImpl implements ProfileData {
  private _gdpr: string = "";
  get gdpr(): string { return this._gdpr; }
  set gdpr(v: string) { this._gdpr; this.updateCache(); }

  private updateCache() {
    var dto: ProfileData = {
      gdpr: this.gdpr,
    };

    const json = JSON.stringify(dto);
    localStorage.setItem("nl_dwf_profile", json);
  }

  async can<T extends keyof AccountFunctions>(name: T): Promise<boolean> {
    const functions = await this.getFunctions();
    return functions[name];
  }

  private getFunctions(): Promise<AccountFunctions> {
    // Should wait for any refresh to be completed.
    return Promise.resolve<AccountFunctions>({
      changeGdpr: true
    });
  }

  hasMatches(): Promise<boolean> {
    // Originally: `profile_set.has_results === 1`
    return Promise.resolve(true);
  }

  hasNttbFunction(): Promise<boolean> {
    return Promise.resolve<boolean>(true);
  }

  refreshFromServer(): Promise<void> {
    // Originally: `update_profile(true); // update fl_aconsent status`
    // Without `true` it will only update it once a day
    return Promise.resolve();
  }
}

export const Profile = new ProfileImpl();