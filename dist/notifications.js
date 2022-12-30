document.addEventListener("DOMContentLoaded", init, false);

function init() {
  requestPermission();

  function requestPermission() {
    if ("Notification" in window) {
      Notification.requestPermission((result) => {
        if (result === "granted") {
          console.log("Acess granted! :)");
          showServerTimeNotification();
        } else if (result === "denied") {
          console.log("Access denied :(");
        } else {
          console.log("Request ignored :/");
        }
      });
    } else {
      alert("Your browser does not support notifications");
    }
  }

  function showServerTimeNotification() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        fetch("/notification")
          .then((res) => res.json())
          .then((response) => {
            const title = "Server time";
            const options = {
              body: `Last request: ${response.date}`,
            };
            registration.showNotification(title, options);
          });
      });
    }
  }
}
