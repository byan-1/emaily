const mongoose = require('mongoose');
const Path = require('path-parser').default;
const { URL } = require('url');
const _ = require('lodash');

const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {
  app.get('/api/surveys', requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false
    });
    res.send(surveys);
  });

  app.get('/api/surveys/:surveyId/:choice', (req, res) => {
    res.send('Thanks for voting!');
  });

  app.post('/api/surveys/webhooks', req => {
    const p = new Path('/api/surveys/:surveyId/:choice');

    const events = req.body.map(event => {
      if (!event.url) {
        return undefined;
      }
      const match = p.test(new URL(event.url).pathname);
      if (match) {
        return {
          email: event.email,
          surveyId: match.surveyId,
          choice: match.choice
        };
      }
    });
    const compactEvents = _.compact(events);
    const uniqueEvents = _.uniqBy(compactEvents, 'email', 'surveyId');
    uniqueEvents.forEach(({ surveyId, email, choice }) => {
      Survey.updateOne(
        {
          _id: surveyId,
          recipients: {
            $elemMatch: { email: email, responded: false }
          }
        },
        {
          $inc: { [choice]: 1 },
          $set: { 'recipients.$.responded': true },
          lastResponded: new Date()
        }
      ).exec();
    });
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;
    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map(email => ({
        email: email.trim()
      })),
      _user: req.user.id,
      dateSent: Date.now()
    });
    const mailer = new Mailer(survey, surveyTemplate(survey));

    try {
      await mailer.send();
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();
      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
};
