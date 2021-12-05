// Status: Basically the original `click_privacy` except changed it into a promise 
// Promise:
// - resolve(true)  => saved
// - resolve(false) => server said no failure
// - reject(...)    => for some reason the server could not be reached.

declare var localiSession;
declare function call_REST(rest, data, type?: string): any;
declare function ok_REST(error, user): boolean;
declare function $(...args);

import type { ClassicProfileData } from "../../shared/classic/classic-profile";
declare var profile_set: ClassicProfileData;

class GdprApiImpl {
  update(gdpr: string): Promise<boolean> {
    console.log("CallRequest GDPR", { gdpr });
    return new Promise<boolean>((resolve, reject) => {
      try {
        // Rest call prep
        localiSession = JSON.parse(localStorage.getItem("nl_dwf_sessionInfo"));
        // save gdpr on server
        let req_gdpr = call_REST("gdpr", {
          gdpr: gdpr,
        });
        req_gdpr.done(data => {
          let retApp = JSON.parse(data) as { error?: any, username?: any };
          if (ok_REST(retApp.error, retApp.username)) {
            $("#success_txtq").html("AVG is succesvol geregistreerd!");
            $(".notification.top.green").notify(3000);
            profile_set.gdpr = gdpr;
            localStorage.setItem("nl_dwf_profile", JSON.stringify(profile_set));
            resolve(true);
          } else {
            $("#unsuccess_txtq").html("Fout tijdens AVG registratie!");
            $(".notification.top.red").notify(3000);
            resolve(false);
          }
        }).fail(() => {
          $("#unsuccess_txtq").html("Connectiefout");
          $(".notification.top.red").notify(3000);
          reject();
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}

export const GdprApi = new GdprApiImpl();