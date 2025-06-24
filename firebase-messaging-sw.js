importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyCVYdfql5aqHrChlA1v3nxRLkIbYyWMvUg",
    authDomain: "study2-7bdc7.firebaseapp.com",
    databaseURL: "https://study2-7bdc7-default-rtdb.firebaseio.com",
    projectId: "study2-7bdc7",
    storageBucket: "study2-7bdc7.appspot.com",
    messagingSenderId: "320617984870",
    appId: "1:320617984870:web:04b61ea4ee88ae057e4ea7",
    measurementId: "G-VRM14GRNWG"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
  
  // Send message to page
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage(payload);
    });
  });
});