declare function $(...args);

class NotificationImpl {
  showError(htmlText: string, duration: number) {
    // $("#unsuccess_txtq").html(htmlText);
    // $(".notification.top.red").notify(duration);
  }
  showSuccess(htmlText: string, duration: number) {
    // $("#success_txtq").html(htmlText);
    // $(".notification.top.green").notify(duration);
  }
}

export const Notification = new NotificationImpl();