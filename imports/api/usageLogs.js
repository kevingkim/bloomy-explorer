import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';

const UsageLogs = new Mongo.Collection('usageLogs');

const schema = new SimpleSchema({
  userId: {
    type: String,
  },
  time: {
    type: Date,
  },
  timeStamp: {  // in milliseconds
    type: Number,
  },
  page: {
    type: String,
  },
  expId: {
    type: String,
  },
  status: {
    type: String,
  },
  message: {
    type: String,
  },
});

UsageLogs.attachSchema(schema);

export {
  UsageLogs
}
