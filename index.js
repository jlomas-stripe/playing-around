// This requires your Secret Key to be stored in Firebase Remote Config:
const functions = require('firebase-functions');
const stripe = require('stripe')(functions.config().stripe_secret);

/**
 * Responds to any HTTP request that can provide a "message" field in the body.
 *
 * @param {!Object} req Cloud Function request context.
 * @param {!Object} res Cloud Function response context.
 */
exports.createEphemeralKey = function (req, res) {
  const apiVersion = req.query.api_version;

  if (!apiVersion) {
    return res.status(400).json({
      error: '`api_version` must be provided.',
    });
  }

  // This function assumes that some previous middleware has determined the
  // correct customerId for the session and saved it on the request object.
  stripe.ephemeralKeys.create({
    customer: req.customerId,
  }, {
    stripe_version: apiVersion,
  }).then((key) => {
    res.status(200).json(key);
  }).catch((err) => {
    res.status(500).end({
      error: err.message,
    });
  });
};
