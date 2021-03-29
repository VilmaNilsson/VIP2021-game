function teamJoin(context, payload) {
  const { team } = payload;

  //update player state
  const Game = context.getGameState();
  const Player = context.getPlayerState();
  console.log(Player.id, Game.id);
  //update game state

  //should broadcast team:joined w/ { playerId, name }
}

export default {
  'team:join': teamJoin,
};
