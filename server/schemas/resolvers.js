const { User, Book } = require('../models')
const { signToken } =require('../utils/auth');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {

        me: async(parent, args,context) =>{
            if (context.user) {
                const userData = await User.findOne({ _id: context.user._id })
                  .select('-__v -password')
                  .populate('thoughts')

            
                return userData;
            }
            throw new AuthenticationError('Not logged in');
        }
    },
    Mutation: {
        addUser: async(parent, {username,email,password}) => {
            const user = await User.create({username,email,password});
            const token= signToken(user);
            return { token, user };
        },

        login: async (parent,{email,password }) => {
            const user = await User.findOne({ email });

            if (!user) {
              throw new AuthenticationError('Incorrect credentials');
            }
          
            const correctPw = await user.isCorrectPassword(password);
          
            if (!correctPw) {
              throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);
          
            return {token, user};
        },
        saveBook: async (parent, body, context) => {
            if (context.user) {          
              const updatedUser = await User.findByIdAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: body } },
                { new: true, runValidators: true }
              );
          
              return updatedUser;
            }
          
            throw new AuthenticationError('You need to be logged in!');
        },
        removeBook: async(parent,params, context) => {
            if(context.user){
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId: params.bookId } } },
                    { new: true }
                  );
                  if (!updatedUser) {
                    return res.status(404).json({ message: "Couldn't find user with this id!" });
                  }
                  return res.json(updatedUser);
            }
          },
    }
}

module.exports = resolvers;