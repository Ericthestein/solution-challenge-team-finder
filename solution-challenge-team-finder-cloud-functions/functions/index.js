const admin = require('firebase-admin');
admin.initializeApp();
const firestore = admin.firestore();
const functions = require('firebase-functions');

const EmailSender = require("./EmailSender");

const MATCH_INTERVAL_MINUTES = 24 * 60;
const MAX_USERS_PER_TEAM = 4;

/**
 * StartFindingTeam - adds a user to the team finding queue at their school
 * @type {HttpsFunction & Runnable<any>}
 */
exports.StartFindingTeam = functions.https.onCall(async (data, context) => {
    try {
        let {name, email, school} = data;
        school = school.toLowerCase();

        // construct data entry
        const userEntry = {
            name: name,
            email: email,
            timestamp: new Date().getTime()
        };

        // get school data
        const schoolCollectionRef = firestore.collection("schools").doc(school);
        const schoolCollectionSnapshot = await schoolCollectionRef.get();
        if (!schoolCollectionSnapshot.exists) { // if it does not exist, add userEntry immediately
            await schoolCollectionRef.set({
                queue: [userEntry]
            });
            return {
                "status": "success"
            }
        } else {
            // check if user already in queue
            const schoolData = schoolCollectionSnapshot.data();

            let alreadyInQueue = false;
            for (let i = 0; i < schoolData.queue.length; i++) {
                const currEntry = schoolData.queue[i];
                if (currEntry.email === email) {
                    alreadyInQueue = true;
                    break;
                }
            }

            if (alreadyInQueue) {
                functions.logger.log(email + " already in queue for " + school);
                return {
                    status: "error",
                    errorMessage: `${name} has already been added to the queue for ${school}
                            with the email address ${email}.`
                }
            }

            // add user to queue
            await schoolCollectionRef.update({
                queue: admin.firestore.FieldValue.arrayUnion(userEntry)
            });
        }
    } catch (err) {
        functions.logger.log("Error adding user to team finding queue: " + err.toString());
        return {
            status: "error"
        }
    }

    return {
        status: 'success'
    }
});

exports.MatchUsers = functions.pubsub.schedule('every ' + MATCH_INTERVAL_MINUTES + ' minutes').onRun(async (context) => {
    // Initialize email sender
    const emailSender = new EmailSender(functions.logger);

    // get all schools' data
    const schoolsCollectionRef = firestore.collection("schools");
    const schoolsSnapshot = await schoolsCollectionRef.get();

    /**
     * Send a single matched email
     * @param currMemberEntry
     * @param subject
     * @param body
     * @returns {Promise<void>}
     */
    const sendMatchedEmail = async (currMemberEntry, subject, body) => {
        await emailSender.sendEmail({
            subject: subject,
            body: `Hi ${currMemberEntry.name},\n\n${body}`,
            email: currMemberEntry.email
        });
    }

    /**
     * Form teams in school
     * @param schoolDocSnapshot
     * @returns {Promise<void>}
     */
    const matchUsersInSchool = async (schoolDocSnapshot) => {
        const data = schoolDocSnapshot.data();
        const queue = data.queue;
        if (queue) {
            let currTeam = [];
            let emailSendResults = [];
            while ((currTeam.length + queue.length) > 1 && queue.length > 0) {
                // choose a random user
                const randomIndex = Math.floor(Math.random() * queue.length);
                const newMember = queue[randomIndex];
                currTeam.push(newMember);
                queue.splice(randomIndex, 1);

                // if team full or queue empty, send email
                if (currTeam.length === MAX_USERS_PER_TEAM || queue.length === 0) {
                    // Build email
                    const subject = `Welcome to your Solution Challenge team!`;
                    let body = `Here are the members of your team.\n\n`;
                    for (let i = 0; i < currTeam.length; i++) {
                        const currMemberEntry = currTeam[i];
                        body += `Member ${i + 1}: ${currMemberEntry.name} (${currMemberEntry.email})\n\n`;
                    }
                    body += `Thank you for using Solution Challenge Team Finder! Best of luck!`;

                    // Send emails
                    currTeam.forEach((currMemberEntry) => {
                        emailSendResults.push(sendMatchedEmail(currMemberEntry, subject, body));
                    });

                    currTeam = [];
                }
            }

            // update queue for school
            const schoolDocRef = firestore.collection("schools").doc(schoolDocSnapshot.id);
            await schoolDocRef.set({
                queue: queue
            });
            await Promise.all(emailSendResults); // wait for all emails in current school to finish sending
        }
    }

    // form teams in all schools
    const schoolMatchingResults = [];
    schoolsSnapshot.forEach((schoolDocSnapshot) => {
        schoolMatchingResults.push(matchUsersInSchool(schoolDocSnapshot));
    })

    await Promise.all(schoolMatchingResults);
});