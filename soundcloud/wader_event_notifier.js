// this.scparser = Skapa en soundcloud parser (kanske tidigare som classvariable)
// const soundcloudEventNotifier = Skapa en soundcloud event notifier(document)
// eventnotifier.notify(this);

// När den blir notifiad av event notifier(sida som notifiade)
// kolla event som kom in, switch
//      event == currentlyplayingtrackchanged
//          sendcurrentlyplayingtracktowader(sida som notifiade)
//
// sendcurrentlyplayingtracktowader(sida){
//          currentlyplayingtrack = scparser.getcurrentlyplayingtrack(sida);
//          sendtowader('currentlyplayingtrackchanged', currentlppaingtrack);
