const { Thought, User } = require('../models');

const thoughtController = {
    //Get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find()
            .sort({ createdAt: -1 });
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //Get single thought by ID
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId });

            if(!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    }
};

    //Create a thought
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);

            //Add thought to user's thoughts array
            await User.findOneAndUpdate(
                { _id: req.body.userId },
                {$push: { thoughts: thought._id } },
                { new: true }
            );

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
        },

        //Update a thought
        async updateThought(req, res) {
            try {
                const thought = await Thought.findOneAndUpdate(
                    { _id: req.params.thoughtId },
                    { $set: req.body },
                    { runValidators: true, new: true }
                );

                if (!thought) {
                    return res.status(404).json({ message: 'No thought with this id!' });
                }
                res.json(thought);
            } catch (err) {
                res.status(500).json(err);
            }
        },

        //Delete a thought
        async deleteThought(req, res) {
            try {
                const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

                if (!thought) {
                    return res.status(404).json({ message: 'No thought with that ID' });
                }
                //Remove thought from user's thoughts array
                await User.findOneAndUpdate(
                    { thoughts: req.params.thoughtId },
                    { $pull: { thoughts: req.params.thoughtId } },
                    { new: true }
                );
                res.json({ message: 'Thought deleted!' });
            } catch (err) {
                res.status(500).json(err);
            }
        }

        //Add a reaction
        async addReaction(req, res) {
            try {
                const thought = await Thought.findOneAndUpdate(
                    { _id: req.params.thoughtId },
                    { $addToSet: { reactions: req.body } },
                    { runValidators: true, new: true }
                );

                if (!thought) {
                    return res.status(404).json({ message: 'No thought with this id!' });
                }
                res.json(thought);
            } catch (err) {
                res.status(500).json(err);
            }
            },

            //Remove reaction
            async removeReaction(req, res) {
                try {
                    const thought = await Thought.findOneAndUpdate(
                        { _id: req.params.thoughtId },
                        { $pull: { reactions: { reactionId: req.params.reactionId } } },
                        { runValidators: true, new: true }
                    );

        if (!thought) {
                    return res.status(404).json({ message: 'No thought with this id!' });
                }
                res.json(thought);
            } catch (err) {
                res.status(500).json(err);
            }
        }
        module.exports = thoughtController;