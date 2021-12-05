// Status:
// 1. 
// Guidelines:
// 1. Don't store data that is retrieved from the classic profile

import type { ClassicProfileData } from "./classic/classic-profile";
declare var profile_set: ClassicProfileData;
declare var fl_aconsent: boolean;

interface ProfileData {
  gdpr: string;
}

export interface AccountFunctions {
  readonly changeGdpr: boolean;
}

class ProfileImpl implements ProfileData {
  get gdpr(): string { return profile_set.gdpr; }

  async can<T extends keyof AccountFunctions>(name: T): Promise<boolean> {
    if (name == "changeGdpr") {
      return fl_aconsent;
    }

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
    // NOTE: Something strange in the old code.
    // It's clear that the profile is initialized using a numeric value, however 
    // a check in the code is done with a strict compare to a string.
    return Promise.resolve(profile_set.has_results === 1 || profile_set.has_results as unknown === "1");
  }

  hasNttbFunction(): Promise<boolean> {
    // NOTE: Something strange in the old code.
    // It's clear that the profile is initialized using a numeric value, however 
    // a check in the code is done with a strict compare to a string.
    return Promise.resolve<boolean>(profile_set.has_function === 1 || profile_set.has_function as unknown === "1");
  }
}

export const Profile = new ProfileImpl();