/* eslint-disable */ const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
// SPF and DKIM needs to be added in the future using a custom domain
// In the future, this should also be checked every 24 hours rather than calling the endpoint from the frontend
exports.sendDeadlineNotification = functions.https.onCall(
  async (data, context) => {
    const email = context.auth.token.email;
    const deadlineDate = data.deadlineDate;

    if (!email) {
      console.error("No email found in context.auth.token.");
      throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called while authenticated."
      );
    }

    console.log(
      `Sending deadline notification to email: ${email} with deadlineDate: ${deadlineDate}`
    );

    try {
      await admin
        .firestore()
        .collection("mail")
        .add({
          to: [email],
          message: {
            subject: "Will Deadline Approaching",
            text: `Your will's deadline is approaching on ${deadlineDate}. Please review if necessary.`,
            html: `Your will's deadline is approaching on <strong>${deadlineDate}</strong>. Please review if necessary.`,
          },
        });

      console.log("Email notification successfully added to Firestore.");
      return {
        success: true,
        message: "Notification email sent successfully.",
      };
    } catch (error) {
      console.error("Error sending email:", error);
      throw new functions.https.HttpsError(
        "unknown",
        "Failed to send email.",
        error
      );
    }
  }
);
