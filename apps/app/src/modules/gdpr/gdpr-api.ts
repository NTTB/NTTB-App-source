class GdprApiImpl {
  update(gdpr: string): Promise<boolean> {
    console.log("CallRequest GDPR", { gdpr });
    return new Promise<boolean>((resolve, reject) => {
      
      // // Rest call prep
      // localiSession = JSON.parse(localStorage.getItem("nl_dwf_sessionInfo"));
      // // save gdpr on server
      // let req_gdpr = call_REST("gdpr", {
      //   gdpr: gdpr,
      // });
      // req_gdpr.done(data=>{
      //   retApp = JSON.parse(data) as {error?: any, username?: any};
      //   resolve(ok_REST(retApp.error, retApp.username));
      // }).fail(()=> reject());

      resolve(true);

    });
  }

}

export const GdprApi = new GdprApiImpl();