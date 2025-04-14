function callFirebase(){


  const firebaseConfig = {

    apiKey: "AIzaSyDB0rI8keNRAzQnO76SntaYPOOJJckj04g",
    authDomain: "meyan-sb.firebaseapp.com",
    projectId: "meyan-sb",
    storageBucket: "meyan-sb.firebasestorage.app",
    messagingSenderId: "13430629904",
    appId: "1:13430629904:web:dc7d93a64d394fdaf8cc95",
    measurementId: "G-9EN5BV002Q"
  
  };

  firebase.initializeApp(firebaseConfig);
  // Inisialisasi Analytics
  const analytics = firebase.analytics();

  // Fungsi untuk melaporkan screen name ke Firebase Analytics
  function screenName(name) {
    analytics.logEvent('screen_view', {screen_name: name});
   // console.log("Screen viewed:", name);
  }


  function showOverlay(message) {
    var overlay = document.getElementById("overlayNotification");
    overlay.innerText = message;
    overlay.style.display = "block";
    setTimeout(function(){
      overlay.style.display = "none";
    }, 3000);
  }

  // 2. Inisialisasi Firebase Remote Config
  const remoteConfig = firebase.remoteConfig();
  // Pengaturan interval minimum fetch (sesuaikan untuk production)
  remoteConfig.settings = {
    minimumFetchIntervalMillis: 3600000
  };
  // Set nilai default remote-config
  remoteConfig.defaultConfig = {
    appVersion: '1.0.0.0'
  };

  // Nilai versi aplikasi bawaan
  const defaultVersion = '1.0.0.0';
  const defaultVersionName = '1_0_0_0';

  function checkAppVersion() {


    let conditionMessage = "";
    // Menggunakan kondisi sesuai nilai dan menerjemahkan berdasarkan bahasa yang aktif
    const currentLang = document.getElementById("languageSelect").value;
    const cond = translations[currentLang].condition;


    remoteConfig.fetchAndActivate()
      .then(() => {

        const remoteVersion = remoteConfig.getValue('appVersion').asString();
       // console.log("Default Version:", defaultVersion, "Remote Version:", remoteVersion);

        const versionToReport = (remoteVersion && remoteVersion !== defaultVersion) ? remoteVersion : defaultVersion;
        
        // Jika versinya berbeda, tampilkan notifikasi overlay bahwa ada versi baru
        if (versionToReport !== defaultVersion) {
          conditionMessage = cond.checkAppVersions;
          showOverlay(conditionMessage);
          
        }


        firebase.analytics().logEvent('Meter_Suara_walet', {
            versionToReport: versionToReport,
            defaultVersion: defaultVersion
          });
        
        // Panggil fungsi screenName dengan parameter "Home_<versi>"
        screenName("Meter Suara walet "+defaultVersionName);
      })
      .catch((err) => {
       // console.error("Remote Config error:", err);
        // Jika terjadi error, gunakan defaultVersion dan panggil screenName
        firebase.analytics().logEvent('Meter_Suara_walet', {
            versionToReport: defaultVersion,
            defaultVersion: defaultVersion,
            error: err.message
          });
        screenName("Meter Suara walet "+defaultVersionName);
      });
  }
  
   checkAppVersion();

}