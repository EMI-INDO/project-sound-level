
function admobStart(){

// targeting
cordova.plugins.emiAdmobPlugin.targeting({
    childDirectedTreatment: false, // default: false
    underAgeOfConsent: false, // default: false
    contentRating: "MA", // value: G | MA | PG | T | ""
});



// globalSettings Optional
cordova.plugins.emiAdmobPlugin.globalSettings({
    setAppMuted: false, // Type Boolean default: false
    setAppVolume: 1.0, // Type float
    pubIdEnabled: false, // default: false
});




// AdMob Sdk initialize

cordova.plugins.emiAdmobPlugin.initialize({

    isUsingAdManagerRequest: true, // true = AdManager | false = AdMob (Default true)
    isResponseInfo: false, // debug true | Production false
    isConsentDebug: false, // debug true | Production false

});


showBanner();


}




// SDK EVENT Initialization
// Optional
document.addEventListener('on.sdkInitialization', (data) => {
    // JSON.stringify(data)
    const sdkVersion = data.version;
    // const adAdapter = data.adapters;
    const conStatus = data.consentStatus; // UMP
    const attStatus = data.attStatus; // ATT
    // const gdprApplie = data.gdprApplies;
    // const purposeConsent = data.purposeConsents;
    // const vendorConsents = data.vendorConsents;
    // const conTCString = data.consentTCString;
    // const additionalConsent = data.additionalConsent;
    
   // showBanner();

});




function showBanner(){

cordova.plugins.emiAdmobPlugin.loadBannerCordova({
    adUnitId: "ca-app-pub-3940256099942544/6300978111",
    position: "bottom-center", // "Recommended: bottom-center"
    size: "banner",
    collapsible: "bottom", // position: top | bottom (disable, empty string)
    autoShow: true, // default false
    isOverlapping: false // The height of the body is reduced by the height of the banner.
   // isOverlapping: true // The body height is not reduced, the banner overlaps on top of the body
});

}