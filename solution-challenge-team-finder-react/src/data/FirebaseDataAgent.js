import firebase from "firebase";

export default class FirebaseDataAgent {
    startFindingTeamFunction = firebase.functions().httpsCallable("StartFindingTeam");

    startFindingTeam = (formData) => {
        return new Promise((resolve, reject) => {
            this.startFindingTeamFunction(formData).then((result) => {
                if (result.data.status === "success") {
                    resolve();
                } else {
                    if (result.data.errorMessage) {
                        reject(result.data.errorMessage);
                    } else {
                        reject();
                    }
                }
            }).catch((err) => {
                console.log(err);
                reject();
            });
        });
    }
}