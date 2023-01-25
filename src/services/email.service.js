const config = require("../config/config");
const postmark = require("postmark");

var client = new postmark.ServerClient(config.email.smtp.token);
/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = (to, subject, text, cc = null) => {
  client.sendEmail({
    From: config.email.from,
    To: to,
    Bcc: cc,
    Subject: subject,
    HtmlBody: text,
  });
};

module.exports = {
  sendEmail,
};
