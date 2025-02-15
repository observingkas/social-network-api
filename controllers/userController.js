const { User, Thought } = require('../models');

const userController = {
    //Get all users
    async getUsers(req, res) {
        try {
            const users = await User.find()
            .select('-__v');
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
        },

        //Get a single user by ID
        async getSingleUser(req, res) {
            try {
                const user = await User.findOne({ _id: req.params.userId })
                .select('-__v')
                .populate('thoughts')
                .populate('friends');

                if (!user) {
                    return res.status(404).json({ message: 'No user with that ID' });
                }
                res.json(user);
            } catch (err) {
                res.status(500).json(err);
            }
            }
        };

        // Create a user
        async createUser(req, res) {
            try {
                const user = await User.create(req.body);
                res.json(user);
            } catch (err) {
                res.status(500).json(err);
            }
            },

            // Update a user
        async updateUser(req, res) {
            try {
                const user = await User.findOneAndUpdate(
                    { _id: req.params.userId },
                    { $set: req.body },
                    { runValidators: true, new: true }
                );

                if (!user) {
                    return res.status(404).json({ message: 'No user with this id!' });
                }
                res.json(user);
            } catch (err) {
                res.status(500).json(err);
            }
        },

        // Delete a user and associated thoughts
        async deleteUser(req, res) {
            try {
                const user = await User.findOneAndDelete({ _id: req.params.userId });
                if (!user) {
                    return res.status(404).json({ message: 'No user with that ID'});
                }

                //Bonus: Remove user's thoughts
                await Thought.deleteMany({ _id: { $in: user.thoughts } });
                res.json({ message: 'User and associated thoughts deleted!' });
            } catch (err) {
                res.status(500).json(err);
            }
            }
        
            // Add friend
            async addFriend(req, res) {
                try {
                    const user = await User.findOneAndUpdate(
                        { _id: req.params.userId },
                        { $addToSet: { friends: req.params.friendId } },
                        { new: true }
                );

                if (!user) {
                    return res.status(404).json({ message: 'No user with this id!' });
                }
                res.json(user);
            } catch (err) {
                res.status(500).json(err);
            }
            },

            //Remove friend
            async removeFriend(req, res) {
                try {
                    const user = await User.findOneAndUpdate(
                        { _id: req.params.userId },
                        { $pull: { friends: req.params.friendId } },
                        { new: true }
                    );

                    if (!user) {
                        return res.status(404).json({ message: 'No user with this id!' });
                    }
                    res.json(user);
                } catch (err) {
                    res.status(500).json(err);
                }
                }
                module.exports = userController;
        
    