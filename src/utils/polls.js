module.exports = {
  groupPolls: function(polls, cookies) {
    if (!polls) {
      return [];
    }

    return polls.map(p => {
      return {
        ...p,
        totalVotes: p.options.reduce(
          (accu, current) => accu + current.totalVotes,
          0
        ),
        votedOption: cookies ? cookies[p.id] : null
      };
    });
  }
};
