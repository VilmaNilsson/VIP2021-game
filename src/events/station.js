function stationLoginDone(context, payload) {
  const { racks } = payload;
  context.setState({ racks });
}

function stationRack(context, payload) {
  const { team, rack } = payload;
  const { racks } = context.getState();

  if (racks) {
    racks[team] = rack;
    context.setState({ racks });
  }
}

export default {
  'station:login:done': playerStationLogin,
  'station:rack': stationRack,
};
