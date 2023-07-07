/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


import * as functions from "firebase-functions";
import * as admin from "firebase-admin";


admin.initializeApp();
const db = admin.firestore();

export const createUserDocument = functions.auth
        .user()
        .onCreate(async (user: any) => {
            db.collection("users")
                .doc(user.uid)
                .set(JSON.parse(JSON.stringify(user)));
        });
