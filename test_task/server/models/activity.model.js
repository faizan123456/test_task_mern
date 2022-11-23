const { model, Schema } = require('mongoose');

const activitySchema = new Schema(
    {   
        lastLoginTime: { type: Date },
        user: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true },
);

const User = model('Activity', activitySchema);
module.exports = User;
