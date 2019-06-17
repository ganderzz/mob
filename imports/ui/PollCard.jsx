import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import Polls from "../api/polls";

class PollCard extends Component {
  render() {
    return (
      <>
        <div className="max-w-sm mx-auto flex p-6 bg-white rounded-lg shadow-xl">
          <div className="flex-shrink-0">asdas</div>
          <div className="ml-6 pt-1">
            <h4 className="text-xl text-gray-900 leading-tight">ChitChat</h4>
            <p className="text-base text-gray-600 leading-normal">
              You have a new message!
            </p>
          </div>
        </div>
      </>
    );
  }
}

export default (InfoContainer = withTracker(() => {
  return {
    polls: Polls.find().fetch()
  };
})(PollCard));
